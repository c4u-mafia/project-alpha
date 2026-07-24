import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq, ne, sql } from 'drizzle-orm';
import { db } from '../db';
import {
  escrowHold,
  payment,
  rentGoal,
  sponsorshipContribution,
  tenancy,
  user,
  wallet,
  walletTransaction,
} from '../db/schema';
import type {
  FundWalletDto,
  InitializePaymentDto,
  ReleaseEscrowDto,
  WithdrawDto,
} from './dto/payments.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { PaystackService } from './paystack.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly notif: NotificationsService,
    private readonly paystack: PaystackService,
  ) {}

  private async getUserEmail(userId: string): Promise<string> {
    const [found] = await db
      .select({ email: user.email })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    if (!found) throw new NotFoundException('User not found.');
    return found.email;
  }

  // ── Wallet ────────────────────────────────────────────────────────────────

  private async getOrCreateWallet(userId: string) {
    const [w] = await db
      .select()
      .from(wallet)
      .where(eq(wallet.userId, userId))
      .limit(1);
    if (w) return w;

    const [created] = await db.insert(wallet).values({ userId }).returning();
    return created;
  }

  async getWallet(userId: string) {
    const w = await this.getOrCreateWallet(userId);
    const transactions = await db
      .select()
      .from(walletTransaction)
      .where(eq(walletTransaction.walletId, w.id))
      .orderBy(desc(walletTransaction.createdAt))
      .limit(10);
    return { ...w, recentTransactions: transactions };
  }

  async fundWallet(userId: string, dto: FundWalletDto) {
    const ref = `FUND-${Date.now()}-${userId.slice(0, 6)}`;
    const email = await this.getUserEmail(userId);
    const [p] = await db
      .insert(payment)
      .values({
        payerId: userId,
        amount: dto.amount,
        type: 'wallet_funding',
        status: 'pending',
        provider: 'paystack',
        providerReference: ref,
      })
      .returning();

    try {
      const checkout = await this.paystack.initializeTransaction({
        email,
        amount: dto.amount,
        reference: ref,
        metadata: { paymentId: p.id, paymentType: p.type },
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

  async initializeRentPayment(payerId: string, dto: InitializePaymentDto) {
    const [t] = await db
      .select()
      .from(tenancy)
      .where(and(eq(tenancy.id, dto.tenancyId), eq(tenancy.tenantId, payerId)))
      .limit(1);
    if (!t) throw new NotFoundException('Tenancy not found.');

    const ref = `RENT-${Date.now()}-${payerId.slice(0, 6)}`;
    const email = await this.getUserEmail(payerId);
    const [p] = await db
      .insert(payment)
      .values({
        payerId,
        payeeId: t.landlordId,
        amount: dto.amount,
        type: 'rent_payment',
        status: 'pending',
        provider: 'paystack',
        providerReference: ref,
        tenancyId: dto.tenancyId,
      })
      .returning();

    try {
      const checkout = await this.paystack.initializeTransaction({
        email,
        amount: dto.amount,
        reference: ref,
        metadata: {
          paymentId: p.id,
          paymentType: p.type,
          tenancyId: dto.tenancyId,
        },
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

  async handleWebhook(body: Record<string, unknown>, signature?: string) {
    this.paystack.assertValidWebhook(body, signature);

    const event = body.event as string;
    const data = (body.data ?? {}) as Record<string, unknown>;
    const reference = data.reference as string | undefined;
    if (!reference) return { ok: true };

    const [p] = await db
      .select()
      .from(payment)
      .where(eq(payment.providerReference, reference))
      .limit(1);
    if (!p) return { ok: true };

    if (event === 'charge.success') {
      const receivedAmount = Number(data.amount);
      const receivedCurrency =
        typeof data.currency === 'string' ? data.currency : 'NGN';
      if (receivedAmount !== p.amount || receivedCurrency !== p.currency) {
        throw new BadRequestException(
          'Webhook amount or currency does not match payment.',
        );
      }

      await db
        .update(payment)
        .set({
          status: 'completed',
          providerResponse: body,
          updatedAt: new Date(),
        })
        .where(and(eq(payment.id, p.id), ne(payment.status, 'completed')));

      if (p.type === 'wallet_funding') {
        if (!p.payerId) {
          throw new BadRequestException('Wallet payment has no payer.');
        }
        await this.creditWallet(
          p.payerId,
          p.amount,
          p.id,
          'Wallet top-up via Paystack',
        );
      }

      if (p.type === 'rent_payment') {
        // Hold funds in escrow for 24h before releasing to landlord
        const releaseAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const [createdHold] = await db
          .insert(escrowHold)
          .values({
            paymentId: p.id,
            amount: p.amount,
            status: 'held',
            releaseScheduledAt: releaseAt,
          })
          .onConflictDoNothing()
          .returning();

        if (createdHold && p.payeeId) {
          await this.notif.create({
            userId: p.payeeId,
            type: 'payment_received',
            title: 'Rent Payment Received',
            body: `₦${(p.amount / 100).toLocaleString()} received and held in escrow.`,
            data: { paymentId: p.id },
          });
        }
      }

      if (p.type === 'sponsorship_contribution') {
        await this.fulfillSponsorship(p);
      }
    }

    if (event === 'charge.failed') {
      await db
        .update(payment)
        .set({ status: 'failed', updatedAt: new Date() })
        .where(eq(payment.id, p.id));

      if (p.payerId) {
        await this.notif.create({
          userId: p.payerId,
          type: 'payment_failed',
          title: 'Payment Failed',
          body: 'Your payment could not be processed. Please try again.',
          data: { paymentId: p.id },
        });
      }
    }

    return { ok: true };
  }

  private async fulfillSponsorship(p: typeof payment.$inferSelect) {
    const metadata = (p.metadata ?? {}) as Record<string, unknown>;
    const goalId = typeof metadata.goalId === 'string' ? metadata.goalId : null;
    if (!goalId)
      throw new BadRequestException('Sponsorship payment has no goal.');

    const fulfilled = await db.transaction(async (tx) => {
      const [goal] = await tx
        .select()
        .from(rentGoal)
        .where(eq(rentGoal.id, goalId))
        .limit(1)
        .for('update');
      if (!goal) throw new NotFoundException('Rent goal not found.');

      const [created] = await tx
        .insert(sponsorshipContribution)
        .values({
          goalId,
          sponsorId:
            typeof metadata.sponsorId === 'string' ? metadata.sponsorId : null,
          sponsorName:
            typeof metadata.sponsorName === 'string'
              ? metadata.sponsorName
              : null,
          sponsorEmail:
            typeof metadata.sponsorEmail === 'string'
              ? metadata.sponsorEmail
              : null,
          amount: p.amount,
          isAnonymous: metadata.isAnonymous === true,
          paymentId: p.id,
          message:
            typeof metadata.message === 'string' ? metadata.message : null,
        })
        .onConflictDoNothing()
        .returning({ id: sponsorshipContribution.id });
      if (!created) return null;

      const [updatedGoal] = await tx
        .update(rentGoal)
        .set({
          currentAmount: sql`${rentGoal.currentAmount} + ${p.amount}`,
          status: sql`CASE
            WHEN ${rentGoal.currentAmount} + ${p.amount} >= ${rentGoal.targetAmount}
            THEN 'completed'::rent_goal_status
            ELSE ${rentGoal.status}
          END`,
          updatedAt: new Date(),
        })
        .where(eq(rentGoal.id, goal.id))
        .returning({ status: rentGoal.status });

      return {
        tenantId: goal.tenantId,
        goalId: goal.id,
        isComplete: updatedGoal?.status === 'completed',
      };
    });
    if (!fulfilled) return;

    await this.notif.create({
      userId: fulfilled.tenantId,
      type: 'sponsorship_received',
      title: fulfilled.isComplete ? 'Goal Reached!' : 'New Contribution',
      body: fulfilled.isComplete
        ? 'Your rent goal has been fully funded!'
        : `Someone contributed ₦${(p.amount / 100).toLocaleString()} to your goal.`,
      data: { goalId: fulfilled.goalId, paymentId: p.id },
    });
  }

  private async creditWallet(
    userId: string,
    amount: number,
    paymentId: string,
    description: string,
  ) {
    const w = await this.getOrCreateWallet(userId);
    await db.transaction(async (tx) => {
      const [lockedWallet] = await tx
        .select()
        .from(wallet)
        .where(eq(wallet.id, w.id))
        .limit(1)
        .for('update');
      if (!lockedWallet) throw new NotFoundException('Wallet not found.');

      const [existing] = await tx
        .select({ id: walletTransaction.id })
        .from(walletTransaction)
        .where(eq(walletTransaction.paymentId, paymentId))
        .limit(1);
      if (existing) return;

      const newBalance = lockedWallet.balance + amount;
      await tx
        .update(wallet)
        .set({ balance: newBalance, updatedAt: new Date() })
        .where(eq(wallet.id, lockedWallet.id));

      await tx.insert(walletTransaction).values({
        walletId: lockedWallet.id,
        paymentId,
        type: 'credit',
        amount,
        balanceAfter: newBalance,
        description,
      });
    });
  }

  async getPaymentHistory(userId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const rows = await db
      .select()
      .from(payment)
      .where(eq(payment.payerId, userId))
      .orderBy(desc(payment.createdAt))
      .limit(limit)
      .offset(offset);
    return { data: rows, page, limit };
  }

  async requestWithdrawal(userId: string, dto: WithdrawDto) {
    const w = await this.getOrCreateWallet(userId);
    if (w.balance < dto.amount) {
      throw new BadRequestException('Insufficient wallet balance.');
    }

    const ref = `WD-${Date.now()}-${userId.slice(0, 6)}`;
    const [p] = await db
      .insert(payment)
      .values({
        payerId: userId,
        amount: dto.amount,
        type: 'withdrawal',
        status: 'pending',
        provider: 'bank_transfer',
        providerReference: ref,
      })
      .returning();

    // Debit wallet immediately; payout processed async
    const newBalance = w.balance - dto.amount;
    await db
      .update(wallet)
      .set({ balance: newBalance, updatedAt: new Date() })
      .where(eq(wallet.id, w.id));

    await db.insert(walletTransaction).values({
      walletId: w.id,
      paymentId: p.id,
      type: 'debit',
      amount: dto.amount,
      balanceAfter: newBalance,
      description: 'Withdrawal to bank account',
    });

    await this.notif.create({
      userId,
      type: 'withdrawal_processed',
      title: 'Withdrawal Initiated',
      body: `₦${(dto.amount / 100).toLocaleString()} withdrawal is being processed.`,
      data: { paymentId: p.id },
    });

    return { paymentId: p.id, reference: ref, amount: dto.amount };
  }

  // ── Admin: escrow ─────────────────────────────────────────────────────────

  async getEscrowHolds() {
    return db.select().from(escrowHold).orderBy(desc(escrowHold.createdAt));
  }

  async releaseEscrow(id: string, dto: ReleaseEscrowDto) {
    const [hold] = await db
      .select()
      .from(escrowHold)
      .where(eq(escrowHold.id, id))
      .limit(1);
    if (!hold) throw new NotFoundException('Escrow hold not found.');
    if (hold.status !== 'held') {
      throw new BadRequestException(
        `Escrow already in status '${hold.status}'.`,
      );
    }

    const [p] = await db
      .select()
      .from(payment)
      .where(eq(payment.id, hold.paymentId))
      .limit(1);

    if (p && dto.reason) {
      const existingMetadata =
        p.metadata && typeof p.metadata === 'object' ? p.metadata : {};
      await db
        .update(payment)
        .set({
          metadata: {
            ...existingMetadata,
            escrowReleaseReason: dto.reason,
          },
          updatedAt: new Date(),
        })
        .where(eq(payment.id, p.id));
    }

    const [updated] = await db
      .update(escrowHold)
      .set({
        status: 'released',
        releasedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(escrowHold.id, id))
      .returning();

    if (p?.payeeId) {
      await this.creditWallet(
        p.payeeId,
        hold.amount,
        p.id,
        'Rent payment released from escrow',
      );

      await this.notif.create({
        userId: p.payeeId,
        type: 'payment_received',
        title: 'Rent Funds Released',
        body: `₦${(hold.amount / 100).toLocaleString()} has been added to your wallet.`,
        data: { escrowId: id },
      });
    }

    return updated;
  }
}
