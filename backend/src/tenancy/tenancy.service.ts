import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { payment, property, tenancy } from '../db/schema';
import { PaymentsService } from '../payments/payments.service';

function rentHealthPercentage(currentPeriodEnd: string): number {
  const end = new Date(currentPeriodEnd).getTime();
  const now = Date.now();
  const total = 365 * 24 * 60 * 60 * 1000; // approx 1 year in ms
  const remaining = Math.max(0, end - now);
  return Math.round((remaining / total) * 100);
}

function rentHealthLabel(pct: number): 'green' | 'yellow' | 'orange' | 'red' {
  if (pct > 50) return 'green';
  if (pct > 25) return 'yellow';
  if (pct > 10) return 'orange';
  return 'red';
}

@Injectable()
export class TenancyService {
  constructor(private readonly paymentsService: PaymentsService) {}

  async getCurrentTenancy(tenantId: string) {
    const [t] = await db
      .select()
      .from(tenancy)
      .where(and(eq(tenancy.tenantId, tenantId), eq(tenancy.status, 'active')))
      .orderBy(desc(tenancy.createdAt))
      .limit(1);

    if (!t) throw new NotFoundException('No active tenancy found.');

    const daysRemaining = Math.ceil(
      (new Date(t.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    const healthPct = rentHealthPercentage(t.currentPeriodEnd);

    return {
      ...t,
      rentHealth: { percentage: healthPct, label: rentHealthLabel(healthPct), daysRemaining },
    };
  }

  async findOne(id: string, actorId: string) {
    const [t] = await db
      .select()
      .from(tenancy)
      .where(eq(tenancy.id, id))
      .limit(1);
    if (!t) throw new NotFoundException('Tenancy not found.');
    if (t.tenantId !== actorId && t.landlordId !== actorId) throw new ForbiddenException();

    const daysRemaining = Math.ceil(
      (new Date(t.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    const healthPct = rentHealthPercentage(t.currentPeriodEnd);

    return {
      ...t,
      rentHealth: { percentage: healthPct, label: rentHealthLabel(healthPct), daysRemaining },
    };
  }

  async getLandlordTenants(landlordId: string) {
    const tenancies = await db
      .select()
      .from(tenancy)
      .where(and(eq(tenancy.landlordId, landlordId), eq(tenancy.status, 'active')))
      .orderBy(tenancy.currentPeriodEnd);

    return tenancies.map((t) => {
      const daysRemaining = Math.ceil(
        (new Date(t.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );
      const healthPct = rentHealthPercentage(t.currentPeriodEnd);
      return {
        ...t,
        rentHealth: { percentage: healthPct, label: rentHealthLabel(healthPct), daysRemaining },
      };
    });
  }

  async initiateRenewal(id: string, tenantId: string) {
    const [t] = await db
      .select()
      .from(tenancy)
      .where(and(eq(tenancy.id, id), eq(tenancy.tenantId, tenantId)))
      .limit(1);
    if (!t) throw new NotFoundException('Tenancy not found.');
    if (t.status !== 'active') throw new BadRequestException('Only active tenancies can be renewed.');

    // Get the annual rent from the property
    const [prop] = await db
      .select({ annualRent: property.annualRent })
      .from(property)
      .where(eq(property.id, t.propertyId))
      .limit(1);

    return this.paymentsService.initializeRentPayment(tenantId, {
      tenancyId: id,
      amount: prop?.annualRent ?? 0,
    });
  }

  async getTenancyPayments(id: string, actorId: string) {
    const [t] = await db
      .select()
      .from(tenancy)
      .where(eq(tenancy.id, id))
      .limit(1);
    if (!t) throw new NotFoundException('Tenancy not found.');
    if (t.tenantId !== actorId && t.landlordId !== actorId) throw new ForbiddenException();

    return db
      .select()
      .from(payment)
      .where(eq(payment.tenancyId, id))
      .orderBy(desc(payment.createdAt));
  }
}
