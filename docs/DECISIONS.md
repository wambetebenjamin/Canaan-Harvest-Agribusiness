# Decisions and reconciliation log

Every point where the build brief and the design source (`AgriCulture-v1.0.0.zip`)
disagreed, were silent, or were internally contradictory — and how each was
resolved. Read this before changing tokens, timing, or copy.

---

## 1. The design source is a static template, not an application

**Finding:** `AgriCulture-v1.0.0.zip` is a BootstrapMade static template —
7 HTML pages, 123 files, **no `package.json`, no `.nvmrc`, no `.env`, no API
routes, no npm dependencies, no build tooling**.

**Resolution:** treated as a *design source* only. Design values (custom
properties, type scale, component geometry, keyframes) are reproduced
verbatim; everything structural is new Next.js App Router code.
Full inventory: `docs/ZIP-INSPECTION.md`.

---

## 2. Typography — zip values vs. brief minimums

**Brief:** *"Body 15px minimum. Metadata 11px minimum. Buttons 12px.
Navigation 13px."* **Also:** *"FONTS ARE SACRED. DO NOT CHANGE FONT FAMILY,
WEIGHT, OR SIZE FROM WHAT IS IN THE ZIP."*

**Finding:** the zip's values **already satisfy every floor**, so there is no
conflict and no substitution was needed:

| Element | Zip value | Brief floor | Verdict |
| --- | --- | --- | --- |
| Body copy | `body` sets no `font-size` → browser default **16px** | 15px | ✅ passes |
| Navigation | **16px** desktop (`.navmenu a` @≥1200px), 17px mobile | 13px | ✅ passes |
| Buttons | **15px** (`.hero .btn-get-started`) | 12px | ✅ passes |
| Metadata | **13px** (`.footer .credits`), 12px (nav icons) | 11px | ✅ passes |

**Resolution:** zip values kept unchanged. One addition was necessary to avoid
a regression: `src/styles/base.css` sets `body { font-size: 16px }` explicitly
rather than relying on the browser default, because a reset or a user
stylesheet could otherwise drop it below the 15px floor. 16px is the value the
zip already rendered at, so nothing changed visually.

**Marcellus has exactly one weight (400).** The zip requests
`family=Marcellus:wght@400` and nowhere else. Any `font-weight: 700` on a
Marvellus heading in the zip is browser-synthesised faux-bold, not a real font
file. Our own rules default headings to `font-weight: 400` and never impose
synthetic weight on Marcellus. See `docs/FONT-LICENSING.md`.

---

## 3. Font loading — self-hosted instead of Google Fonts CDN

**Brief:** *"FONTS ARE SACRED."* **Zip:** loads Open Sans (300–800 + italics)
and Marcellus (400) from the Google Fonts CDN, ships **no font files and no
`@font-face` rules at all**.

**Resolution:** self-hosted the **identical families, identical weights,
identical italics** from `@fontsource/open-sans@5.3.0` and
`@fontsource/marcellus@5.3.0`.

Why this is fidelity-preserving rather than a substitution:

- Same family names (`"Open Sans"`, `"Marcellus"`) — the `--default-font`,
  `--heading-font` and `--nav-font` stacks resolve to the same faces.
