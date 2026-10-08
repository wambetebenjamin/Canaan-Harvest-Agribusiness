import Link from 'next/link';
import { SITE } from '@/lib/site';

/**
 * Page title band. Uses the design source's .page-title values verbatim:
 * 80px vertical padding, 42px/700 h1, 16px breadcrumbs, "/" separators.
 */
export default function PageTitle({
  title,
  subtitle,
  backgroundImage = '/photos/farm/farm-field-aerial.webp',
  breadcrumbs = [],
}: {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  breadcrumbs?: { href: string; label: string }[];
}) {
  return (
    <section
      className="page-title"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      aria-labelledby="page-title-heading"
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'color-mix(in srgb, var(--background-color), transparent 22%)',
        }}
      />
      <div className="container" style={{ position: 'relative' }}>
        <h1 id="page-title-heading">{title}</h1>
        {subtitle && (
          <p
            style={{
              maxWidth: '62ch',
              margin: '0 auto 16px',
              fontSize: 16,
              lineHeight: 1.65,
              color: 'color-mix(in srgb, var(--default-color), transparent 18%)',
            }}
          >
            {subtitle}
          </p>
        )}
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            {breadcrumbs.map((crumb) => (
              <li key={crumb.href}>
                <Link href={crumb.href}>{crumb.label}</Link>
              </li>
            ))}
            <li aria-current="page">
              <span className="sr-only">{title}</span>
            </li>
          </ol>
        </nav>
      </div>
    </section>
  );
}

export const SITE_NAME = SITE.name;
