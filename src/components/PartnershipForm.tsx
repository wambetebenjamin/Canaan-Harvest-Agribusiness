'use client';

import { useState } from 'react';
import { PARTNERSHIP_REQUIREMENTS, CERTIFICATION_STEPS } from '@/data/content';
import { Icon } from '@/lib/icons';
import { submitWithCaptcha } from '@/lib/submit';
import ClayTitle from './ClayTitle';
import RecaptchaV2Fallback from './RecaptchaV2Fallback';

type Status = 'idle' | 'loading' | 'success' | 'error';

const WATER_SOURCES = ['Borehole', 'River', 'Dam / pan', 'Piped supply', 'Rain-fed only'];
const CROP_OPTIONS = [
  'Vegetables', 'Fruits', 'Herbs and Spices', 'Grains and Legumes',
  'Dairy', 'Poultry and Eggs', 'Tubers',
];

/**
 * Farm partnership application.
 * Photo is uploaded to Vercel Blob (or the local fallback) first, then the
 * application including the resulting URL is posted to /api/farm-partner.
 */
export default function PartnershipForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [needsV2, setNeedsV2] = useState(false);
  const [v2Token, setV2Token] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [crops, setCrops] = useState<string[]>([]);

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoName(file.name);
    setUploading(true);
    setPhotoUrl(null);

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('slug', 'partner');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      setPhotoUrl(data.url as string);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        photo: err instanceof Error ? err.message : 'Photo upload failed.',
      }));
      setPhotoName(null);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const form = e.currentTarget;

    const payload = {
      farmerName: String(fd.get('farmerName') ?? '').trim(),
      location: String(fd.get('location') ?? '').trim(),
      farmSizeAcres: String(fd.get('farmSizeAcres') ?? '').trim(),
      cropTypes: crops,
      waterSource: String(fd.get('waterSource') ?? ''),
      phone: String(fd.get('phone') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      notes: String(fd.get('notes') ?? '').trim(),
      farmPhotoUrl: photoUrl,
    };

    const next: Record<string, string> = {};
    if (!payload.farmerName) next.farmerName = 'Please give the farmer name.';
    if (!payload.location) next.location = 'Which county and ward?';
    if (!payload.farmSizeAcres || Number(payload.farmSizeAcres) <= 0)
      next.farmSizeAcres = 'Enter the farm size in acres.';
    if (!payload.cropTypes.length) next.cropTypes = 'Select at least one crop type.';
    if (!/^[+\d][\d\s\-()]{8,}$/.test(payload.phone)) next.phone = 'Enter a reachable phone number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email))
      next.email = 'Enter a valid email address.';

    setErrors(next);
    if (Object.keys(next).length) {
      setStatus('error');
      setMessage('Please correct the highlighted fields.');
      return;
    }

    setStatus('loading');
    const outcome = await submitWithCaptcha('/api/farm-partner', payload, 'farm_partner', {
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
    form.reset();
    setCrops([]);
    setPhotoName(null);
    setPhotoUrl(null);
  }

  return (
    <section className="section light-background" id="partnership" aria-labelledby="partnership-heading">
      <div className="container">
        <div className="section-title">
          <p className="eyebrow">Farm partnership programme</p>
          <h2 id="partnership-heading">Sell to a buyer who has already agreed to buy</h2>
          <p style={{ fontSize: 18, marginTop: 12 }}>
            We only plant against confirmed demand. Join the network and your harvest has a home
            before the seed goes in the ground.
          </p>
        </div>

        {/* Requirements + certification */}
        <div className="form-grid form-grid--2" style={{ marginBottom: 34 }}>
          <div>
            <h3 style={{ fontSize: 22, marginBottom: 14 }}>
              <Icon name="check-circle" size={19} /> What we look for
            </h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {PARTNERSHIP_REQUIREMENTS.map((req) => (
                <div className="contact-info__item" key={req.title}>
                  <Icon name={req.icon} size={18} />
                  <div>
                    <h4>{req.title}</h4>
                    <p>{req.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 22, marginBottom: 14 }}>
              <Icon name="shield" size={19} /> Certification process
            </h3>
            <ol style={{ listStyle: 'none', display: 'grid', gap: 12 }}>
              {CERTIFICATION_STEPS.map((step) => (
                <li className="contact-info__item" key={step.step}>
                  <span
                    className="journey__beat-num"
                    style={{ marginBottom: 0, flexShrink: 0 }}
                    aria-hidden="true"
                  >
                    {step.step}
                  </span>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Application */}
        <div className="form-card">
          <ClayTitle text="Apply to join the network" as="h3" />

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
                <label className="field__label" htmlFor="farmerName">
                  Farmer name <span className="req">*</span>
                </label>
                <input
                  id="farmerName"
                  name="farmerName"
                  className="input"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.farmerName)}
                  required
                />
                {errors.farmerName && (
                  <p className="field__error">
                    <Icon name="alert-circle" size={13} />
                    {errors.farmerName}
                  </p>
                )}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="location">
                  Location (county and ward) <span className="req">*</span>
                </label>
                <input
                  id="location"
                  name="location"
                  className="input"
                  placeholder="e.g. Machakos, Mwala"
                  aria-invalid={Boolean(errors.location)}
                  required
                />
                {errors.location && (
                  <p className="field__error">
                    <Icon name="alert-circle" size={13} />
                    {errors.location}
                  </p>
                )}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="farmSizeAcres">
                  Farm size in acres <span className="req">*</span>
                </label>
                <input
                  id="farmSizeAcres"
                  name="farmSizeAcres"
                  type="number"
                  min="0.25"
                  step="0.25"
                  className="input"
                  placeholder="e.g. 4.5"
                  aria-invalid={Boolean(errors.farmSizeAcres)}
                  required
                />
                {errors.farmSizeAcres && (
                  <p className="field__error">
                    <Icon name="alert-circle" size={13} />
                    {errors.farmSizeAcres}
                  </p>
                )}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="waterSource">
                  Water source <span className="req">*</span>
                </label>
                <select id="waterSource" name="waterSource" className="select" required>
                  {WATER_SOURCES.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field field-span-2">
                <span className="field__label" id="crops-label">
                  Crop types <span className="req">*</span>
                </span>
                <div className="radio-group" role="group" aria-labelledby="crops-label">
                  {CROP_OPTIONS.map((crop) => {
                    const on = crops.includes(crop);
                    return (
                      <label className="radio-pill" key={crop}>
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() =>
                            setCrops((prev) =>
                              on ? prev.filter((c) => c !== crop) : [...prev, crop]
                            )
                          }
                        />
                        {on && <Icon name="check" size={14} />}
                        {crop}
                      </label>
                    );
                  })}
                </div>
                {errors.cropTypes && (
                  <p className="field__error">
                    <Icon name="alert-circle" size={13} />
                    {errors.cropTypes}
                  </p>
                )}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="partner-phone">
                  Phone <span className="req">*</span>
                </label>
                <input
                  id="partner-phone"
                  name="phone"
                  type="tel"
                  className="input"
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
                <label className="field__label" htmlFor="partner-email">
                  Email <span className="req">*</span>
                </label>
                <input
                  id="partner-email"
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

              <div className="field field-span-2">
                <label className="field__label" htmlFor="farmPhoto">
                  Recent farm photo
                </label>
                <input
                  id="farmPhoto"
                  name="farmPhoto"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic"
                  className="input"
                  onChange={handlePhoto}
                  aria-describedby="farmPhoto-hint"
                />
                <p className="field__hint" id="farmPhoto-hint">
                  JPEG, PNG, WebP or HEIC up to 8 MB. A photo of the actual plot, not a stock image.
                </p>
                {uploading && (
                  <p className="field__hint" role="status">
                    <Icon name="loader" size={12} /> Uploading {photoName}…
                  </p>
                )}
                {photoUrl && !uploading && (
                  <p className="field__hint" role="status" style={{ color: 'var(--accent-color)' }}>
                    <Icon name="check-circle" size={12} /> Photo uploaded.
                  </p>
                )}
                {errors.photo && (
                  <p className="field__error">
                    <Icon name="alert-circle" size={13} />
                    {errors.photo}
                  </p>
                )}
              </div>

              <div className="field field-span-2">
                <label className="field__label" htmlFor="partner-notes">
                  Tell us about your farm
                </label>
                <textarea
                  id="partner-notes"
                  name="notes"
                  className="textarea"
                  rows={4}
                  placeholder="Current crops, irrigation, storage, distance to tarmac…"
                />
              </div>
            </div>

            <p className="captcha-slot__note" style={{ marginBottom: 16 }}>
              Protected by reCAPTCHA. We review every application and respond within five working
              days.
            </p>

            <button
              type="submit"
              className="btn-clay"
              disabled={status === 'loading' || uploading}
              aria-busy={status === 'loading'}
            >
              <span className="btn-clay__icon">
                <Icon name={status === 'loading' ? 'loader' : 'users'} size={18} />
              </span>
              {status === 'loading' ? 'Submitting…' : 'Submit partnership application'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
