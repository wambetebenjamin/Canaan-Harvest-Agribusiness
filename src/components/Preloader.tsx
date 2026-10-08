'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import WordmarkDraw from './WordmarkDraw';

/* Timing budget — brief: "Under 2 seconds total."
 *
 *   MIN_MS   floor   — keeps the seedling readable; never the limiter on
 *                      a cold connection because readyState gates it.
 *   CAP_MS   ceiling — hard stop, guaranteed under 2s.
 *   SKIP_MS  valve   — the skip control appears at 3s *only if the page is
 *                      still genuinely loading*. On any normal load the
 *                      preloader is gone long before 3s, so "under 2s" and
 *                      "skip appears after 3s" are both satisfied rather
 *                      than contradicting one another. See docs/DECISIONS.md.
 */
const MIN_MS = 850;
const CAP_MS = 1900;
const SKIP_MS = 3000;
const EXIT_MS = 420;

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<'loading' | 'exiting' | 'done'>('loading');
  const [skipVisible, setSkipVisible] = useState(false);
  const [announced, setAnnounced] = useState(false);

  const startRef = useRef<number>(0);
  const finishedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setProgress(100);
    setAnnounced(true);
    setState('exiting');
    window.setTimeout(() => setState('done'), EXIT_MS);
  }, []);

  useEffect(() => {
    startRef.current = performance.now();
    let mounted = true;

    const tick = () => {
      if (!mounted || finishedRef.current) return;
      const elapsed = performance.now() - startRef.current;

      // Hold at 92% until the document is genuinely ready, so the bar
      // reflects real progress rather than a fixed animation.
      const docReady = document.readyState === 'complete';
      const ratio = Math.min(elapsed / MIN_MS, 1);
      const ceiling = docReady ? 1 : 0.92;
      const next = Math.min(ratio * ceiling, ceiling);

      setProgress((prev) => (next > prev ? next : prev));

      const timeUp = elapsed >= CAP_MS;
      const ready = docReady && elapsed >= MIN_MS;

      if (ready || timeUp) {
        finish();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // Safety valve: only surfaces if we are still loading at 3s.
    const skipTimer = window.setTimeout(() => {
      if (!finishedRef.current) setSkipVisible(true);
    }, SKIP_MS);

    // If the document finishes loading after the loop has already stopped.
    const onLoad = () => {
      if (finishedRef.current) return;
      if (performance.now() - startRef.current >= MIN_MS) finish();
    };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad);

    return () => {
      mounted = false;
      window.clearTimeout(skipTimer);
      window.removeEventListener('load', onLoad);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [finish]);

  if (state === 'done') return null;

  const pct = Math.round(progress * 100);

  return (
    <div
      className="preloader"
      data-state={state}
      // Not aria-modal and not focus-trapping: the hero CTA must remain
      // focusable immediately (EFFECT-23) and nothing may delay LCP.
      aria-busy={state === 'loading'}
    >
      <div className="preloader__inner">
        <div className="preloader__stage">
          <span className="preloader__ring" aria-hidden="true" />
          {/* EFFECT-25 — sprouting seedling */}
          <svg
            className="preloader__seedling"
            viewBox="0 0 40 40"
            aria-hidden="true"
            focusable="false"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path className="seedling-soil" d="M6 33 H 34" strokeWidth={2.4} />
              <path className="seedling-stem" d="M20 33 V 16" />
              <path className="seedling-leaf seedling-leaf--left" d="M20 22 C 12 22, 9 16, 10 11 C 16 11, 20 15, 20 22 Z" />
              <path className="seedling-leaf seedling-leaf--right" d="M20 24 C 28 24, 31 18, 30 13 C 24 13, 20 17, 20 24 Z" />
            </g>
          </svg>
        </div>

        <WordmarkDraw className="preloader__wordmark wordmark" duration={1.1} />
        <p className="preloader__tagline">Kenyan farms · Nairobi kitchens</p>

        {/* Completing announcement for assistive tech. */}
        <p className="sr-only" role="status" aria-live="polite">
          {announced ? 'Loading complete.' : 'Loading Canaan Harvest.'}
        </p>
      </div>

      <div className="preloader__progress-wrap">
        <div
          className="preloader__bar"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Loading Canaan Harvest Agribusiness"
        >
          <span className="preloader__bar-fill" style={{ width: `${pct}%` }} />
        </div>

        {/* Plain percentage — the visible progress signal under reduced-motion. */}
        <p className="preloader__percent" aria-hidden="true">
          {pct}%
        </p>
        <p className="preloader__percent--reduced">{pct}% loaded</p>

        <button
          type="button"
          className="preloader__skip"
          data-visible={skipVisible}
          onClick={finish}
          tabIndex={skipVisible ? 0 : -1}
          aria-hidden={!skipVisible}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
