'use client';

import { useState } from 'react';
import { executeRecaptcha, V2_REQUIRED_CODE } from '@/lib/recaptcha';
import { Icon } from '@/lib/icons';
import RecaptchaV2Fallback from './RecaptchaV2Fallback';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [needsV2, setNeedsV2] = useState(false);
  const [v2Token, setV2Token] = useState<string | null>(null);
  const [invalid, setInvalid] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setInvalid(false);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setInvalid(true);
      setStatus('error');
      setMessage('Enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    const token = await executeRecaptcha('newsletter');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          captchaToken: v2Token ?? token,
          captchaVersion: v2Token ? 'v2' : 'v3',
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.code === V2_REQUIRED_CODE) {
          setNeedsV2(true);
          setStatus('idle');
          setMessage(data.error ?? 'Please complete the verification below.');
          return;
        }
        setStatus('error');
        setMessage(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setMessage(data.message ?? 'You are on the list. Look out for our seasonal produce guide.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="form-status form-status--success" role="status">
        <Icon name="check-circle" size={18} />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form className="footer__newsletter" onSubmit={submit} noValidate>
      <label htmlFor={compact ? 'newsletter-email-footer' : 'newsletter-email'} className="sr-only">
        Email address
      </label>

      <div className="footer__newsletter-row">
        <input
          id={compact ? 'newsletter-email-footer' : 'newsletter-email'}
          className="input"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={invalid}
          aria-describedby="newsletter-note"
          required
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === 'loading'}
          aria-busy={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <Icon name="loader" size={16} />
              Joining
            </>
          ) : (
            <>
              <Icon name="send" size={16} />
              Subscribe
            </>
          )}
        </button>
      </div>

      {needsV2 && (
        <RecaptchaV2Fallback
          onToken={(t) => {
            setV2Token(t);
            setNeedsV2(false);
          }}
        />
      )}

      {status === 'error' && (
        <p className="field__error" role="alert" style={{ marginTop: 8 }}>
          <Icon name="alert-circle" size={14} />
          {message}
        </p>
      )}

      <p id="newsletter-note" className="meta-xs" style={{ marginTop: 8 }}>
        Seasonal produce guides, harvest news and delivery updates. Unsubscribe any time.
        Protected by reCAPTCHA.
      </p>
    </form>
  );
}
