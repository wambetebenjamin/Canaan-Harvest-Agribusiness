'use client';

import { useState } from 'react';
import { BOXES, type ProduceBox } from '@/data/content';
import { formatKES } from '@/data/produce';
import { Icon } from '@/lib/icons';
import { submitWithCaptcha } from '@/lib/submit';
import RecaptchaV2Fallback from './RecaptchaV2Fallback';

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Weekly produce subscription boxes.
 * Subscribe Now → /api/subscription, which records the signup in KV and
 * triggers M-Pesa Daraja recurring billing (simulated when Daraja
 * credentials are absent — see src/lib/mpesa.ts).
 */
export default function SubscriptionBoxes() {
  const [selected, setSelected] = useState<ProduceBox | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [needsV2, setNeedsV2] = useState(false);
  const [v2Token, setV2Token] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    const fd = new FormData(e.currentTarget);

    const payload = {
      boxId: selected.id,
      boxName: selected.name,
      pricePerWeek: selected.pricePerWeek,
      fullName: String(fd.get('fullName') ?? '').trim(),
      phone: String(fd.get('phone') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      deliveryAddress: String(fd.get('deliveryAddress') ?? '').trim(),
      preferredDay: String(fd.get('preferredDay') ?? ''),
    };

    const next: Record<string, string> = {};
    if (!payload.fullName) next.fullName = 'Please tell us your name.';
    if (!/^[+\d][\d\s\-()]{8,}$/.test(payload.phone)) next.phone = 'Enter a valid M-Pesa phone number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) next.email = 'Enter a valid email address.';
    if (!payload.deliveryAddress) next.deliveryAddress = 'Where should the box be delivered?';

    setErrors(next);
    if (Object.keys(next).length) {
      setStatus('error');
      setMessage('Please correct the highlighted fields.');
      return;
    }

    setStatus('loading');
    const outcome = await submitWithCaptcha('/api/subscription', payload, 'subscription', {
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
  }

  if (status === 'success') {
    return (
      <section className="section light-background" id="subscription" aria-labelledby="subscription-heading">
        <div className="container">
          <div className="form-card" style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <Icon name="check-circle" size={44} />
            <h2 id="subscription-heading" style={{ marginTop: 16, fontSize: 28 }}>
              You are subscribed
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7 }}>{message}</p>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setStatus('idle');
                setSelected(null);
              }}
            >
              Choose a different box
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section light-background" id="subscription" aria-labelledby="subscription-heading">
      <div className="container">
        <div className="section-title">
          <p className="eyebrow">Weekly produce box</p>
          <h2 id="subscription-heading">A box of the week&apos;s harvest, every week</h2>
          <p style={{ fontSize: 18, marginTop: 12 }}>
            Paid by M-Pesa recurring billing. Pause or change your box any time.
          </p>
        </div>

        <div className="testimonials" style={{ marginBottom: selected ? 26 : 0 }}>
          {BOXES.map((box) => {
            const isSelected = selected?.id === box.id;
            return (
              <article
                key={box.id}
                className="post-card"
                style={{
                  borderColor: isSelected ? 'var(--accent-color)' : undefined,
                  boxShadow: isSelected
                    ? '0 18px 44px -26px color-mix(in srgb, var(--accent-color), transparent 40%)'
                    : undefined,
                }}
              >
                <div className="post-card__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={box.image} alt={box.alt} width={640} height={400} loading="lazy" />
                </div>
                <div className="post-card__body">
                  {box.popular && (
                    <p className="post-card__cat" style={{ marginBottom: 8 }}>
                      <Icon name="star" size={12} /> Most popular
                    </p>
                  )}
                  <h3>{box.name}</h3>
                  <p className="meta" style={{ marginBottom: 10 }}>
                    {box.tagline} · serves {box.serves}
                  </p>

                  <p
                    className="produce-card__price"
                    style={{ marginBottom: 12, fontSize: 26 }}
                  >
                    {formatKES(box.pricePerWeek)}
                    <small style={{ fontSize: 13 }}> / week</small>
                  </p>

                  <ul style={{ listStyle: 'none', display: 'grid', gap: 7, marginBottom: 18 }}>
                    {box.contents.map((line) => (
                      <li
                        key={line}
                        style={{ display: 'flex', gap: 8, fontSize: 14, alignItems: 'flex-start' }}
                      >
                        <Icon name="check-circle" size={15} />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={isSelected ? 'btn btn-primary btn-block' : 'btn btn-outline btn-block'}
                    onClick={() => {
                      setSelected(isSelected ? null : box);
                      setStatus('idle');
                      setV2Token(null);
                      setNeedsV2(false);
                    }}
                    aria-expanded={isSelected}
                  >
                    <Icon name={isSelected ? 'check' : 'package'} size={16} />
                    {isSelected ? 'Selected' : 'Subscribe Now'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* ── Subscribe form, revealed once a box is chosen ───────────── */}
        {selected && (
          <div className="form-card" id="subscribe-form">
            <h3 style={{ fontSize: 24, marginBottom: 6 }}>
              Subscribe to the {selected.name}
            </h3>
            <p className="meta" style={{ marginBottom: 22 }}>
              {formatKES(selected.pricePerWeek)} per week, billed by M-Pesa. You will receive an
              STK push to authorise the first payment.
            </p>

            {status === 'error' && (
              <div className="form-status form-status--error" role="alert">
                <Icon name="alert-circle" size={18} />
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
                  <label className="field__label" htmlFor="sub-name">
                    Full name <span className="req">*</span>
                  </label>
                  <input
                    id="sub-name"
                    name="fullName"
                    className="input"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.fullName)}
                    required
                  />
                  {errors.fullName && (
                    <p className="field__error">
                      <Icon name="alert-circle" size={13} />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="sub-phone">
                    M-Pesa phone <span className="req">*</span>
                  </label>
                  <input
                    id="sub-phone"
                    name="phone"
                    type="tel"
                    className="input"
                    placeholder="0712 345 678"
                    autoComplete="tel"
                    aria-invalid={Boolean(errors.phone)}
                    required
                  />
                  {errors.phone && (
                    <p className="field__error">
                      <Icon name="alert-circle" size={13} />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="sub-email">
                    Email <span className="req">*</span>
                  </label>
                  <input
                    id="sub-email"
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
                  <label className="field__label" htmlFor="sub-day">
                    Preferred delivery day
                  </label>
                  <select id="sub-day" name="preferredDay" className="select" defaultValue="Tuesday">
                    <option>Tuesday</option>
                    <option>Thursday</option>
                    <option>Saturday</option>
                  </select>
                </div>

                <div className="field field-span-2">
                  <label className="field__label" htmlFor="sub-address">
                    Delivery address <span className="req">*</span>
                  </label>
                  <input
                    id="sub-address"
                    name="deliveryAddress"
                    className="input"
                    autoComplete="street-address"
                    aria-invalid={Boolean(errors.deliveryAddress)}
                    required
                  />
                  {errors.deliveryAddress && (
                    <p className="field__error">
                      <Icon name="alert-circle" size={13} />
                      {errors.deliveryAddress}
                    </p>
                  )}
                </div>
              </div>

              <p className="captcha-slot__note" style={{ marginBottom: 16 }}>
                Protected by reCAPTCHA. Recurring billing is processed through Safaricom M-Pesa.
              </p>

              <button
                type="submit"
                className="btn-clay"
                disabled={status === 'loading'}
                aria-busy={status === 'loading'}
              >
                <span className="btn-clay__icon">
                  <Icon name={status === 'loading' ? 'loader' : 'check-circle'} size={18} />
                </span>
                {status === 'loading'
                  ? 'Starting M-Pesa…'
                  : `Subscribe — ${formatKES(selected.pricePerWeek)}/week`}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
