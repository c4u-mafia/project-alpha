import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { escrowHold, payment, tenancy, wallet, walletTransaction } from '../db/schema';
import type {
  FundWalletDto,
  InitializePaymentDto,
  ReleaseEscrowDto,
  WithdrawDto,
} from './dto/payments.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly notif: NotificationsService) {}

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
    // In production: call Paystack to create a payment link and return it.
    // For now: return a mock payment reference for testing.
    const ref = `FUND-${Date.now()}-${userId.slice(0, 6)}`;
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

    return {
      paymentId: p.id,
      reference: ref,
      amount: dto.amount,
      // In production return Paystack authorization_url here
      message: 'Initialize payment with Paystack using the reference above.',
    };
  }

  async initializeRentPayment(payerId: string, dto: InitializePaymentDto) {
    const [t] = await db
      .select()
      .from(tenancy)
      .where(and(eq(tenancy.id, dto.tenancyId), eq(tenancy.tenantId, payerId)))
      .limit(1);
    if (!t) throw new NotFoundException('Tenancy not found.');

    const ref = `RENT-${Date.now()}-${payerId.slice(0, 6)}`;
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

    return {
      paymentId: p.id,
      reference: ref,
      amount: dto.amount,
      message: 'Initialize payment with Paystack using the reference above.',
    };
  }

  async handleWebhook(body: Record<string, unknown>) {
    // Verify Paystack signature in production (req.headers['x-paystack-signature'])
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
      await db
        .update(payment)
        .set({
          status: 'completed',
          providerResponse: body as any,
          updatedAt: new Date(),
        })
        .where(eq(payment.id, p.id));

      if (p.type === 'wallet_funding') {
        await this.creditWallet(p.payerId, p.amount, p.id, 'Wallet top-up via Paystack');
      }

      if (p.type === 'rent_payment') {
        // Hold funds in escrow for 24h before releasing to landlord
        const releaseAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await db.insert(escrowHold).values({
          paymentId: p.id,
          amount: p.amount,
          status: 'held',
          releaseScheduledAt: releaseAt,
        });

        if (p.payeeId) {
          await this.notif.create({
            userId: p.payeeId,
            type: 'payment_received',
            title: 'Rent Payment Received',
            body: `₦${(p.amount / 100).toLocaleString()} received and held in escrow.`,
            data: { paymentId: p.id },
          });
        }
      }
    }

    if (event === 'charge.failed') {
      await db
        .update(payment)
        .set({ status: 'failed', updatedAt: new Date() })
        .where(eq(payment.id, p.id));

      await this.notif.create({
        userId: p.payerId,
        type: 'payment_failed',
        title: 'Payment Failed',
        body: 'Your payment could not be processed. Please try again.',
        data: { paymentId: p.id },
      });
    }

    return { ok: true };
  }

  private async creditWallet(userId: string, amount: number, paymentId: string, description: string) {
    const w = await this.getOrCreateWallet(userId);
    const newBalance = w.balance + amount;

    await db
      .update(wallet)
      .set({ balance: newBalance, updatedAt: new Date() })
      .where(eq(wallet.id, w.id));

    await db.insert(walletTransaction).values({
      walletId: w.id,
      paymentId,
      type: 'credit',
      amount,
      balanceAfter: newBalance,
      description,
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
      throw new BadRequestException(`Escrow already in status '${hold.status}'.`);
    }

    const [p] = await db
      .select()
      .from(payment)
      .where(eq(payment.id, hold.paymentId))
      .limit(1);

    const [updated] = await db
      .update(escrowHold)
      .set({ status: 'released', releasedAt: new Date(), updatedAt: new Date() })
      .where(eq(escrowHold.id, id))
      .returning();

    if (p?.payeeId) {
      await this.creditWallet(p.payeeId, hold.amount, p.id, 'Rent payment released from escrow');

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
