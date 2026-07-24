import { createHmac } from 'node:crypto';
import { UnauthorizedException } from '@nestjs/common';
import { PaystackService } from './paystack.service';

describe('PaystackService', () => {
  const previousSecret = process.env.PAYSTACK_SECRET_KEY;
  const service = new PaystackService();

  beforeEach(() => {
    process.env.PAYSTACK_SECRET_KEY = 'sk_test_homelyn';
  });

  afterAll(() => {
    if (previousSecret === undefined) {
      delete process.env.PAYSTACK_SECRET_KEY;
    } else {
      process.env.PAYSTACK_SECRET_KEY = previousSecret;
    }
  });

  it('accepts a correctly signed webhook payload', () => {
    const body = {
      event: 'charge.success',
      data: { reference: 'RENT-123', amount: 500000, currency: 'NGN' },
    };
    const signature = createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(JSON.stringify(body))
      .digest('hex');

    expect(() => service.assertValidWebhook(body, signature)).not.toThrow();
  });

  it('rejects a missing or invalid webhook signature', () => {
    const body = { event: 'charge.success', data: { reference: 'RENT-123' } };

    expect(() => service.assertValidWebhook(body)).toThrow(
      UnauthorizedException,
    );
    expect(() => service.assertValidWebhook(body, '00')).toThrow(
      UnauthorizedException,
    );
  });
});
