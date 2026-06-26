import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import { user, type AppRole } from '../db/schema';
import { EmailService } from '../email/email.service';
import { QUEUE } from '../queue/queue.constants';

export type WelcomeJobData = {
  userId: string;
};

function normalizeRole(role: unknown): AppRole | null {
  return typeof role === 'string' &&
    (['tenant', 'landlord', 'admin'] as readonly string[]).includes(role)
    ? (role as AppRole)
    : null;
}

@Processor(QUEUE.WELCOME)
export class WelcomeProcessor extends WorkerHost {
  private readonly logger = new Logger(WelcomeProcessor.name);

  constructor(private readonly email: EmailService) {
    super();
  }

  async process(job: Job<WelcomeJobData>): Promise<void> {
    const { userId } = job.data;

    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    // Idempotency: skip if the user vanished or was already welcomed. This
    // guards against retries and re-enqueues sending a duplicate email.
    if (!foundUser?.email) {
      this.logger.warn(`Welcome skipped — user ${userId} has no email`);
      return;
    }
    if (foundUser.welcomeEmailSentAt) {
      this.logger.debug(`Welcome already sent for ${userId}, skipping`);
      return;
    }

    await this.email.sendWelcome(foundUser.email, {
      name: foundUser.name,
      role: normalizeRole(foundUser.role),
    });

    await db
      .update(user)
      .set({ welcomeEmailSentAt: new Date(), updatedAt: new Date() })
      .where(eq(user.id, userId));

    this.logger.log(`Welcome email sent to ${foundUser.email}`);
  }
}
