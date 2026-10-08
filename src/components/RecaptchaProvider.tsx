'use client';

import { useEffect } from 'react';
import { loadRecaptchaV3, isRecaptchaV3Enabled } from '@/lib/recaptcha';

/**
 * Preloads the reCAPTCHA v3 script once per session so form submissions do
 * not pay the script-download cost at submit time. No-ops when the site key
 * is absent.
 */
export default function RecaptchaProvider() {
  useEffect(() => {
    if (!isRecaptchaV3Enabled()) return;
    // Defer past first paint so it never competes with LCP.
    const id = window.setTimeout(() => {
      loadRecaptchaV3().catch(() => {});
    }, 1200);
    return () => window.clearTimeout(id);
  }, []);

  return null;
}
