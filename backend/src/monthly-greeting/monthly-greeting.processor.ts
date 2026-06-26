import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job, Queue } from 'bullmq';

import { db } from '../db';
import { user } from '../db/schema';
import { EmailService } from '../email/email.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MONTHLY_JOB, QUEUE } from '../queue/queue.constants';

const BATCH_SIZE = 500;
const TIMEZONE = 'Africa/Lagos';

export type DeliverJobData = {
  userId: string;
  email: string;
  name: string | null;
  /** Period key, e.g. "2026-07". */
  period: string;
  /** Full month name, e.g. "July". */
  month: string;
  year: number;
};

/** Resolves the current month in Nigerian time, independent of server TZ. */
function currentPeriod(now = new Date()): {
  period: string;
  month: string;
  year: number;
} {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(now);
  const year = Number(parts.find((p) => p.type === 'year')?.value);
  const monthNum = parts.find((p) => p.type === 'month')?.value ?? '01';
  const month = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    month: 'long',
  }).format(now);
  return { period: `${year}-${monthNum}`, month, year };
}

@Processor(QUEUE.MONTHLY_GREETING)
export class MonthlyGreetingProcessor extends WorkerHost {
  private readonly logger = new Logger(MonthlyGreetingProcessor.name);

  constructor(
    @InjectQueue(QUEUE.MONTHLY_GREETING) private readonly queue: Queue,
    private readonly email: EmailService,
    private readonly notifications: NotificationsService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name === MONTHLY_JOB.DISPATCH) {
      await this.dispatch();
      return;
    }
    if (job.name === MONTHLY_JOB.DELIVER) {
      await this.deliver(job.data as DeliverJobData);
      return;
    }
    this.logger.warn(`Unknown monthly-greeting job: ${job.name}`);
  }

  /** Fan-out: page through all users, enqueue one delivery job each. */
  private async dispatch(): Promise<void> {
    const { period, month, year } = currentPeriod();
    let offset = 0;
    let enqueued = 0;

    for (;;) {
      const rows = await db
        .select({ id: user.id, email: user.email, name: user.name })
        .from(user)
        .orderBy(user.id)
        .limit(BATCH_SIZE)
        .offset(offset);

      if (rows.length === 0) break;

      await this.queue.addBulk(
        rows.map((u) => ({
          name: MONTHLY_JOB.DELIVER,
          data: {
            userId: u.id,
            email: u.email,
            name: u.name,
            period,
            month,
            year,
          } satisfies DeliverJobData,
          // Deterministic id → one greeting per user per month, even if the
          // dispatch job is retried or restarts mid-run.
          opts: { jobId: `greeting:${period}:${u.id}` },
        })),
      );

      enqueued += rows.length;
      if (rows.length < BATCH_SIZE) break;
      offset += BATCH_SIZE;
    }

    this.logger.log(`Monthly greeting for ${period}: enqueued ${enqueued} users`);
  }

  /** Per-user: send the email and write the in-app notification. */
  private async deliver(data: DeliverJobData): Promise<void> {
    const { userId, email, name, month, year } = data;

    await this.email.sendMonthlyGreeting(email, { name, month, year });

    await this.notifications.create({
      userId,
      type: 'monthly_greeting',
      title: `Welcome to ${month} 🎉`,
      body: `Happy new month! Here's to a great ${month} ${year} on Homelyn.`,
      data: { period: data.period },
      sentAt: new Date(),
    });

    this.logger.debug(`Monthly greeting delivered to ${email}`);
  }
}
