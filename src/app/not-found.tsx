import type { Metadata } from 'next';
import Link from 'next/link';
import { GooFilterDefs } from '@/components/FarmGallery';
import { Icon } from '@/lib/icons';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'This crop did not grow here. Head back to the farm.',
  robots: { index: false, follow: true },
};

/**
 * 404 — EFFECT-17.
 * "This crop did not grow here." with a "Back to the Farm" CTA.
 * The liquid blob spill reuses the same bounded SVG goo filter as farm story
 * card 7 — applied to the decorative blob layer only, never to text.
 */
export default function NotFound() {
  return (
    <div className="error-page">
      <GooFilterDefs />

      <div className="error-page__blobs" aria-hidden="true">
        <span className="error-page__blob error-page__blob--1" />
        <span className="error-page__blob error-page__blob--2" />
        <span className="error-page__blob error-page__blob--3" />
        <span className="error-page__blob error-page__blob--4" />
      </div>

      <div className="error-page__content">
        <p className="error-page__code">404</p>
        <h1 className="error-page__title">This crop did not grow here.</h1>
        <p className="error-page__body">
          The page you were looking for is not on this farm. It may have been moved, or the
          link may have been mistyped. Nothing has gone wrong with your order.
        </p>

        <div className="error-page__actions">
          <Link href="/" className="btn btn-primary">
            <Icon name="tractor" size={17} />
            Back to the Farm
          </Link>
          <Link href="/produce" className="btn btn-outline">
            <Icon name="leaf" size={17} />
            Browse produce
          </Link>
        </div>

        <p className="error-page__help">
          Looking for a specific delivery or order?{' '}
          <Link href="/contact">Contact us</Link> or message{' '}
          <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer">
            WhatsApp {SITE.whatsappDisplay}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
