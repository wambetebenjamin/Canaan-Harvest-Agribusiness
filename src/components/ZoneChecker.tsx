'use client';

import { useState } from 'react';
import { Icon } from '@/lib/icons';

type Result =
  | { kind: 'yes'; area: string; lead: string }
  | { kind: 'no'; area: string; nearest: string[] }
  | null;

/**
 * Delivery zone checker. Posts the area to /api/zone, which answers from the
 * KV-stored zone table (falling back to the bundled JSON) with a yes/no and
 * the delivery lead time for covered areas.
 */
export default function ZoneChecker() {
  const [area, setArea] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [result, setResult] = useState<Result>(null);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    if (!area.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/zone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area: area.trim() }),
      });
      const data = await res.json();
      if (data.covered) {
        setResult({ kind: 'yes', area: data.area, lead: data.lead });
      } else {
        setResult({ kind: 'no', area: area.trim(), nearest: data.nearest ?? [] });
      }
    } catch {
      setResult({ kind: 'no', area: area.trim(), nearest: [] });
    } finally {
      setStatus('done');
    }
  }

  return (
    <div>
      <h3 style={{ fontSize: 20, marginBottom: 6 }}>
        <Icon name="truck" size={18} /> Do we deliver to you?
      </h3>
      <p className="meta" style={{ marginBottom: 4 }}>
        Enter your estate or area to check Nairobi delivery coverage.
      </p>

      <form className="zone-checker" onSubmit={check}>
        <label className="sr-only" htmlFor="zone-area">
          Delivery area
        </label>
        <input
          id="zone-area"
          className="input"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="e.g. Kilimani, Westlands, Ruaka"
          autoComplete="address-level2"
        />
        <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? <Icon name="loader" size={16} /> : <Icon name="map-pin" size={16} />}
          Check my area
        </button>
      </form>

      <div aria-live="polite">
        {result?.kind === 'yes' && (
          <div className="zone-result zone-result--yes">
            <Icon name="check-circle" size={18} />
            <div>
              <strong>Yes — we deliver to {result.area}.</strong>
              <p style={{ margin: '4px 0 0', fontSize: 13 }}>
                Typical lead time: {result.lead}.
              </p>
            </div>
          </div>
        )}

        {result?.kind === 'no' && (
          <div className="zone-result zone-result--no">
            <Icon name="info" size={18} />
            <div>
              <strong>Not yet covered for {result.area}.</strong>
              <p style={{ margin: '4px 0 0', fontSize: 13 }}>
                {result.nearest.length > 0 ? (
                  <>We are closest to: {result.nearest.join(', ')}. </>
                ) : null}
                Message us on WhatsApp and we will quote a one-off delivery.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
