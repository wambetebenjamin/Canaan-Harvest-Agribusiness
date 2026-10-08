'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NAV_LINKS } from '@/lib/site';
import { Icon } from '@/lib/icons';

/* EFFECT-28 — glassmorphic once scrolled past 80px. */
const GLASS_THRESHOLD = 80;
/* The design source's original .scrolled marker threshold, preserved. */
const SCROLLED_MARKER = 100;

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [scrolledMarker, setScrolledMarker] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /* EFFECT-10 — 'load' plays once, 'replay' re-runs on click. */
  const [drawState, setDrawState] = useState<'load' | 'replay'>('load');
  const markRef = useRef<SVGSVGElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* ── Scroll state ───────────────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > GLASS_THRESHOLD);
      setScrolledMarker(y > SCROLLED_MARKER);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── EFFECT-10 — measure the logo paths so stroke-dashoffset is exact ── */
  useEffect(() => {
    const svg = markRef.current;
    if (!svg) return;
    const measure = () => {
      svg.querySelectorAll<SVGGeometryElement>('path, circle, line').forEach((el) => {
        let len = 200;
        try {
          len = el.getTotalLength();
        } catch {
          /* keep fallback */
        }
        el.style.setProperty('--len', String(Math.ceil(len)));
      });
    };
    measure();
  }, []);

  /* ── Close the mobile panel on navigation ───────────────────────────── */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* ── Escape closes the panel; body scroll is locked while open ──────── */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  /* ── Close when the viewport grows to desktop width ─────────────────── */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1200px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const replayLogo = useCallback(() => {
    setDrawState('replay');
    const t = window.setTimeout(() => setDrawState('load'), 900);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <header
        className="header"
        id="header"
        data-scrolled={scrolled}
        data-scrolled-marker={scrolledMarker}
      >
        <div className="header__inner">
          {/* EFFECT-10 — accessible name "Canaan Harvest Home" */}
          <Link
            href="/"
            className="brand"
            aria-label="Canaan Harvest Home"
            data-draw={drawState}
            onClick={replayLogo}
          >
            <svg
              ref={markRef}
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
            <span className="brand__name">
              Canaan Harvest
              <span className="brand__name-small">Agribusiness · Kenya</span>
            </span>
          </Link>

          {/* Desktop navigation — EFFECT-11 icon animation on hover/focus */}
          <nav className="nav" aria-label="Primary">
            <ul className="nav__list">
              {NAV_LINKS.map((link) => {
                const active =
                  link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="nav__link"
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className="nav__icon">
                        <Icon name={link.icon} size={18} />
                      </span>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="header__cta">
            <Link href="/order" className="btn btn-primary">
              <Icon name="package" size={17} />
              Order Now
            </Link>
          </div>

          {/* Mobile toggle — EFFECT-21 doodle driven by aria-expanded */}
          <button
            ref={toggleRef}
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg
              className="nav-toggle__doodle"
              viewBox="0 0 30 30"
              aria-hidden="true"
              focusable="false"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Closed state: menu bars */}
                <line className="doodle-bar" x1="5" y1="10" x2="25" y2="10" />
                <line className="doodle-bar" x1="5" y1="15" x2="25" y2="15" />
                <line className="doodle-bar" x1="5" y1="20" x2="25" y2="20" />
                {/* Open state: sun, rain, sprout */}
                <circle className="doodle-sun" cx="8" cy="8" r="3.4" />
                <line className="doodle-sun" x1="8" y1="1.6" x2="8" y2="3.6" />
                <line className="doodle-sun" x1="8" y1="12.4" x2="8" y2="14.4" />
                <line className="doodle-sun" x1="1.6" y1="8" x2="3.6" y2="8" />
                <line className="doodle-rain" x1="16" y1="6" x2="14" y2="12" />
                <line className="doodle-rain" x1="21" y1="5" x2="19" y2="11" />
                <line className="doodle-rain" x1="26" y1="6" x2="24" y2="12" />
                <path className="doodle-sprout" d="M15 27 V 20" />
                <path className="doodle-sprout" d="M15 21 C 10 21, 8 18, 9 15 C 13 15, 15 18, 15 21 Z" />
                <path className="doodle-sprout" d="M15 22 C 20 22, 22 19, 21 16 C 17 16, 15 19, 15 22 Z" />
              </g>
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile panel */}
      <nav
        id="mobile-nav"
        className="nav-panel"
        data-open={menuOpen}
        aria-label="Mobile"
        aria-hidden={!menuOpen}
      >
        <ul style={{ listStyle: 'none' }}>
          {NAV_LINKS.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="nav-panel__link"
                  aria-current={active ? 'page' : undefined}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  {link.label}
                  <span className="nav__icon">
                    <Icon name={link.icon} size={16} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="nav-panel__cta">
          <Link
            href="/order"
            className="btn btn-primary btn-block"
            tabIndex={menuOpen ? 0 : -1}
          >
            <Icon name="package" size={17} />
            Order Now
          </Link>
        </div>
      </nav>
    </>
  );
}
