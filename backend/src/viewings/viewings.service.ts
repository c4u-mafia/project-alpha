import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from '../db';
import { property, viewingSlot, viewingRequest } from '../db/schema';
import type {
  CreateSlotDto,
  CreateViewingRequestDto,
  RateViewingDto,
} from './dto/viewings.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ViewingsService {
  constructor(private readonly notif: NotificationsService) {}

  // ── Slots (landlord) ────────────────────────────────────────────────────────

  async createSlot(landlordId: string, propertyId: string, dto: CreateSlotDto) {
    const [prop] = await db
      .select({ id: property.id })
      .from(property)
      .where(and(eq(property.id, propertyId), eq(property.landlordId, landlordId)))
      .limit(1);
    if (!prop) throw new NotFoundException('Property not found.');

    const [slot] = await db
      .insert(viewingSlot)
      .values({
        propertyId,
        landlordId,
        date: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
        maxAttendees: dto.maxAttendees ?? 1,
      })
      .returning();
    return slot;
  }

  async deleteSlot(landlordId: string, propertyId: string, slotId: string) {
    const [slot] = await db
      .select()
      .from(viewingSlot)
      .where(
        and(
          eq(viewingSlot.id, slotId),
          eq(viewingSlot.propertyId, propertyId),
          eq(viewingSlot.landlordId, landlordId),
        ),
      )
      .limit(1);
    if (!slot) throw new NotFoundException('Slot not found.');
    await db.delete(viewingSlot).where(eq(viewingSlot.id, slotId));
    return { deleted: true };
  }

  async getSlots(propertyId: string) {
    return db
      .select()
      .from(viewingSlot)
      .where(and(eq(viewingSlot.propertyId, propertyId), eq(viewingSlot.status, 'available')))
      .orderBy(viewingSlot.date, viewingSlot.startTime);
  }

  // ── Requests (tenant) ───────────────────────────────────────────────────────

  async createRequest(tenantId: string, propertyId: string, dto: CreateViewingRequestDto) {
    const [slot] = await db
      .select()
      .from(viewingSlot)
      .where(and(eq(viewingSlot.id, dto.slotId), eq(viewingSlot.propertyId, propertyId)))
      .limit(1);

    if (!slot) throw new NotFoundException('Viewing slot not found for this property.');
    if (slot.status !== 'available') throw new BadRequestException('Slot is not available.');
    if (slot.currentAttendees >= slot.maxAttendees) {
      throw new BadRequestException('Slot is fully booked.');
    }

    const [req] = await db
      .insert(viewingRequest)
      .values({
        tenantId,
        propertyId,
        slotId: dto.slotId,
        tenantMessage: dto.tenantMessage,
      })
      .returning();

    // Bump attendee count
    await db
      .update(viewingSlot)
      .set({
        currentAttendees: slot.currentAttendees + 1,
        status:
          slot.currentAttendees + 1 >= slot.maxAttendees ? 'fully_booked' : 'available',
        updatedAt: new Date(),
      })
      .where(eq(viewingSlot.id, slot.id));

    return req;
  }

  async getMyRequests(tenantId: string) {
    const rows = await db
      .select({
        request: viewingRequest,
        slot: {
          date: viewingSlot.date,
          startTime: viewingSlot.startTime,
          endTime: viewingSlot.endTime,
        },
        property: {
          id: property.id,
          title: property.title,
          area: property.area,
          city: property.city,
        },
      })
      .from(viewingRequest)
      .leftJoin(viewingSlot, eq(viewingSlot.id, viewingRequest.slotId))
      .leftJoin(property, eq(property.id, viewingRequest.propertyId))
      .where(eq(viewingRequest.tenantId, tenantId))
      .orderBy(desc(viewingRequest.createdAt));

    return rows.map((r) => ({
      ...r.request,
      scheduledFor: r.slot ? `${r.slot.date}T${r.slot.startTime}` : null,
      property: r.property,
    }));
  }

  async getPropertyRequests(landlordId: string, propertyId: string) {
    const [prop] = await db
      .select({ id: property.id })
      .from(property)
      .where(and(eq(property.id, propertyId), eq(property.landlordId, landlordId)))
      .limit(1);
    if (!prop) throw new NotFoundException('Property not found.');

    return db
      .select()
      .from(viewingRequest)
      .where(eq(viewingRequest.propertyId, propertyId))
      .orderBy(viewingRequest.createdAt);
  }

  async getLandlordRequests(landlordId: string) {
    const owned = await db
      .select({ id: property.id })
      .from(property)
      .where(eq(property.landlordId, landlordId));
    if (owned.length === 0) return [];

    const propertyIds = owned.map((p) => p.id);
    const rows = await db
      .select({
        request: viewingRequest,
        slot: {
          date: viewingSlot.date,
          startTime: viewingSlot.startTime,
          endTime: viewingSlot.endTime,
        },
        property: {
          id: property.id,
          title: property.title,
          area: property.area,
          city: property.city,
        },
      })
      .from(viewingRequest)
      .leftJoin(viewingSlot, eq(viewingSlot.id, viewingRequest.slotId))
      .leftJoin(property, eq(property.id, viewingRequest.propertyId))
      .where(inArray(viewingRequest.propertyId, propertyIds))
      .orderBy(desc(viewingRequest.createdAt));

    return rows.map((r) => ({
      ...r.request,
      scheduledFor: r.slot ? `${r.slot.date}T${r.slot.startTime}` : null,
      property: r.property,
    }));
  }

  // ── State transitions ────────────────────────────────────────────────────────

  private async findRequest(id: string) {
    const [req] = await db
      .select()
      .from(viewingRequest)
      .where(eq(viewingRequest.id, id))
      .limit(1);
    if (!req) throw new NotFoundException('Viewing request not found.');
    return req;
  }

  async confirm(id: string, landlordId: string) {
    const req = await this.findRequest(id);
    const [prop] = await db
      .select({ landlordId: property.landlordId })
      .from(property)
      .where(eq(property.id, req.propertyId))
      .limit(1);

    if (!prop || prop.landlordId !== landlordId) throw new ForbiddenException();
    if (req.status !== 'pending') {
      throw new BadRequestException(`Cannot confirm a request with status '${req.status}'.`);
    }

    const [updated] = await db
      .update(viewingRequest)
      .set({ status: 'confirmed', addressRevealed: true, updatedAt: new Date() })
      .where(eq(viewingRequest.id, id))
      .returning();

    await this.notif.create({
      userId: req.tenantId,
      type: 'viewing_confirmed',
      title: 'Viewing Confirmed',
      body: 'Your viewing has been confirmed. The address is now available.',
      data: { viewingRequestId: id },
    });

    return updated;
  }

  async cancel(id: string, actorId: string) {
    const req = await this.findRequest(id);
    const isParty = req.tenantId === actorId;
    const [prop] = await db
      .select({ landlordId: property.landlordId })
      .from(property)
      .where(eq(property.id, req.propertyId))
      .limit(1);
    const isLandlord = prop?.landlordId === actorId;

    if (!isParty && !isLandlord) throw new ForbiddenException();

    const [updated] = await db
      .update(viewingRequest)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(eq(viewingRequest.id, id))
      .returning();

    await this.notif.create({
      userId: isParty ? prop!.landlordId : req.tenantId,
      type: 'viewing_cancelled',
      title: 'Viewing Cancelled',
      body: 'A viewing has been cancelled.',
      data: { viewingRequestId: id },
    });

    return updated;
  }

  async complete(id: string, landlordId: string) {
    const req = await this.findRequest(id);
    const [prop] = await db
      .select({ landlordId: property.landlordId })
      .from(property)
      .where(eq(property.id, req.propertyId))
      .limit(1);

    if (!prop || prop.landlordId !== landlordId) throw new ForbiddenException();
    if (req.status !== 'confirmed') {
      throw new BadRequestException('Viewing must be confirmed before marking complete.');
    }

    const [updated] = await db
      .update(viewingRequest)
      .set({ status: 'completed', updatedAt: new Date() })
      .where(eq(viewingRequest.id, id))
      .returning();
    return updated;
  }

  async rate(id: string, actorId: string, dto: RateViewingDto) {
    const req = await this.findRequest(id);
    if (req.status !== 'completed') {
      throw new BadRequestException('Can only rate a completed viewing.');
    }

    const [prop] = await db
      .select({ landlordId: property.landlordId })
      .from(property)
      .where(eq(property.id, req.propertyId))
      .limit(1);

    const isTenant = req.tenantId === actorId;
    const isLandlord = prop?.landlordId === actorId;
    if (!isTenant && !isLandlord) throw new ForbiddenException();

    const patch = isTenant
      ? { landlordRating: dto.rating, landlordRatingNote: dto.note }
      : { tenantRating: dto.rating, tenantRatingNote: dto.note };

    const [updated] = await db
      .update(viewingRequest)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(viewingRequest.id, id))
      .returning();
    return updated;
  }
}
