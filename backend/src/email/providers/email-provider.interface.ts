import type { EmailResult, SendEmailOptions } from '../email.types';

export const EMAIL_PROVIDER = Symbol('EMAIL_PROVIDER');

export interface EmailProvider {
  send(options: SendEmailOptions): Promise<EmailResult>;
}
