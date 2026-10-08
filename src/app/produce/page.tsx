import type { Metadata } from 'next';
import PageTitle from '@/components/PageTitle';
import ProduceCatalogue from '@/components/ProduceCatalogue';
import { PRODUCE, CATEGORIES, type CategoryId } from '@/data/produce';
import { SITE } from '@/lib/site';

/* ISR — brief: produce catalogue revalidates every 300s. */
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Produce Catalogue',
  description:
    'Bulk and household pricing for Kenyan vegetables, fruits, herbs, grains, dairy, poultry and tubers. Graded fresh, delivered across Nairobi.',
  alternates: { canonical: '/produce' },
  openGraph: {
    title: 'Produce Catalogue | Canaan Harvest Agribusiness',
    description:
      'Seven produce categories, graded and priced per kilo, with the origin farm named on every line.',
    url: `${SITE.url}/produce`,
    images: [{ url: '/photos/produce/vegetable-basket.jpg', width: 1200, height: 630, alt: 'Fresh Kenyan produce' }],
  },
};

/* Product schema per produce item. */
function productJsonLd() {
  return PRODUCE.map((item) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    sku: item.id,
    category: CATEGORIES.find((c) => c.id === item.category)?.label,
    image: `${SITE.url}${item.image}`,
    description: `${item.name} from ${item.originFarm}, ${item.county} County. Pack sizes: ${item.packSizes.join(', ')}.`,
    brand: { '@type': 'Brand', name: SITE.shortName },
    countryOfOrigin: { '@type': 'Country', name: 'Kenya' },
    offers: {
      '@type': 'Offer',
      price: item.unitPrice,
      priceCurrency: 'KES',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      eligibleQuantity: {
        '@type': 'QuantitativeValue',
        unitText: item.unit.replace('per ', ''),
      },
      seller: { '@type': 'Organization', name: SITE.name },
      url: `${SITE.url}/produce`,
    },
  }));
}

export default async function ProducePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const requested = params.category as CategoryId | undefined;
  const initialCategory =
    requested && CATEGORIES.some((c) => c.id === requested) ? requested : 'all';

  const jsonLd = productJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageTitle
        title="Produce catalogue"
        subtitle="Seven categories, graded to destination specification, with the origin farm named on every line. Trade pricing shown per kilo or per unit."
        breadcrumbs={[{ href: '/produce', label: 'Produce' }]}
      />

      <ProduceCatalogue initialCategory={initialCategory} />
    </>
  );
}
