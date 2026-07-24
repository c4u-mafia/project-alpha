import { BadRequestException, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { userProfile, landlordProfile, kycDocument } from '../db/schema';
import type {
  LandlordProfileDto,
  LandlordNinDto,
  LandlordDocumentDto,
  LandlordBankDto,
} from './dto/landlord-onboarding.dto';

@Injectable()
export class LandlordOnboardingService {
  async saveProfile(userId: string, dto: LandlordProfileDto) {
    const [existing] = await db
      .select()
      .from(landlordProfile)
      .where(eq(landlordProfile.userId, userId))
      .limit(1);

    const updates = {
      ...(dto.isCompany !== undefined && { isCompany: dto.isCompany }),
      ...(dto.companyName !== undefined && { companyName: dto.companyName }),
      ...(dto.isDiaspora !== undefined && { isDiaspora: dto.isDiaspora }),
      updatedAt: new Date(),
    };

    if (existing) {
      const [updated] = await db
        .update(landlordProfile)
        .set(updates)
        .where(eq(landlordProfile.userId, userId))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(landlordProfile)
      .values({ userId, ...updates })
      .returning();
    return created;
  }

  async submitNin(userId: string, dto: LandlordNinDto) {
    const [existing] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId))
      .limit(1);

    if (existing?.ninStatus === 'verified') {
      throw new BadRequestException('NIN is already verified.');
    }

    const updates = {
      ninNumber: dto.nin,
      ninStatus: 'pending' as const,
      updatedAt: new Date(),
    };

    if (existing) {
      const [updated] = await db
        .update(userProfile)
        .set(updates)
        .where(eq(userProfile.userId, userId))
        .returning();
      return {
        ninStatus: updated.ninStatus,
        message: 'NIN submitted for verification.',
      };
    }

    const [created] = await db
      .insert(userProfile)
      .values({ userId, ...updates })
      .returning();
    return {
      ninStatus: created.ninStatus,
      message: 'NIN submitted for verification.',
    };
  }

  async uploadDocument(userId: string, dto: LandlordDocumentDto) {
    const [doc] = await db
      .insert(kycDocument)
      .values({
        userId,
        documentType: dto.documentType,
        documentUrl: dto.documentUrl,
        status: 'submitted',
        propertyId: dto.propertyId ?? null,
      })
      .returning();

    // After uploading first doc, bump verification status to documents_submitted
    await db
      .update(landlordProfile)
      .set({ verificationStatus: 'documents_submitted', updatedAt: new Date() })
      .where(
        and(
          eq(landlordProfile.userId, userId),
          eq(landlordProfile.verificationStatus, 'unverified'),
        ),
      );

    return doc;
  }

  async saveBank(userId: string, dto: LandlordBankDto) {
    const [existing] = await db
      .select()
      .from(landlordProfile)
      .where(eq(landlordProfile.userId, userId))
      .limit(1);

    const updates = {
      bankCode: dto.bankCode,
      bankName: dto.bankName,
      bankAccountNumber: dto.accountNumber,
      bankAccountName: dto.accountName,
      bankStepCompleted: true,
      updatedAt: new Date(),
    };

    if (existing) {
      const [updated] = await db
        .update(landlordProfile)
        .set(updates)
        .where(eq(landlordProfile.userId, userId))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(landlordProfile)
      .values({ userId, ...updates })
      .returning();
    return created;
  }

  async getStatus(userId: string) {
    const [profile] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId))
      .limit(1);

    const [lp] = await db
      .select()
      .from(landlordProfile)
      .where(eq(landlordProfile.userId, userId))
      .limit(1);

    const profileComplete = Boolean(profile?.phone && profile?.city);

    return {
      steps: {
        profile: profileComplete,
        nin:
          profile?.ninStatus !== 'not_submitted' && profile?.ninStatus != null,
        ninVerified: profile?.ninStatus === 'verified',
        documents: lp ? lp.verificationStatus !== 'unverified' : false,
        bank: lp?.bankStepCompleted ?? false,
      },
      verificationStatus: lp?.verificationStatus ?? 'unverified',
      completed: lp?.onboardingCompleted ?? false,
    };
  }
}
