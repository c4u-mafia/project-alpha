import { Module } from '@nestjs/common';
import { ViewingsController } from './viewings.controller';
import { ViewingsService } from './viewings.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [ViewingsController],
  providers: [ViewingsService],
})
export class ViewingsModule {}
