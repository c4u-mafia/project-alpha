import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';

import { buildRedisConnection } from './redis.connection';

/**
 * Global root config for BullMQ. Sets the shared Redis connection and sensible
 * default job options so individual queues don't repeat them.
 *
 * Marked @Global so any feature module can `BullModule.registerQueue(...)` and
 * inject queues without re-importing this.
 */
@Global()
@Module({
  imports: [
    BullModule.forRoot({
      connection: buildRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5_000 },
        // Keep history bounded so Redis memory stays flat.
        removeOnComplete: { age: 24 * 3600, count: 1_000 },
        removeOnFail: { age: 7 * 24 * 3600 },
      },
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
