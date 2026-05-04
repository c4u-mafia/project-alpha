import type { AppRole } from '../../db/schema';
import { baseTemplate } from './base.template';

type WelcomeTemplateOptions = {
  name?: string | null;
  role?: AppRole | null;
};

const roleCopy: Record<
  Exclude<AppRole, 'admin'>,
  { heading: string; body: string; action: string }
> = {
  tenant: {
    heading: 'Welcome to Homelyn',
    body: 'Your account is ready. You can now explore homes, save promising places, and move through renting with clearer steps.',
    action:
      'Start by completing your profile so landlords can understand your rental needs faster.',
  },
  landlord: {
    heading: 'Welcome to Homelyn',
    body: 'Your account is ready. You can now prepare your landlord profile, verify your details, and list homes for serious renters.',
    action:
      'Start by completing your profile so tenants can trust your listings from the first look.',
  },
};

export function welcomeTemplate(options: WelcomeTemplateOptions = {}): {
  subject: string;
  html: string;
} {
  const firstName = options.name?.trim().split(/\s+/)[0];
  const copy =
    options.role === 'tenant' || options.role === 'landlord'
      ? roleCopy[options.role]
      : {
          heading: 'Welcome to Homelyn',
          body: 'Your account is ready. You can now set up your profile and move through renting with clearer steps.',
          action:
            'Start by completing your profile so Homelyn can shape the experience around you.',
        };

  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,';

  const html = baseTemplate(`
    <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#1A2332;line-height:1.3;">
      ${copy.heading}
    </h1>

    <p style="margin:0 0 20px;font-size:16px;color:#5A5F6A;line-height:1.6;">
      ${greeting}
    </p>

    <p style="margin:0 0 28px;font-size:16px;color:#5A5F6A;line-height:1.6;">
      ${copy.body}
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="background-color:#D4EDE6;border-radius:10px;padding:16px 20px;">
          <p style="margin:0;font-size:14px;color:#0E7C7B;font-weight:500;line-height:1.6;">
            ${copy.action}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:14px;color:#9498A0;line-height:1.6;border-top:1px solid #EEEFF1;padding-top:24px;">
      We are glad to have you here.
    </p>
  `);

  return { subject: 'Welcome to Homelyn', html };
}
