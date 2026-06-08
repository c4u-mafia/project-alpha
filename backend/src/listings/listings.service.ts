import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { and, arrayContains, between, desc, eq, gte, lte, sql } from 'drizzle-orm';
import { db } from '../db';
import { property, propertyPhoto, savedListing } from '../db/schema';
import type { ListingsQueryDto } from './dto/listings.dto';

function stripAddress(p: Record<string, unknown>) {
  const { address, ...safe } = p;
  return safe;
}

@Injectable()
export class ListingsService {
  async getFeed(userId: string) {
    const base = and(eq(property.status, 'listed'));

    const [forYou, newThisWeek, verifiedOnly] = await Promise.all([
      // For You — randomised listed properties (simple shuffle via createdAt desc for now)
      db
        .select()
        .from(property)
        .where(base)
        .orderBy(desc(property.publishedAt))
        .limit(10),

      // New This Week — published in last 7 days
      db
        .select()
        .from(property)
        .where(
          and(
            eq(property.status, 'listed'),
            gte(property.publishedAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
          ),
        )
        .orderBy(desc(property.publishedAt))
        .limit(10),

      // Verified Only — boosted or recently published (proxy for "verified" spotlight)
      db
        .select()
        .from(property)
        .where(and(eq(property.status, 'listed'), eq(property.isBoosted, true)))
        .orderBy(desc(property.publishedAt))
        .limit(10),
    ]);

    const strip = (rows: typeof forYou) => rows.map((r) => stripAddress(r as any));

    return {
      forYou: strip(forYou),
      newThisWeek: strip(newThisWeek),
      verifiedOnly: strip(verifiedOnly),
    };
  }

  async search(query: ListingsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions = [eq(property.status, 'listed')];

    if (query.city) conditions.push(eq(property.city, query.city));
    if (query.area) conditions.push(eq(property.area, query.area));
    if (query.bedrooms !== undefined) conditions.push(eq(property.bedrooms, query.bedrooms));
    if (query.type) conditions.push(eq(property.type, query.type as any));
    if (query.minRent !== undefined) conditions.push(gte(property.annualRent, query.minRent));
    if (query.maxRent !== undefined) conditions.push(lte(property.annualRent, query.maxRent));
    if (query.amenity) conditions.push(arrayContains(property.amenities, [query.amenity]));

    const rows = await db
      .select()
      .from(property)
      .where(and(...(conditions as [any, ...any[]])))
      .orderBy(desc(property.publishedAt))
      .limit(limit)
      .offset(offset);

    return {
      data: rows.map((r) => stripAddress(r as any)),
      page,
      limit,
    };
  }

  async findOne(propertyId: string) {
    const [found] = await db
      .select()
      .from(property)
      .where(and(eq(property.id, propertyId), eq(property.status, 'listed')))
      .limit(1);

    if (!found) throw new NotFoundException('Listing not found.');

    const photos = await db
      .select()
      .from(propertyPhoto)
      .where(eq(propertyPhoto.propertyId, propertyId))
      .orderBy(propertyPhoto.displayOrder);

    return { ...stripAddress(found as any), photos };
  }

  async save(userId: string, propertyId: string) {
    const [exists] = await db
      .select({ id: savedListing.id })
      .from(savedListing)
      .where(and(eq(savedListing.userId, userId), eq(savedListing.propertyId, propertyId)))
      .limit(1);

    if (exists) throw new ConflictException('Listing already saved.');

    const [created] = await db
      .insert(savedListing)
      .values({ userId, propertyId })
      .returning();
    return created;
  }

  async unsave(userId: string, propertyId: string) {
    await db
      .delete(savedListing)
      .where(and(eq(savedListing.userId, userId), eq(savedListing.propertyId, propertyId)));
    return { ok: true };
  }

  async getSavedListings(userId: string) {
    const rows = await db
      .select({
        savedAt: savedListing.createdAt,
        property,
      })
      .from(savedListing)
      .innerJoin(property, eq(savedListing.propertyId, property.id))
      .where(eq(savedListing.userId, userId))
      .orderBy(desc(savedListing.createdAt));

    return rows.map((r) => ({ savedAt: r.savedAt, ...stripAddress(r.property as any) }));
  }
}
