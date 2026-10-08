'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PRODUCE } from '@/data/produce';
import { Icon } from '@/lib/icons';
import { submitWithCaptcha } from '@/lib/submit';
import ClayTitle from './ClayTitle';
import RecaptchaV2Fallback from './RecaptchaV2Fallback';
import { BASKET_KEY } from './ProduceCatalogue';

interface OrderRow {
  key: string;
  produce: string;
  quantity: string;
  packSize: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

const FREQUENCIES = ['Once', 'Weekly', 'Monthly'] as const;
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let rowSeq = 0;
const newRow = (produce = '', quantity = '', packSize = ''): OrderRow => ({
  key: `row-${rowSeq++}`,
  produce,
  quantity,
  packSize,
});

export default function BulkOrderForm() {
  const [rows, setRows] = useState<OrderRow[]>([newRow()]);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [needsV2, setNeedsV2] = useState(false);
  const [v2Token, setV2Token] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  /* Prefill from the produce catalogue basket, if the visitor added items. */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(BASKET_KEY);
      if (!raw) return;
      const basket: { name: string; unit: string; quantity: number }[] = JSON.parse(raw);
      if (!basket.length) return;
      setRows(
        basket.map((b) => newRow(b.name, String(b.quantity), b.unit.replace('per ', '')))
      );
    } catch {
      /* ignore */
    }
  }, []);

  const addRow = useCallback(() => setRows((r) => [...r, newRow()]), []);
  const removeRow = useCallback(
    (key: string) => setRows((r) => (r.length === 1 ? r : r.filter((row) => row.key !== key))),
    []
  );
  const updateRow = useCallback((key: string, patch: Partial<OrderRow>) => {
    setRows((r) => r.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      businessName: String(fd.get('businessName') ?? '').trim(),
      contactName: String(fd.get('contactName') ?? '').trim(),
      phone: String(fd.get('phone') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      deliveryAddress: String(fd.get('deliveryAddress') ?? '').trim(),
      frequency: String(fd.get('frequency') ?? 'Once'),
      deliveryDay: String(fd.get('deliveryDay') ?? ''),
      notes: String(fd.get('notes') ?? '').trim(),
      items: rows
        .filter((r) => r.produce.trim() && r.quantity.trim())
        .map((r) => ({
          produce: r.produce.trim(),
          quantity: r.quantity.trim(),
          packSize: r.packSize.trim(),
        })),
    };

    /* ── Validation ───────────────────────────────────────────────────── */
    const next: Record<string, string> = {};
    if (!payload.businessName) next.businessName = 'Tell us the business or restaurant name.';
    if (!payload.contactName) next.contactName = 'Who should we ask for?';
    if (!/^[+\d][\d\s\-()]{8,}$/.test(payload.phone)) next.phone = 'Enter a reachable phone number.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email)) next.email = 'Enter a valid email address.';
    if (!payload.deliveryAddress) next.deliveryAddress = 'Where should this be delivered?';
    if (!payload.items.length) next.items = 'Add at least one produce item and quantity.';

    setErrors(next);
    if (Object.keys(next).length) {
      setStatus('error');
      setMessage('Please correct the highlighted fields.');
      statusRef.current?.focus();
      const firstKey = Object.keys(next)[0];
      form.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }

    setStatus('loading');
    setMessage('');

    const outcome = await submitWithCaptcha('/api/bulk-order', payload, 'bulk_order', {
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
      statusRef.current?.focus();
      return;
    }

    setStatus('success');
    setMessage(outcome.message);
    form.reset();
    setRows([newRow()]);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <section className="section" id="bulk-order" aria-labelledby="bulk-order-heading">
      <div className="container">
        <div className="form-card">
          <p className="eyebrow">Bulk order</p>
          <ClayTitle text="Place a bulk order" id="bulk-order-heading" />
          <p className="meta" style={{ marginBottom: 24 }}>
            Trade pricing for supermarkets, hotels, restaurants and export buyers. We confirm
            availability and a delivery window within one working day.
          </p>

          {/* Live region for status changes */}
          <div ref={statusRef} tabIndex={-1}>
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
            {status === 'loading' && (
              <div className="form-status form-status--loading" role="status">
                <span className="form-status__spinner" aria-hidden="true" />
                <span>Sending your order…</span>
              </div>
            )}
          </div>

          {needsV2 && (
            <RecaptchaV2Fallback
              onToken={(t) => {
                setV2Token(t);
                setNeedsV2(false);
              }}
            />
          )}

          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="form-grid form-grid--2">
              <div className="field">
                <label className="field__label" htmlFor="businessName">
                  Business or restaurant name <span className="req">*</span>
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  className="input"
                  autoComplete="organization"
                  aria-invalid={Boolean(errors.businessName)}
                  aria-describedby={errors.businessName ? 'businessName-error' : undefined}
                  required
                />
                {errors.businessName && (
                  <p className="field__error" id="businessName-error">
                    <Icon name="alert-circle" size={13} />
                    {errors.businessName}
                  </p>
                )}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="contactName">
                  Contact name <span className="req">*</span>
                </label>
                <input
                  id="contactName"
                  name="contactName"
                  className="input"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.contactName)}
                  required
                />
                {errors.contactName && (
                  <p className="field__error">
                    <Icon name="alert-circle" size={13} />
                    {errors.contactName}
                  </p>
                )}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="phone">
                  Phone <span className="req">*</span>
                </label>
                <input
                  id="phone"
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
                <label className="field__label" htmlFor="email">
                  Email <span className="req">*</span>
                </label>
                <input
                  id="email"
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
                <label className="field__label" htmlFor="deliveryAddress">
                  Delivery address <span className="req">*</span>
                </label>
                <input
                  id="deliveryAddress"
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

            {/* ── Produce items and quantities, add row dynamically ────── */}
            <fieldset style={{ border: 0, padding: 0, margin: '0 0 18px' }}>
              <legend className="field__label" style={{ marginBottom: 10 }}>
                Produce items and quantities <span className="req">*</span>
              </legend>

              <div className="order-rows">
                {rows.map((row, i) => (
                  <div className="order-row" key={row.key}>
                    <div className="field">
                      <label className="field__label" htmlFor={`produce-${row.key}`}>
                        Produce
                      </label>
                      <input
                        id={`produce-${row.key}`}
                        className="input"
                        list="produce-options"
                        value={row.produce}
                        onChange={(e) => updateRow(row.key, { produce: e.target.value })}
                        aria-invalid={Boolean(errors.items) && !row.produce}
                      />
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor={`qty-${row.key}`}>
                        Quantity
                      </label>
                      <input
                        id={`qty-${row.key}`}
                        className="input"
                        placeholder="e.g. 25"
                        value={row.quantity}
                        onChange={(e) => updateRow(row.key, { quantity: e.target.value })}
                      />
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor={`pack-${row.key}`}>
                        Pack size
                      </label>
                      <input
                        id={`pack-${row.key}`}
                        className="input"
                        placeholder="e.g. 12 kg"
                        value={row.packSize}
                        onChange={(e) => updateRow(row.key, { packSize: e.target.value })}
                      />
                    </div>
                    <button
                      type="button"
                      className="order-row__remove"
                      onClick={() => removeRow(row.key)}
                      disabled={rows.length === 1}
                      aria-label={`Remove produce row ${i + 1}`}
                    >
                      <Icon name="trash" size={17} />
                    </button>
                  </div>
                ))}
              </div>

              <datalist id="produce-options">
                {PRODUCE.map((p) => (
                  <option key={p.id} value={p.name} />
                ))}
              </datalist>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={addRow}
                style={{ marginTop: 10 }}
              >
                <Icon name="plus" size={15} />
                Add another item
              </button>

              {errors.items && (
                <p className="field__error" style={{ marginTop: 8 }}>
                  <Icon name="alert-circle" size={13} />
                  {errors.items}
                </p>
              )}
            </fieldset>

            {/* ── Frequency ────────────────────────────────────────────── */}
            <fieldset style={{ border: 0, padding: 0, margin: '0 0 18px' }}>
              <legend className="field__label" style={{ marginBottom: 10 }}>
                Preferred delivery frequency
              </legend>
              <div className="radio-group">
                {FREQUENCIES.map((freq, i) => (
                  <label className="radio-pill" key={freq}>
                    <input type="radio" name="frequency" value={freq} defaultChecked={i === 0} />
                    {freq}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="form-grid form-grid--2">
              <div className="field">
                <label className="field__label" htmlFor="deliveryDay">
                  Delivery day preference
                </label>
                <select id="deliveryDay" name="deliveryDay" className="select" defaultValue="">
                  <option value="">No preference</option>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="notes">
                  Notes
                </label>
                <input
                  id="notes"
                  name="notes"
                  className="input"
                  placeholder="Grade standards, packaging, invoicing"
                />
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="notes-long">
                Anything else we should know?
              </label>
              <textarea
                id="notes-long"
                name="notes"
                className="textarea"
                rows={4}
                placeholder="Seasonal volumes, cold-chain requirements, site access restrictions…"
              />
            </div>

            <p className="captcha-slot__note" style={{ marginBottom: 16 }}>
              This form is protected by reCAPTCHA and the Google{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{' '}
              apply.
            </p>

            {/* EFFECT-29 — claymorphic submit */}
            <button
              type="submit"
              className="btn-clay"
              disabled={status === 'loading'}
              aria-busy={status === 'loading'}
            >
              <span className="btn-clay__icon">
                <Icon name={status === 'loading' ? 'loader' : 'send'} size={18} />
              </span>
              {status === 'loading' ? 'Sending…' : 'Send bulk order request'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
