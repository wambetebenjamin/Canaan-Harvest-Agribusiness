import type { Metadata } from 'next';
import Link from 'next/link';
import PageTitle from '@/components/PageTitle';
import FarmGallery from '@/components/FarmGallery';
import Journey from '@/components/Journey';
import ARFarmTour from '@/components/ARFarmTour';
import Testimonials from '@/components/Testimonials';
import { SITE } from '@/lib/site';
import { Icon } from '@/lib/icons';

export const metadata: Metadata = {
  title: 'Farm Stories',
  description:
    'Meet the farms behind Canaan Harvest — Nakuru highlands, Meru ridge and Machakos valley — and the partner growers who supply them.',
  alternates: { canonical: '/farm-stories' },
  openGraph: {
    title: 'Farm Stories | Canaan Harvest Agribusiness',
    description: 'Ten things that happen on a Canaan farm, from seedling to delivery.',
    url: `${SITE.url}/farm-stories`,
    images: [{ url: '/photos/farm/farmer-harvest-kale.jpg', width: 1200, height: 630, alt: 'A Kenyan farmer with a harvest of kale' }],
  },
};

export default function FarmStoriesPage() {
  return (
    <>
      <PageTitle
        title="Farm stories"
        subtitle="Our own farms and the partner growers who supply them. Named, audited, and paid on time."
        breadcrumbs={[{ href: '/farm-stories', label: 'Farm stories' }]}
        backgroundImage="/photos/farm/farmer-harvest-kale.jpg"
      />

      {/* Farm summary */}
      <section className="section" aria-labelledby="farms-heading">
        <div className="container">
          <div className="section-title">
            <p className="eyebrow">Three farms</p>
            <h2 id="farms-heading">Where your produce is grown</h2>
          </div>

          <div className="testimonials">
            {SITE.farms.map((farm) => (
              <article className="testimonial" key={farm.name} style={{ opacity: 1, transform: 'none' }}>
                <p className="post-card__cat">
                  <Icon name="map-pin" size={12} /> {farm.county} County
                </p>
                <h3 style={{ fontSize: 20, margin: '0 0 8px' }}>{farm.name}</h3>
                <p className="testimonial__quote">
                  {farm.acres} acres under cultivation. Primary focus: {farm.focus.toLowerCase()}.
                </p>
                <p className="meta">
                  <Icon name="droplets" size={13} /> Assured water ·{' '}
                  <Icon name="shield" size={13} /> GAP certified
                </p>
              </article>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link href="/partnership" className="btn btn-primary">
              <Icon name="users" size={17} />
              Become a farm partner
            </Link>
          </div>
        </div>
      </section>

      <Journey />
      <FarmGallery />
      <ARFarmTour />
      <Testimonials />
    </>
  );
}
