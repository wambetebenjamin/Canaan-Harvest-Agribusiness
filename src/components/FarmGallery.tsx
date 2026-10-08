'use client';

import { useEffect, useRef } from 'react';
import { FARM_STORIES } from '@/data/content';
import {
  FieldLineArt,
  MorphCycle,
  FarmerMascot,
  Faux3DCrate,
  MixedMediaCollage,
  LiquidBlob,
  IsometricFarm,
  HandDrawnDoodle,
  StopMotionSprite,
  WordmarkCardEffect,
} from './FarmEffects';

/** One renderer per card, keyed by story id. */
const VISUALS: Record<string, React.ComponentType> = {
  field: FieldLineArt,
  wordmark: WordmarkCardEffect,
  morph: MorphCycle,
  farmer: FarmerMascot,
  crate: Faux3DCrate,
  collage: MixedMediaCollage,
  blob: LiquidBlob,
  isometric: IsometricFarm,
  doodle: HandDrawnDoodle,
  stopmotion: StopMotionSprite,
};

/**
 * EFFECT-17 — the gooey filter definition, declared once.
 * Both the filter region (x/y/width/height) and the primitive subregion are
 * explicitly bounded, so the blur can never bleed outside the element that
 * uses it. It is applied only to decorative blob shapes — never to text.
 */
export function GooFilterDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute', pointerEvents: 'none' }}
    >
      <defs>
        <filter
          id="goo-filter"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * The 10-card farm stories gallery. A single IntersectionObserver flips
 * data-inview on each card, which every effect stylesheet keys off — so the
 * animations only run while a card is actually on screen.
 */
export default function FarmGallery() {
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const nodes = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          el.dataset.inview = entry.isIntersecting ? 'true' : 'false';
        });
      },
      { threshold: 0.25 }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section light-background" id="farm-stories" aria-labelledby="stories-heading">
      <GooFilterDefs />

      <div className="container">
        <div className="section-title">
          <p className="eyebrow">Farm stories</p>
          <h2 id="stories-heading">Ten things that happen on a Canaan farm</h2>
          <p style={{ fontSize: 18, marginTop: 12 }}>
            Every card animates only while it is on screen, and every animation has a still version.
          </p>
        </div>

        <div className="farm-gallery">
          {FARM_STORIES.map((story, i) => {
            const Visual = VISUALS[story.id];
            return (
              <article
                key={story.id}
                className="farm-card"
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <span className="farm-card__index" aria-hidden="true">
                  {String(story.index).padStart(2, '0')}
                </span>

                <div className="farm-card__visual">
                  {Visual ? <Visual /> : null}
                </div>

                <h3>{story.title}</h3>
                <p>{story.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
