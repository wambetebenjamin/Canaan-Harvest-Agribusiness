'use client';

import { useState } from 'react';
import { Icon } from '@/lib/icons';
import { submitWithCaptcha } from '@/lib/submit';
import RecaptchaV2Fallback from './RecaptchaV2Fallback';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm({ defaultProduce = '' }: { defaultProduce?: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [needsV2, setNeedsV2] = useState(false);
  const [v2Token, setV2Token] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const payload = {
      name: String(fd.get('name') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      phone: String(fd.get('phone') ?? '').trim(),
      subject: String(fd.get('subject') ?? '').trim(),
      produce: String(fd.get('produce') ?? '').trim(),
      message: String(fd.get('message') ?? '').trim(),
    };

    const next: Record<string, string> = {};
    if (!payload.name) next.name = 'Please tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) next.email = 'Enter a valid email address.';
    if (!payload.message || payload.message.length < 10)
      next.message = 'Please give us a little more detail.';

    setErrors(next);
    if (Object.keys(next).length) {
      setStatus('error');
      setMessage('Please correct the highlighted fields.');
      return;
    }

    setStatus('loading');
    const outcome = await submitWithCaptcha('/api/contact', payload, 'contact', {
      captchaVersion: v2Token ? 'v2' : 'v3',
      token: v2Token,
    });

    if (outcome.requiresV2) {
      setNeedsV2(true);
      setStatus('idle');
      setMessage(outcome.message);
      return;
    }

    if (!outcome.ok) {
      setStatus('error');
      setMessage(outcome.message);
      return;
    }

    setStatus('success');
    setMessage(outcome.message);
    e.currentTarget.reset();
  }

  return (
    <div className="form-card">
      <h3 style={{ fontSize: 24, marginBottom: 6 }}>Send an enquiry</h3>
      <p className="meta" style={{ marginBottom: 20 }}>
        Bulk orders, delivery zones, export enquiries or anything else.
      </p>

      {status === 'error' && (
        <div className="form-status form-status--error" role="alert">
          <Icon name="alert-circle" size={18} />
          <span>{message}</span>
        </div>
      )}
      {status === 'success' && (
        <div className="form-status form-status--success" role="status">
          <Icon name="check-circle" size={18} />
          <span>{message}</span>
        </div>
      )}

      {needsV2 && (
        <RecaptchaV2Fallback
          onToken={(t) => {
            setV2Token(t);
            setNeedsV2(false);
          }}
        />
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid form-grid--2">
          <div className="field">
            <label className="field__label" htmlFor="contact-name">
              Your name <span className="req">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              className="input"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              required
            />
            {errors.name && (
              <p className="field__error">
                <Icon name="alert-circle" size={13} />
                {errors.name}
              </p>
            )}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="contact-email">
              Email <span className="req">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              className="input"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              required
            />
            {errors.email && (
              <p className="field__error">
                <Icon name="alert-circle" size={13} />
                {errors.email}
              </p>
            )}
          </div>

          <div className="field">
            <label className="field__label" htmlFor="contact-phone">
              Phone
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              className="input"
              autoComplete="tel"
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="contact-subject">
              Subject
            </label>
            <input id="contact-subject" name="subject" className="input" placeholder="Bulk produce enquiry" />
          </div>

          <div className="field field-span-2">
            <label className="field__label" htmlFor="contact-produce">
              Produce you are interested in
            </label>
            <input
              id="contact-produce"
              name="produce"
              className="input"
              defaultValue={defaultProduce}
              placeholder="e.g. Sukuma wiki, avocado"
            />
          </div>

          <div className="field field-span-2">
            <label className="field__label" htmlFor="contact-message">
              Message <span className="req">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              className="textarea"
              rows={5}
              aria-invalid={Boolean(errors.message)}
              required
            />
            {errors.message && (
              <p className="field__error">
                <Icon name="alert-circle" size={13} />
                {errors.message}
              </p>
            )}
          </div>
        </div>

        <p className="captcha-slot__note" style={{ marginBottom: 16 }}>
          Protected by reCAPTCHA. We reply within one working day.
        </p>

        <button
          type="submit"
          className="btn-clay"
          disabled={status === 'loading'}
          aria-busy={status === 'loading'}
        >
          <span className="btn-clay__icon">
            <Icon name={status === 'loading' ? 'loader' : 'send'} size={18} />
          </span>
          {status === 'loading' ? 'Sending…' : 'Send enquiry'}
        </button>
      </form>
    </div>
  );
}
