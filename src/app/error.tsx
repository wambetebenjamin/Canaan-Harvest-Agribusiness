'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Icon } from '@/lib/icons';
import { SITE } from '@/lib/site';

/**
 * 500 — branded error boundary.
 * "Something is off in the fields. We are fixing it." with a Try Again button.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the digest so it can be matched to server logs.
    console.error('[canaan-harvest] unhandled error:', error.digest ?? error.message);
  }, [error]);

  return (
    <div className="error-page">
      <div className="error-page__content">
        <p className="error-page__code">500</p>
        <h1 className="error-page__title">Something is off in the fields. We are fixing it.</h1>
        <p className="error-page__body">
          An unexpected problem stopped this page from loading. It is almost certainly on our
          side, not yours — and your order has not been placed twice.
        </p>

        <div className="error-page__actions">
          <button type="button" className="btn btn-primary" onClick={reset}>
            <Icon name="loader" size={17} />
            Try Again
          </button>
          <Link href="/" className="btn btn-outline">
            <Icon name="home" size={17} />
            Back to the Farm
          </Link>
        </div>

        <p className="error-page__help">
          If it keeps happening, tell us on{' '}
          <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer">
            WhatsApp {SITE.whatsappDisplay}
          </a>{' '}
          or call <a href={SITE.phoneHref}>{SITE.phone}</a>
          {error.digest ? (
            <>
              <br />
              <span className="meta-xs">Reference: {error.digest}</span>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}
