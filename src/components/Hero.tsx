'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from '@/lib/icons';
import HeroTitle from './HeroTitle';
import LeafField from './LeafField';

/* three.js is heavy; keep it out of the critical path entirely.
   ssr:false is required — WebGL cannot render on the server. */
const Basket3D = dynamic(() => import('./Basket3D'), {
  ssr: false,
  loading: () => (
    <div className="hero__stage" aria-hidden="true">
      <div className="hero__poster">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/photos/produce/vegetable-basket.jpg"
          alt=""
          width={900}
          height={900}
        />
      </div>
    </div>
  ),
});

const PROOF = [
  { icon: 'shield' as const, label: 'Certified fresh produce' },
  { icon: 'map-pin' as const, label: 'Nakuru · Meru · Machakos' },
  { icon: 'truck' as const, label: 'Nairobi delivery 6 days a week' },
];

export default function Hero() {
  /* EFFECT-23 — the entrance sequence runs once on mount. The copy and CTAs
     are in the SSR HTML and remain focusable throughout; only the visual
     rise is animated, so nothing is delayed for LCP or keyboard users. */
  const [entrance, setEntrance] = useState<'idle' | 'run'>('idle');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;
    const id = requestAnimationFrame(() => setEntrance('run'));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="hero" id="hero" data-entrance={entrance}>
      {/* EFFECT-18 — slow animated gradient, background-position only */}
      <div className="hero__backdrop" aria-hidden="true" />
      <div className="hero__scrim" aria-hidden="true" />
      {/* EFFECT-06 — drifting leaf particles */}
      <LeafField />

      <div className="hero__container">
        <div className="hero__copy">
          <p className="hero__eyebrow hero-step hero-step--1">
            <Icon name="leaf" size={15} />
            Farm to table · Nairobi
          </p>

          <h1 className="hero__title hero-step hero-step--2">
            <HeroTitle text="Fresh From Kenyan Farms to Your Kitchen." glitchWord="Fresh" />
          </h1>

          <p className="hero__sub hero-step hero-step--3">
            Certified fresh produce. Farm-to-table. Bulk and household orders. Delivered across
            Nairobi.
          </p>

          <div className="hero__actions hero-step hero-step--4">
            <Link href="/order" className="btn btn-primary">
              <Icon name="package" size={17} />
              Place a Bulk Order
            </Link>
            <Link href="/order#subscription" className="btn btn-outline">
              <Icon name="calendar" size={17} />
              Subscribe for Weekly Box
            </Link>
          </div>

          <ul className="hero__proof hero-step hero-step--5">
            {PROOF.map((item) => (
              <li key={item.label}>
                <Icon name={item.icon} size={15} />
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-step hero-step--5">
          <Basket3D
            posterSrc="/photos/produce/vegetable-basket.jpg"
            posterAlt="A basket of assorted fresh Kenyan vegetables"
          />
        </div>
      </div>
    </section>
  );
}
