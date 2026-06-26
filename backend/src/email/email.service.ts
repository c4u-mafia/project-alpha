import { Inject, Injectable } from '@nestjs/common';
import type { AppRole } from '../db/schema';
import {
  EMAIL_PROVIDER,
  type EmailProvider,
} from './providers/email-provider.interface';
import { monthlyGreetingTemplate } from './templates/monthly-greeting.template';
import { otpTemplate, type OtpEmailType } from './templates/otp.template';
import { welcomeTemplate } from './templates/welcome.template';

@Injectable()
export class EmailService {
  constructor(
    @Inject(EMAIL_PROVIDER) private readonly provider: EmailProvider,
  ) {}

  async sendOTP(to: string, otp: string, type: OtpEmailType): Promise<void> {
    const { subject, html } = otpTemplate(otp, type);
    await this.provider.send({ to, subject, html });
  }

  async sendWelcome(
    to: string,
    options?: { name?: string | null; role?: AppRole | null },
  ) {
    const { subject, html } = welcomeTemplate(options);
    await this.provider.send({ to, subject, html });
  }

  async sendMonthlyGreeting(
    to: string,
    options: { name?: string | null; month: string; year: number },
  ) {
    const { subject, html } = monthlyGreetingTemplate(options);
    await this.provider.send({ to, subject, html });
  }
}
