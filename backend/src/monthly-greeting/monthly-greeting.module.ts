import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { EmailModule } from '../email/email.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { QUEUE } from '../queue/queue.constants';
import { MonthlyGreetingProcessor } from './monthly-greeting.processor';
import { MonthlyGreetingScheduler } from './monthly-greeting.scheduler';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUE.MONTHLY_GREETING }),
    EmailModule,
    NotificationsModule,
  ],
  providers: [MonthlyGreetingProcessor, MonthlyGreetingScheduler],
})
export class MonthlyGreetingModule {}
