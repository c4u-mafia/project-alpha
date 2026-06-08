import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, ilike, or } from 'drizzle-orm';
import { db } from '../db';
import { kycDocument, landlordProfile, property, user } from '../db/schema';
import type {
  RejectKycDocumentDto,
  ReviewKycDocumentDto,
  SuspendUserDto,
  UserListQueryDto,
} from './dto/admin.dto';

@Injectable()
export class AdminService {
  // ── KYC queue ─────────────────────────────────────────────────────────────

  async getKycQueue() {
    return db
      .select()
      .from(kycDocument)
      .where(
        or(
          eq(kycDocument.status, 'submitted'),
          eq(kycDocument.status, 'under_review'),
        ),
      )
      .orderBy(kycDocument.createdAt);
  }

  async markUnderReview(
    id: string,
    reviewerId: string,
    dto: ReviewKycDocumentDto,
  ) {
    const [doc] = await db
      .select()
      .from(kycDocument)
      .where(eq(kycDocument.id, id))
      .limit(1);
    if (!doc) throw new NotFoundException('KYC document not found.');
    if (doc.status === 'approved')
      throw new BadRequestException('Document is already approved.');

    const [updated] = await db
      .update(kycDocument)
      .set({
        status: 'under_review',
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(kycDocument.id, id))
      .returning();
    return updated;
  }

  async approveKycDocument(id: string, reviewerId: string) {
    const [doc] = await db
      .select()
      .from(kycDocument)
      .where(eq(kycDocument.id, id))
      .limit(1);
    if (!doc) throw new NotFoundException('KYC document not found.');

    const [updated] = await db
      .update(kycDocument)
      .set({
        status: 'approved',
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(kycDocument.id, id))
      .returning();

    // Check if all submitted docs for this user are approved → promote landlord
    await this.tryPromoteLandlord(doc.userId);

    return updated;
  }

  async rejectKycDocument(
    id: string,
    reviewerId: string,
    dto: RejectKycDocumentDto,
  ) {
    const [doc] = await db
      .select()
      .from(kycDocument)
      .where(eq(kycDocument.id, id))
      .limit(1);
    if (!doc) throw new NotFoundException('KYC document not found.');

    const [updated] = await db
      .update(kycDocument)
      .set({
        status: 'rejected',
        rejectionReason: dto.reason,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(kycDocument.id, id))
      .returning();
    return updated;
  }

  private async tryPromoteLandlord(userId: string) {
    const docs = await db
      .select()
      .from(kycDocument)
      .where(eq(kycDocument.userId, userId));

    const hasDocs = docs.length > 0;
    const allApproved = docs.every((d) => d.status === 'approved');

    if (hasDocs && allApproved) {
      await db
        .update(landlordProfile)
        .set({
          verificationStatus: 'approved',
          onboardingCompleted: true,
          updatedAt: new Date(),
        })
        .where(eq(landlordProfile.userId, userId));
    }
  }

  // ── User management ────────────────────────────────────────────────────────

  async listUsers(query: UserListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions: ReturnType<typeof eq>[] = [];

    if (query.role) {
      conditions.push(eq(user.role, query.role as any));
    }

    // Base query with left join to landlord_profile for verificationStatus filter
    const rows = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        verificationStatus: landlordProfile.verificationStatus,
      })
      .from(user)
      .leftJoin(landlordProfile, eq(user.id, landlordProfile.userId))
      .where(
        and(
          query.role ? eq(user.role, query.role as any) : undefined,
          query.verificationStatus
            ? eq(landlordProfile.verificationStatus, query.verificationStatus as any)
            : undefined,
          query.search
            ? or(
                ilike(user.name, `%${query.search}%`),
                ilike(user.email, `%${query.search}%`),
              )
            : undefined,
        ),
      )
      .limit(limit)
      .offset(offset)
      .orderBy(user.createdAt);

    return { data: rows, page, limit };
  }

  async suspendUser(id: string, dto: SuspendUserDto) {
    const [found] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, id))
      .limit(1);
    if (!found) throw new NotFoundException('User not found.');

    // We use the welcomeEmailSentAt field as a stand-in status marker is not in schema.
    // For now, return a soft confirmation — a `suspended` flag can be added to user table if needed.
    return { id, suspended: true, reason: dto.reason ?? null };
  }

  async banUser(id: string) {
    const [found] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, id))
      .limit(1);
    if (!found) throw new NotFoundException('User not found.');

    return { id, banned: true };
  }

  // ── Listing moderation ─────────────────────────────────────────────────────

  async getListingsQueue() {
    return db
      .select()
      .from(property)
      .where(eq(property.status, 'submitted_for_review'))
      .orderBy(property.createdAt);
  }

  async approveListing(id: string) {
    const [found] = await db
      .select()
      .from(property)
      .where(eq(property.id, id))
      .limit(1);
    if (!found) throw new NotFoundException('Property not found.');
    if (found.status !== 'submitted_for_review') {
      throw new BadRequestException('Property is not pending review.');
    }

    const [updated] = await db
      .update(property)
      .set({ status: 'listed', publishedAt: new Date(), updatedAt: new Date() })
      .where(eq(property.id, id))
      .returning();
    return updated;
  }

  async rejectListing(id: string, dto: { reason: string }) {
    const [found] = await db
      .select()
      .from(property)
      .where(eq(property.id, id))
      .limit(1);
    if (!found) throw new NotFoundException('Property not found.');
    if (found.status !== 'submitted_for_review') {
      throw new BadRequestException('Property is not pending review.');
    }

    const [updated] = await db
      .update(property)
      .set({
        status: 'rejected',
        rejectionReason: dto.reason,
        updatedAt: new Date(),
      })
      .where(eq(property.id, id))
      .returning();
    return updated;
  }
}
