import type { Metadata } from 'next';
import PageTitle from '@/components/PageTitle';
import BulkOrderForm from '@/components/BulkOrderForm';
import SubscriptionBoxes from '@/components/SubscriptionBoxes';
import { Icon } from '@/lib/icons';
import { SITE } from '@/lib/site';

/* SSR — brief: bulk order form is server-rendered. */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Place an Order',
  description:
    'Order fresh Kenyan produce in bulk, or subscribe to a weekly produce box delivered across Nairobi. Trade pricing for hotels, restaurants, supermarkets and exporters.',
  alternates: { canonical: '/order' },
  openGraph: {
    title: 'Place an Order | Canaan Harvest Agribusiness',
    description: 'Bulk trade orders and weekly subscription boxes, delivered across Nairobi.',
    url: `${SITE.url}/order`,
  },
};

const STEPS = [
  { icon: 'file-text' as const, title: 'Send your list', body: 'Tell us the items, quantities and your delivery address.' },
  { icon: 'check-circle' as const, title: 'We confirm', body: 'Availability, grade and a delivery window, within one working day.' },
  { icon: 'truck' as const, title: 'We deliver', body: 'Refrigerated vans on fixed Nairobi routes, six mornings a week.' },
];

export default function OrderPage() {
  return (
    <>
      <PageTitle
        title="Place an order"
        subtitle="Bulk trade orders for kitchens, retailers and exporters — or a weekly box for your household."
        breadcrumbs={[{ href: '/order', label: 'Order' }]}
        backgroundImage="/photos/farm/harvest-greens.jpg"
      />

      {/* How it works */}
      <section className="section" aria-labelledby="how-heading">
        <div className="container">
          <div className="section-title">
            <p className="eyebrow">How it works</p>
            <h2 id="how-heading">Three steps from list to delivery</h2>
          </div>

          <div className="testimonials">
            {STEPS.map((step, i) => (
              <article className="testimonial" key={step.title} style={{ opacity: 1, transform: 'none' }}>
                <span className="journey__beat-num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 style={{ fontSize: 20, margin: '10px 0 8px' }}>
                  <Icon name={step.icon} size={18} /> {step.title}
                </h3>
                <p className="testimonial__quote">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <BulkOrderForm />
      <SubscriptionBoxes />
    </>
  );
}
