import { baseTemplate } from './base.template';

type MonthlyGreetingOptions = {
  name?: string | null;
  /** Full month name, e.g. "July". */
  month: string;
  /** Four-digit year, e.g. 2026. */
  year: number;
};

export function monthlyGreetingTemplate(options: MonthlyGreetingOptions): {
  subject: string;
  html: string;
} {
  const firstName = options.name?.trim().split(/\s+/)[0];
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,';
  const { month, year } = options;

  const html = baseTemplate(`
    <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#1A2332;line-height:1.3;">
      Happy new month — welcome to ${month}
    </h1>

    <p style="margin:0 0 20px;font-size:16px;color:#5A5F6A;line-height:1.6;">
      ${greeting}
    </p>

    <p style="margin:0 0 28px;font-size:16px;color:#5A5F6A;line-height:1.6;">
      A fresh month, a fresh start. Thank you for being part of Homelyn as we
      make renting in Nigeria simpler, faster, and fairer — no agents, no
      inflated fees, just homes and the people who live in them.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="background-color:#D4EDE6;border-radius:10px;padding:16px 20px;">
          <p style="margin:0;font-size:14px;color:#0E7C7B;font-weight:500;line-height:1.6;">
            Open Homelyn to pick up where you left off — new listings, viewings,
            and rent updates are waiting for you this ${month}.
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:14px;color:#9498A0;line-height:1.6;border-top:1px solid #EEEFF1;padding-top:24px;">
      Here's to a great ${month} ${year}.
    </p>
  `);

  return { subject: `Welcome to ${month} 🎉`, html };
}
