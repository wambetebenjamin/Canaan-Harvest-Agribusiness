/**
 * Generates the Canaan Harvest favicon and Apple touch icon from the same
 * monogram idea as <WordmarkDraw /> (EFFECT-08): a seedling leaf over a field
 * horizon, in --accent-color (#116530) and white. No gradients, no shadows —
 * a favicon is 16px tall in a browser tab and anything more is noise at that
 * size.
 *
 * Shapes are drawn in a 64×64 box and have two modes:
 *
 *   full  — leaf with midrib and veins, plus a horizon rule. Used at 180px
 *           and 512px, where the fine strokes read cleanly.
 *   tight — solid leaf with a midrib only, enlarged. The side veins and the
 *           horizon are dropped at tab size: below ~24px they blur into a
 *           grey halo and muddy the silhouette instead of adding identity.
 *           The midrib is kept deliberately — without it the leaf reads as a
 *           grain of rice at 16px; the rib is what makes it a leaf.
 *
 * The ring from the on-page wordmark is deliberately NOT used here. A circle
 * outline around a leaf reads as a prohibition sign at a glance, and the
 * horizon rule collides with the ring's lower arc.
 *
 * Run:  node scripts/make-icons.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ACCENT = '#116530';
const WHITE = '#ffffff';
const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public');
const SOURCE = path.join(ROOT, 'public/icons/icon-source.svg');

/** Flat-fill accent plate, drawn first so it is always solid. */
const DISC = `<circle cx="32" cy="32" r="32" fill="${ACCENT}" />`;
const SQUARE = `<rect width="64" height="64" fill="${ACCENT}" />`;

/**
 * Marquise leaf: points at both tips, widest at the middle. This is the
 * silhouette that stays unmistakably a leaf from 16px upward — a rounded
 * bottom with a straight midrib reads as a coffee bean instead.
 *
 * `cy` is the vertical centre; `half` is the half-height of the leaf.
 */
function leafBody(cy, half) {
  const top = cy - half;
  const bot = cy + half;
  const w = half * 0.78; // half-width at the waist
  const mid = cy;
  return { top, bot, mid, w };
}

/** Solid leaf outline, no interior detail. */
function solidLeaf(cy, half) {
  const { top, bot, w, mid } = leafBody(cy, half);
  return `<path d="M32 ${top} C ${32 + w} ${mid - half * 0.4}, ${32 + w} ${mid + half * 0.4}, 32 ${bot}
                    C ${32 - w} ${mid + half * 0.4}, ${32 - w} ${mid - half * 0.4}, 32 ${top} Z"
    fill="${WHITE}" />`;
}

/**
 * Leaf plus the single midrib, for tab size. Everything else is stripped:
 * side veins, horizon rule, ring.
 */
function ribbedLeaf(cy, half) {
  const { top, bot } = leafBody(cy, half);
  return `${solidLeaf(cy, half)}
    <path d="M32 ${top + half * 0.09} L 32 ${bot - half * 0.09}" stroke="${ACCENT}"
          stroke-width="${half * 0.095}" stroke-linecap="round" fill="none" />`;
}

/** Leaf with a midrib and two pairs of veins knocked out in the accent. */
function detailedLeaf(cy, half) {
  const { top, bot, mid } = leafBody(cy, half);
  const ribTop = top + half * 0.16;
  const ribBot = bot - half * 0.14;
  const vein = (fromY, toX, toY) => `<path d="M32 ${fromY} Q ${32 + toX * 0.45} ${(
    fromY + toY) / 2} ${32 + toX} ${toY}"
    stroke="${ACCENT}" stroke-width="${half * 0.085}" stroke-linecap="round" fill="none" />`;
  return `${solidLeaf(cy, half)}
    <path d="M32 ${ribTop} L 32 ${ribBot}" stroke="${ACCENT}"
          stroke-width="${half * 0.10}" stroke-linecap="round" fill="none" />
    ${vein(top + half * 0.34, half * 0.50, top + half * 0.60)}
    ${vein(top + half * 0.34 + 0, -half * 0.50, top + half * 0.60)}
    ${vein(top + half * 0.58, half * 0.42, top + half * 0.84)}
    ${vein(top + half * 0.58, -half * 0.42, top + half * 0.84)}`;
}

/** Horizon rule — the field the seedling is standing in. */
function horizon(inset, weight, y) {
  return `<path d="M${13 + inset} ${y} H ${51 - inset}" stroke="${WHITE}"
    stroke-width="${weight}" stroke-linecap="round" fill="none" />`;
}

const svg = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">\n  ${body}\n</svg>`;

