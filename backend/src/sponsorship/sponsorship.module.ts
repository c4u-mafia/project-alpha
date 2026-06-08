import { Module } from '@nestjs/common';
import { SponsorshipController } from './sponsorship.controller';
import { SponsorshipService } from './sponsorship.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [SponsorshipController],
  providers: [SponsorshipService],
})
export class SponsorshipModule {}
