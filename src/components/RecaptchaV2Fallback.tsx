'use client';

import { useEffect, useRef, useState } from 'react';
import { loadRecaptchaV2, RECAPTCHA_V2_SITE_KEY } from '@/lib/recaptcha';
import { Icon } from '@/lib/icons';

/**
 * reCAPTCHA v2 checkbox, rendered only when the server reports that a v3
 * score fell below RECAPTCHA_SCORE_THRESHOLD. The token it produces is
 * submitted as captchaToken with captchaVersion: 'v2'.
 */
export default function RecaptchaV2Fallback({
  onToken,
}: {
  onToken: (token: string) => void;
}) {
  const holderRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (!RECAPTCHA_V2_SITE_KEY) {
      setUnavailable(true);
      return;
    }
    let cancelled = false;

    loadRecaptchaV2()
      .then(() => {
        if (cancelled || !holderRef.current || !window.grecaptcha) return;
        window.grecaptcha.ready(() => {
          if (cancelled || !holderRef.current) return;
          holderRef.current.innerHTML = '';
          window.grecaptcha!.render(holderRef.current, {
            sitekey: RECAPTCHA_V2_SITE_KEY,
            callback: (token: string) => onToken(token),
          });
          setReady(true);
        });
      })
      .catch(() => {
        if (!cancelled) setUnavailable(true);
      });

    return () => {
      cancelled = true;
    };
  }, [onToken]);

  return (
    <div className="captcha-v2">
      <p className="captcha-v2__msg">
        <Icon name="shield" size={14} /> One quick check to confirm you are human.
      </p>
      <div ref={holderRef} />
      {unavailable && (
        <p className="captcha-slot__note" role="alert">
          Verification could not be displayed. Please contact us on WhatsApp or by phone and we
          will take your request directly.
        </p>
      )}
      {!ready && !unavailable && <p className="captcha-slot__note">Loading verification…</p>}
    </div>
  );
}
