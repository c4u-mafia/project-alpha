import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { payment, rentGoal, sponsorshipContribution } from '../db/schema';
import type { ContributeDto, CreateRentGoalDto } from './dto/sponsorship.dto';
import { NotificationsService } from '../notifications/notifications.service';

function generateToken(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

@Injectable()
export class SponsorshipService {
  constructor(private readonly notif: NotificationsService) {}

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
    return db
      .select()
      .from(rentGoal)
      .where(eq(rentGoal.tenantId, tenantId));
  }

  async getByToken(token: string) {
    const [goal] = await db
      .select()
      .from(rentGoal)
      .where(eq(rentGoal.shareToken, token))
      .limit(1);
    if (!goal) throw new NotFoundException('Goal not found.');

    // Omit internal fields from public view
    const { tenantId: _, ...publicGoal } = goal;
    return publicGoal;
  }

  async contribute(token: string, dto: ContributeDto, sponsorId?: string) {
    const [goal] = await db
      .select()
      .from(rentGoal)
      .where(eq(rentGoal.shareToken, token))
      .limit(1);
    if (!goal) throw new NotFoundException('Goal not found.');
    if (goal.status !== 'active') throw new BadRequestException('Goal is no longer active.');
    if (new Date(goal.deadline) < new Date()) {
      throw new BadRequestException('This goal has expired.');
    }

    if (!sponsorId && (!dto.sponsorName || !dto.sponsorEmail)) {
      throw new BadRequestException('Guest sponsors must provide name and email.');
    }

    const ref = `SPONS-${Date.now()}`;
    const [p] = await db
      .insert(payment)
      .values({
        payerId: sponsorId ?? goal.tenantId,
        amount: dto.amount,
        type: 'sponsorship_contribution',
        status: 'completed',
        provider: 'paystack',
        providerReference: ref,
      })
      .returning();

    const [contribution] = await db
      .insert(sponsorshipContribution)
      .values({
        goalId: goal.id,
        sponsorId: sponsorId ?? null,
        sponsorName: dto.sponsorName,
        sponsorEmail: dto.sponsorEmail,
        amount: dto.amount,
        isAnonymous: dto.isAnonymous ?? false,
        paymentId: p.id,
        message: dto.message,
      })
      .returning();

    const newAmount = goal.currentAmount + dto.amount;
    const isComplete = newAmount >= goal.targetAmount;

    await db
      .update(rentGoal)
      .set({
        currentAmount: newAmount,
        status: isComplete ? 'completed' : 'active',
        updatedAt: new Date(),
      })
      .where(eq(rentGoal.id, goal.id));

    await this.notif.create({
      userId: goal.tenantId,
      type: 'sponsorship_received',
      title: isComplete ? '🎉 Goal Reached!' : 'New Contribution',
      body: isComplete
        ? `Your rent goal has been fully funded!`
        : `Someone contributed ₦${(dto.amount / 100).toLocaleString()} to your goal.`,
      data: { goalId: goal.id },
    });

    return contribution;
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
      c.isAnonymous ? { ...c, sponsorName: 'Anonymous', sponsorEmail: null, sponsorId: null } : c,
    );
  }
}
