import { baseTemplate } from './base.template';

export type OtpEmailType =
  | 'email-verification'
  | 'sign-in'
  | 'forget-password'
  | 'change-email';

const copy: Record<
  OtpEmailType,
  { subject: string; heading: string; body: string; action: string }
> = {
  'email-verification': {
    subject: 'Verify your Homelyn account',
    heading: "Let's get you verified",
    body: "You're almost in. Enter this code to verify your email address and activate your Homelyn account.",
    action: 'Once verified, you can start finding your next home.',
  },
  'sign-in': {
    subject: 'Your Homelyn sign-in code',
    heading: 'Here to let you in',
    body: "Use this code to complete your sign-in. If you didn't request this, someone else may be trying to access your account — ignore this email and your account stays safe.",
    action: 'This code signs you into your Homelyn account.',
  },
  'forget-password': {
    subject: 'Reset your Homelyn password',
    heading: 'Reset your password',
    body: 'No stress — it happens. Use this code to reset your password and get back into your account.',
    action:
      "If you didn't request a password reset, you can safely ignore this.",
  },
  'change-email': {
    subject: 'Confirm your new email — Homelyn',
    heading: 'Confirm your new email',
    body: 'We got a request to update your email address. Enter this code to confirm the change.',
    action: "If you didn't request this change, contact us immediately.",
  },
};

export function otpTemplate(
  otp: string,
  type: OtpEmailType,
): { subject: string; html: string } {
  const { subject, heading, body, action } = copy[type];

  const digits = otp
    .split('')
    .map(
      (d) => `
    <td style="padding:0 4px;">
      <div style="
        width:44px;
        height:56px;
        background-color:#FAF7F2;
        border:2px solid #D4EDE6;
        border-radius:12px;
        text-align:center;
        line-height:56px;
        font-size:28px;
        font-weight:700;
        color:#1A2332;
      ">${d}</div>
    </td>
  `,
    )
    .join('');

  const html = baseTemplate(`
    <!-- Heading -->
    <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#1A2332;line-height:1.3;">
      ${heading}
    </h1>

    <!-- Body copy -->
    <p style="margin:0 0 32px;font-size:16px;color:#5A5F6A;line-height:1.6;">
      ${body}
    </p>

    <!-- OTP digits -->
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
      <tr>${digits}</tr>
    </table>

    <!-- Expiry notice -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      <tr>
        <td style="background-color:#D4EDE6;border-radius:10px;padding:14px 20px;">
          <p style="margin:0;font-size:14px;color:#0E7C7B;font-weight:500;">
            ⏱ This code expires in <strong>10 minutes</strong>. Do not share it with anyone.
          </p>
        </td>
      </tr>
    </table>

    <!-- Action note -->
    <p style="margin:0;font-size:14px;color:#9498A0;line-height:1.6;border-top:1px solid #EEEFF1;padding-top:24px;">
      ${action}
    </p>
  `);

  return { subject, html };
}
