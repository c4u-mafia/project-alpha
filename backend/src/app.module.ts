import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '@thallesp/nestjs-better-auth';

import { auth } from './auth';
import { AuthGuard } from './common/guards/auth.guard';
import { RoleGuard } from './common/guards/role.guard';
import { EmailModule } from './email/email.module';
import { UserModule } from './user/user.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { AdminModule } from './admin/admin.module';
import { PropertyModule } from './property/property.module';

@Module({
  imports: [
    AuthModule.forRoot({ auth, disableGlobalAuthGuard: true }),
    EmailModule,
    UserModule,
    OnboardingModule,
    AdminModule,
    PropertyModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}
