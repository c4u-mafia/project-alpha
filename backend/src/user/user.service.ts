import { Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { user, userProfile, tenantProfile, landlordProfile } from '../db/schema';

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
      createdAt: foundUser.createdAt,
      profile: profile ?? null,
      roleProfile,
    };
  }
}
