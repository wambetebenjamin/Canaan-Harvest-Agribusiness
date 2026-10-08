/**
 * Server-side reCAPTCHA verification.
 *
 * v3 is verified against the Google siteverify endpoint and the returned
 * score is compared with RECAPTCHA_SCORE_THRESHOLD (default 0.5). A score
 * below the threshold returns { ok: false, requiresV2: true } so the client
 * can present the v2 challenge and resubmit with a v2 token.
 *
 * When RECAPTCHA_SECRET_KEY is unset the route reports "not configured" and
 * callers allow the request through, keeping local dev and the preview
 * environment fully usable.
 */

const SCORE_THRESHOLD = Number(process.env.RECAPTCHA_SCORE_THRESHOLD ?? '0.5');
const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

export interface CaptchaResult {
  ok: boolean;
  /** True when a v3 score fell below the threshold and v2 should be shown. */
  requiresV2?: boolean;
  /** Human-readable reason when ok === false. */
  reason?: string;
  score?: number;
  configured: boolean;
}

export function isCaptchaConfigured(): boolean {
  return Boolean(process.env.RECAPTCHA_SECRET_KEY);
}

export function isCaptchaV2Configured(): boolean {
  return Boolean(process.env.RECAPTCHA_V2_SECRET_KEY);
}

export async function verifyCaptcha(
  token: string | undefined | null,
  expectedAction?: string
): Promise<CaptchaResult> {
  // Not configured → allow through (dev / preview).
  if (!isCaptchaConfigured()) {
    return { ok: true, configured: false };
  }

  if (!token) {
    return { ok: false, reason: 'Missing CAPTCHA token.', configured: true };
  }

  const body = new URLSearchParams({
    secret: process.env.RECAPTCHA_SECRET_KEY as string,
    response: token,
  });

  let data: {
    success: boolean;
    score?: number;
    action?: string;
    'error-codes'?: string[];
  };

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      cache: 'no-store',
    });
    data = await res.json();
  } catch {
    // Network failure to Google must not silently drop a real enquiry;
    // fail closed only when we can actually reach the verifier.
    return { ok: false, reason: 'CAPTCHA verification service unreachable.', configured: true };
  }

  if (!data.success) {
    return {
      ok: false,
      reason: `CAPTCHA check failed${data['error-codes']?.length ? `: ${data['error-codes'].join(', ')}` : '.'}`,
      configured: true,
    };
  }

  // Action mismatch indicates a token replayed from another form.
  if (expectedAction && data.action && data.action !== expectedAction) {
    return { ok: false, reason: 'CAPTCHA action mismatch.', configured: true };
  }

  const score = typeof data.score === 'number' ? data.score : 1;

  if (score < SCORE_THRESHOLD) {
    // v2 available → ask the client to escalate. Otherwise reject outright.
    return {
      ok: false,
      requiresV2: isCaptchaV2Configured(),
      reason: isCaptchaV2Configured()
        ? 'Please complete the quick verification below.'
        : 'Automated activity detected.',
      score,
      configured: true,
    };
  }

  return { ok: true, score, configured: true };
}

/** Verifies a v2 checkbox token (used on the fallback resubmit). */
export async function verifyCaptchaV2(token: string | undefined | null): Promise<CaptchaResult> {
  if (!isCaptchaV2Configured()) return { ok: true, configured: false };
  if (!token) return { ok: false, reason: 'Missing v2 CAPTCHA token.', configured: true };

  const body = new URLSearchParams({
    secret: process.env.RECAPTCHA_V2_SECRET_KEY as string,
    response: token,
  });

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      cache: 'no-store',
    });
    const data: { success: boolean } = await res.json();
    return data.success
      ? { ok: true, configured: true }
      : { ok: false, reason: 'Verification failed. Please try again.', configured: true };
  } catch {
    return { ok: false, reason: 'CAPTCHA verification service unreachable.', configured: true };
  }
}
