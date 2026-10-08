'use client';

import { useMemo, useState } from 'react';
import { CATEGORIES, HARVEST_VOLUME } from '@/data/produce';
import { Icon } from '@/lib/icons';

/**
 * EFFECT-27 — neumorphic freshness widget.
 *
 * Four controls in one cluster:
 *   • freshness toggle per produce category
 *   • delivery-days-remaining spinner
 *   • cold-chain temperature indicator
 *   • weekly harvest volume mini chart
 *
 * Every control uses dual light + dark box-shadows and has a visually
 * distinguishable pressed state (box-shadow flips from raised to inset).
 * All text sits at or above 4.5:1 against the neumorphic surface.
 */

const COLD_CHAIN_C = 3.5;

export default function FreshnessWidget() {
  const [freshOnly, setFreshOnly] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CATEGORIES.filter((c) => c.id !== 'all').map((c) => [c.id, true]))
  );
  const [deliveryDays, setDeliveryDays] = useState(2);
  const [tempC, setTempC] = useState(COLD_CHAIN_C);
  const [activeCharts] = useState(false);

  const peak = useMemo(
    () => Math.max(...HARVEST_VOLUME.map((w) => w.tonnes)),
    []
  );

  const totalFresh = Object.values(freshOnly).filter(Boolean).length;
  const maxDays = 7;

  return (
    <section className="neu-widget" aria-labelledby="freshness-heading">
      <div className="neu-widget__head">
        <Icon name="sun" size={22} />
        <div>
          <h3 id="freshness-heading">Freshness control</h3>
          <p>Live cold-chain and harvest readings from the packhouse.</p>
        </div>
      </div>

      <div className="neu-grid">
        {/* ── Freshness toggle per category ───────────────────────────── */}
        <div className="neu-cell">
          <p className="neu-cell__label">Freshness filter</p>
          <p className="neu-cell__value">
            {totalFresh}
            <small>of {Object.keys(freshOnly).length} categories</small>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
              const on = freshOnly[cat.id];
              return (
                <button
                  key={cat.id}
                  type="button"
                  className="neu-toggle"
                  aria-pressed={on}
                  onClick={() =>
                    setFreshOnly((prev) => ({ ...prev, [cat.id]: !prev[cat.id] }))
                  }
                  style={{ width: 'auto', fontSize: 11, padding: '4px 10px', minHeight: 34 }}
                    title={`${cat.label}: harvested within 24 hours`}
                >
                  {cat.label}
                  <span className="neu-toggle__knob" aria-hidden="true" style={{ width: 26, height: 16 }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Delivery days remaining spinner ─────────────────────────── */}
        <div className="neu-cell">
          <p className="neu-cell__label">Delivery in</p>
          <div className="neu-spinner">
            <button
              type="button"
              className="neu-spinner__btn"
              aria-label="Fewer delivery days"
              onClick={() => setDeliveryDays((d) => Math.max(1, d - 1))}
              disabled={deliveryDays <= 1}
            >
              <Icon name="chevron-left" size={16} />
            </button>
            <span className="neu-spinner__value" aria-live="polite">
              {deliveryDays}
            </span>
            <button
              type="button"
              className="neu-spinner__btn"
              aria-label="More delivery days"
              onClick={() => setDeliveryDays((d) => Math.min(maxDays, d + 1))}
              disabled={deliveryDays >= maxDays}
            >
              <Icon name="chevron-right" size={16} />
            </button>
          </div>
          <p className="meta" style={{ margin: 0 }}>
            {deliveryDays === 1 ? 'Next-day window' : `Day ${deliveryDays} slot available`}
          </p>
        </div>

        {/* ── Cold-chain temperature ──────────────────────────────────── */}
        <div className="neu-cell">
          <p className="neu-cell__label">Cold chain</p>
          <p className="neu-cell__value">
            {tempC.toFixed(1)}
            <small>°C</small>
          </p>
          <div className="neu-temp">
            <div className="neu-temp__gauge">
              <div
                className="neu-temp__fill"
                style={{ width: `${Math.min(100, (tempC / 12) * 100)}%` }}
              />
            </div>
            <button
              type="button"
              className="neu-spinner__btn"
              aria-label="Re-read cold-chain temperature"
              onClick={() =>
                setTempC((t) => {
                  const next = t + (Math.random() * 0.8 - 0.3);
                  return Math.min(9, Math.max(0.5, Number(next.toFixed(1))));
                })
              }
              style={{ width: 34, height: 34 }}
            >
              <Icon name="snowflake" size={15} />
            </button>
          </div>
          <p className="meta" style={{ margin: 0 }}>
            Leafy greens held at 2–4 °C
          </p>
        </div>

        {/* ── Weekly harvest volume ───────────────────────────────────── */}
        <div className="neu-cell">
          <p className="neu-cell__label">Weekly harvest</p>
          <p className="neu-cell__value">
            {HARVEST_VOLUME[HARVEST_VOLUME.length - 1].tonnes}
            <small>tonnes this week</small>
          </p>
          <div className="neu-chart" role="img" aria-label="Harvest volume for the last eight weeks">
            {HARVEST_VOLUME.map((week) => (
              <span
                key={week.week}
                className="neu-chart__bar"
                data-peak={!activeCharts && week.tonnes === peak}
                style={{ height: `${(week.tonnes / peak) * 100}%` }}
                title={`${week.week}: ${week.tonnes} tonnes`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
