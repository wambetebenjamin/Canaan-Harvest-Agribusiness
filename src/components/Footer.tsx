import Link from 'next/link';
import { SITE } from '@/lib/site';
import { CATEGORIES } from '@/data/produce';
import { Icon, type LucideIconName } from '@/lib/icons';
import NewsletterForm from './NewsletterForm';
import CookiePreferencesButton from './CookiePreferencesButton';

const QUICK_LINKS: { href: string; label: string; icon: LucideIconName }[] = [
  { href: '/produce', label: 'Produce catalogue', icon: 'leaf' },
  { href: '/farm-stories', label: 'Farm stories', icon: 'tractor' },
  { href: '/order', label: 'Bulk orders', icon: 'package' },
  { href: '/order#subscription', label: 'Weekly boxes', icon: 'calendar' },
  { href: '/partnership', label: 'Farm partnership', icon: 'users' },
  { href: '/blog', label: 'Blog & farm news', icon: 'file-text' },
];

const LEGAL_LINKS = [
  { href: '/legal/privacy-policy', label: 'Privacy Policy', icon: 'shield' as LucideIconName },
  { href: '/legal/terms', label: 'Terms of Service', icon: 'file-text' as LucideIconName },
  { href: '/legal/cookie-policy', label: 'Cookie Policy', icon: 'shield' as LucideIconName },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer dark-background" id="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer__grid">
            {/* About + contact */}
            <div className="footer__about">
              <Link
                href="/"
                className="brand"
                aria-label="Canaan Harvest Home"
                style={{ marginBottom: 16 }}
              >
                <svg
                  className="brand__mark"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                  focusable="false"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="24" cy="24" r="21" />
                    <path d="M24 37 C 14 31, 12 17, 24 9 C 36 17, 34 31, 24 37 Z" />
                    <path d="M24 37 L 24 17" />
                  </g>
                </svg>
                <span className="brand__name">Canaan Harvest</span>
              </Link>

              <p>
                Certified fresh produce from our farms in Nakuru, Meru and Machakos, delivered to
                supermarkets, hotels, restaurants, export buyers and households across Nairobi.
              </p>

              <div className="footer__contact">
                <p>
                  <Icon name="map-pin" size={15} />
                  <span>
                    {SITE.address.street}, {SITE.address.locality}
                  </span>
                </p>
                <p>
                  <Icon name="phone" size={15} />
                  <a href={SITE.phoneHref}>{SITE.phone}</a>
                </p>
                <p>
                  <Icon name="message" size={15} />
                  <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer">
                    WhatsApp {SITE.whatsappDisplay}
                  </a>
                </p>
                <p>
                  <Icon name="mail" size={15} />
                  <a href={SITE.emailHref}>{SITE.email}</a>
                </p>
                <p>
                  <Icon name="clock" size={15} />
                  <span>Mon–Sat, 6:00am – 7:00pm</span>
                </p>
              </div>

              <div className="social-links">
                <a href={SITE.social.facebook} aria-label="Canaan Harvest on Facebook" target="_blank" rel="noopener noreferrer">
                  <Icon name="facebook" size={18} />
                </a>
                <a href={SITE.social.instagram} aria-label="Canaan Harvest on Instagram" target="_blank" rel="noopener noreferrer">
                  <Icon name="instagram" size={18} />
                </a>
                <a href={SITE.social.linkedin} aria-label="Canaan Harvest on LinkedIn" target="_blank" rel="noopener noreferrer">
                  <Icon name="linkedin" size={18} />
                </a>
                <a href={SITE.social.x} aria-label="Canaan Harvest on X" target="_blank" rel="noopener noreferrer">
                  <Icon name="twitter" size={18} />
                </a>
              </div>

              {/* M-Pesa + payment icons */}
              <div className="footer__payments" aria-label="Accepted payment methods">
                <span className="footer__pay footer__pay--mpesa">M-PESA</span>
                <span className="footer__pay">Bank transfer</span>
                <span className="footer__pay">Invoice 30d</span>
              </div>
            </div>

            {/* Produce categories */}
            <div className="footer-links">
              <h4>Produce</h4>
              <ul>
                {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/produce?category=${cat.id}`}>
                      <Icon name={cat.icon as LucideIconName} size={14} />
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick links */}
            <div className="footer-links">
              <h4>Company</h4>
              <ul>
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <Icon name={link.icon} size={14} />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter + legal */}
            <div className="footer-links">
              <h4>Harvest newsletter</h4>
              <p style={{ fontSize: 14, lineHeight: 1.65, marginBottom: 12 }}>
                Weekly availability, seasonal guides and delivery updates.
              </p>
              <NewsletterForm compact />

              <h4 style={{ marginTop: 26 }}>Legal</h4>
              <ul>
                {LEGAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <Icon name={link.icon} size={14} />
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <CookiePreferencesButton />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="copyright">
        <div className="container">
          <div className="footer__bottom">
            <div>
              <p>
                © {year} <strong>{SITE.name}</strong>. All rights reserved.
              </p>
              <div className="footer__legal">
                <span>Registered in Kenya</span>
                <span>Kenya Data Protection Act 2019 compliant</span>
              </div>
            </div>
            <div className="credits">
              Farms in Nakuru · Meru · Machakos · Deliveries across Nairobi
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
