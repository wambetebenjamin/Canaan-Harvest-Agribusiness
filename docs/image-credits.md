# Image credits and photo provenance

## ⚠️ Current status: TEMPORARY placeholder photography

**No photograph in this repository was sourced from Pexels or Unsplash.**
Every image in `public/photos/` is a placeholder taken from the design-source
template (`AgriCulture-v1.0.0.zip`) that this build was specified from.

This was a deliberate, disclosed decision — see the options considered in
`docs/DECISIONS.md`. The build brief specified *"Pexels and Unsplash only"*;
neither host was reachable from the build environment, and automated image
search returned only rights-managed stock (Getty / Dreamstime) which cannot
lawfully be shipped. Using the template's own licensed imagery as clearly
labelled stand-ins was chosen over shipping broken image slots.

**These images must be replaced before launch.** See
`docs/PHOTO-SHOT-LIST.md` for the exact slots, search terms and dimensions.

---

## Source and licence

All placeholder files originate from:

- **Template:** AgriCulture — `https://bootstrapmade.com/agriculture-bootstrap-website-template/`
- **Author:** BootstrapMade.com
- **Licence:** `https://bootstrapmade.com/license/`
- **Archive:** `AgriCulture-v1.0.0.zip` (6,516,036 bytes, 123 files)

Under the BootstrapMade licence the template's bundled images may be used
within a site built from the template. **They are not licensed for
redistribution as standalone stock photography.** If this repository is
published publicly, replace the images first — do not treat this directory as
an image library.

## Known content mismatch (material)

The template's photography is **European/Western stock imagery** — a grower in
wellington boots, a garden centre, a European kitchen garden. The build brief
specifies *"East African farmers and produce settings."*

The current placeholders therefore **do not meet the brief's subject-matter
requirement**, and no amount of careful cropping fixes that. They are
functional placeholders only. This is the single most important reason to
complete the photo swap before any public launch.

## AI-generated imagery

**None.** No AI-generated image appears anywhere in this project. Every raster
asset is a real photograph from the template archive, and every illustration
(seedling, mascot, isometric farm, doodles, sprite sheet, scenes) is
hand-authored SVG generated at build time by `scripts/make-sprite.mjs` or
written inline in `src/components/FarmEffects.tsx`.

---

## File-by-file mapping

### `public/photos/farm/`

| File | Original template path | Current subject |
| --- | --- | --- |
| `farm-field-aerial.webp` | `assets/img/page-title-bg.webp` | Aerial view of cultivated field rows |
| `field-rows.jpg` | `assets/img/img_long_5.jpg` | Grower holding a kale harvest |
| `farmer-harvest-kale.jpg` | `assets/img/img_sq_5.jpg` | Older grower smiling with a leafy harvest |
| `harvest-greens.jpg` | `assets/img/img_sq_6.jpg` | Hands holding freshly cut greens |
| `packhouse-grading.jpg` | `assets/img/img_sq_8.jpg` | People inspecting plants with a tablet |
| `seedling-nursery.jpg` | `assets/img/img_sq_3.jpg` | Person with a trolley among potted plants |
| `soil-cultivation.jpg` | `assets/img/img_sq_4.jpg` | Boots and a hoe working soil |
| `harvest-basket.jpg` | `assets/img/img_sq_1.jpg` | Grower holding a basket of vegetables |
| `seedlings-planted.jpg` | `assets/img/hero_1.jpg` | Person kneeling among young plants |
| `field-weeding.jpg` | `assets/img/hero_3.jpg` | Weeding a vegetable bed |

### `public/photos/produce/`

| File | Original template path | Current subject |
| --- | --- | --- |
| `chard-beetroot.jpg` | `assets/img/hero_2.jpg` | Chard and beetroot being carried |
| `fresh-leaves.jpg` | `assets/img/hero_4.jpg` | Hands cradling fresh leaves |
| `vegetable-basket.jpg` | `assets/img/hero_5.jpg` | Basket of mixed vegetables |

### `public/photos/people/`

| File | Original template path | Use |
| --- | --- | --- |
| `team-1.jpg` … `team-4.jpg` | `assets/img/team/team-1..4.jpg` | Team imagery (currently unused in pages) |
| `testimonial-1.jpg` … `testimonial-4.jpg` | `assets/img/testimonials/testimonials-1..4.jpg` | Testimonial avatars |

> **Note:** the testimonial avatars are attached to fictional East African
> chef and procurement personas in `src/data/content.ts`. Pairing European
> stock portraits with East African names is inaccurate and should be the
> **first** thing corrected. Until then, the avatars are placeholders, and the
> testimonials are illustrative content — they are **not** real customer
> reviews and must not be presented as such in a live deployment.

### `public/photos/blog/`

| File | Original template path |
| --- | --- |
| `blog-1.jpg` … `blog-6.jpg` | `assets/img/blog/blog-1..6.jpg` |

### Brand assets

| File | Original template path | Note |
| --- | --- | --- |
| `public/favicon.png` | `assets/img/favicon.png` | Generic template favicon — **replace with the Canaan Harvest mark** |
| `public/apple-touch-icon.png` | `assets/img/apple-touch-icon.png` | Generic template icon — **replace** |

> The template's `logo.png` was **not** copied. The Canaan Harvest wordmark and
> brand mark are hand-authored SVG (`src/components/WordmarkDraw.tsx`,
> `src/components/Header.tsx`) so the EFFECT-08 self-draw can measure real
> stroke lengths at runtime.

### Generated (not photographic)

| File | Generator | Frames |
| --- | --- | --- |
| `public/sprites/seed-growth-sprite.svg` | `node scripts/make-sprite.mjs` | 12 frames, 176 px each, single 2112×176 sheet |

---

## Replacing the images

1. Read `docs/PHOTO-SHOT-LIST.md` for every slot, its subject requirement and
   its aspect ratio.
2. Download replacements from Pexels or Unsplash — both permit commercial use
   without attribution, though attribution is recorded here as good practice.
3. Keep the filenames identical and the aspect ratios close; no code changes
   are then required.
4. Update the tables above with the new source URL and photographer.
5. Delete the "TEMPORARY placeholder photography" warning at the top of this
   file once every slot is replaced.

`next/image` remote patterns for `images.pexels.com` and
`images.unsplash.com` are already configured in `next.config.mjs`, so images
can also be served directly from those hosts during the transition.
