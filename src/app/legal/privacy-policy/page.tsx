import type { Metadata } from 'next';
import Link from 'next/link';
import PageTitle from '@/components/PageTitle';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Canaan Harvest Agribusiness collects, uses, stores and protects personal data under the Kenya Data Protection Act 2019.',
  alternates: { canonical: '/legal/privacy-policy' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Privacy Policy | Canaan Harvest Agribusiness',
    description:
      'Order data, farm partner data, analytics, delivery data, your rights and how to contact us.',
    url: `${SITE.url}/legal/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageTitle
        title="Privacy Policy"
        subtitle="Prepared under the Kenya Data Protection Act 2019 and the General Data Protection Regulation where it applies."
        breadcrumbs={[
          { href: '/legal/privacy-policy', label: 'Legal' },
          { href: '/legal/privacy-policy', label: 'Privacy Policy' },
        ]}
      />

      <section className="section">
        <div className="container">
          <div className="prose" style={{ margin: '0 auto' }}>
            <p className="meta-xs" style={{ marginBottom: 30 }}>
              Last updated: 7 October 2026 · Version 1.0
            </p>

            <p>
              Canaan Harvest Agribusiness (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a fresh
              produce and agribusiness company registered in Kenya, operating farms in Nakuru,
              Meru and Machakos and delivering across Nairobi. This policy explains what
              personal data we collect, why we collect it, how long we keep it, and the rights
              you have over it.
            </p>
            <p>
              We are the data controller for the information described below. Our contact
              details are in the final section.
            </p>

            <h2 id="order-data">1. Order Data</h2>
            <p>
              When you place a bulk order, subscribe to a weekly box, or send an enquiry, we
              collect the information needed to fulfil that request:
            </p>
            <ul>
              <li>
                <strong>Business identity</strong> — the business or restaurant name, so that
                trade pricing, invoicing and credit terms are applied correctly.
              </li>
              <li>
                <strong>Contact details</strong> — contact name, phone number and email
                address, so we can confirm availability, agree a delivery window, and send your
                order confirmation.
              </li>
              <li>
                <strong>Order contents</strong> — the produce items, quantities, pack sizes and
                delivery frequency you request.
              </li>
              <li>
                <strong>Notes you provide</strong> — any grade standards, packaging,
                invoicing or access notes you choose to give us.
              </li>
            </ul>
            <p>
              <strong>Lawful basis:</strong> performance of a contract, and our legitimate
              interest in supplying the produce you have asked for.
              <br />
              <strong>Retention:</strong> order records are retained for seven years to satisfy
              Kenyan tax and accounting requirements. Enquiry records that do not become orders
              are retained for 24 months.
            </p>

            <h2 id="farm-partner-data">2. Farm Partner Data</h2>
            <p>
              If you apply to join our farming network we collect a different set of
              information, so that we can assess your farm and, if you are accepted, operate an
              off-take agreement:
            </p>
            <ul>
              <li>
                <strong>Farmer identity</strong> — your name and the county and ward where the
                farm is located.
              </li>
              <li>
                <strong>Farm characteristics</strong> — farm size in acres, crop types, and
                your water source.
              </li>
              <li>
                <strong>Contact details</strong> — phone number and email address.
              </li>
              <li>
                <strong>Farm photograph</strong> — a photo of the actual plot, uploaded to
                Vercel Blob storage. This is used only to assess the site before a field visit.
              </li>
              <li>
                <strong>Free-text notes</strong> — anything else you tell us about the farm.
              </li>
            </ul>
            <p>
              <strong>Lawful basis:</strong> your consent, given when you submit the
              application, and our legitimate interest in assessing suppliers.
              <br />
              <strong>Retention:</strong> applications that are not accepted are deleted after
              12 months. Data for accepted partners is retained for the life of the agreement
              plus seven years, to evidence traceability and meet audit requirements.
              <br />
              <strong>Special note:</strong> farm photographs are stored at a public URL so
              that they can be reviewed. Please do not upload images containing people&rsquo;s
              faces, identity documents, or anything you would not want publicly visible.
            </p>

            <h2 id="analytics">3. Analytics</h2>
            <p>
              We use privacy-respecting analytics to understand which produce buyers are
              looking for and whether the site is working properly. Analytics cookies are
              <strong> switched off until you opt in</strong> through our{' '}
              <Link href="/legal/cookie-policy">Cookie Policy</Link> banner or preferences
              panel.
            </p>
            <ul>
              <li>
                We record aggregate page and catalogue usage — which categories are browsed and
                which pages are visited.
              </li>
              <li>
                We do not sell, rent or trade personal data, and we do not use your data for
                third-party advertising.
              </li>
              <li>
                We do not attempt to identify you from analytics data, and we do not build
                advertising profiles.
              </li>
            </ul>
            <p>
              <strong>Lawful basis:</strong> consent, which you may withdraw at any time using
              the &ldquo;Cookie preferences&rdquo; control in the footer.
            </p>

            <h2 id="delivery-data">4. Delivery Data</h2>
            <p>
              To deliver produce we need to know where to take it and who to hand it to:
            </p>
            <ul>
              <li>
                <strong>Delivery address</strong> — the physical location for your order.
              </li>
              <li>
                <strong>Area and zone information</strong> — the estate or area you enter into
                our delivery zone checker, used solely to answer whether we cover you and what
                the lead time is.
              </li>
              <li>
                <strong>Preferred delivery day</strong> and, on our routes, the delivery
                window and driver assignment associated with your delivery.
              </li>
            </ul>
            <p>
              <strong>Lawful basis:</strong> performance of a contract.
              <br />
              <strong>Retention:</strong> delivery details are kept with the order record for
              seven years. Standalone zone-check lookups are not linked to your identity and
              are not retained.
              <br />
              <strong>Sharing:</strong> delivery information is visible to our own drivers and
              packhouse staff only. We do not pass addresses to third-party couriers without
              telling you first.
            </p>

            <h2 id="your-rights">5. Your Rights</h2>
            <p>
              Under the Kenya Data Protection Act 2019 you have the right to:
            </p>
            <ul>
              <li>
                <strong>Be informed</strong> — to know how your data is used, which this policy
                sets out.
              </li>
              <li>
                <strong>Access</strong> — to request a copy of the personal data we hold about
                you.
              </li>
              <li>
                <strong>Rectification</strong> — to have inaccurate or incomplete data
                corrected.
              </li>
              <li>
                <strong>Erasure</strong> — to ask us to delete your data where we no longer
                have a lawful reason to hold it. Note that we cannot delete records we are
                legally required to retain for tax purposes.
              </li>
              <li>
                <strong>Restrict processing</strong> — to ask us to stop using your data while
                a concern is investigated.
              </li>
              <li>
                <strong>Object</strong> — to object to processing carried out on the basis of
                legitimate interest.
              </li>
              <li>
                <strong>Data portability</strong> — to receive your data in a structured,
                commonly used, machine-readable format.
              </li>
              <li>
                <strong>Withdraw consent</strong> — at any time, where consent is the basis for
                processing. Withdrawing consent does not affect processing already carried out.
              </li>
              <li>
                <strong>Lodge a complaint</strong> — with the Office of the Data Protection
                Commissioner (ODPC), Kenya.
              </li>
            </ul>
            <p>
              We respond to rights requests within 30 days. We may ask you to verify your
              identity before acting, so that we do not disclose your data to someone else.
            </p>

            <h3>Security</h3>
            <p>
              Data is transmitted over HTTPS and stored in Vercel KV and Vercel Blob, which
              provide encryption at rest. Access is limited to staff who need it to fulfil your
              order or assess your application. We do not store card numbers — M-Pesa payments
              are handled entirely by Safaricom&rsquo;s Daraja platform, and we never see your
              M-Pesa PIN.
            </p>

            <h3>International transfers</h3>
            <p>
              Our hosting and storage providers may process data outside Kenya. Where that
              happens we rely on providers offering equivalent protections, and we remain
              accountable for your data under the Act.
            </p>

            <h3>Children</h3>
            <p>
              Our services are intended for businesses and adult households. We do not
              knowingly collect data from children.
            </p>

            <h3>Changes to this policy</h3>
            <p>
              If we change how we handle personal data we will update this page and revise the
              version number above. Material changes affecting existing customers will be sent
              by email.
            </p>

            <h2 id="contact">6. Contact</h2>
            <p>
              For any question about this policy, or to exercise a right described above:
            </p>
            <ul>
              <li>
                <strong>Email:</strong> <a href={SITE.emailHref}>{SITE.email}</a>
              </li>
              <li>
                <strong>Phone:</strong> <a href={SITE.phoneHref}>{SITE.phone}</a>
              </li>
              <li>
                <strong>WhatsApp:</strong>{' '}
                <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer">
                  {SITE.whatsappDisplay}
                </a>
              </li>
              <li>
                <strong>Post:</strong> {SITE.address.street}, {SITE.address.locality},{' '}
                {SITE.address.region}, Kenya
              </li>
            </ul>
            <p>
              If you are not satisfied with our response you may complain to the Office of the
              Data Protection Commissioner, Kenya.
            </p>

            <p style={{ marginTop: 34 }}>
              See also our <Link href="/legal/terms">Terms of Service</Link> and{' '}
              <Link href="/legal/cookie-policy">Cookie Policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
