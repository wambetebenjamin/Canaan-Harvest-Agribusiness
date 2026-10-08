'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * EFFECT-06 — ambient slow-drifting leaf particles.
 *
 * • aria-hidden, purely decorative
 * • layer opacity held below 0.2 in CSS
 * • animation paused when the tab is hidden (data-paused)
 * • frozen under reduced-motion (CSS), and never renders at all there
 */

const LEAF_COUNT = 9;

/** Deterministic positions so layout never shifts between renders. */
const LEAVES = Array.from({ length: LEAF_COUNT }, (_, i) => ({
  left: (i * 11.3 + 4) % 96,
  size: 14 + ((i * 7) % 18),
  delay: -(i * 2.9),
  duration: 24 + ((i * 3.1) % 12),
  flip: i % 2 === 0,
}));

export default function LeafField() {
  const [paused, setPaused] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced-motion: do not mount the layer at all.
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setEnabled(!mq.matches);
    const onChange = () => setEnabled(!mq.matches);
    mq.addEventListener('change', onChange);

    const onVisibility = () => setPaused(document.hidden);
    setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      mq.removeEventListener('change', onChange);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      className="hero__leaves"
      ref={ref}
      data-paused={paused}
      aria-hidden="true"
      role="presentation"
    >
      {LEAVES.map((leaf, i) => (
        <span
          key={i}
          className="hero__leaf"
          style={{
            left: `${leaf.left}%`,
            width: leaf.size,
            height: leaf.size,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
            transform: leaf.flip ? 'scaleX(-1)' : undefined,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path
              d="M12 22C12 22 3 17.5 3 10.5C3 5.8 6.8 2 11.5 2C16.2 2 20 5.8 20 10.5C20 17.5 12 22 12 22Z"
              fill="currentColor"
              opacity="0.55"
            />
            <path
              d="M12 21V6"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
