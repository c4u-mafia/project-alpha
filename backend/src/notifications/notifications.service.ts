import { Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { db } from '../db';
import { notification } from '../db/schema';
import type { NewNotification } from '../db/schema';

@Injectable()
export class NotificationsService {
  async create(data: Omit<NewNotification, 'id' | 'createdAt'>) {
    const [n] = await db.insert(notification).values(data).returning();
    return n;
  }

  async findAllForUser(userId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const rows = await db
      .select()
      .from(notification)
      .where(eq(notification.userId, userId))
      .orderBy(notification.createdAt)
      .limit(limit)
      .offset(offset);
    return { data: rows, page, limit };
  }

  async markRead(id: string, userId: string) {
    const [updated] = await db
      .update(notification)
      .set({ readAt: new Date() })
      .where(and(eq(notification.id, id), eq(notification.userId, userId)))
      .returning();
    return updated ?? null;
  }

  async markAllRead(userId: string) {
    await db
      .update(notification)
      .set({ readAt: new Date() })
      .where(and(eq(notification.userId, userId), isNull(notification.readAt)));
    return { ok: true };
  }
}
