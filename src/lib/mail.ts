/**
 * Nodemailer transport with a console fallback.
 *
 * When SMTP_HOST is absent the message is logged instead of sent, so the
 * full request flow — including generated confirmation copy — is verifiable
 * in development and previews without credentials.
 */

import nodemailer, { type Transporter } from 'nodemailer';

export interface MailMessage {
  to?: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

let transporter: Transporter | null = null;

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST);
}

function getTransport(): Transporter | null {
  if (!isMailConfigured()) return null;
  if (transporter) return transporter;

  const port = Number(process.env.SMTP_PORT ?? '587');
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST as string,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
  });

  return transporter;
}

export async function sendMail(
  message: MailMessage
): Promise<{ sent: boolean; skipped?: boolean; error?: string }> {
  const to = message.to ?? process.env.MAIL_TO ?? 'orders@canaanharvest.co.ke';
  const from = process.env.MAIL_FROM ?? 'Canaan Harvest <orders@canaanharvest.co.ke>';

  const transport = getTransport();

  if (!transport) {
    // Dev fallback — the message body is printed so copy can be reviewed.
    console.info(
      [
        '\n──────── EMAIL (SMTP not configured — logged instead) ────────',
        `From:    ${from}`,
        `To:      ${to}`,
        `Subject: ${message.subject}`,
        '',
        message.text,
        '──────────────────────────────────────────────────────────────\n',
      ].join('\n')
    );
    return { sent: false, skipped: true };
  }

  try {
    await transport.sendMail({
      from,
      to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      replyTo: message.replyTo,
    });
    return { sent: true };
  } catch (error) {
    console.error('[mail] send failed:', error);
    return { sent: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
