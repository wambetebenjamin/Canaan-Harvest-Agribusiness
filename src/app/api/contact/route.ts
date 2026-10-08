import { NextResponse } from 'next/server';
import { saveRecord } from '@/lib/store';
import { sendMail } from '@/lib/mail';
import { isCaptchaConfigured, verifyCaptcha, verifyCaptchaV2 } from '@/lib/captcha-server';
import { V2_CODE } from '@/lib/codes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** POST /api/contact — enquiry form, delivered by Nodemailer. */
export async function POST(request: Request) {
  let body: {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    produce?: string;
    message?: string;
    captchaToken?: string;
    captchaVersion?: 'v2' | 'v3';
    captchaAction?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (isCaptchaConfigured()) {
    const captcha =
      body.captchaVersion === 'v2'
        ? await verifyCaptchaV2(body.captchaToken)
        : await verifyCaptcha(body.captchaToken, body.captchaAction ?? 'contact');

    if (!captcha.ok) {
      return NextResponse.json(
        { error: captcha.reason, code: captcha.requiresV2 ? V2_CODE : undefined },
        { status: 400 }
      );
    }
  }

  if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) {
    return NextResponse.json(
      { error: 'Name, email and message are required.' },
      { status: 422 }
    );
  }

  const record = await saveRecord('enquiries', {
    type: 'contact',
    name: body.name.trim(),
    email: body.email.trim(),
    phone: body.phone?.trim() ?? '',
    subject: body.subject?.trim() ?? 'Website enquiry',
    produce: body.produce?.trim() ?? '',
    message: body.message.trim(),
  });

  const mail = await sendMail({
    replyTo: body.email.trim(),
    subject: `[Website enquiry] ${body.subject?.trim() || 'General'} — ${body.name.trim()}`,
    text: [
      `From:    ${body.name} <${body.email}>`,
      body.phone ? `Phone:   ${body.phone}` : '',
      body.produce ? `Produce: ${body.produce}` : '',
      '',
      body.message,
      '',
      `Reference: ${record.id}`,
    ]
      .filter(Boolean)
      .join('\n'),
  });

  return NextResponse.json({
    ok: true,
    id: record.id,
    message: 'Thank you — your enquiry is with our team. We reply within one working day.',
    emailSent: mail.sent,
  });
}
