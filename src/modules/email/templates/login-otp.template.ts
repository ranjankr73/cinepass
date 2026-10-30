interface LoginOtpTemplateOptions {
  appName: string;
  otp: string;
  expiresInMinutes: number;
}

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return value.replace(/[&<>"']/g, (char) => entities[char] ?? char);
}

export function createLoginOtpTemplate({
  appName,
  otp,
  expiresInMinutes,
}: LoginOtpTemplateOptions) {
  const safeAppName = escapeHtml(appName);

  return {
    subject: `${otp} is your ${appName} login code`,

    text: `
            Your ${appName} login verification code is ${otp}.

            This code expires in ${expiresInMinutes} minutes.

            If you didn't attempt to log in, you can safely ignore this email.
            Do not share this code with anyone.
          `.trim(),

    html: `
          <!DOCTYPE html>
          <html>
            <body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:32px 0;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;">

                      <!-- Header -->
                      <tr>
                        <td style="background:#e11d48;padding:28px 32px;">
                          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">
                            ${safeAppName}
                          </h1>
                        </td>
                      </tr>

                      <!-- Body -->
                      <tr>
                        <td style="padding:32px;">
                          <h2 style="margin:0 0 12px;color:#111827;font-size:20px;">
                            Your login verification code
                          </h2>

                          <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.6;">
                            Use the following one-time password to securely log in to your account.
                          </p>

                          <!-- OTP -->
                          <div style="text-align:center;margin:0 0 24px;">
                            <div style="display:inline-block;padding:16px 32px;background:#fef2f2;border:2px dashed #e11d48;border-radius:10px;">
                              <span style="font-family:'Courier New',Courier,monospace;font-size:34px;font-weight:700;letter-spacing:8px;color:#e11d48;">
                                ${otp}
                              </span>
                            </div>
                          </div>

                          <p style="margin:0 0 8px;color:#4b5563;font-size:14px;line-height:1.6;">
                            This code expires in <strong>${expiresInMinutes} minutes</strong>.
                          </p>

                          <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;">
                            If you didn't attempt to log in, you can safely ignore this email.
                          </p>
                        </td>
                      </tr>

                      <!-- Divider -->
                      <tr>
                        <td style="padding:0 32px;">
                          <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" />
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="padding:20px 32px;color:#9ca3af;font-size:12px;line-height:1.5;">
                          Never share this code with anyone. ${safeAppName} staff will never ask for it.
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>
          `.trim(),
  };
}
