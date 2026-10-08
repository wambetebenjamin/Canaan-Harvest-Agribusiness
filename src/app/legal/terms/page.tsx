import type { Metadata } from 'next';
import Link from 'next/link';
import PageTitle from '@/components/PageTitle';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Produce quality standards, order and delivery terms, farm partnership terms, payment terms and Kenyan governing law for Canaan Harvest Agribusiness.',
  alternates: { canonical: '/legal/terms' },
  openGraph: {
    title: 'Terms of Service | Canaan Harvest Agribusiness',
    description:
      'Quality standards, order and delivery terms, farm partnership terms, payment terms and governing law.',
    url: `${SITE.url}/legal/terms`,
  },
};

export default function TermsPage() {
  return (
    <>
      <PageTitle
        title="Terms of Service"
        subtitle="These terms govern produce supply and farm partnership with Canaan Harvest Agribusiness."
        breadcrumbs={[
          { href: '/legal/terms', label: 'Legal' },
          { href: '/legal/terms', label: 'Terms' },
        ]}
      />

      <section className="section">
        <div className="container">
          <div className="prose" style={{ margin: '0 auto' }}>
            <p className="meta-xs" style={{ marginBottom: 30 }}>
              Last updated: 7 October 2026 · Version 1.0
            </p>

            <p>
              These terms apply to every order for produce and to every farm partnership
              agreement with Canaan Harvest Agribusiness, a company registered in Kenya. By
              placing an order or signing an off-take agreement you accept them. If you are
              negotiating different terms for a large contract, we will put those in a separate
              signed agreement which takes precedence over this page.
            </p>

            <h2 id="produce-quality-standards">1. Produce Quality Standards</h2>
            <p>
              We grade and pack to the destination specification agreed at the time of order.
              Where no specification is agreed, the following defaults apply:
            </p>
            <table>
              <caption className="sr-only">Default produce quality standards by category</caption>
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Default standard</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Leafy vegetables</td>
                  <td>
                    Fresh, turgid, free of yellowing and insect damage. Held at 2–4 °C after
                    harvest. Trimmed and washed.
                  </td>
                </tr>
                <tr>
                  <td>Fruiting vegetables</td>
                  <td>
                    Uniform colour and size within a crate. Firm. No splits, bruising or
                    sunscald. Held at 8–10 °C.
                  </td>
                </tr>
                <tr>
                  <td>Fruits</td>
                  <td>
                    Mature but not over-ripe, graded by count and size. Ripe-and-ready or
                    ripening-on-arrival specified per order.
                  </td>
                </tr>
                <tr>
                  <td>Herbs and spices</td>
                  <td>
                    Whole leaves and stems, no discolouration, bunched and sleeved. Held at
                    2–4 °C.
                  </td>
                </tr>
                <tr>
                  <td>Grains and legumes</td>
                  <td>
                    Cleaned, dry, free of foreign matter and live infestation. Moisture content
                    within market tolerance for the crop.
                  </td>
                </tr>
                <tr>
                  <td>Dairy</td>
                  <td>
                    Cold chain unbroken from milking to delivery. Delivered at or below 5 °C.
                  </td>
                </tr>
                <tr>
                  <td>Poultry and eggs</td>
                  <td>
                    Dressed weight as stated. Eggs clean, uncracked, with a collection date
                    marked on the tray.
                  </td>
                </tr>
                <tr>
                  <td>Tubers</td>
                  <td>
                    Sound, unbroken skin, graded by size, free of greening and rot.
                  </td>
                </tr>
              </tbody>
            </table>

            <h3>1.1 Rejection</h3>
            <p>
              You may reject any consignment that falls materially below the agreed standard.
              Rejection must be notified <strong>on the day of delivery</strong>, with the
              consignment left in its original packaging and, where practical, photographed.
              We will collect the rejected goods at our own cost and either replace them on the
              next route or credit the invoice in full — your choice.
            </p>
            <p>
              Our measured rejection rate at the buyer end is under two per cent. Consignments
              that miss grade during our own inspection are diverted before dispatch rather
              than blended into your order.
            </p>

            <h3>1.2 Weight basis</h3>
            <p>
              Unless stated otherwise, prices and quantities are on a delivered-gross-weight
              basis for produce sold by weight, and per tray or crate for items sold by count.
              Natural shrinkage in transit is within normal trade tolerance.
            </p>

            <h2 id="order-and-delivery-terms">2. Order and Delivery Terms</h2>

            <h3>2.1 Placing orders</h3>
            <p>
              Orders may be placed through the website, by phone, or on WhatsApp. An order is
              accepted only when we confirm it in writing — email or WhatsApp both count. Until
              we confirm, the order is a request, not a contract.
            </p>

            <h3>2.2 Cut-off times</h3>
            <ul>
              <li>
                <strong>Next-morning delivery:</strong> orders confirmed by 15:00 the previous
                day.
              </li>
              <li>
                <strong>Same-day delivery:</strong> subject to availability, by 06:00.
              </li>
              <li>
                <strong>Weekend deliveries:</strong> Saturday only. No deliveries on Sunday or
                public holidays.
              </li>
            </ul>

            <h3>2.3 Delivery windows</h3>
            <p>
              We deliver against an agreed window and aim to arrive within it. Traffic
              conditions on Nairobi routes can occasionally push an arrival later; if we expect
              to be more than 60 minutes outside the window we will call the number on the
              order. You must provide reasonable access to the delivery point. If nobody is
              available to receive the goods we will attempt one further delivery on the next
              route and may charge for the second trip.
            </p>

            <h3>2.4 Risk and title</h3>
            <p>
              Risk in the produce passes to you on delivery. Title passes when the produce has
              been paid for in full.
            </p>

            <h3>2.5 Availability</h3>
            <p>
              Fresh produce is by nature variable. If a line is unavailable we will offer a
              substitute, a reduced quantity, or a credit — whichever you prefer. We will not
              substitute a line without asking you first.
            </p>

            <h2 id="farm-partnership-terms">3. Farm Partnership Terms</h2>
            <p>
              These terms apply to farmers in the Canaan Harvest network. An
              accepted application is followed by a signed off-take agreement which sets the
              specifics for your farm; the principles below apply to all of them.
            </p>

            <h3>3.1 Off-take commitments</h3>
            <ul>
              <li>
                We commit to buy agreed volumes at the agreed grade standard, for the agreed
                season.
              </li>
              <li>
                You commit to plant the agreed area, follow the agreed crop plan, and offer the
                harvest to us first.
              </li>
              <li>
                We only ask you to plant against confirmed demand. No crop enters the plan
                before a buyer line exists for it.
              </li>
            </ul>

            <h3>3.2 Price mechanism</h3>
            <p>
              The agreement states whether your price is fixed for the season, indexed to a
              named market rate, or reviewed at agreed intervals. If the market price rises
              above your agreed price, we pass through the increase under the mechanism in your
              agreement rather than holding you to a stale figure.
            </p>

            <h3>3.3 What we provide</h3>
            <ul>
              <li>An input and agronomy plan, including safe-spraying guidance.</li>
              <li>Record books and training on planting, spraying and harvest logs.</li>
              <li>A field officer who visits on an agreed schedule and is contactable between visits.</li>
              <li>Collection from the farm or an agreed aggregation point, at our cost.</li>
            </ul>

            <h3>3.4 What we require</h3>
            <ul>
              <li>
                Traceability records kept up to date. This is what makes export and
                supermarket supply possible, and it protects you if a consignment is questioned.
              </li>
              <li>No use of unregistered or banned pesticides.</li>
              <li>Harvest hygiene and post-harvest handling to the standard we train on.</li>
            </ul>

            <h3>3.5 Certification and review</h3>
            <p>
              Certification is formalised after an assessment visit, an agreed crop plan, a
              good-agricultural-practice sign-off, and a signed off-take agreement. It is
              maintained through quarterly grading reviews and an annual re-audit. We may
              suspend certification where the agreed standards are not met, and will always
              tell you why and what needs to change.
            </p>

            <h3>3.6 Termination</h3>
            <p>
              Either party may end the agreement at the end of a season by giving written
              notice before the next planting. Immediate termination is available to either
              party for material breach, insolvency, or conduct that puts food safety at risk.
              Ending the agreement does not affect payment for produce already delivered.
            </p>

            <h2 id="payment-terms">4. Payment Terms</h2>

            <h3>4.1 Currency and taxes</h3>
            <p>
              All prices are quoted in Kenyan Shillings (KES) and are exclusive of VAT unless
              the quote states otherwise. VAT is charged at the prevailing statutory rate where
              applicable.
            </p>

            <h3>4.2 Accepted methods</h3>
            <ul>
              <li>
                <strong>M-Pesa</strong> — including the recurring weekly box billing, which is
                authorised by you through an STK push each cycle.
              </li>
              <li>
                <strong>Bank transfer</strong> — to the account on our invoice.
              </li>
              <li>
                <strong>Invoice on account</strong> — available to approved trade customers.
              </li>
              <li>Cash on delivery — small orders only, at our discretion.</li>
            </ul>

            <h3>4.3 Credit terms</h3>
            <p>
              Approved trade customers are invoiced on delivery with payment due within{' '}
              <strong>30 days</strong> of the invoice date. Household boxes and one-off bulk
              orders are payable on or before delivery unless credit has been agreed in writing.
            </p>

            <h3>4.4 Late payment</h3>
            <p>
              Overdue amounts may attract interest at the rate stated on the invoice and,
              where applicable, statutory commercial interest under Kenyan law. We will always
              contact you before applying any interest charge, and we would rather agree a
              payment plan with you than escalate.
            </p>

            <h3>4.5 Subscriptions</h3>
            <p>
              Weekly box subscriptions recur until cancelled. You may pause, change or cancel
              before the cut-off for the next cycle, and no further charge will be raised after
              cancellation. Failed M-Pesa authorisations are retried once, then the
              subscription is marked as needing your attention rather than silently lapsing.
            </p>

            <h3>4.6 Refunds</h3>
            <p>
              Where we owe you a credit it is applied to your next invoice, or paid out to you
              if you ask. Refunds of M-Pesa payments are sent back to the number that paid.
            </p>

            <h2 id="governing-law-kenya">5. Governing Law — Kenya</h2>
            <p>
              These terms, and any dispute arising from them, are governed by the laws of the
              Republic of Kenya.
            </p>
            <ul>
              <li>
                The parties submit to the exclusive jurisdiction of the courts of Kenya.
              </li>
              <li>
                Where a dispute is commercial in nature, the parties may agree to refer it to
                arbitration in Nairobi under the Nairobi Centre for International Arbitration
                rules.
              </li>
              <li>
                Nothing in this clause prevents either party from seeking urgent interim relief,
                including for perishable goods that must be dealt with immediately.
              </li>
              <li>
                If any provision of these terms is found to be unenforceable, the remaining
                provisions continue in full force.
              </li>
            </ul>

            <h3>Consumer protection</h3>
            <p>
              Nothing in these terms limits rights you have that cannot lawfully be limited
              under Kenyan consumer protection legislation.
            </p>

            <h3>Contact</h3>
            <p>
              Questions about these terms:{' '}
              <a href={SITE.emailHref}>{SITE.email}</a> · <a href={SITE.phoneHref}>{SITE.phone}</a>{' '}
              · {SITE.address.street}, {SITE.address.locality}, Kenya.
            </p>

            <p style={{ marginTop: 34 }}>
              See also our <Link href="/legal/privacy-policy">Privacy Policy</Link> and{' '}
              <Link href="/legal/cookie-policy">Cookie Policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
