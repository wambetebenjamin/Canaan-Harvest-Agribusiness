'use client';

import { usePresence } from '@/hooks/usePresence';
import { cursorColor } from '@/hooks/usePresence';

/**
 * EFFECT-05 — "12 buyers browsing now." live board.
 *
 * Graceful single-visitor state: with one visitor the copy reads
 * "You are browsing now" rather than inventing a crowd, and the dot stack
 * collapses to a single marker.
 */
export default function PresenceBoard() {
  const { count, connected } = usePresence();

  const dots = Math.min(count, 5);
  const more = count - dots;

  return (
    <div className="presence" role="status" aria-live="polite">
      <span className="presence__dots" aria-hidden="true">
        {Array.from({ length: dots }).map((_, i) => (
          <span
            key={i}
            className="presence__dot"
            style={{ background: cursorColor(i) }}
          />
        ))}
        {more > 0 && <span className="presence__dot presence__dot--more">+{more}</span>}
      </span>

      <p className="presence__text">
        {count <= 1 ? (
          <>
            You are browsing <strong>now</strong>
          </>
        ) : (
          <>
            <strong>{count} buyers</strong> browsing now
          </>
        )}
      </p>

      <span className="presence__live">
        <span className="presence__pulse" aria-hidden="true" />
        {connected ? 'Live' : 'Offline'}
      </span>
    </div>
  );
}
