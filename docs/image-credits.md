# Image credits and photo provenance

## ✅ Status: live Pexels photography

Every photograph in `public/photos/` is now a **real Pexels stock photo**
sourced from `images.pexels.com`. The previous BootstrapMade template
placeholders — European/Western stock imagery paired with East African personas
— have all been removed.

- **Source:** [Pexels](https://www.pexels.com/license/) — free to use, no
  attribution required, modification permitted.
- **Subject:** East, West and Southern African farmers, market traders, chefs
  and produce settings.
- **No AI-generated images.** Every raster file is a photograph.
- **No watermarked previews.** Each file was checked by eye before it was
  written (the 2026-10-08 contact-sheet review, see "Verification" below); two
  candidates that carried a stock-agency watermark were rejected and replaced.

> **Attribution is recorded here as good practice even though the Pexels licence
> does not require it.** Adding it to the deployed site is optional.

---

## Verification performed

1. Every downloaded candidate was opened and looked at. Brave/Bing image search
   returns thumbnails whose captions frequently do not match the picture
   actually returned (three candidates captioned "African woman farmer" were a
   shirtless man with a hoe, a California strawberry field and two wine
   glasses). Twelve candidates were discarded on sight for this reason.
2. A contact sheet of all 27 final files was rendered and reviewed at
   `scale 250px` per cell (`/tmp/final3.png` during the build session) and every
   slot was confirmed to match its filename and purpose.
3. Crops, aspect ratios and byte sizes were verified against the table in
   `docs/PHOTO-SHOT-LIST.md`.

---

## File-by-file mapping

`ID` is the Pexels photo number — `https://www.pexels.com/photo/<slug>-<ID>/`.
Where a row says **confirm**, the file is definitely a Pexels photo (it was
served from `images.pexels.com`) but the exact photo page could not be
re-resolved from the build sandbox, which cannot reach pexels.com directly.
Confirm those IDs from the running site before publishing an attribution block.

### `public/photos/farm/`

| File | Pexels ID | Subject | Photographer |
| --- | --- | --- | --- |
| `farm-field-aerial.webp` | **30255135** | Aerial view of farmlands and road, **Mau Narok, Nakuru County, Kenya** | **Vince Pictures** |
| `field-rows.jpg` | **28144221** | Vibrant green crop rows, early morning | — |
| `farmer-harvest-kale.jpg` | **15897037** | Smiling woman harvesting with a basket on her back | **Safari Consoler** |
| `harvest-greens.jpg` | **15897036** | Woman harvesting cassava leaves in a sunny field | **Safari Consoler** |
| `packhouse-grading.jpg` | **11196879** | Two men filling sacks with harvested crops | — |
| `seedling-nursery.jpg` | **7457205** | Seedlings in soil-filled nursery trays | — |
| `soil-cultivation.jpg` | **11350430** | Group of farmers working the soil with manual tools | — |
| `harvest-basket.jpg` | **33706309** | Woven basket of freshly harvested vegetables and fruit | — |
| `seedlings-planted.jpg` | **11211022** | Two women kneeling and planting in a rural field | — |
| `field-weeding.jpg` | **12638149** | Woman in traditional dress working a Gambian farm field | — |

### `public/photos/produce/`

| File | Pexels ID | Subject |
| --- | --- | --- |
| `chard-beetroot.jpg` | **12955498** | Market close-up of lettuce, greens and beetroot |
| `fresh-leaves.jpg` | **2095569** | Fresh green leafy vegetables on display |
| `vegetable-basket.jpg` | **7658789** | Hands holding a basket of tomatoes, peppers, cucumber and celery — **hero 3D fallback poster** |

### `public/photos/people/`

| File | Pexels ID | Subject | Used by |
| --- | --- | --- | --- |
| `testimonial-1.jpg` | **37118121** | African woman in a grey blazer | Alice Wanjiru, Amina Hassan |
| `testimonial-2.jpg` | **14621560** | Three chefs cooking over open flame, Uganda | Samuel Otieno |
| `testimonial-3.jpg` | **34928339** | African woman in a black suit | Grace Nyambura, Faith Mwikali |
| `testimonial-4.jpg` | **33993456** | Smiling farmer in a cap, Nigeria | Peter Kilonzo |
| `team-1.jpg` | **36551042** | Woman smiling at an office desk | (unused) |
| `team-2.jpg` | confirm | Woman in a headwrap in a village setting | (unused) |
| `team-3.jpg` | **12683835** | Woman in vibrant dress and headwrap in a Nigerian field | (unused) |
| `team-4.jpg` | **10988584** | Farmer working a field with a hoe | (unused) |

> The testimonial portraits are **stock photos of people who are not the named
> individuals**. The personas in `src/data/content.ts` are fictional and the
> testimonials are illustrative copy — do not present them as real customer
> reviews. Alt text describes what each photo shows, not the persona name.

### `public/photos/blog/`

| File | Pexels ID | Subject |
| --- | --- | --- |
| `blog-1.jpg` | **27874900** | Woman at a market stall of fresh produce, Ife, Nigeria |
| `blog-2.jpg` | **10041323** | Stacked crates of freshly harvested produce |
| `blog-3.jpg` | **26587857** | Plate of cooked greens with meat and maize meal |
| `blog-4.jpg` | **37345040** | Farmers working the soil with hand tools |
| `blog-5.jpg` | **34182300** | Sprinklers irrigating a green field |
| `blog-6.jpg` | **14621560** | Chefs cooking over open flame, Uganda |

### Brand assets

| File | Source |
| --- | --- |
| `public/favicon.png`, `apple-touch-icon.png`, `icons/*` | Generated by `scripts/make-icons.mjs` from the hand-authored Canaan Harvest mark — **not** stock |
| `public/sprites/seed-growth-sprite.svg` | Generated by `scripts/make-sprite.mjs` — **not** stock |

---

## Resolution note

The build sandbox cannot open a direct connection to `images.pexels.com`
(egress allowlist: github.com, npm, PyPI only). The photos were therefore
retrieved through the search index, and Pexels serves those at **500–1050 px on
the long edge**. That is comfortable at the sizes this site actually renders
(hero poster 560 px, cards ~400 px) but it caps how large the images can be
enlarged. If you later want 2× print-grade sources, download the same Pexels IDs
above at full size and drop them in with the same filenames — no code changes
are needed.

---

## Replacing or adding images

1. `docs/PHOTO-SHOT-LIST.md` lists every slot with its subject and aspect ratio.
2. Download from Pexels (or Unsplash — `next.config.mjs` already allowlists both
   hosts) keeping the filename identical; no code changes are then required.
3. Add the photo ID and photographer to the tables above.
4. Check the image with your eyes before committing — captions lie.
