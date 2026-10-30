import { env } from '../../config/env.js';
import { transporter } from '../../lib/mailer.js';

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions): Promise<void> {
  await transporter.sendMail({
    from: `"${env.APP_NAME}" <${env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}
