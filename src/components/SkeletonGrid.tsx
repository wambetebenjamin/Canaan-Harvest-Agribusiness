/**
 * EFFECT-24 — shimmer skeleton cards that match the exact dimensions of a
 * real produce card, so swapping in the loaded grid causes zero CLS.
 * Under prefers-reduced-motion the shimmer is replaced by flat grey
 * (handled in produce.css).
 */
export default function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="skeleton-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-card__media" />
          <div className="skeleton-card__body">
            <div className="skeleton-line skeleton-line--title" />
            <div className="skeleton-line skeleton-line--mid" />
            <div className="skeleton-chips">
              <div className="skeleton-chip" />
              <div className="skeleton-chip" />
              <div className="skeleton-chip" />
            </div>
            <div className="skeleton-actions">
              <div className="skeleton-btn" />
              <div className="skeleton-btn" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
