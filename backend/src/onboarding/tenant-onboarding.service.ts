import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { userProfile, tenantProfile } from '../db/schema';
import type { TenantNinDto, TenantEmploymentDto, TenantPreferencesDto } from './dto/tenant-onboarding.dto';

@Injectable()
export class TenantOnboardingService {
  async submitNin(userId: string, dto: TenantNinDto) {
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
      return { ninStatus: updated.ninStatus, message: 'NIN submitted for verification.' };
    }

    const [created] = await db
      .insert(userProfile)
      .values({ userId, ...updates })
      .returning();
    return { ninStatus: created.ninStatus, message: 'NIN submitted for verification.' };
  }

  async saveEmployment(userId: string, dto: TenantEmploymentDto) {
    const [existing] = await db
      .select()
      .from(tenantProfile)
      .where(eq(tenantProfile.userId, userId))
      .limit(1);

    const updates = {
      ...(dto.employerName !== undefined && { employerName: dto.employerName }),
      ...(dto.jobRole !== undefined && { jobRole: dto.jobRole }),
      ...(dto.monthlyIncomeRange !== undefined && {
        monthlyIncomeRange: dto.monthlyIncomeRange as any,
      }),
      ...(dto.guarantorName !== undefined && { guarantorName: dto.guarantorName }),
      ...(dto.guarantorPhone !== undefined && { guarantorPhone: dto.guarantorPhone }),
      ...(dto.guarantorConfirmed !== undefined && { guarantorConfirmed: dto.guarantorConfirmed }),
      employmentStepCompleted: true,
      updatedAt: new Date(),
    };

    if (existing) {
      const [updated] = await db
        .update(tenantProfile)
        .set(updates)
        .where(eq(tenantProfile.userId, userId))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(tenantProfile)
      .values({ userId, ...updates })
      .returning();
    return created;
  }

  async savePreferences(userId: string, dto: TenantPreferencesDto) {
    const [existing] = await db
      .select()
      .from(tenantProfile)
      .where(eq(tenantProfile.userId, userId))
      .limit(1);

    const updates = {
      ...(dto.preferredBudgetMin !== undefined && { preferredBudgetMin: dto.preferredBudgetMin }),
      ...(dto.preferredBudgetMax !== undefined && { preferredBudgetMax: dto.preferredBudgetMax }),
      ...(dto.preferredAreas !== undefined && { preferredAreas: dto.preferredAreas }),
      ...(dto.preferredBedrooms !== undefined && { preferredBedrooms: dto.preferredBedrooms }),
      ...(dto.moveInTimeline !== undefined && { moveInTimeline: dto.moveInTimeline as any }),
      preferencesStepCompleted: true,
      updatedAt: new Date(),
    };

    if (existing) {
      const [updated] = await db
        .update(tenantProfile)
        .set(updates)
        .where(eq(tenantProfile.userId, userId))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(tenantProfile)
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

    const [tp] = await db
      .select()
      .from(tenantProfile)
      .where(eq(tenantProfile.userId, userId))
      .limit(1);

    const profileComplete = Boolean(
      profile?.phone && profile?.dateOfBirth && profile?.gender && profile?.city,
    );

    return {
      steps: {
        profile: profileComplete,
        nin: profile?.ninStatus !== 'not_submitted' && profile?.ninStatus != null,
        ninVerified: profile?.ninStatus === 'verified',
        employment: tp?.employmentStepCompleted ?? false,
        preferences: tp?.preferencesStepCompleted ?? false,
      },
      completed: Boolean(
        profileComplete &&
          profile?.ninStatus === 'verified' &&
          tp?.employmentStepCompleted &&
          tp?.preferencesStepCompleted,
      ),
    };
  }
}
