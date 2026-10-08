'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * EFFECT-29 — clay writing animation on a form title.
 * Each character presses into the surface in sequence. Skipped entirely
 * under reduced-motion (the stylesheet renders the settled state).
 */
export default function ClayTitle({
  text,
  as: Tag = 'h2',
  className = 'clay-title',
  id,
}: {
  text: string;
  as?: 'h2' | 'h3';
  className?: string;
  id?: string;
}) {
  const [run, setRun] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRun(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  let i = 0;

  return (
    <Tag
      id={id}
      className={className}
      data-writing={run ? 'run' : 'idle'}
      // @ts-expect-error -- polymorphic ref across h2/h3
      ref={ref}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((char, index) => (
          <span
            key={`${char}-${index}`}
            className="clay-title__char"
            style={{ ['--i' as string]: i++ }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </Tag>
  );
}