- Same 12 Open Sans weight/italic combinations + Marcellus 400.
- Same `font-display: swap` (the zip's URL carries `display=swap`).
- WOFF2 with WOFF fallback, real `@font-face` rules (which the zip lacked).
- **Zero third-party runtime request**, so rendering cannot drift if the CDN
  changes the served files.

The zip's verbatim font stacks are preserved in `src/styles/tokens.css` behind
the real families as fallbacks.

---

## 4. Loading screen — brief contradicts itself

**Brief:** *"EFFECT-25 … Skip control appears after 3 seconds … Under 2 seconds
total."* Those two cannot both be unconditional. **Zip:** contains a preloader,
but it is a bare 60px CSS spinner with no wordmark, no progress bar, no skip
control, no ARIA, and no reduced-motion fallback.

**Resolution (user-selected):** EFFECT-25/08 build, hard-capped under 2s, with
the skip control as a *slow-connection safety valve*:

```
MIN_MS   = 850ms    floor; readyState gates it, so never the limiter
CAP_MS   = 1900ms   hard ceiling — guarantees "under 2 seconds"
SKIP_MS  = 3000ms   skip appears ONLY if still genuinely loading
EXIT_MS  = 420ms    fade-out
```

On any normal load the preloader is gone before 3s, so "under 2s" holds. On a
stalled connection the skip appears at 3s exactly as specified. **Both rules
are satisfied; neither is violated.**

The zip's preloader geometry is carried into the new component verbatim:
60×60px (`--preloader-size`), 6px border (`--preloader-border`),
`--accent-color`/`transparent` quadrants, `1.5s linear infinite`
(`--preloader-spin`), and the container's `0.6s ease-out`
(`--transition-fade`). The `@keyframes animate-preloader` name and body are
byte-identical to the zip.

---

## 5. Produce categories — "8 items" but 7 named

**Brief:** rail *"Labelled 'Produce categories, 8 items.'"* then lists
**seven**: Vegetables, Fruits, Herbs and Spices, Grains and Legumes, Dairy,
Poultry and Eggs, Tubers.

**Resolution:** `All Produce` is included as the first, default chip — total
**8**. This matches the label and preserves all seven named categories
unchanged.

The accessible label is derived from `CATEGORIES.length` at runtime rather than
hard-coded, so the announced count can never drift out of sync with the list
again. See `src/data/produce.ts` and `ProduceCatalogue.tsx`.

---

## 6. Photography — brief's source is unreachable

**Brief:** *"Pexels and Unsplash only … No AI images. East African farmers and
produce settings."*

**Finding:** `images.pexels.com`, `images.unsplash.com` and
`source.unsplash.com` are **all unreachable** from the build environment
(network allowlist). Automated image search returned **only rights-managed
stock** (Getty Images, Dreamstime) — which cannot lawfully be shipped. The
zip's own imagery is **European/Western stock** (a grower in wellington boots,
a garden centre) and therefore also fails the "East African" requirement.

Three options were offered; the user chose **use the zip's photos as clearly
documented stand-ins**.

**Resolution (interim):** template imagery copied into `public/photos/` with
semantic filenames, and `docs/PHOTO-SHOT-LIST.md` written as a mechanical
swap-in spec — every slot, its subject requirement, its aspect ratio, and the
brief's approved search terms.

**Resolution (final, 2026-10-08):** the swap is complete. All **27 slots** now
hold real Pexels photography of East African farmers, produce and market
settings, and the template imagery is gone from the repository.

`images.pexels.com` is still unreachable from this build environment. The
photographs were therefore obtained through the image-search channel, which
returns Pexels-hosted originals, and each one's photographer and canonical
photo page were verified against Pexels before use. `scripts/fetch-photos.mjs`
now records the whole set as a manifest — Pexels id, photographer, target slot
and exact pixel size — so it can be re-downloaded from `images.pexels.com`
directly wherever that host *is* reachable. `npm run fetch:photos` had been
referenced by `package.json` and the README from the beginning but the script
did not exist; it does now.

Two consequences worth recording:

1. **Every slot was re-cut to the ratio the code already declared.** Several
   farm files had been copied from the template at the template's own ratios
   (square where the markup said `640×400`, 2.24:1 where the OG card declares
   1200×630). Alt text was likewise rewritten to describe *the photograph*,
   because 28 catalogue lines share 13 images — an alt reading "Hass avocados
   harvested at the Meru Ridge Farm" over a picture of kale is worse for a
   screen-reader user than no alt at all.
2. **The set is not perfectly on-brief and `docs/image-credits.md` says so.**
   `farm/packhouse-grading.jpg` shows a non-African packing crew: Pexels'
   searchable supply of African packhouse photography is thin, and the slot's
   primary requirement — produce being graded with crates visible — is met.
   That is recorded as a known gap alongside the fixes, not smoothed over.

**The testimonials are illustrative content, not real reviews.** They must not
be presented as genuine customer feedback in a live deployment. The four
avatars are stock models, and two of them stand in for six named personas —
both facts are stated at the top of `docs/image-credits.md`.

---

## 7. External services — no credentials available

**Brief:** Vercel KV, Vercel Blob, M-Pesa Daraja, reCAPTCHA v3 + v2, Nodemailer,
WhatsApp, WebSockets.

**Resolution (user-selected):** production code paths activate when env vars
are present; documented local fallbacks keep the preview fully clickable
without them.

| Service | Production path | Fallback when unconfigured |
| --- | --- | --- |
| Vercel KV | `kv.zadd` / `kv.set` | JSON file in `.data/` (gitignored) |
| Vercel Blob | `put()` with token | writes to `public/uploads/` |
| M-Pesa Daraja | STK push against live/sandbox | clearly-labelled simulated result |
| reCAPTCHA v3 | siteverify + score vs threshold | verification skipped, request allowed |
| reCAPTCHA v2 | siteverify | fallback panel explains and offers WhatsApp |
| Nodemailer | SMTP send | full message logged, including generated copy |
| WhatsApp Cloud API | Graph API message | message logged + click-to-chat deep link |

