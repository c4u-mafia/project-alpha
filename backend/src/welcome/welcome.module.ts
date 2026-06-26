import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { EmailModule } from '../email/email.module';
import { QUEUE } from '../queue/queue.constants';
import { WelcomeListener } from './welcome.listener';
import { WelcomeProcessor } from './welcome.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: QUEUE.WELCOME }),
    EmailModule,
  ],
  providers: [WelcomeProcessor, WelcomeListener],
})
export class WelcomeModule {}
