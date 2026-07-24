import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import {
  user,
  userProfile,
  tenantProfile,
  landlordProfile,
} from '../db/schema';
import type { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  async getMe(userId: string) {
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    if (!foundUser) throw new NotFoundException('User not found.');

    const [profile] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId))
      .limit(1);

    const roleProfile =
      foundUser.role === 'tenant'
        ? await db
            .select()
            .from(tenantProfile)
            .where(eq(tenantProfile.userId, userId))
            .limit(1)
            .then((r) => r[0] ?? null)
        : foundUser.role === 'landlord'
          ? await db
              .select()
              .from(landlordProfile)
              .where(eq(landlordProfile.userId, userId))
              .limit(1)
              .then((r) => r[0] ?? null)
          : null;

    return {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      emailVerified: foundUser.emailVerified,
      image: foundUser.image,
      role: foundUser.role,
      status: foundUser.status,
      createdAt: foundUser.createdAt,
      profile: profile ?? null,
      roleProfile,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Phone uniqueness check (only if changing phone)
    if (dto.phone) {
      const [conflict] = await db
        .select({ id: userProfile.id })
        .from(userProfile)
        .where(eq(userProfile.phone, dto.phone))
        .limit(1);
      if (conflict) throw new ConflictException('Phone number already in use.');
    }

    const [existing] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId))
      .limit(1);

    const updates = {
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.dateOfBirth !== undefined && { dateOfBirth: dto.dateOfBirth }),
      ...(dto.gender !== undefined && { gender: dto.gender }),
      ...(dto.city !== undefined && { city: dto.city }),
      updatedAt: new Date(),
    };

    if (existing) {
      const [updated] = await db
        .update(userProfile)
        .set(updates)
        .where(eq(userProfile.userId, userId))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(userProfile)
      .values({ userId, ...updates })
      .returning();
    return created;
  }

  async getOnboardingStatus(userId: string) {
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    if (!foundUser) throw new NotFoundException('User not found.');

    const [profile] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId))
      .limit(1);

    const tenantProfileComplete = Boolean(
      profile?.phone &&
      profile?.dateOfBirth &&
      profile?.gender &&
      profile?.city,
    );
    const landlordProfileComplete = Boolean(profile?.phone && profile?.city);
    const ninSubmitted =
      profile?.ninStatus !== 'not_submitted' && profile?.ninStatus != null;
    const ninVerified = profile?.ninStatus === 'verified';

    if (foundUser.role === 'tenant') {
      const [tp] = await db
        .select()
        .from(tenantProfile)
        .where(eq(tenantProfile.userId, userId))
        .limit(1);

      return {
        role: 'tenant',
        steps: {
          profile: tenantProfileComplete,
          nin: ninSubmitted,
          ninVerified,
          employment: tp?.employmentStepCompleted ?? false,
          preferences: tp?.preferencesStepCompleted ?? false,
        },
        completed: Boolean(
          tenantProfileComplete &&
          ninVerified &&
          tp?.employmentStepCompleted &&
          tp?.preferencesStepCompleted,
        ),
      };
    }

    if (foundUser.role === 'landlord') {
      const [lp] = await db
        .select()
        .from(landlordProfile)
        .where(eq(landlordProfile.userId, userId))
        .limit(1);

      return {
        role: 'landlord',
        steps: {
          profile: landlordProfileComplete,
          nin: ninSubmitted,
          ninVerified,
          documents: lp ? lp.verificationStatus !== 'unverified' : false,
          bank: lp?.bankStepCompleted ?? false,
        },
        completed: lp?.onboardingCompleted ?? false,
      };
    }

    return {
      role: foundUser.role,
      steps: { profile: tenantProfileComplete, nin: ninSubmitted },
      completed: tenantProfileComplete && ninVerified,
    };
  }
}
