import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import type { EmailProvider } from './email-provider.interface';
import type { EmailResult, SendEmailOptions } from '../email.types';

@Injectable()
export class ResendProvider implements EmailProvider {
  private readonly client = new Resend(process.env.RESEND_API_KEY);
  private readonly defaultFrom =
    process.env.EMAIL_FROM ?? 'Homelyn <noreply@koanprotocol.com>';
  private readonly logger = new Logger(ResendProvider.name);

  async send(options: SendEmailOptions): Promise<EmailResult> {
    const { data, error } = await this.client.emails.send({
      from: options.from ?? this.defaultFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      this.logger.error(`Failed to send email to ${options.to}: ${error.message}`);
      throw new Error(error.message);
    }

    return { id: data?.id };
  }
}
