import type { Metadata } from 'next';
import PageTitle from '@/components/PageTitle';
import PartnershipForm from '@/components/PartnershipForm';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Farm Partnership Programme',
  description:
    'Join the Canaan Harvest farming network. Off-take agreements, input planning, agronomy support and guaranteed purchase volumes for Kenyan farmers.',
  alternates: { canonical: '/partnership' },
  openGraph: {
    title: 'Farm Partnership Programme | Canaan Harvest Agribusiness',
    description:
      'We only plant against confirmed demand. Join the network and your harvest has a buyer before the seed goes in the ground.',
    url: `${SITE.url}/partnership`,
    images: [{ url: '/photos/farm/seedlings-planted.jpg', width: 1200, height: 630, alt: 'Seedlings planted on a Kenyan farm' }],
  },
};

export default function PartnershipPage() {
  return (
    <>
      <PageTitle
        title="Farm partnership"
        subtitle="A signed off-take agreement, an input plan, and agronomy support — so you plant knowing who is buying."
        breadcrumbs={[{ href: '/partnership', label: 'Partnership' }]}
        backgroundImage="/photos/farm/seedlings-planted.jpg"
      />

      <PartnershipForm />
    </>
  );
}
