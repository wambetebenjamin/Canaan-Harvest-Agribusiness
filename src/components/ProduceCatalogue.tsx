'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORIES, PRODUCE, type CategoryId, type ProduceItem } from '@/data/produce';
import { Icon, type LucideIconName } from '@/lib/icons';
import ProduceCard from './ProduceCard';
import SkeletonGrid from './SkeletonGrid';
import FreshnessWidget from './FreshnessWidget';
import PresenceBoard from './PresenceBoard';
import { cursorColor, cursorLabel, usePresence } from '@/hooks/usePresence';

export const BASKET_KEY = 'canaan-harvest:basket';

/** Writes an item to the local basket so /order can prefill its rows. */
function addToBasket(item: ProduceItem) {
  try {
    const raw = window.localStorage.getItem(BASKET_KEY);
    const basket: { id: string; name: string; unit: string; quantity: number }[] = raw
      ? JSON.parse(raw)
      : [];
    const existing = basket.find((b) => b.id === item.id);
    if (existing) existing.quantity += 1;
    else basket.push({ id: item.id, name: item.name, unit: item.unit, quantity: 1 });
    window.localStorage.setItem(BASKET_KEY, JSON.stringify(basket));
    window.dispatchEvent(new CustomEvent('canaan-harvest:basket-changed'));
  } catch {
    /* storage unavailable — the order form still works from scratch */
  }
}

export default function ProduceCatalogue({
  initialCategory = 'all',
}: {
  initialCategory?: CategoryId;
}) {
  const [category, setCategory] = useState<CategoryId>(initialCategory);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState<string | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);

  const { cursors } = usePresence();

  /* EFFECT-24 — brief skeleton pass representing the fetch of the produce
     list. Real data is already in the bundle; the skeleton exists so the
     catalogue has a genuine loading state on slow devices and on ISR
     revalidation, and it matches card dimensions exactly (zero CLS). */
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(t);
  }, []);

  const items = useMemo(
    () => (category === 'all' ? PRODUCE : PRODUCE.filter((p) => p.category === category)),
    [category]
  );

  const handleAdd = useCallback((item: ProduceItem) => {
    addToBasket(item);
    setAdded(item.name);
    window.setTimeout(() => setAdded(null), 2600);
  }, []);

  /* Scroll-rail paging */
  const page = useCallback((dir: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const amount = Math.max(200, rail.clientWidth * 0.7);
    rail.scrollBy({ left: amount * dir, behavior: 'smooth' });
  }, []);

  /* EFFECT-15 — keyboard arrow navigation within the rail */
  const onChipKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    const last = CATEGORIES.length - 1;
    let next = index;
    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;
    e.preventDefault();
    chipRefs.current[next]?.focus();
  }, []);

  const railLabel = `Produce categories, ${CATEGORIES.length} items.`;

  return (
    <section className="section" id="produce" aria-labelledby="produce-heading">
      <div className="container">
        <div className="section-title">
          <p className="eyebrow">Produce catalogue</p>
          <h2 id="produce-heading">Everything we grow, graded and priced</h2>
        </div>

        {/* ── Presence board ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
          <PresenceBoard />
        </div>

        {/* ── EFFECT-15 — scroll-snap category rail ──────────────────── */}
        <div className="rail-head">
          <div>
            <p className="meta" style={{ margin: 0 }}>
              {CATEGORIES.length} categories · {PRODUCE.length} lines in stock
            </p>
          </div>
          <div className="rail-nav">
            <button
              type="button"
              className="rail-nav__btn"
              onClick={() => page(-1)}
              aria-label="Scroll categories left"
            >
              <Icon name="chevron-left" size={18} />
            </button>
            <button
              type="button"
              className="rail-nav__btn"
              onClick={() => page(1)}
              aria-label="Scroll categories right"
            >
              <Icon name="chevron-right" size={18} />
            </button>
          </div>
        </div>

        <div className="rail" role="group" aria-label={railLabel} ref={railRef}>
          {CATEGORIES.map((cat, i) => {
            const count =
              cat.id === 'all'
                ? PRODUCE.length
                : PRODUCE.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                ref={(el) => {
                  chipRefs.current[i] = el;
                }}
                type="button"
                className="rail__chip"
                aria-pressed={category === cat.id}
                onClick={() => setCategory(cat.id)}
                onKeyDown={(e) => onChipKeyDown(e, i)}
              >
                <Icon name={cat.icon as LucideIconName} size={16} />
                {cat.label}
                <span className="rail__count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* ── Grid + collaborator cursors ────────────────────────────── */}
        <div className="produce-stage" ref={stageRef}>
          {/* EFFECT-05 — coloured dots for other active visitors */}
          {cursors.length > 0 && (
            <div className="produce-cursors" aria-hidden="true">
              {cursors.map((cursor, i) => (
                <span
                  key={cursor.id}
                  className="produce-cursor"
                  style={{
                    transform: `translate3d(${cursor.x * 100}%, ${cursor.y * 100}%, 0)`,
                    background: cursor.color || cursorColor(i),
                  }}
                >
                  <span className="produce-cursor__tag">
                    {cursor.label || cursorLabel(i)}
                  </span>
                </span>
              ))}
            </div>
          )}

          <div
            className="produce-grid"
            aria-busy={loading}
            aria-live="polite"
            aria-label={`${items.length} produce items in ${CATEGORIES.find((c) => c.id === category)?.label}`}
          >
            {loading ? (
              <SkeletonGrid count={8} />
            ) : (
              items.map((item) => (
                <ProduceCard key={item.id} item={item} onAddToOrder={handleAdd} />
              ))
            )}
          </div>
        </div>

        {/* Add-to-order confirmation */}
        <div
          role="status"
          aria-live="polite"
          style={{ minHeight: 24, marginTop: 12, fontSize: 14, color: 'var(--accent-color)' }}
        >
          {added ? (
            <>
              <Icon name="check-circle" size={15} /> {added} added to your order — open the{' '}
              <a href="/order">bulk order form</a> to send it.
            </>
          ) : null}
        </div>

        {/* ── EFFECT-27 — neumorphic freshness widget ────────────────── */}
        <FreshnessWidget />
      </div>
    </section>
  );
}
