import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { ResendProvider } from './providers/resend.provider';
import { EMAIL_PROVIDER } from './providers/email-provider.interface';

@Module({
  controllers: [EmailController],
  providers: [
    { provide: EMAIL_PROVIDER, useClass: ResendProvider },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
