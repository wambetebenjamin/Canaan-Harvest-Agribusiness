# Canaan Harvest Agribusiness

Fresh produce, farm-to-table. Farms in Nakuru, Meru and Machakos; deliveries
across Nairobi. Built for bulk buyers — supermarkets, hotels, restaurants and
exporters — plus household subscription boxes and off-take agreements for
farmers.

**Next.js 16.4.0 App Router · TypeScript · Node 24.x · Vercel**

---

## Quick start

```bash
npm install
cp .env.example .env.local     # optional — every route has a working fallback
npm run dev                    # http://localhost:3000
```

> **Do not run `npm run build` while `npm run dev` is live.** Both write to
> `.next/`, and the build will break the running dev server. Stop the dev
> server first, or `rm -rf .next` and restart. See `docs/DECISIONS.md` §12.

```bash
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
npm run fetch:photos   # helper for the image swap (see docs)
```

### Environment

Every integration is optional. With no `.env.local` the site is fully
clickable: orders persist to `.data/*.json`, uploads go to `public/uploads/`,
M-Pesa returns a clearly-labelled simulated result, and email/WhatsApp messages
are logged to the console. All variable names are documented in
`.env.example`.

**Set `RECAPTCHA_SECRET_KEY` before any public deployment** — without it, form
submissions are not verified.

---

## Design source

All design values are transcribed from `AgriCulture-v1.0.0.zip`
(BootstrapMade *AgriCulture*, Aug 07 2024, Bootstrap 5.3.3).

- **All 15 CSS custom properties** are reproduced **verbatim** in
  `src/styles/tokens.css` — byte-identical, including the double space inside
  the font stacks and the original inline comments.
- **Fonts are unchanged.** Open Sans 300–800 + all six italics, and Marcellus
  400, self-hosted from `@fontsource` (the zip loaded them from the Google
  Fonts CDN and shipped no font files). Same families, weights, sizes and
  `font-display`.
- The zip's typographic scale (48/42/32/30/28/26/24/22/20/18/17/16/15/14/13/12px),
  component geometry, colour-mix derivation technique and hero keyframes are
  all preserved.

