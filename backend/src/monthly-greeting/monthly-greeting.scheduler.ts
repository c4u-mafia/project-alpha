import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { MONTHLY_JOB, QUEUE } from '../queue/queue.constants';

/**
 * Registers the recurring monthly-greeting dispatch.
 *
 * Fires 09:00 on the 1st of every month, in Africa/Lagos (WAT) so it lands at
 * 9am local for Nigerian users rather than 9am UTC. Registering the same
 * repeatable job on every boot is idempotent — BullMQ keys it by name + cron.
 */
@Injectable()
export class MonthlyGreetingScheduler implements OnModuleInit {
  private readonly logger = new Logger(MonthlyGreetingScheduler.name);

  constructor(
    @InjectQueue(QUEUE.MONTHLY_GREETING) private readonly queue: Queue,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.queue.add(
      MONTHLY_JOB.DISPATCH,
      {},
      {
        repeat: {
          pattern: '0 9 1 * *',
          tz: 'Africa/Lagos',
        },
        // Stable key so re-registering doesn't pile up duplicate schedules.
        jobId: 'monthly-greeting-dispatch',
      },
    );
    this.logger.log(
      'Monthly greeting scheduled for 09:00 WAT on the 1st of each month',
    );
  }
}
