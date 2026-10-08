'use client';

import { executeRecaptcha, V2_REQUIRED_CODE } from './recaptcha';

export interface SubmitOutcome {
  ok: boolean;
  message: string;
  /** Server asked for the v2 challenge — render RecaptchaV2Fallback. */
  requiresV2?: boolean;
  /** Extra server payload (e.g. M-Pesa simulated notice, WhatsApp deep link). */
  data?: Record<string, unknown>;
}

/**
 * Posts a form payload to an API route, attaching a reCAPTCHA v3 token for
 * the named action. When the server reports that the v3 score fell below the
 * threshold it returns requiresV2 so the caller can surface the v2 widget and
 * resubmit with that token instead.
 */
export async function submitWithCaptcha(
  url: string,
  payload: Record<string, unknown>,
  action: string,
  options?: { captchaVersion?: 'v2' | 'v3'; token?: string | null }
): Promise<SubmitOutcome> {
  let captchaToken = options?.token ?? null;
  const captionVersion = options?.captchaVersion ?? 'v3';

  if (!captchaToken && captionVersion === 'v3') {
    captchaToken = await executeRecaptcha(action);
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        captchaToken,
        captchaVersion: captionVersion,
        captchaAction: action,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;

    if (!res.ok) {
      if (data.code === V2_REQUIRED_CODE) {
        return {
          ok: false,
          requiresV2: true,
          message:
            (data.error as string) ?? 'Please complete the quick verification below.',
        };
      }
      return {
        ok: false,
        message: (data.error as string) ?? 'Something went wrong. Please try again.',
      };
    }

    return {
      ok: true,
      message: (data.message as string) ?? 'Thank you — we have received your request.',
      data,
    };
  } catch {
    return { ok: false, message: 'Network error. Please check your connection and try again.' };
  }
}