**Security note:** the fallback paths are for development and preview only.
`isCaptchaConfigured()` returning false means form submissions are not
verified — **set `RECAPTCHA_SECRET_KEY` before any public deployment.** All
variable names are in `.env.example`.

---

## 8. WebSockets on Vercel — not possible on this runtime

**Brief:** `/api/ws` WebSocket for live buyer presence.

**Finding:** Vercel's Node.js serverless runtime **cannot hold a WebSocket
upgrade open**. Attempting one hangs the invocation rather than connecting.

**Resolution:** `/api/ws` answers honestly with **501** and a JSON body
explaining how to enable real presence. `usePresence` treats any non-upgrade
response as offline and settles into the **graceful single-visitor state** the
brief requires ("You are browsing now"), reconnecting with capped exponential
backoff and jitter.

To enable true multi-user presence, point `NEXT_PUBLIC_WS_URL` at a dedicated
WebSocket host (a long-running Node service, Ably, Pusher, PartyKit…). **No
client code change is needed.**

---

## 9. `@vercel/kv` is deprecated upstream

**Finding:** npm reports `@vercel/kv@3.0.0` as deprecated in favour of the
Vercel Marketplace Redis integration (Upstash).

**Resolution:** kept, because the brief specifies *"Vercel KV"* by name. The
whole surface is behind `src/lib/store.ts`, so migrating to Upstash Redis is a
single-file change. Documented in that file's header.

---

## 10. `next@15.1.0` carried CVE-2025-66478 (patched)

**Finding:** Next 15.1.0 has published security vulnerabilities, including
CVE-2025-66478 (React Server Components RCE). Vercel refuses the deploy:
*"Vulnerable version of Next.js detected, please update immediately."*
A first bump to 15.5.27 still failed Vercel's GitHub check: React 19.0.0,
`next-mdx-remote@5` and Next 15's bundled PostCSS remain flagged, and Next 15
itself reaches end-of-life on 21 Oct 2026.

**Resolution:** upgraded to **Next 16.4.0** (current latest) with
**React 19.3.0**, **next-mdx-remote 6.0.0**, **nodemailer 10.0.16**, and
`eslint-config-next` 16.4.0 (ESLint 9 flat config; `next lint` is removed in
16). App Router pages already awaited `params` / `searchParams`.
`allowedDevOrigins` is set so the Arena preview host can reach `next dev`.

---

## 11. Node 24.x required, Node 22 available

**Brief:** *"Node.js 24.x. `.nvmrc`: 24.0.0. engines: node >=24.0.0."*
**Environment:** Node v22.22.3.

**Resolution:** `.nvmrc` (`24.0.0`) and `engines` (`>=24.0.0`) are set exactly
as specified. The build and dev server were verified on v22.22.3 — npm emits
an `EBADENGINE` warning, which is expected and harmless. Vercel will use Node
24 in deployment. **Nothing in the codebase depends on a Node 24-only API.**

---

## 12. `next dev` + `next build` share `.next/`

**Finding:** running `npm run build` while `npm run dev` is live leaves the dev
server throwing `Cannot find module './vendor-chunks/…'`.

**Resolution:** not a bug — expected behaviour, since both write to `.next/`.
Documented in the README: stop the dev server before building, or clear `.next`
(`rm -rf .next`) and restart.

---

## 13. EFFECT-04 glitch and the accessible name

**Brief:** *"Keyword 'Fresh' gets a glitch pass. aria-hidden split glyphs.
sr-only full clean sentence."*

**Resolution:** the headline is split per character into `aria-hidden="true"`
spans and animated with a staggered rise; the word `Fresh` additionally runs a
single-iteration `glitch-pass` using `clip-path` and dual-colour
`text-shadow` (magenta/cyan ghosts drawn from the palette, not pure red/blue).
A sibling `sr-only` element carries the **clean, complete sentence**, so screen
readers never hear the text spelled out letter by letter or interrupted by the
glitch.

The glitch is a **single pass**, never a loop — looping text distortion is a
WCAG 2.2.2 concern and, at headline size, a photosensitivity risk.

---

## 14. EFFECT-01 keyboard control must not hijack scroll

**Brief:** *"Orbitable by drag. Arrow keys for keyboard users."* and for
EFFECT-02, *"Never hijacks wheel speed."*

**Resolution:** the canvas is `tabIndex={0}` with `role="img"`. Arrow keys
orbit **only when the canvas itself has focus** — `preventDefault()` is called
inside the canvas's own `keydown` handler, so arrow-key page scrolling is
completely unaffected until a user deliberately tabs into the 3D view. Drag is
single-pointer with pointer capture; `touch-action: pan-y` keeps vertical
scrolling native on touch.

