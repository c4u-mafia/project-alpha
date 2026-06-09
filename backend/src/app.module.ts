import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { AppController } from './app.controller';

import { auth } from './auth';
import { AuthGuard } from './common/guards/auth.guard';
import { RoleGuard } from './common/guards/role.guard';
import { EmailModule } from './email/email.module';
import { UserModule } from './user/user.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { AdminModule } from './admin/admin.module';
import { PropertyModule } from './property/property.module';
import { ListingsModule } from './listings/listings.module';
import { ViewingsModule } from './viewings/viewings.module';
import { ApplicationsModule } from './applications/applications.module';
import { PaymentsModule } from './payments/payments.module';
import { TenancyModule } from './tenancy/tenancy.module';
import { SponsorshipModule } from './sponsorship/sponsorship.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  controllers: [AppController],
  imports: [
    AuthModule.forRoot({ auth, disableGlobalAuthGuard: true }),
    EmailModule,
    UserModule,
    OnboardingModule,
    AdminModule,
    PropertyModule,
    ListingsModule,
    ViewingsModule,
    ApplicationsModule,
    PaymentsModule,
    TenancyModule,
    SponsorshipModule,
    NotificationsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}
