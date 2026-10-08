import type { Metadata } from 'next';
import PageTitle from '@/components/PageTitle';
import ContactForm from '@/components/ContactForm';
import ZoneChecker from '@/components/ZoneChecker';
import { Icon } from '@/lib/icons';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact and Delivery Zones',
  description:
    'Call, WhatsApp or email Canaan Harvest Agribusiness. Check whether we deliver to your Nairobi area and send us an enquiry.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact and Delivery Zones | Canaan Harvest Agribusiness',
    description: 'Nairobi delivery zone checker, phone, WhatsApp and email.',
    url: `${SITE.url}/contact`,
  },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ produce?: string }>;
}) {
  const params = await searchParams;
  const produce = params.produce ?? '';

  /* Google Maps embed for the Nairobi delivery zone. Uses the keyless
     maps.google.com embed so the page works before an API key is added;
     set NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL to override. */
  const mapSrc =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ??
    'https://www.google.com/maps?q=Nairobi%20County%2C%20Kenya&output=embed';

  return (
    <>
      <PageTitle
        title="Contact and delivery zones"
        subtitle="Tell us what your kitchen needs, or check whether we already deliver to your area."
        breadcrumbs={[{ href: '/contact', label: 'Contact' }]}
        backgroundImage="/photos/farm/field-rows.jpg"
      />

      <section className="section" aria-labelledby="contact-heading">
        <div className="container">
          <div className="section-title">
            <p className="eyebrow">Get in touch</p>
            <h2 id="contact-heading">We reply within one working day</h2>
          </div>

          <div className="contact-grid">
            {/* ── Details + zone checker ─────────────────────────────── */}
            <div>
              <div className="contact-info">
                <div className="contact-info__item">
                  <Icon name="map-pin" size={20} />
                  <div>
                    <h4>Office and packhouse</h4>
                    <p>
                      {SITE.address.street}
                      <br />
                      {SITE.address.locality}, {SITE.address.region}
                      <br />
                      {SITE.address.country}
                    </p>
                  </div>
                </div>

                <div className="contact-info__item">
                  <Icon name="phone" size={20} />
                  <div>
                    <h4>Phone</h4>
                    <p>
                      <a href={SITE.phoneHref}>{SITE.phone}</a>
                    </p>
                  </div>
                </div>

                <div className="contact-info__item">
                  <Icon name="message" size={20} />
                  <div>
                    <h4>WhatsApp</h4>
                    <p>
                      <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer">
                        {SITE.whatsappDisplay}
                      </a>{' '}
                      — fastest way to place an order
                    </p>
                  </div>
                </div>

                <div className="contact-info__item">
                  <Icon name="mail" size={20} />
                  <div>
                    <h4>Email</h4>
                    <p>
                      <a href={SITE.emailHref}>{SITE.email}</a>
                    </p>
                  </div>
                </div>

                <div className="contact-info__item">
                  <Icon name="clock" size={20} />
                  <div>
                    <h4>Opening hours</h4>
                    <p>
                      Monday to Saturday, 6:00am – 7:00pm
                      <br />
                      Deliveries run from 5:30am
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <ZoneChecker />
              </div>

              <div className="map-embed" style={{ marginTop: 24 }}>
                <iframe
                  src={mapSrc}
                  title="Map of Nairobi delivery zones served by Canaan Harvest Agribusiness"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            {/* ── Enquiry form ───────────────────────────────────────── */}
            <ContactForm defaultProduce={produce} />
          </div>
        </div>
      </section>
    </>
  );
}
