import { Theme } from "next-auth"

export function customEmailTemplate(params: {
  url: string
  host: string
  theme: Theme
}) {
  const { url, host, theme } = params

  const buttonColor = "#000000" // Black button
  const buttonText = "#ffffff"

  const escapedHost = host.replace(/\./g, "&#8203;.")

  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>Verify your email address</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    * {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    @media only screen and (max-width: 600px) {
      .button {
        width: 100% !important;
        text-align: center !important;
      }
    }
    @media only screen and (max-width: 600px) {
      .button-td {
        width: 100% !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; background-color: #f3f4f6;">
  <div style="display: none; line-height: 0; font-size: 0;">Verify your email address to sign in to Cantor Library</div>
  <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0; padding: 0; width: 100%; background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 24px;">
        <table class="content" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin: 0 auto; padding: 0;">
          <tr>
            <td style="padding: 24px; background-color: #ffffff; border-radius: 4px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #111827;">Verify your email address</h1>
              <p style="margin: 24px 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                Click the button below to verify your email address and sign in to Cantor Library.
              </p>
              <table cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto;">
                <tr>
                  <td class="button-td" style="border-radius: 4px; background: ${buttonColor};">
                    <a class="button" href="${url}" target="_blank" style="display: block; padding: 12px 24px; font-size: 16px; font-weight: 600; line-height: 100%; color: ${buttonText}; text-decoration: none;">
                      Verify email address
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0 0; font-size: 16px; line-height: 24px; color: #4b5563;">
                If you didn't request this email, you can safely ignore it.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px;">
              <p style="margin: 0; font-size: 14px; line-height: 20px; color: #6b7280; text-align: center;">
                &copy; ${new Date().getFullYear()} Cantor Library. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

