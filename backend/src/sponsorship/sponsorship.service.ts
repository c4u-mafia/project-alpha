import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { payment, rentGoal, sponsorshipContribution } from '../db/schema';
import type { ContributeDto, CreateRentGoalDto } from './dto/sponsorship.dto';
import { PaystackService } from '../payments/paystack.service';

function generateToken(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

@Injectable()
export class SponsorshipService {
  constructor(private readonly paystack: PaystackService) {}

  async createGoal(tenantId: string, dto: CreateRentGoalDto) {
    const [goal] = await db
      .insert(rentGoal)
      .values({
        tenantId,
        targetAmount: dto.targetAmount,
        deadline: new Date(dto.deadline),
        message: dto.message,
        tenancyId: dto.tenancyId,
        propertyId: dto.propertyId,
        shareToken: generateToken(),
        status: 'active',
      })
      .returning();
    return goal;
  }

  async getMyGoals(tenantId: string) {
    return db.select().from(rentGoal).where(eq(rentGoal.tenantId, tenantId));
  }

  async getByToken(token: string) {
    const [goal] = await db
      .select()
      .from(rentGoal)
      .where(eq(rentGoal.shareToken, token))
      .limit(1);
    if (!goal) throw new NotFoundException('Goal not found.');

    // Omit internal fields from public view
    const { tenantId, ...publicGoal } = goal;
    void tenantId;
    return publicGoal;
  }

  async contribute(token: string, dto: ContributeDto, sponsorId?: string) {
    const [goal] = await db
      .select()
      .from(rentGoal)
      .where(eq(rentGoal.shareToken, token))
      .limit(1);
    if (!goal) throw new NotFoundException('Goal not found.');
    if (goal.status !== 'active')
      throw new BadRequestException('Goal is no longer active.');
    if (new Date(goal.deadline) < new Date()) {
      throw new BadRequestException('This goal has expired.');
    }

    if (!sponsorId && !dto.sponsorName) {
      throw new BadRequestException('Guest sponsors must provide a name.');
    }

    const ref = `SPONS-${Date.now()}`;
    const [p] = await db
      .insert(payment)
      .values({
        payerId: sponsorId ?? null,
        amount: dto.amount,
        type: 'sponsorship_contribution',
        status: 'pending',
        provider: 'paystack',
        providerReference: ref,
        metadata: {
          goalId: goal.id,
          sponsorId: sponsorId ?? null,
          sponsorName: dto.sponsorName ?? null,
          sponsorEmail: dto.sponsorEmail ?? null,
          isAnonymous: dto.isAnonymous ?? false,
          message: dto.message ?? null,
        },
      })
      .returning();

    try {
      const checkout = await this.paystack.initializeTransaction({
        email: dto.sponsorEmail,
        amount: dto.amount,
        reference: ref,
        metadata: { paymentId: p.id, paymentType: p.type, goalId: goal.id },
      });
      return { paymentId: p.id, amount: dto.amount, ...checkout };
    } catch (error) {
      await db
        .update(payment)
        .set({ status: 'failed', updatedAt: new Date() })
        .where(eq(payment.id, p.id));
      throw error;
    }
  }

  async getContributors(goalId: string, tenantId: string) {
    const [goal] = await db
      .select()
      .from(rentGoal)
      .where(and(eq(rentGoal.id, goalId), eq(rentGoal.tenantId, tenantId)))
      .limit(1);
    if (!goal) throw new NotFoundException('Goal not found.');

    const contribs = await db
      .select()
      .from(sponsorshipContribution)
      .where(eq(sponsorshipContribution.goalId, goalId));

    return contribs.map((c) =>
      c.isAnonymous
        ? {
            ...c,
            sponsorName: 'Anonymous',
            sponsorEmail: null,
            sponsorId: null,
          }
        : c,
    );
  }
}
