import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import {
  property,
  rentalApplication,
  leaseAgreement,
  tenancy,
  viewingRequest,
} from '../db/schema';
import type { CreateApplicationDto, DeclineApplicationDto } from './dto/applications.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ApplicationsService {
  constructor(private readonly notif: NotificationsService) {}

  async create(tenantId: string, dto: CreateApplicationDto) {
    const [prop] = await db
      .select()
      .from(property)
      .where(and(eq(property.id, dto.propertyId), eq(property.status, 'listed')))
      .limit(1);
    if (!prop) throw new NotFoundException('Listed property not found.');

    // Require a completed viewing
    if (dto.viewingRequestId) {
      const [vr] = await db
        .select()
        .from(viewingRequest)
        .where(
          and(
            eq(viewingRequest.id, dto.viewingRequestId),
            eq(viewingRequest.tenantId, tenantId),
            eq(viewingRequest.status, 'completed'),
          ),
        )
        .limit(1);
      if (!vr) throw new BadRequestException('Viewing must be completed before applying.');
    }

    const [app] = await db
      .insert(rentalApplication)
      .values({
        tenantId,
        landlordId: prop.landlordId,
        propertyId: dto.propertyId,
        viewingRequestId: dto.viewingRequestId,
        moveInDate: dto.moveInDate,
        employmentProofUrl: dto.employmentProofUrl,
        personalMessage: dto.personalMessage,
        status: 'submitted',
      })
      .returning();

    await this.notif.create({
      userId: prop.landlordId,
      type: 'application_submitted',
      title: 'New Rental Application',
      body: 'A tenant has applied for your property.',
      data: { applicationId: app.id, propertyId: dto.propertyId },
    });

    return app;
  }

  async getMyApplications(tenantId: string) {
    return db
      .select()
      .from(rentalApplication)
      .where(eq(rentalApplication.tenantId, tenantId))
      .orderBy(rentalApplication.createdAt);
  }

  async getPropertyApplications(landlordId: string, propertyId: string) {
    const [prop] = await db
      .select({ id: property.id })
      .from(property)
      .where(and(eq(property.id, propertyId), eq(property.landlordId, landlordId)))
      .limit(1);
    if (!prop) throw new NotFoundException('Property not found.');

    return db
      .select()
      .from(rentalApplication)
      .where(eq(rentalApplication.propertyId, propertyId))
      .orderBy(rentalApplication.createdAt);
  }

  async findOne(id: string, actorId: string) {
    const [app] = await db
      .select()
      .from(rentalApplication)
      .where(eq(rentalApplication.id, id))
      .limit(1);
    if (!app) throw new NotFoundException('Application not found.');
    if (app.tenantId !== actorId && app.landlordId !== actorId) throw new ForbiddenException();
    return app;
  }

  async approve(id: string, landlordId: string) {
    const [app] = await db
      .select()
      .from(rentalApplication)
      .where(and(eq(rentalApplication.id, id), eq(rentalApplication.landlordId, landlordId)))
      .limit(1);
    if (!app) throw new NotFoundException('Application not found.');
    if (app.status !== 'submitted' && app.status !== 'under_review') {
      throw new BadRequestException(`Cannot approve application with status '${app.status}'.`);
    }

    const [updatedApp] = await db
      .update(rentalApplication)
      .set({ status: 'approved', updatedAt: new Date() })
      .where(eq(rentalApplication.id, id))
      .returning();

    const [prop] = await db
      .select()
      .from(property)
      .where(eq(property.id, app.propertyId))
      .limit(1);

    // Generate draft lease
    const leaseStart = app.moveInDate;
    const leaseEnd = new Date(app.moveInDate);
    leaseEnd.setFullYear(leaseEnd.getFullYear() + 1);

    const [lease] = await db
      .insert(leaseAgreement)
      .values({
        applicationId: app.id,
        tenantId: app.tenantId,
        landlordId: app.landlordId,
        propertyId: app.propertyId,
        startDate: leaseStart,
        endDate: leaseEnd.toISOString().split('T')[0],
        annualRent: prop?.annualRent ?? 0,
        paymentFrequency: prop?.acceptedPaymentFrequencies?.[0] ?? 'yearly',
        status: 'pending_signatures',
      })
      .returning();

    await this.notif.create({
      userId: app.tenantId,
      type: 'application_approved',
      title: 'Application Approved!',
      body: 'Your rental application has been approved. Please review and sign the lease.',
      data: { applicationId: id, leaseId: lease.id },
    });

    return { application: updatedApp, lease };
  }

  async decline(id: string, landlordId: string, dto: DeclineApplicationDto) {
    const [app] = await db
      .select()
      .from(rentalApplication)
      .where(and(eq(rentalApplication.id, id), eq(rentalApplication.landlordId, landlordId)))
      .limit(1);
    if (!app) throw new NotFoundException('Application not found.');

    const [updated] = await db
      .update(rentalApplication)
      .set({ status: 'declined', landlordNote: dto.note, updatedAt: new Date() })
      .where(eq(rentalApplication.id, id))
      .returning();

    await this.notif.create({
      userId: app.tenantId,
      type: 'application_declined',
      title: 'Application Not Selected',
      body: dto.note ?? 'Your application was not selected for this property.',
      data: { applicationId: id },
    });

    return updated;
  }

  // ── Lease ────────────────────────────────────────────────────────────────────

  async getLease(id: string, actorId: string) {
    const [lease] = await db
      .select()
      .from(leaseAgreement)
      .where(eq(leaseAgreement.id, id))
      .limit(1);
    if (!lease) throw new NotFoundException('Lease not found.');
    if (lease.tenantId !== actorId && lease.landlordId !== actorId) throw new ForbiddenException();
    return lease;
  }

  async signLease(id: string, actorId: string) {
    const [lease] = await db
      .select()
      .from(leaseAgreement)
      .where(eq(leaseAgreement.id, id))
      .limit(1);
    if (!lease) throw new NotFoundException('Lease not found.');
    if (lease.tenantId !== actorId && lease.landlordId !== actorId) throw new ForbiddenException();
    if (lease.status !== 'pending_signatures') {
      throw new BadRequestException(`Lease cannot be signed in status '${lease.status}'.`);
    }

    const isTenant = lease.tenantId === actorId;
    if (isTenant && lease.tenantSignedAt) {
      throw new BadRequestException('You have already signed this lease.');
    }
    if (!isTenant && lease.landlordSignedAt) {
      throw new BadRequestException('You have already signed this lease.');
    }

    const patch = isTenant
      ? { tenantSignedAt: new Date() }
      : { landlordSignedAt: new Date() };

    const tenantSigned = isTenant ? new Date() : lease.tenantSignedAt;
    const landlordSigned = !isTenant ? new Date() : lease.landlordSignedAt;
    const bothSigned = Boolean(tenantSigned && landlordSigned);

    const [updatedLease] = await db
      .update(leaseAgreement)
      .set({
        ...patch,
        status: bothSigned ? 'active' : 'pending_signatures',
        updatedAt: new Date(),
      })
      .where(eq(leaseAgreement.id, id))
      .returning();

    if (bothSigned) {
      // Create tenancy record
      const [t] = await db
        .insert(tenancy)
        .values({
          leaseId: lease.id,
          tenantId: lease.tenantId,
          landlordId: lease.landlordId,
          propertyId: lease.propertyId,
          startDate: lease.startDate,
          endDate: lease.endDate,
          currentPeriodStart: lease.startDate,
          currentPeriodEnd: lease.endDate,
          status: 'active',
        })
        .returning();

      // Mark property as occupied
      await db
        .update(property)
        .set({ status: 'occupied', updatedAt: new Date() })
        .where(eq(property.id, lease.propertyId));

      await this.notif.create({
        userId: lease.tenantId,
        type: 'tenancy_created',
        title: 'Tenancy Active',
        body: 'Both parties have signed. Your tenancy is now active.',
        data: { tenancyId: t.id, leaseId: id },
      });

      return { lease: updatedLease, tenancy: t };
    }

    await this.notif.create({
      userId: isTenant ? lease.landlordId : lease.tenantId,
      type: 'lease_ready_to_sign',
      title: 'Lease Ready to Sign',
      body: 'The other party has signed the lease. Your signature is needed.',
      data: { leaseId: id },
    });

    return { lease: updatedLease };
  }
}
