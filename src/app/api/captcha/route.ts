import { NextResponse } from 'next/server';
import { isCaptchaConfigured, verifyCaptcha, verifyCaptchaV2 } from '@/lib/captcha-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/captcha
 * Standalone reCAPTCHA verification endpoint. Other routes call the shared
 * helpers in lib/captcha-server directly; this exists so the verification
 * can also be exercised independently (and so the brief's route list is
 * complete).
 */
export async function POST(request: Request) {
  let body: { token?: string; action?: string; version?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!isCaptchaConfigured()) {
    return NextResponse.json({
      ok: true,
      configured: false,
      message: 'reCAPTCHA is not configured in this environment.',
    });
  }

  const result =
    body.version === 'v2'
      ? await verifyCaptchaV2(body.token)
      : await verifyCaptcha(body.token, body.action);

  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}

export async function GET() {
  return NextResponse.json({
    configured: isCaptchaConfigured(),
    threshold: Number(process.env.RECAPTCHA_SCORE_THRESHOLD ?? '0.5'),
    v2FallbackAvailable: Boolean(process.env.RECAPTCHA_V2_SECRET_KEY),
  });
}
