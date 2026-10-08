# Font licensing and delivery

## The constraint

The build brief states: *"FONTS ARE SACRED. DO NOT CHANGE FONT FAMILY, WEIGHT,
OR SIZE FROM WHAT IS IN THE ZIP."*

## What the design source actually does

`AgriCulture-v1.0.0.zip` **ships no font files and declares no `@font-face`
rules for either brand font.** Verified:

```
grep -r "@font-face" --include="*.css" .   →  bootstrap-icons.css,
                                              bootstrap-icons.min.css,
                                              swiper-bundle.min.css   (third-party only)

find . -type f \( -iname "*.woff*" -o -iname "*.ttf" -o -iname "*.otf" \)
                                           →  bootstrap-icons woff/woff2 only
```

Both families load from the Google Fonts CDN via a single `<link>` in the
`<head>` of all seven pages:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Marcellus:wght@400&display=swap" rel="stylesheet">
```

## The families and weights requested

| Family | Weights | Italics | Role in the design source |
| --- | --- | --- | --- |
| **Open Sans** | 300, 400, 500, 600, 700, 800 | 300i, 400i, 500i, 600i, 700i, 800i | `--default-font` — all body copy |
| **Marcellus** | **400 only** | none | `--heading-font` and `--nav-font` |

`display=swap` is set on the request.

## How this project delivers them

Self-hosted from npm packages that ship the **same upstream font files**:

| Package | Version | Files |
| --- | --- | --- |
| `@fontsource/open-sans` | 5.3.0 | 240 font files (WOFF2 + WOFF) |
| `@fontsource/marcellus` | 5.3.0 | WOFF2 + WOFF, 400 only |

Imported in `src/app/layout.tsx` as CSS, one import per weight and italic:

```ts
import '@fontsource/open-sans/300.css';
import '@fontsource/open-sans/300-italic.css';
/* … through 800-italic … */
import '@fontsource/marcellus/400.css';
```

This produces **122 real `@font-face` rules** carrying the same family names,
the same weights, the same italics, `font-display: swap`, WOFF2 with a WOFF
fallback, and `unicode-range` subsetting per script.

### Why this preserves fidelity

| Requirement | Zip | This build |
| --- | --- | --- |
| Family name | `"Open Sans"`, `"Marcellus"` | identical |
| Open Sans weights | 300–800 | 300–800 |
| Open Sans italics | all six | all six |
| Marcellus weights | 400 | 400 |
| `font-display` | `swap` | `swap` |
| Formats | CDN-served WOFF2 | WOFF2 + WOFF |
| `@font-face` rules | **none (CDN-injected)** | **explicit, in the bundle** |
| Third-party runtime request | yes (Google) | **none** |

Rendering cannot drift, because the files are pinned in `package-lock.json`
rather than fetched from a CDN whose served files can change.

The zip's verbatim font stacks remain in `src/styles/tokens.css` as fallbacks
behind the real families — including the original double space:

```css
--default-font: "Open Sans",  system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
--heading-font: "Marcellus",  sans-serif;
--nav-font: "Marcellus",  sans-serif;
```

## Licences

Both families are licensed under the **SIL Open Font License 1.1**, which
permits commercial use, self-hosting, modification and redistribution, provided
the font is not sold on its own and the licence is included.

- Open Sans — designed by Steve Matteson. OFL 1.1.
- Marcellus — designed by Astigmatic (Brian J. Bonislawsky). OFL 1.1.

The `@fontsource` packages are MIT-licensed wrappers. Licence text ships inside
`node_modules/@fontsource/*/LICENSE`.

## Marcellus has one weight — and this matters

Marcellus ships **only 400**. Any `font-weight` above 400 applied to a Marcellus
heading is **synthesised faux-bold** by the browser, not a real font file.

Two places where this shows up:

1. The design source sets `.hero h2 { font-weight: 700 }` and
   `.page-title h1 { font-weight: 700 }`. Those are real rules from the zip and
   are reproduced verbatim in `src/styles/base.css` and `src/styles/hero.css` —
   so they render exactly as the template rendered them, i.e. synthesised bold.
   **This is intentional fidelity, not an oversight.**
2. Our own heading rules default to `font-weight: 400` and never impose
   synthetic weight on Marcellus, so newly authored headings get the typeface
   as designed.

If you decide synthesised bold is undesirable, the faithful fix is to lower
those two declarations to `400` — but that **changes the design source**, so it
has deliberately not been done here.

## Verifying

```bash
npm run build
grep -o "@font-face" .next/static/css/*.css | wc -l   # → 122
grep -o "font-weight: [0-9]*" .next/static/css/*.css | sort -u
# → 300 400 500 600 700 800
```
