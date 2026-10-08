import type { Metadata } from 'next';
import Link from 'next/link';
import PageTitle from '@/components/PageTitle';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'The cookies Canaan Harvest Agribusiness uses, what each one does, and how to change or withdraw your consent.',
  alternates: { canonical: '/legal/cookie-policy' },
  openGraph: {
    title: 'Cookie Policy | Canaan Harvest Agribusiness',
    description: 'Necessary, functional and analytics cookies, and how to manage your consent.',
    url: `${SITE.url}/legal/cookie-policy`,
  },
};

export default function CookiePolicyPage() {
  return (
    <>
      <PageTitle
        title="Cookie Policy"
        subtitle="What we store on your device, why, and how to change your mind."
        breadcrumbs={[
          { href: '/legal/cookie-policy', label: 'Legal' },
          { href: '/legal/cookie-policy', label: 'Cookie Policy' },
        ]}
      />

      <section className="section">
        <div className="container">
          <div className="prose" style={{ margin: '0 auto' }}>
            <p className="meta-xs" style={{ marginBottom: 30 }}>
              Last updated: 7 October 2026 · Version 1.0
            </p>

            <p>
              Cookies and local storage let a website remember things between page loads. We
              keep ours deliberately small: nothing optional is set until you say yes, and you
              can change your choice at any time.
            </p>

            <h2>Categories we use</h2>
            <table>
              <caption className="sr-only">Cookie categories and their purpose</caption>
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Default</th>
                  <th scope="col">What it does</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Necessary</strong>
                  </td>
                  <td>Always on</td>
                  <td>
                    Records your cookie choice itself, keeps forms secure, remembers your
                    delivery zone check within a session, and holds items you add to your order
                    basket on this device. Without these the site cannot function.
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Functional</strong>
                  </td>
                  <td>Off until you opt in</td>
                  <td>
                    Remembers your preferred delivery area, produce categories and pack sizes,
                    so the catalogue opens where you left it rather than resetting each visit.
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Analytics</strong>
                  </td>
                  <td>Off until you opt in</td>
                  <td>
                    Anonymous, aggregated page and catalogue usage showing which produce buyers
                    are looking for. Used only to improve the site. We do not sell this data and
                    we do not use it for advertising.
                  </td>
                </tr>
              </tbody>
            </table>

            <h2>What we store</h2>
            <ul>
              <li>
                <strong>cookie-consent</strong> — your consent decision, with a version number
                and the date you made it, so we can show you the banner again if this policy
                changes. Stored in your browser&rsquo;s local storage.
              </li>
              <li>
                <strong>order basket</strong> — the produce items you have added to an order on
                this device. Necessary; cleared when you submit an order.
              </li>
              <li>
                <strong>reCAPTCHA</strong> — Google sets cookies when a form is protected by
                reCAPTCHA, to distinguish humans from automated submissions. These are set only
                on pages containing a protected form.
              </li>
              <li>
                <strong>Analytics cookies</strong> — set only after you opt in to Analytics.
              </li>
            </ul>

            <h2>Your choices</h2>
            <p>
              When you first visit you will see a banner offering{' '}
              <strong>Accept All</strong>, <strong>Manage Preferences</strong> and{' '}
              <strong>Reject Optional</strong>. Functional and Analytics are switched off by
              default and are only enabled by an explicit action from you.
            </p>
            <p>
              To change your mind, use the <strong>Cookie preferences</strong> control in the
              footer of any page, or clear cookies and local storage for this site in your
              browser settings. Withdrawing consent stops any further non-essential storage; it
              does not affect processing that already happened.
            </p>

            <h2>Third parties</h2>
            <p>
              We use Google reCAPTCHA on our forms, Google Maps for the Nairobi delivery zone
              map, and Vercel for hosting and storage. Each of these may set its own cookies
              when the relevant feature loads. We do not run third-party advertising on this
              site.
            </p>

            <h2>Kenya Data Protection Act 2019</h2>
            <p>
              This policy is written to meet the transparency and consent requirements of the
              Kenya Data Protection Act 2019. For how we handle personal data more broadly —
              including order data, farm partner data and delivery data — see our{' '}
              <Link href="/legal/privacy-policy">Privacy Policy</Link>. For the terms governing
              supply, see our <Link href="/legal/terms">Terms of Service</Link>.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about cookies:{' '}
              <a href={SITE.emailHref}>{SITE.email}</a> ·{' '}
              <a href={SITE.phoneHref}>{SITE.phone}</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
