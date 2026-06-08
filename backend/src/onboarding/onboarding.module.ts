import { Module } from '@nestjs/common';
import { TenantOnboardingController } from './tenant-onboarding.controller';
import { TenantOnboardingService } from './tenant-onboarding.service';
import { LandlordOnboardingController } from './landlord-onboarding.controller';
import { LandlordOnboardingService } from './landlord-onboarding.service';

@Module({
  controllers: [TenantOnboardingController, LandlordOnboardingController],
  providers: [TenantOnboardingService, LandlordOnboardingService],
})
export class OnboardingModule {}
