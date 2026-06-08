import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { property, propertyPhoto, landlordProfile } from '../db/schema';
import type { CreatePropertyDto, UpdatePropertyDto, AddPhotoDto } from './dto/property.dto';

const IMMUTABLE_STATUSES = ['occupied'] as const;
const MIN_PHOTOS_TO_SUBMIT = 6;

@Injectable()
export class PropertyService {
  private async assertOwnership(propertyId: string, landlordId: string) {
    const [found] = await db
      .select()
      .from(property)
      .where(and(eq(property.id, propertyId), eq(property.landlordId, landlordId)))
      .limit(1);
    if (!found) throw new NotFoundException('Property not found.');
    return found;
  }

  private async assertVerified(landlordId: string) {
    const [lp] = await db
      .select({ verificationStatus: landlordProfile.verificationStatus })
      .from(landlordProfile)
      .where(eq(landlordProfile.userId, landlordId))
      .limit(1);
    if (!lp || lp.verificationStatus !== 'approved') {
      throw new ForbiddenException(
        'Your landlord account must be verified before creating listings.',
      );
    }
  }

  async create(landlordId: string, dto: CreatePropertyDto) {
    await this.assertVerified(landlordId);
    const [created] = await db
      .insert(property)
      .values({
        landlordId,
        title: dto.title,
        type: dto.type as any,
        bedrooms: dto.bedrooms,
        bathrooms: dto.bathrooms,
        toilets: dto.toilets,
        squareFootage: dto.squareFootage,
        yearBuilt: dto.yearBuilt,
        description: dto.description ?? '',
        annualRent: dto.annualRent,
        serviceCharge: dto.serviceCharge ?? 0,
        cautionDeposit: dto.cautionDeposit ?? 0,
        agencyFee: dto.agencyFee ?? 0,
        acceptedPaymentFrequencies: (dto.acceptedPaymentFrequencies as any) ?? [],
        amenities: dto.amenities ?? [],
        state: dto.state,
        city: dto.city,
        area: dto.area,
        address: dto.address,
        latitude: dto.latitude?.toString(),
        longitude: dto.longitude?.toString(),
        status: 'draft',
      })
      .returning();
    return created;
  }

  async update(propertyId: string, landlordId: string, dto: UpdatePropertyDto) {
    const existing = await this.assertOwnership(propertyId, landlordId);
    if ((IMMUTABLE_STATUSES as readonly string[]).includes(existing.status)) {
      throw new BadRequestException(`Cannot edit a property with status '${existing.status}'.`);
    }

    const [updated] = await db
      .update(property)
      .set({
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.type !== undefined && { type: dto.type as any }),
        ...(dto.bedrooms !== undefined && { bedrooms: dto.bedrooms }),
        ...(dto.bathrooms !== undefined && { bathrooms: dto.bathrooms }),
        ...(dto.toilets !== undefined && { toilets: dto.toilets }),
        ...(dto.squareFootage !== undefined && { squareFootage: dto.squareFootage }),
        ...(dto.yearBuilt !== undefined && { yearBuilt: dto.yearBuilt }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.annualRent !== undefined && { annualRent: dto.annualRent }),
        ...(dto.serviceCharge !== undefined && { serviceCharge: dto.serviceCharge }),
        ...(dto.cautionDeposit !== undefined && { cautionDeposit: dto.cautionDeposit }),
        ...(dto.agencyFee !== undefined && { agencyFee: dto.agencyFee }),
        ...(dto.acceptedPaymentFrequencies !== undefined && {
          acceptedPaymentFrequencies: dto.acceptedPaymentFrequencies as any,
        }),
        ...(dto.amenities !== undefined && { amenities: dto.amenities }),
        ...(dto.state !== undefined && { state: dto.state }),
        ...(dto.city !== undefined && { city: dto.city }),
        ...(dto.area !== undefined && { area: dto.area }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.latitude !== undefined && { latitude: dto.latitude.toString() }),
        ...(dto.longitude !== undefined && { longitude: dto.longitude.toString() }),
        updatedAt: new Date(),
      })
      .where(eq(property.id, propertyId))
      .returning();
    return updated;
  }

  async addPhoto(propertyId: string, landlordId: string, dto: AddPhotoDto) {
    await this.assertOwnership(propertyId, landlordId);
    const [photo] = await db
      .insert(propertyPhoto)
      .values({
        propertyId,
        url: dto.url,
        caption: dto.caption,
        displayOrder: dto.displayOrder ?? 0,
        photoType: (dto.photoType as any) ?? 'other',
      })
      .returning();
    return photo;
  }

  async deletePhoto(propertyId: string, photoId: string, landlordId: string) {
    await this.assertOwnership(propertyId, landlordId);
    const [deleted] = await db
      .delete(propertyPhoto)
      .where(and(eq(propertyPhoto.id, photoId), eq(propertyPhoto.propertyId, propertyId)))
      .returning();
    if (!deleted) throw new NotFoundException('Photo not found.');
    return { deleted: true };
  }

  async submitForReview(propertyId: string, landlordId: string) {
    const existing = await this.assertOwnership(propertyId, landlordId);

    if (existing.status !== 'draft') {
      throw new BadRequestException(
        `Only draft properties can be submitted. Current status: ${existing.status}`,
      );
    }

    const photos = await db
      .select({ id: propertyPhoto.id })
      .from(propertyPhoto)
      .where(eq(propertyPhoto.propertyId, propertyId));

    if (photos.length < MIN_PHOTOS_TO_SUBMIT) {
      throw new BadRequestException(
        `At least ${MIN_PHOTOS_TO_SUBMIT} photos are required before submitting.`,
      );
    }

    const [updated] = await db
      .update(property)
      .set({ status: 'submitted_for_review', updatedAt: new Date() })
      .where(eq(property.id, propertyId))
      .returning();
    return updated;
  }

  async pause(propertyId: string, landlordId: string) {
    const existing = await this.assertOwnership(propertyId, landlordId);
    if (existing.status !== 'listed') {
      throw new BadRequestException('Only listed properties can be paused.');
    }
    const [updated] = await db
      .update(property)
      .set({ status: 'paused', updatedAt: new Date() })
      .where(eq(property.id, propertyId))
      .returning();
    return updated;
  }

  async unpause(propertyId: string, landlordId: string) {
    const existing = await this.assertOwnership(propertyId, landlordId);
    if (existing.status !== 'paused') {
      throw new BadRequestException('Only paused properties can be unpaused.');
    }
    const [updated] = await db
      .update(property)
      .set({ status: 'listed', updatedAt: new Date() })
      .where(eq(property.id, propertyId))
      .returning();
    return updated;
  }

  async findAllForLandlord(landlordId: string) {
    return db
      .select()
      .from(property)
      .where(eq(property.landlordId, landlordId))
      .orderBy(property.createdAt);
  }

  async findOneForLandlord(propertyId: string, landlordId: string) {
    const found = await this.assertOwnership(propertyId, landlordId);
    const photos = await db
      .select()
      .from(propertyPhoto)
      .where(eq(propertyPhoto.propertyId, propertyId))
      .orderBy(propertyPhoto.displayOrder);
    return { ...found, photos };
  }
}
