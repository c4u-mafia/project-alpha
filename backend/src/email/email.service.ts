import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_PROVIDER, type EmailProvider } from './providers/email-provider.interface';

@Injectable()
export class EmailService {
  constructor(@Inject(EMAIL_PROVIDER) private readonly provider: EmailProvider) {}

  async sendOTP(to: string, otp: string, type: 'verify' | 'reset' | 'sign-in'): Promise<void> {
    const subjects: Record<typeof type, string> = {
      verify: 'Verify your Homelyn account',
      reset: 'Reset your Homelyn password',
      'sign-in': 'Your Homelyn sign-in code',
    };

    await this.provider.send({
      to,
      subject: subjects[type],
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <h2 style="color:#1a1a1a">Your one-time code</h2>
          <p style="font-size:32px;font-weight:700;letter-spacing:8px;color:#1a1a1a">${otp}</p>
          <p style="color:#666;font-size:14px">This code expires in 10 minutes. Do not share it with anyone.</p>
        </div>
      `,
    });
  }
}
