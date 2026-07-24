import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, desc, eq, isNull, ne, or, sql } from 'drizzle-orm';
import { db } from '../db';
import { conversation, message, property, user } from '../db/schema';
import { NotificationsService } from '../notifications/notifications.service';
import type {
  CreateConversationDto,
  MessageListQueryDto,
  SendMessageDto,
} from './dto/messages.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly notifications: NotificationsService) {}

  private async requireParticipant(conversationId: string, userId: string) {
    const [found] = await db
      .select()
      .from(conversation)
      .where(eq(conversation.id, conversationId))
      .limit(1);
    if (!found) throw new NotFoundException('Conversation not found.');
    if (found.tenantId !== userId && found.landlordId !== userId) {
      throw new ForbiddenException(
        'You are not a participant in this conversation.',
      );
    }
    return found;
  }

  async createConversation(tenantId: string, dto: CreateConversationDto) {
    const [listing] = await db
      .select({ id: property.id, landlordId: property.landlordId })
      .from(property)
      .where(
        and(eq(property.id, dto.propertyId), eq(property.status, 'listed')),
      )
      .limit(1);
    if (!listing) throw new NotFoundException('Listed property not found.');
    if (listing.landlordId === tenantId) {
      throw new BadRequestException(
        'You cannot message yourself about your own property.',
      );
    }

    const [created] = await db
      .insert(conversation)
      .values({
        propertyId: listing.id,
        tenantId,
        landlordId: listing.landlordId,
      })
      .onConflictDoNothing()
      .returning();
    if (created) return created;

    const [existing] = await db
      .select()
      .from(conversation)
      .where(
        and(
          eq(conversation.tenantId, tenantId),
          eq(conversation.propertyId, listing.id),
        ),
      )
      .limit(1);
    return existing;
  }

  async getConversations(userId: string) {
    const rows = await db
      .select()
      .from(conversation)
      .where(
        or(
          eq(conversation.tenantId, userId),
          eq(conversation.landlordId, userId),
        ),
      )
      .orderBy(desc(conversation.lastMessageAt), desc(conversation.createdAt));

    return Promise.all(
      rows.map(async (item) => {
        const otherId =
          item.tenantId === userId ? item.landlordId : item.tenantId;
        const [[listing], [otherParticipant], [lastMessage], [unread]] =
          await Promise.all([
            db
              .select({
                id: property.id,
                title: property.title,
                area: property.area,
                city: property.city,
              })
              .from(property)
              .where(eq(property.id, item.propertyId))
              .limit(1),
            db
              .select({ id: user.id, name: user.name, image: user.image })
              .from(user)
              .where(eq(user.id, otherId))
              .limit(1),
            db
              .select()
              .from(message)
              .where(eq(message.conversationId, item.id))
              .orderBy(desc(message.createdAt))
              .limit(1),
            db
              .select({ count: sql<number>`count(*)::int` })
              .from(message)
              .where(
                and(
                  eq(message.conversationId, item.id),
                  ne(message.senderId, userId),
                  isNull(message.readAt),
                ),
              ),
          ]);

        return {
          ...item,
          property: listing ?? null,
          otherParticipant: otherParticipant ?? null,
          lastMessage: lastMessage ?? null,
          unreadCount: unread?.count ?? 0,
        };
      }),
    );
  }

  async getMessages(
    conversationId: string,
    userId: string,
    query: MessageListQueryDto,
  ) {
    await this.requireParticipant(conversationId, userId);
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const data = await db
      .select()
      .from(message)
      .where(eq(message.conversationId, conversationId))
      .orderBy(desc(message.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);
    return { data, page, limit };
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    dto: SendMessageDto,
  ) {
    const found = await this.requireParticipant(conversationId, senderId);
    if (found.status !== 'active') {
      throw new BadRequestException('This conversation is archived.');
    }

    const content = dto.content.trim();
    if (!content) throw new BadRequestException('Message cannot be empty.');

    const [created] = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(message)
        .values({ conversationId, senderId, content })
        .returning();
      await tx
        .update(conversation)
        .set({ lastMessageAt: new Date(), updatedAt: new Date() })
        .where(eq(conversation.id, conversationId));
      return inserted;
    });

    const recipientId =
      senderId === found.tenantId ? found.landlordId : found.tenantId;
    await this.notifications.create({
      userId: recipientId,
      type: 'message_received',
      title: 'New Message',
      body: content.length > 120 ? `${content.slice(0, 117)}...` : content,
      data: { conversationId, propertyId: found.propertyId },
    });

    return created;
  }

  async markRead(conversationId: string, userId: string) {
    await this.requireParticipant(conversationId, userId);
    const updated = await db
      .update(message)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(message.conversationId, conversationId),
          ne(message.senderId, userId),
          isNull(message.readAt),
        ),
      )
      .returning({ id: message.id });
    return { updated: updated.length };
  }
}
