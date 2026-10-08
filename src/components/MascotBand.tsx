import Link from 'next/link';
import { Icon } from '@/lib/icons';
import { FarmerMascot } from './FarmEffects';

/**
 * Order CTA band carrying the waving mascot variant (EFFECT-13).
 * The wave triggers on hover of the band, matching the farm card behaviour.
 */
export default function MascotBand() {
  return (
    <section className="section" aria-labelledby="order-cta-heading">
      <div className="container">
        <div
          className="mascot-band surface"
          style={{ padding: '26px 30px', alignItems: 'center' }}
        >
          <FarmerMascot className="effect13" />

          <div style={{ flex: '1 1 320px' }}>
            <p className="eyebrow" style={{ marginBottom: 6 }}>
              Ready when you are
            </p>
            <h2 id="order-cta-heading" style={{ fontSize: 28, marginBottom: 8 }}>
              Tell us what your kitchen needs this week
            </h2>
            <p style={{ margin: 0, fontSize: 15, color: 'color-mix(in srgb, var(--default-color), transparent 25%)' }}>
              Bulk pricing, a delivery window and a named driver — confirmed within one working day.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link href="/order" className="btn btn-primary">
              <Icon name="package" size={17} />
              Place a Bulk Order
            </Link>
            <Link href="/partnership" className="btn btn-outline">
              <Icon name="users" size={17} />
              Become a Farm Partner
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