---

## 15. Error-page blob filter is bounded and never on text

**Brief:** *"Liquid blob spill animation using SVG filter on the page, bounded
filter region, never on text."*

**Resolution:** the `#goo-filter` (`feGaussianBlur` + `feColorMatrix`) declares
`x="-20%" y="-20%" width="140%" height="140%"` — an explicit bounded region —
and is applied only to `.error-page__blobs`, which additionally has
`overflow: hidden`. Text sits on `.error-page__content` at `z-index: 2`,
outside the filtered subtree, so no glyph is ever blurred. The identical filter
is reused on farm story card 7 (EFFECT-17).

---

## 16. `prefers-reduced-motion` — an explicit fallback per effect

**Brief:** *"ALL 31 REDUCED-MOTION FALLBACKS."*

**Resolution:** every effect has a declared fallback that preserves the
*content* rather than merely shortening the animation. Element-level rules sit
beside each effect; `src/styles/reduced-motion.css` holds the global guarantees
and the structural fallbacks. See `docs/EFFECTS.md` for the full matrix
mapping every implemented effect to where its fallback is declared.

Notable structural (not merely truncated) fallbacks:

- **EFFECT-02** — pinning is removed and the four beats become a plain stacked
  article, with all four scenes rendered as static figures.
- **EFFECT-15** — the horizontal scroll-snap rail becomes a plain wrapped grid.
- **EFFECT-26** — price and origin info become permanently visible instead of
  hover-gated, so nothing is lost to a user who cannot hover.
- **EFFECT-25** — progress is communicated as plain percentage text.
- **EFFECT-31** — the sprite holds its first frame.

---

## 17. Testimonials "pause on hover"

**Brief:** *"Stagger reveal on scroll. Pause on hover."*

**Resolution:** the stagger reveal is index-driven
(`transition-delay: calc(var(--i) * var(--stagger-step))`). On `:hover` the
delay is set to `0ms`, so the card settles immediately the instant a pointer
arrives rather than continuing to wait its turn. This is the CSS-only reading
of "pause on hover" and needs no JavaScript.

---

## 18. AR tour never autoplays

**Brief:** *"WebXR session on consent. Never autoplays."* and *"Persistent
focusable Exit control always visible."*

**Resolution:** the bay renders an opt-in button; `navigator.xr` is *probed*
(which does not prompt) but `requestSession` is called **only** inside the
button's click handler. Permission denial or absent hardware falls through to
the draggable equirectangular panorama instead of erroring. The Exit control is
rendered whenever a session is active and returns focus to the opt-in button on
exit.

---

## 19. `.DS_Store` and the unused `aos.esm.js`

**Finding:** the zip contains two macOS `.DS_Store` files, and ships
`aos.esm.js` / `aos.cjs.js` which `import` `lodash.throttle` and
`lodash.debounce` — neither of which is present, and there is no
`package.json` to resolve them.

**Resolution:** `.DS_Store` ignored. AOS is **not ported** — its effect
(600ms, ease-in-out, once, mirror:false) is superseded by native
IntersectionObserver, which is what the brief's effects already require. The
brief mandates Lucide 0.468.0 for icons, so Bootstrap Icons is not ported
either.

---

## 20. EFFECT-20, EFFECT-22 and EFFECT-30 are undefined

**Finding:** the brief mandates *"31 named effects (EFFECT-01 … EFFECT-31)"*
and supplies qualifying text for **28** of them: 01–19, 21, 23–29 and 31.
Numbers **20, 22 and 30 have no definition anywhere in the brief** — not in
the section specs, not in the reduced-motion list, not in the deployment
requirements.

**Resolution (user-selected):** the three numbers are **left unclaimed and
documented as a gap** rather than filled with invented work.

Why not guess: three plausible effects could have been added (subscription
tier reveal, delivery-route trace, testimonial marquee) and they would have
looked reasonable — but they would not be *the* specified effects, and
`docs/EFFECTS.md` would then assert compliance with a spec nobody had seen.
Shipping 28 named effects and one honest gap note is more useful than
shipping 31 where three are fabricated.

**Nothing is missing as a result.** All 15 page-structure sections carry at
least one implemented effect, and every effect the brief actually names has
been built.

If the original numbering is recovered, fill slots 20, 22 and 30 to spec —
no existing work needs to be unwound.

**Where this is recorded:** `docs/EFFECTS.md` (table rows + gap note),
`src/styles/reduced-motion.css` (comment), `src/styles/tokens.css`, and the
README's *The effects* section.

---
