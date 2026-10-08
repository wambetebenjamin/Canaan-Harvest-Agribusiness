/**
 * reCAPTCHA v3 client loader with a v2 fallback path.
 *
 * Behaviour when NEXT_PUBLIC_RECAPTCHA_SITE_KEY is absent: the module
 * resolves `null` and forms submit without a token. The matching server
 * route treats a missing secret key as "captcha not configured" and skips
 * verification, so local development and previews stay fully clickable.
 * See docs/DECISIONS.md.
 */

export const RECAPTCHA_V3_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';
export const RECAPTCHA_V2_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY ?? '';

/** Server signals this when a v3 score falls under the threshold. */
export { V2_CODE as V2_REQUIRED_CODE } from './codes';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
      render: (
        container: HTMLElement | string,
        params: { sitekey: string; callback: (token: string) => void; theme?: 'light' | 'dark' }
      ) => number;
      reset: (id?: number) => void;
    };
  }
}

export function isRecaptchaV3Enabled(): boolean {
  return RECAPTCHA_V3_SITE_KEY.length > 0;
}

export function isRecaptchaV2Enabled(): boolean {
  return RECAPTCHA_V2_SITE_KEY.length > 0;
}

let v3Promise: Promise<void> | null = null;

export function loadRecaptchaV3(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (!isRecaptchaV3Enabled()) return Promise.resolve();
  if (v3Promise) return v3Promise;

  v3Promise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-recaptcha="v3"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('reCAPTCHA v3 failed to load')));
      if (window.grecaptcha) resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_V3_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.dataset.recaptcha = 'v3';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('reCAPTCHA v3 failed to load'));
    document.head.appendChild(script);
  });

  return v3Promise;
}

let v2Promise: Promise<void> | null = null;

export function loadRecaptchaV2(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (!isRecaptchaV2Enabled()) return Promise.resolve();
  if (v2Promise) return v2Promise;

  v2Promise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-recaptcha="v2"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('reCAPTCHA v2 failed to load')));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.dataset.recaptcha = 'v2';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('reCAPTCHA v2 failed to load'));
    document.head.appendChild(script);
  });

  return v2Promise;
}

/**
 * Executes v3 for a named action and returns a token, or null when
 * reCAPTCHA is not configured. Never throws — a failure to obtain a token
 * must not block a legitimate enquiry.
 */
export async function executeRecaptcha(action: string): Promise<string | null> {
  if (!isRecaptchaV3Enabled()) return null;
  try {
    await loadRecaptchaV3();
    const grecaptcha = window.grecaptcha;
    if (!grecaptcha) return null;
    return await new Promise<string>((resolve, reject) => {
      grecaptcha.ready(() => {
        grecaptcha.execute(RECAPTCHA_V3_SITE_KEY, { action }).then(resolve).catch(reject);
      });
    });
  } catch {
    return null;
  }
}
