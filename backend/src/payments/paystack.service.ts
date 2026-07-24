import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';

type PaystackEnvelope<T> = {
  status: boolean;
  message: string;
  data: T;
};

export type PaystackCheckout = {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
};

@Injectable()
export class PaystackService {
  private readonly baseUrl = 'https://api.paystack.co';

  private get secretKey(): string {
    const key = process.env.PAYSTACK_SECRET_KEY;
    if (!key) {
      throw new ServiceUnavailableException('Paystack is not configured.');
    }
    return key;
  }

  async initializeTransaction(input: {
    email: string;
    amount: number;
    reference: string;
    metadata?: Record<string, unknown>;
  }): Promise<PaystackCheckout> {
    const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: input.email,
        amount: String(input.amount),
        reference: input.reference,
        currency: 'NGN',
        metadata: input.metadata,
        ...(process.env.PAYSTACK_CALLBACK_URL
          ? { callback_url: process.env.PAYSTACK_CALLBACK_URL }
          : {}),
      }),
    });

    const body = (await response.json().catch(() => null)) as PaystackEnvelope<{
      authorization_url: string;
      access_code: string;
      reference: string;
    }> | null;

    if (!response.ok || !body?.status || !body.data) {
      throw new BadGatewayException(
        body?.message ?? 'Paystack initialization failed.',
      );
    }

    return {
      authorizationUrl: body.data.authorization_url,
      accessCode: body.data.access_code,
      reference: body.data.reference,
    };
  }

  assertValidWebhook(body: Record<string, unknown>, signature?: string): void {
    if (!signature) {
      throw new UnauthorizedException('Missing Paystack signature.');
    }

    const expected = createHmac('sha512', this.secretKey)
      .update(JSON.stringify(body))
      .digest('hex');
    const actualBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expected, 'hex');

    if (
      actualBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(actualBuffer, expectedBuffer)
    ) {
      throw new UnauthorizedException('Invalid Paystack signature.');
    }
  }
}
