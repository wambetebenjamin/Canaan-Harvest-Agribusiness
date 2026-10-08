import type { Metadata, Viewport } from 'next';

/* ── Fonts ──────────────────────────────────────────────────────────────────
   The design source loads Open Sans and Marcellus from the Google Fonts CDN
   and ships no font files. The SAME families, SAME weights and SAME italics
   are self-hosted here from @fontsource so the typography is byte-identical
   but no third-party runtime request is made. @fontsource emits real
   @font-face rules with woff2 + woff and font-display: swap — matching the
   source's `display=swap` request exactly.

   Open Sans → --default-font : 300,400,500,600,700,800 + each italic
   Marcellus → --heading-font + --nav-font : 400 only (single weight)
   ──────────────────────────────────────────────────────────────────────── */
import '@fontsource/open-sans/300.css';
import '@fontsource/open-sans/300-italic.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/400-italic.css';
import '@fontsource/open-sans/500.css';
import '@fontsource/open-sans/500-italic.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/600-italic.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/open-sans/700-italic.css';
import '@fontsource/open-sans/800.css';
import '@fontsource/open-sans/800-italic.css';
import '@fontsource/marcellus/400.css';

import './globals.css';

import { SITE } from '@/lib/site';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Preloader from '@/components/Preloader';
import RecaptchaProvider from '@/components/RecaptchaProvider';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Fresh Kenyan Produce, Farm to Table`,
    template: `%s | ${SITE.shortName}`,
  },
  description: SITE.description,
  keywords: [
    'fresh produce Kenya',
    'farm to table Nairobi',
    'bulk vegetables Nairobi',
    'contract farming Kenya',
    'agribusiness Kenya',
    'produce supplier hotels Nairobi',
    'weekly produce box Nairobi',
    'farm partnership Kenya',
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  applicationName: SITE.name,
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Fresh From Kenyan Farms to Your Kitchen.`,
    description: SITE.description,
    images: [
      {
        url: '/photos/farm/farm-field-aerial.webp',
        width: 1200,
        height: 630,
        alt: 'Nakuru highlands farm fields at Canaan Harvest Agribusiness',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Fresh From Kenyan Farms to Your Kitchen.`,
    description: SITE.description,
    images: ['/photos/farm/farm-field-aerial.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: [
      // SVG first: modern browsers prefer it and it stays sharp at any DPI.
      // The PNG is the fallback for older Safari and for crawlers that still
      // request /favicon.png by name.
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icons/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [{ rel: 'mask-icon', url: '/favicon.svg', color: '#116530' }],
  },
  alternates: { canonical: SITE.url },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#116530',
  colorScheme: 'light',
};

const LOCAL_BUSINESS_JSONLD = {
  '@context': 'https://schema.org',
  '@type': ['FoodEstablishment', 'LocalBusiness'],
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: SITE.shortName,
  description: SITE.description,
  url: SITE.url,
  telephone: '+254112272061',
  email: SITE.email,
  image: `${SITE.url}/photos/farm/farm-field-aerial.webp`,
  logo: `${SITE.url}/icons/wordmark.svg`,
  priceRange: 'KES',
  servesCuisine: 'Fresh produce',
  currenciesAccepted: 'KES',
  paymentAccepted: 'M-Pesa, Cash, Bank Transfer',
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: -1.3194, longitude: 36.8485 },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '06:00',
      closes: '19:00',
    },
  ],
  areaServed: { '@type': 'City', name: 'Nairobi' },
  sameAs: Object.values(SITE.social),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Produce categories',
    itemListElement: [
      'Vegetables', 'Fruits', 'Herbs and Spices', 'Grains and Legumes',
      'Dairy', 'Poultry and Eggs', 'Tubers',
    ].map((name) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Product', name },
    })),
  },
  makesOffer: {
    '@type': 'Offer',
    name: 'Contract farming and off-take agreements',
    description:
      'Off-take agreements for Kenyan farmers, including input planning, agronomy support and guaranteed purchase volumes.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE">
      <head>
        <link rel="preconnect" href="https://www.google.com" />
        <script
          type="application/ld+json"
          // JSON-LD is static and author-controlled; no user input is interpolated.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSONLD) }}
        />
      </head>
      <body>
        <RecaptchaProvider />
        <Preloader />
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <CookieConsent />
      </body>
    </html>
  );
}