/**
 * Static vector wordmark, geometry identical to <WordmarkDraw /> (EFFECT-08)
 * so the animation lands exactly on the printed mark.
 *
 * Marcellus is not available inside a bare SVG, so the serif stack carries a
 * Georgia / Times fallback: on a machine with the webfont it renders in
 * Marcellus, and anywhere else it degrades to a serif of the same flavour
 * rather than to a sans. That is acceptable for a downloadable asset and NOT
 * acceptable for on-page text, which is why on-page headings use the real
 * font via CSS.
 */
const WORDMARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80"
     width="320" height="80" role="img" aria-label="Canaan Harvest Agribusiness">
  <title>Canaan Harvest Agribusiness</title>
  <g fill="none" stroke="${ACCENT}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="40" cy="40" r="31" />
    <!-- Leaf and stem are STROKED, not filled — identical to <WordmarkDraw />.
         A filled leaf would need a knocked-out stem, and a knock-out could
         only be white, which would vanish where the header sits over a photo.
         Stroking keeps one mark that works on every background. -->
    <path d="M40 58 C 26 50, 24 32, 40 22 C 56 32, 54 50, 40 58 Z" />
    <path d="M40 58 L 40 31" />
    <path d="M21 75 H 59" />
  </g>
  <g fill="${ACCENT}">
    <text x="92" y="44" font-family="Marcellus, Georgia, 'Times New Roman', serif"
          font-size="30" letter-spacing="2.5">CANAAN</text>
    <text x="92" y="70" font-family="'Open Sans', Helvetica, Arial, sans-serif"
          font-size="13" font-weight="600" letter-spacing="6.4">HARVEST</text>
  </g>
</svg>`;

/**
 * Scalable favicon. Modern browsers prefer this over the 32px PNG and it stays
 * sharp on any DPI. The PNG is retained for older Safari and for the tags that
 * still request it by name.
 */
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"
     width="64" height="64" role="img" aria-label="Canaan Harvest Agribusiness">
  <title>Canaan Harvest Agribusiness</title>
  ${DISC}
  ${ribbedLeaf(31, 19)}
</svg>`;

/* ── Variants ──────────────────────────────────────────────────────────── */

// 32px tab icon — ribbed leaf on a disc, transparent corners so the tab strip
// shows through and the shape reads as a logo rather than a broken image box.
const FAVICON = svg(`${DISC}${ribbedLeaf(31, 19)}`);

// 180px Apple touch icon — square and full-bleed with NO transparency: iOS
// applies its own mask and composites transparent pixels onto black, which
// would ring the mark in a dark halo.
const APPLE = svg(`${SQUARE}${detailedLeaf(29, 17)}${horizon(4, 3.2, 54.5)}`);

// 512px maskable PWA icon — same mark pulled well inside the safe area so
// Android can crop to a circle, squircle or rounded square without clipping.
const MASKABLE = svg(`${SQUARE}${detailedLeaf(25, 13)}${horizon(13, 3.2, 46.5)}`);

async function main() {
  await mkdir(path.join(OUT, 'icons'), { recursive: true });

  // Canonical vector sources, kept in the repo so the icons can be re-rendered
  // or hand-edited without reverse-engineering the PNGs.
  await writeFile(SOURCE, FAVICON_SVG.trim() + '\n', 'utf8');
  await writeFile(path.join(OUT, 'favicon.svg'), FAVICON_SVG.trim() + '\n', 'utf8');
  await writeFile(path.join(OUT, 'icons/wordmark.svg'), WORDMARK.trim() + '\n', 'utf8');

  await sharp(Buffer.from(FAVICON))
    .resize(32, 32)
    .png({ compressionLevel: 9, palette: false })
    .toFile(path.join(OUT, 'favicon.png'));

  await sharp(Buffer.from(APPLE))
    .resize(180, 180)
    .flatten({ background: ACCENT })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, 'apple-touch-icon.png'));

  await sharp(Buffer.from(MASKABLE))
    .resize(512, 512)
    .flatten({ background: ACCENT })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, 'icons/icon-512.png'));

  console.log('icons written:');
  console.log('  public/favicon.png             32×32   ribbed leaf, transparent corners');
  console.log('  public/favicon.svg             vector  scalable tab icon');
  console.log('  public/apple-touch-icon.png   180×180  detailed mark, full-bleed');
  console.log('  public/icons/icon-512.png     512×512  maskable, safe-area padded');
  console.log('  public/icons/wordmark.svg     320×80   full wordmark');
  console.log('  public/icons/icon-source.svg           canonical vector source');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
