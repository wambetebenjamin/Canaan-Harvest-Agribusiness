'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { FRESHNESS_LABEL, formatKES, type ProduceItem } from '@/data/produce';
import { Icon } from '@/lib/icons';

/**
 * EFFECT-26 — hover reveals pricing and origin farm info, 150–400ms.
 *
 * The reveal is gated behind `@media (hover: hover) and (pointer: fine)` in
 * produce.css, so a touch device never gets a hover state it cannot undo.
 * Keyboard users get the identical reveal through :focus-within, and touch
 * users get an equivalent tap toggle via [data-revealed].
 */
export default function ProduceCard({
  item,
  onAddToOrder,
}: {
  item: ProduceItem;
  onAddToOrder?: (item: ProduceItem) => void;
}) {
  const [pinned, setPinned] = useState(false);
  const revealId = useId();

  return (
    <article className="produce-card">
      <div className="produce-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.alt}
          width={640}
          height={480}
          loading="lazy"
          decoding="async"
        />
        <p className="produce-card__fresh" data-fresh={item.freshness}>
          <Icon name="sun" size={11} />
          {item.freshness === 'today' ? 'Today' : item.freshness}
        </p>
      </div>

      <div className="produce-card__body">
        <h3>{item.name}</h3>
        <p className="produce-card__origin">
          <Icon name="map-pin" size={13} />
          {item.originFarm}, {item.county}
        </p>

        <div className="produce-card__packs">
          {item.packSizes.map((pack) => (
            <span className="produce-card__pack" key={pack}>
              {pack}
            </span>
          ))}
        </div>

        <div className="produce-card__actions">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onAddToOrder?.(item)}
          >
            <Icon name="package" size={15} />
            Add to Order
          </button>
          <Link href={`/contact?produce=${encodeURIComponent(item.name)}`} className="btn btn-outline btn-sm">
            <Icon name="message" size={15} />
            Enquire
          </Link>
        </div>
      </div>

      {/* Price + origin reveal (EFFECT-26) */}
      <div className="produce-card__reveal" id={revealId} data-pinned={pinned}>
        <div className="produce-card__reveal-row">
          <span className="produce-card__reveal-label">Unit price</span>
          <span className="produce-card__price">
            {formatKES(item.unitPrice)} <small>{item.unit}</small>
          </span>
        </div>
        <p className="produce-card__farm">
          <Icon name="map-pin" size={13} />
          {item.originFarm} · {item.county}
        </p>
        <div className="produce-card__reveal-row" style={{ marginTop: 6, marginBottom: 0 }}>
          <span className="produce-card__reveal-label">
            <Icon name="sun" size={11} /> Freshness
          </span>
          <span className="meta">{FRESHNESS_LABEL[item.freshness]}</span>
        </div>
      </div>

      {/* Touch-only equivalent of hover */}
      <button
        type="button"
        className="produce-card__reveal-toggle"
        aria-expanded={pinned}
        aria-controls={revealId}
        onClick={() => setPinned((v) => !v)}
      >
        <Icon name={pinned ? 'chevron-down' : 'info'} size={14} />
        {pinned ? 'Hide price' : 'Price & origin'}
      </button>
    </article>
  );
}