Full inventory: **`docs/ZIP-INSPECTION.md`**
Reconciliation log: **`docs/DECISIONS.md`**
Typography provenance: **`docs/FONT-LICENSING.md`**

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx              fonts, metadata, JSON-LD, chrome
│   ├── page.tsx                home
│   ├── produce/                ISR 300, Product JSON-LD per item
│   ├── farm-stories/
│   ├── order/                  SSR (force-dynamic)
│   ├── partnership/
│   ├── contact/                zone checker + Maps embed
│   ├── blog/ + blog/[slug]/    MDX articles, Article JSON-LD
│   ├── legal/                  privacy-policy · terms · cookie-policy
│   ├── api/                    see route table below
│   ├── not-found.tsx           404 — EFFECT-17
│   ├── error.tsx               500 — branded
│   ├── global-error.tsx        root boundary (inline styles)
│   ├── sitemap.ts · robots.ts
│   └── globals.css
├── components/                 19 components, one concern each
├── data/                       produce · content · delivery-zones.json
├── hooks/                      usePresence (EFFECT-05)
├── lib/                        site · icons · blog · store · mail ·
│                               whatsapp · blob · mpesa · recaptcha ·
│                               captcha-server · submit · codes
└── styles/                     11 stylesheets + tokens
content/blog/                   6 MDX articles
public/photos/                  placeholder imagery — see image-credits.md
public/favicon.svg · icons/     brand icons + wordmark.svg
scripts/make-sprite.mjs         generates the EFFECT-31 sprite sheet
scripts/make-icons.mjs          generates favicon, touch icon, maskable icon
docs/                           see documentation index below
```

### Regenerating assets

```bash
node scripts/make-icons.mjs     # favicon.svg/png, apple-touch-icon, icon-512, wordmark.svg
node scripts/make-sprite.mjs    # EFFECT-31 stop-motion sprite sheet
```

Both are deterministic and write into `public/`; the outputs are committed so a
plain `npm install && npm run build` needs neither.

---

## API routes

| Route | Method | Purpose | Persists to |
| --- | --- | --- | --- |
| `/api/bulk-order` | POST | Order intake, reCAPTCHA, WhatsApp + email | KV `orders` |
| `/api/subscription` | POST | Weekly box signup, M-Pesa Daraja STK push | KV `subscriptions` |
| `/api/subscription/callback` | POST | Safaricom payment callback | KV `subscriptions` |
| `/api/farm-partner` | POST | Partner application | KV `partners` |
| `/api/upload` | POST | Farm photo → Vercel Blob | Blob / `public/uploads` |
| `/api/contact` | POST | Enquiry via Nodemailer | KV `enquiries` |
| `/api/newsletter` | POST | Newsletter signup, deduped case-insensitively | KV `newsletter` |
| `/api/zone` | POST/GET | Delivery zone checker | KV or bundled JSON |
| `/api/blog` | GET | `?slug=` single article, else index | MDX files |
| `/api/captcha` | GET/POST | Standalone reCAPTCHA verification | — |
| `/api/ws` | GET | Presence capability probe (501 on Vercel) | — |

All routes are `runtime = 'nodejs'`. See `docs/DECISIONS.md` §7–8 for the
fallback behaviour and the WebSocket deployment note.

---

## The effects

**28 are implemented: 01–19, 21, 23–29 and 31.** Every one has an explicit
reduced-motion fallback that preserves content rather than merely shortening
the animation. Numbers 20, 22 and 30 are not defined in the brief and are left
unclaimed — see §20 below.

**Full matrix: `docs/EFFECTS.md`**

Highlights:

- **EFFECT-01** — real WebGL produce basket (Three.js), drag-orbit, arrow keys
  when focused, poster fallback under reduced-motion or without WebGL.
- **EFFECT-02** — IntersectionObserver scrollytelling. Wheel speed is never
  hijacked; flattens to a stacked article under reduced-motion.
- **EFFECT-08 / 25** — self-drawing wordmark with stroke lengths measured at
  runtime via `getTotalLength()` / `getComputedTextLength()`, inside a seedling
  preloader capped under 2 seconds.
- **EFFECT-17** — bounded SVG goo filter, shared between farm card 7 and the
  404 page. Never applied to text.
- **EFFECT-28** — glass on scroll past 80px, blur capped at 20px, solid
  fallback via `@supports`.

---

## Accessibility

- Skip link, landmark structure, one `h1` per page.
- **EFFECT-04** split glyphs are `aria-hidden`; an `sr-only` element carries
  the clean full sentence.
- Focus rings use a solid outline **plus** an inset-capable halo so they stay
  visible over `backdrop-filter` blur.
- Touch targets: `--tap-min: 48px` enforced on every interactive element.
- Form errors use `aria-invalid` + `role="alert"`, and focus moves to the first
  invalid field.
- Cookie consent: necessary locked, optional categories default **off**, no
  pre-ticked boxes, withdrawable from the footer (Kenya DPA 2019).
- Every effect has a reduced-motion fallback, reinforced by a blanket policy
  rule in `src/styles/reduced-motion.css` so a newly added animation cannot
  escape it.

---

## Responsive

Verified at **1440 / 1024 / 768 / 390 / 320 px**.

| Element | Behaviour |
| --- | --- |
| Produce grid | 4 columns → 2 → 1 |
| Category rail | scroll-snap → wrapped grid under reduced-motion |
| Bulk order form | two columns → single column |
| Farm gallery | 3 → 2 (tablet) → 1 (mobile) |
| Footer | 4 columns → 2 → single column |
| Nav | desktop links vanish below 1200px, doodle toggle appears |

---

## Documentation index

| Document | Contents |
| --- | --- |
| `docs/ZIP-INSPECTION.md` | Full file tree, all 15 custom properties verbatim, font inventory, preloader timing, and confirmation of what the zip does *not* contain (cookie banner, CAPTCHA, legal pages, 404/500, API routes, package versions, env vars). |
| `docs/DECISIONS.md` | 19 reconciliation points where brief and design source disagreed. **Read this first.** |
| `docs/EFFECTS.md` | Every implemented effect with its reduced-motion fallback and file ownership, plus the 20/22/30 gap note. |
| `docs/FONT-LICENSING.md` | Font provenance, OFL licensing, and why Marcellus 400-only matters. |
| `docs/PHOTO-SHOT-LIST.md` | Every image slot, subject requirement, aspect ratio and the brief's search terms. |
| `docs/image-credits.md` | **Photography is temporary placeholder material.** Provenance, licence and the known mismatch. |

---

## ⚠️ Before production

1. **Replace the photography.** Current images are template placeholders with
   European subjects and do not meet the brief's "East African farmers and
   produce settings" requirement. Start with the testimonial avatars — European
   portraits are currently attached to East African personas.
2. **Replace the testimonials** or confirm they are genuine. They are currently
   illustrative content, not real customer reviews.
3. **Set `RECAPTCHA_SECRET_KEY`** — without it, forms are unverified.
4. **Wire the real integrations** — Vercel KV, Blob, Daraja, SMTP, WhatsApp
   Business. See `.env.example`.
5. **For live buyer presence**, point `NEXT_PUBLIC_WS_URL` at a dedicated
   WebSocket host. See `docs/DECISIONS.md` §8.

> The favicon, Apple touch icon, maskable PWA icon and `wordmark.svg` are
> **already bespoke** — generated from the Canaan Harvest mark by
> `node scripts/make-icons.mjs`, replacing the template's generic "B" icons.
> Re-run that script after editing the brand mark geometry in
> `WordmarkDraw.tsx` so the two stay in sync.

---

© Canaan Harvest Agribusiness. Registered in Kenya.
