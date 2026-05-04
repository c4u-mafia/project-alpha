import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '@thallesp/nestjs-better-auth';

import { auth } from './auth';
import { AuthGuard } from './common/guards/auth.guard';
import { RoleGuard } from './common/guards/role.guard';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule.forRoot({ auth }), UserModule],
  providers: [
    // AuthGuard runs first — validates session, attaches user to request
    { provide: APP_GUARD, useClass: AuthGuard },
    // RoleGuard runs second — checks @Roles() decorator if present
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}
