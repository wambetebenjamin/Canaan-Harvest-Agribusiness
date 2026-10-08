'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/lib/icons';

/**
 * EFFECT-03 — WebXR AR farm tour with a 360° fallback.
 *
 * Consent model: nothing starts on its own. The bay renders an opt-in
 * button; a WebXR session is only requested after an explicit click, and
 * `navigator.xr` is probed first so unsupported browsers go straight to the
 * draggable panorama. An Exit control is always rendered and always
 * focusable while a session is active, and leaving the session returns
 * focus to the button that started it.
 *
 * Fallback: equirectangular farm photo dragged horizontally (pointer or
 * arrow keys), which is a genuine equirectangular projection of the scene.
 */

const PANO_SRC = '/photos/farm/farm-field-aerial.webp';

type Mode = 'idle' | 'pano' | 'xr';

export default function ARFarmTour() {
  const [mode, setMode] = useState<Mode>('idle');
  const [xrSupported, setXrSupported] = useState(false);
  const [panoramaX, setPanoramaX] = useState(50);
  const [error, setError] = useState<string | null>(null);

  const optInRef = useRef<HTMLButtonElement>(null);
  const panoRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const xrSession = useRef<XRSession | null>(null);

  /* Probe WebXR support without prompting. */
  useEffect(() => {
    const xr = (navigator as Navigator & { xr?: XRSystem }).xr;
    if (!xr?.isSessionSupported) return;
    xr.isSessionSupported('immersive-ar')
      .then((supported) => setXrSupported(supported))
      .catch(() => setXrSupported(false));
  }, []);

  /* ── Panorama drag (pointer) ──────────────────────────────────────────── */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    setPanoramaX((prev) => {
      // Wraps seamlessly around the full 360°.
      const next = prev - dx * 0.16;
      return ((next % 100) + 100) % 100;
    });
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragging.current = false;
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  }, []);

  /* ── Panorama keyboard control ────────────────────────────────────────── */
  const onPanoKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 12 : 4;
    if (e.key === 'ArrowLeft') {
      setPanoramaX((p) => (((p + step) % 100) + 100) % 100);
    } else if (e.key === 'ArrowRight') {
      setPanoramaX((p) => (((p - step) % 100) + 100) % 100);
    } else if (e.key === 'Home') {
      setPanoramaX(50);
    } else {
      return;
    }
    e.preventDefault();
  }, []);

  /* ── Enter the tour ───────────────────────────────────────────────────── */
  const enter = useCallback(async () => {
    setError(null);
    setMode('pano');

    if (!xrSupported) return;

    try {
      const xr = (navigator as Navigator & { xr?: XRSystem }).xr;
      if (!xr) return;

      // Requested only on this user gesture — never automatically.
      const session = await xr.requestSession('immersive-ar', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['hit-test', 'dom-overlay'],
        domOverlay: { root: document.body },
      });

      xrSession.current = session;
      setMode('xr');
      session.addEventListener('end', () => {
        xrSession.current = null;
        setMode('pano');
        optInRef.current?.focus();
      });
    } catch {
      // Permission denied or no AR hardware — the panorama stands in.
      setMode('pano');
      setError('AR is not available on this device, so the 360° farm view is shown instead.');
    }
  }, [xrSupported]);

  /* ── Exit the tour ────────────────────────────────────────────────────── */
  const exit = useCallback(() => {
    xrSession.current?.end().catch(() => {});
    xrSession.current = null;
    setMode('idle');
    optInRef.current?.focus();
  }, []);

  const inSession = mode !== 'idle';

  return (
    <section className="section light-background" id="ar-tour" aria-labelledby="ar-heading">
      <div className="container">
        <div className="section-title">
          <p className="eyebrow">Demo bay</p>
          <h2 id="ar-heading">Walk through a Canaan Farm in AR.</h2>
        </div>

        <div className="ar-bay">
          <div className="ar-bay__stage">
            {inSession ? (
              <>
                <div
                  className="ar-bay__pano"
                  ref={panoRef}
                  style={{ backgroundPosition: `${panoramaX}% 50%` }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  onKeyDown={onPanoKeyDown}
                  role="img"
                  tabIndex={0}
                  aria-label="360 degree view of a Canaan Harvest farm field. Drag, or use the left and right arrow keys, to look around."
                />
                <p className="ar-bay__hud">
                  <Icon name="compass" size={13} />
                  {mode === 'xr' ? 'AR session active' : '360° view · drag to look around'}
                </p>

                {/* Always present, always focusable while in session. */}
                <button
                  type="button"
                  className="btn btn-primary btn-sm ar-bay__exit"
                  onClick={exit}
                >
                  <Icon name="x" size={15} />
                  Exit farm tour
                </button>
              </>
            ) : (
              <div className="ar-bay__idle">
                <h3>See the fields before you buy</h3>
                <p>
                  Step onto the Nakuru highlands plots from wherever you are. Nothing starts until
                  you ask it to, and you can leave at any time.
                </p>
                <button
                  ref={optInRef}
                  type="button"
                  className="btn btn-primary"
                  onClick={enter}
                >
                  <Icon name="compass" size={17} />
                  Enter AR Farm Tour
                </button>
                <p className="ar-bay__notice">
                  {xrSupported
                    ? 'This device supports AR. You will be asked for camera permission.'
                    : 'This device will show the 360° farm view instead of AR.'}
                </p>
              </div>
            )}
          </div>

          {error && (
            <p className="ar-bay__notice" role="status" style={{ padding: '0 20px 16px' }}>
              <Icon name="info" size={13} /> {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
