import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { Queue } from 'bullmq';

import {
  AppEvent,
  eventBus,
  type UserCreatedPayload,
} from '../events/event-bus';
import { QUEUE } from '../queue/queue.constants';
import type { WelcomeJobData } from './welcome.processor';

/**
 * Bridges the non-DI auth hook (which emits `user.created` on the shared event
 * bus) into the welcome queue. Enqueues one job per new user.
 */
@Injectable()
export class WelcomeListener implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WelcomeListener.name);

  constructor(
    @InjectQueue(QUEUE.WELCOME) private readonly queue: Queue<WelcomeJobData>,
  ) {}

  private readonly handler = (payload: UserCreatedPayload): void => {
    void this.enqueue(payload);
  };

  onModuleInit(): void {
    eventBus.on(AppEvent.UserCreated, this.handler);
  }

  onModuleDestroy(): void {
    eventBus.off(AppEvent.UserCreated, this.handler);
  }

  private async enqueue(payload: UserCreatedPayload): Promise<void> {
    try {
      await this.queue.add(
        'send',
        { userId: payload.userId },
        // jobId = userId dedupes concurrent signups/retries of the same user.
        { jobId: `welcome:${payload.userId}` },
      );
    } catch (error) {
      this.logger.error(
        `Failed to enqueue welcome job for ${payload.userId}`,
        error as Error,
      );
    }
  }
}
