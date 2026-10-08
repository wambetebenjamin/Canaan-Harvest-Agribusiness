'use client';

import { useEffect, useRef, useState } from 'react';
import { JOURNEY_BEATS } from '@/data/content';
import { Icon } from '@/lib/icons';
import { JOURNEY_SCENES } from './JourneyScenes';

/**
 * EFFECT-02 — pinned scrollytelling, four beats.
 *
 * Progress is driven by IntersectionObserver only. Wheel and touch events
 * are never intercepted, so scrolling speed and momentum stay entirely
 * native — the sticky visual panel simply follows whichever beat is
 * currently crossing the viewport midline.
 *
 * Under prefers-reduced-motion the sticky panel is unpinned by CSS and the
 * beats render as a plain stacked article.
 */
export default function Journey() {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const beatRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const nodes = beatRefs.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Choose the entry closest to the vertical midline of the viewport.
        const candidates = entries.filter((e) => e.isIntersecting);
        if (!candidates.length) return;
        const best = candidates.reduce((a, b) =>
          Math.abs(a.boundingClientRect.top) < Math.abs(b.boundingClientRect.top) ? a : b
        );
        const index = Number((best.target as HTMLElement).dataset.beatIndex ?? 0);
        setActive(index);
      },
      {
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0,
      }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section className="journey section" id="journey" aria-labelledby="journey-heading">
      <div className="container">
        <div className="section-title">
          <p className="eyebrow">The produce journey</p>
          <h2 id="journey-heading">From the Nakuru highlands to your kitchen</h2>
        </div>

        <div className="journey__grid">
          {/* Sticky visual — hidden from AT; the beats carry the content. */}
          <div className="journey__sticky" aria-hidden="true">
            <div className="journey__scene">
              {JOURNEY_BEATS.map((beat, i) => {
                const Scene = JOURNEY_SCENES[beat.scene];
                return (
                  <div
                    key={beat.id}
                    className="journey__panel"
                    data-active={reduced || active === i}
                  >
                    <p className="journey__step-num">{beat.step}</p>
                    <Scene />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress rail */}
          <div className="journey__rail" aria-hidden="true">
            {JOURNEY_BEATS.map((beat, i) => (
              <span
                key={beat.id}
                className="journey__rail-dot"
                data-past={active >= i}
              />
            ))}
          </div>

          {/* Beats */}
          <div className="journey__beats">
            {JOURNEY_BEATS.map((beat, i) => (
              <article
                key={beat.id}
                className="journey__beat"
                data-beat-index={i}
                data-active={active === i}
                ref={(el) => {
                  beatRefs.current[i] = el;
                }}
                aria-current={active === i ? 'step' : undefined}
              >
                <span className="journey__beat-num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3>{beat.title}</h3>
                <p>{beat.body}</p>
                <p className="journey__beat-meta">
                  <Icon name={beat.icon} size={15} />
                  {beat.meta}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
