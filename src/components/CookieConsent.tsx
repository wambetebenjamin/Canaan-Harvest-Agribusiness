'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/lib/icons';

/**
 * Cookie consent — banner + preferences modal.
 *
 * Kenya Data Protection Act 2019 compliance notes:
 *  • Necessary cookies are strictly locked and cannot be disabled.
 *  • Functional and Analytics default to OFF and require an explicit
 *    affirmative action (no pre-ticked optional categories).
 *  • "Accept All" and the granular "Save Preferences" path are equally
 *    prominent; refusing is as easy as accepting.
 *  • Consent is stored in localStorage with a timestamp and version so it
 *    can be re-sought if the policy changes, and withdrawn at any time via
 *    the footer "Cookie preferences" control.
 *  • No non-essential script is loaded before consent is recorded.
 *
 * The banner does not repeat once a decision is stored, and is not shown at
 * all during SSR to avoid a flash before hydration.
 */

const STORAGE_KEY = 'canaan-harvest:cookie-consent';
const CONSENT_VERSION = 1;

export interface ConsentState {
  version: number;
  necessary: true;
  functional: boolean;
  analytics: boolean;
  decidedAt: string;
}

type CategoryId = 'necessary' | 'functional' | 'analytics';

const CATEGORIES: {
  id: CategoryId;
  name: string;
  description: string;
  locked?: boolean;
}[] = [
  {
    id: 'necessary',
    name: 'Necessary',
    description:
      'Required for the site to work: your cookie choice, form security, delivery-zone lookups and the shopping basket on this device. These cannot be switched off.',
    locked: true,
  },
  {
    id: 'functional',
    name: 'Functional',
    description:
      'Remember your preferred delivery area, produce categories and pack sizes so the catalogue opens where you left it.',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description:
      'Anonymous, aggregated page and catalogue usage that tells us which produce buyers are looking for. Used only to improve the site.',
  },
];

function readConsent(): ConsentState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed?.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeConsent(state: ConsentState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage may be unavailable in private mode — fail quietly */
  }
}

/** Public helper so other components can gate non-essential behaviour. */
export function hasConsent(category: 'functional' | 'analytics'): boolean {
  if (typeof window === 'undefined') return false;
  const state = readConsent();
  return Boolean(state?.[category]);
}

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [functional, setFunctional] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  /* Never render on the server — avoids a flash before hydration. */
  useEffect(() => {
    setMounted(true);
    const existing = readConsent();
    if (existing) {
      setFunctional(existing.functional);
      setAnalytics(existing.analytics);
      return;
    }
    // Small delay so the banner does not compete with first paint.
    const t = window.setTimeout(() => setVisible(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  /* Allow re-opening from anywhere (footer control). */
  useEffect(() => {
    const open = () => {
      const existing = readConsent();
      if (existing) {
        setFunctional(existing.functional);
        setAnalytics(existing.analytics);
      }
      setVisible(true);
      setModalOpen(true);
    };
    window.addEventListener('canaan-harvest:cookie-preferences', open);
    return () => window.removeEventListener('canaan-harvest:cookie-preferences', open);
  }, []);

  /* Modal: focus management + Escape + scroll lock. */
  useEffect(() => {
    if (!modalOpen) return;
    lastFocused.current = document.activeElement as HTMLElement;

    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    focusables?.[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      lastFocused.current?.focus();
    };
  }, [modalOpen]);

  const persist = useCallback((next: { functional: boolean; analytics: boolean }) => {
    const state: ConsentState = {
      version: CONSENT_VERSION,
      necessary: true,
      functional: next.functional,
      analytics: next.analytics,
      decidedAt: new Date().toISOString(),
    };
    writeConsent(state);
    setFunctional(next.functional);
    setAnalytics(next.analytics);
    setModalOpen(false);
    setVisible(false);
    window.dispatchEvent(new CustomEvent('canaan-harvest:consent-changed', { detail: state }));
  }, []);

  const acceptAll = useCallback(() => {
    persist({ functional: true, analytics: true });
  }, [persist]);

  const rejectOptional = useCallback(() => {
    persist({ functional: false, analytics: false });
  }, [persist]);

  const savePreferences = useCallback(() => {
    persist({ functional, analytics });
  }, [persist, functional, analytics]);

  if (!mounted) return null;
  /* Nothing to show: no decision pending and the modal is closed. */
  if (!visible && !modalOpen) return null;

  return (
    <>
      {/* ── Banner ───────────────────────────────────────────────────── */}
      <div
        className="cookie-banner"
        data-visible={visible && !modalOpen}
        role="region"
        aria-label="Cookie consent"
      >
        <div className="cookie-banner__inner">
          <p className="cookie-banner__text">
            Canaan Harvest uses cookies to personalise your produce browsing and improve your
            experience. See our{' '}
            <Link href="/legal/cookie-policy">Cookie Policy</Link>.
          </p>
          <div className="cookie-banner__actions">
            <button type="button" className="btn btn-primary btn-sm" onClick={acceptAll}>
              Accept All
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setModalOpen(true)}
            >
              Manage Preferences
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={rejectOptional}>
              Reject Optional
            </button>
          </div>
        </div>
      </div>

      {/* ── Preferences modal ────────────────────────────────────────── */}
      {modalOpen && (
        <div
          className="consent-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-title"
        >
          <div className="consent-modal__panel" ref={panelRef}>
            <h2 id="consent-title">Cookie preferences</h2>
            <p className="consent-modal__intro">
              You choose what we may store on your device. Necessary cookies keep the site and
              its forms working; everything else is optional and starts switched off. You can
              change this at any time from the footer.
            </p>

            {CATEGORIES.map((cat) => {
              const checked = cat.id === 'necessary' ? true : cat.id === 'functional' ? functional : analytics;
              const toggle = () => {
                if (cat.locked) return;
                if (cat.id === 'functional') setFunctional((v) => !v);
                if (cat.id === 'analytics') setAnalytics((v) => !v);
              };
              return (
                <div className="consent-row" key={cat.id}>
                  <div className="consent-row__copy">
                    <p className="consent-row__name" id={`consent-${cat.id}-name`}>
                      {cat.name}
                      {cat.locked && (
                        <span className="consent-row__lock">
                          <Icon name="lock" size={11} />
                          Always on
                        </span>
                      )}
                    </p>
                    <p className="consent-row__desc">{cat.description}</p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    aria-disabled={cat.locked || undefined}
                    aria-labelledby={`consent-${cat.id}-name`}
                    className="consent-switch"
                    onClick={toggle}
                    disabled={cat.locked}
                  >
                    <span className="sr-only">
                      {cat.locked
                        ? `${cat.name} cookies are always enabled`
                        : `Toggle ${cat.name} cookies`}
                    </span>
                  </button>
                </div>
              );
            })}

            <div className="consent-modal__actions">
              <button type="button" className="btn btn-primary" onClick={acceptAll}>
                Accept All
              </button>
              <button type="button" className="btn btn-outline" onClick={savePreferences}>
                Save Preferences
              </button>
              <button type="button" className="btn btn-ghost" onClick={rejectOptional}>
                Reject Optional
              </button>
            </div>

            <p className="consent-modal__foot">
              Read our <Link href="/legal/cookie-policy">Cookie Policy</Link> and{' '}
              <Link href="/legal/privacy-policy">Privacy Policy</Link>, both prepared under the
              Kenya Data Protection Act 2019.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
