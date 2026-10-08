'use client';

import { useEffect, useRef } from 'react';
import { TESTIMONIALS } from '@/data/content';
import { Icon } from '@/lib/icons';

/**
 * Testimonials — stagger reveal on scroll, pause on hover.
 * The hover pause is CSS-only (`transition-delay: 0ms` on :hover, declared
 * in chrome.css), so the card settles the instant a pointer or keyboard
 * focus arrives rather than mid-flight.
 */
export default function Testimonials() {
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const nodes = refs.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          el.dataset.inview = entry.isIntersecting ? 'true' : 'false';
        });
      },
      { threshold: 0.2 }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section" id="testimonials" aria-labelledby="testimonials-heading">
      <div className="container">
        <div className="section-title">
          <p className="eyebrow">Trusted by kitchens across Kenya</p>
          <h2 id="testimonials-heading">What our buyers say</h2>
        </div>

        <div className="testimonials">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={t.id}
              className="testimonial"
              style={{ ['--i' as string]: i }}
              ref={(el) => {
                refs.current[i] = el;
              }}
            >
              <div
                className="testimonial__stars"
                role="img"
                aria-label={`${t.stars} out of 5 for quality rating`}
              >
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Icon key={s} name="star" size={15} />
                ))}
              </div>

              <p className="testimonial__quote">“{t.quote}”</p>

              <div className="testimonial__person">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="testimonial__avatar"
                  src={t.image}
                  alt={t.alt}
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <p className="testimonial__name">{t.name}</p>
                  <p className="testimonial__biz">{t.business}</p>
                  <p className="testimonial__ordered">
                    <Icon name="leaf" size={11} /> {t.ordered}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
