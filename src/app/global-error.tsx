'use client';

import { useEffect } from 'react';

/**
 * Root error boundary. Reached only when the root layout itself throws, so
 * it must render its own <html> and <body> and cannot rely on the app's
 * stylesheets having loaded — hence the inline styles.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[canaan-harvest] root error:', error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="en-KE">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
          fontFamily:
            '"Open Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          color: '#212529',
          background: '#ffffff',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <p style={{ fontFamily: '"Marcellus", sans-serif', fontSize: 72, margin: '0 0 8px', color: '#116530', lineHeight: 1 }}>
            500
          </p>
          <h1 style={{ fontFamily: '"Marcellus", sans-serif', fontSize: 32, margin: '0 0 14px', color: '#2d465e' }}>
            Something is off in the fields. We are fixing it.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.7, margin: '0 0 26px', color: '#4a5158' }}>
            The site failed to start correctly. Please try again — if it persists, call
            0112 272 061 and we will take your order directly.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              fontFamily: '"Marcellus", sans-serif',
              fontSize: 16,
              letterSpacing: 1,
              color: '#ffffff',
              background: '#116530',
              border: 0,
              borderRadius: 18,
              padding: '14px 38px',
              minHeight: 56,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
