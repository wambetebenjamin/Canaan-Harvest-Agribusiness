import { NextResponse } from 'next/server';
import { listRecords, saveRecord } from '@/lib/store';
import { sendMail } from '@/lib/mail';
import { isCaptchaConfigured, verifyCaptcha, verifyCaptchaV2 } from '@/lib/captcha-server';
import { V2_CODE } from '@/lib/codes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** POST /api/newsletter — Vercel KV storage, reCAPTCHA verified. */
export async function POST(request: Request) {
  let body: {
    email?: string;
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
        : await verifyCaptcha(body.captchaToken, body.captchaAction ?? 'newsletter');

    if (!captcha.ok) {
      return NextResponse.json(
        { error: captcha.reason, code: captcha.requiresV2 ? V2_CODE : undefined },
        { status: 400 }
      );
    }
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 422 });
  }

  /* Idempotent: re-subscribing the same address is a no-op, not an error. */
  const existing = await listRecords('newsletter', 500);
  if (existing.some((r) => String(r.email).toLowerCase() === email)) {
    return NextResponse.json({
      ok: true,
      message: 'You are already on the list — nothing more to do.',
    });
  }

  await saveRecord('newsletter', { email, source: 'website' });

  await sendMail({
    to: email,
    subject: 'Welcome to the Canaan Harvest newsletter',
    text: [
      'Thank you for subscribing.',
      '',
      'Each week we send what is actually in season, what has just been harvested, and any changes to Nairobi delivery windows. No filler.',
      '',
      'Canaan Harvest Agribusiness',
      'WhatsApp: 0112 272 061',
    ].join('\n'),
  });

  return NextResponse.json({
    ok: true,
    message: 'You are on the list. Look out for our seasonal produce guide.',
  });
}
