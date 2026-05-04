export function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Homelyn</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF7F2;font-family:'Inter',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF7F2;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#0E7C7B;border-radius:16px 16px 0 0;padding:32px 40px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:10px;vertical-align:middle;">
                    <!-- House icon approximation -->
                    <div style="width:36px;height:36px;background-color:rgba(255,255,255,0.15);border-radius:8px;display:inline-block;text-align:center;line-height:36px;font-size:20px;">⌂</div>
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="color:#FFFFFF;font-size:22px;font-weight:700;letter-spacing:-0.5px;">homelyn</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#FFFFFF;padding:40px;border-radius:0 0 16px 16px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 40px 0;">
              <p style="margin:0;color:#9498A0;font-size:13px;line-height:1.6;">
                Rent direct. Live easy. &nbsp;·&nbsp; <a href="https://homelyn.com" style="color:#0E7C7B;text-decoration:none;">homelyn.com</a>
              </p>
              <p style="margin:8px 0 0;color:#9498A0;font-size:12px;">
                You're receiving this because you signed up for Homelyn.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
