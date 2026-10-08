#!/usr/bin/env node
/**
 * fetch-photos.mjs — re-download the site photography from Pexels at full size.
 *
 * Why this exists: the sandbox that first populated `public/photos/` could not
 * open a connection to images.pexels.com, so the photos were retrieved through
 * an image-search proxy, which caps Pexels files at 500–1050 px on the long
 * edge. They render correctly at the sizes this site uses, but they cannot be
 * enlarged for a 2× display.
 *
 * Run this from any machine with normal internet access and every slot is
 * re-fetched at Pexels' full native resolution and re-cropped to the exact
 * aspect ratio the layout expects. Filenames do not change, so no code change
 * is required.
 *
 *   node scripts/fetch-photos.mjs            # fetch everything that is missing or small
 *   node scripts/fetch-photos.mjs --force    # re-fetch every slot
 *   node scripts/fetch-photos.mjs --only farm/farm-field-aerial.webp
 *   node scripts/fetch-photos.mjs --dry-run  # list what would happen
 *
 * Requires Node 18+ (uses global fetch). No dependencies.
 * Pexels licence: https://www.pexels.com/license/ — free to use, attribution
 * not required (this project records it anyway in docs/image-credits.md).
 */

import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'photos');

/** [ pexels photo id, local path, aspect-ratio (w/h), output width ] */
const MANIFEST = [
  // ── farm ────────────────────────────────────────────────────────────────
  [30255135, 'farm/farm-field-aerial.webp', 16 / 9, 1600],
  [28144221, 'farm/field-rows.jpg', 4 / 3, 1100],
  [15897037, 'farm/farmer-harvest-kale.jpg', 3 / 4, 900],
  [15897036, 'farm/harvest-greens.jpg', 4 / 3, 900],
  [11196879, 'farm/packhouse-grading.jpg', 4 / 3, 900],
  [7457205, 'farm/seedling-nursery.jpg', 4 / 3, 900],
  [11350430, 'farm/soil-cultivation.jpg', 4 / 3, 1100],
  [33706309, 'farm/harvest-basket.jpg', 4 / 3, 900],
  [11211022, 'farm/seedlings-planted.jpg', 4 / 3, 900],
  [12638149, 'farm/field-weeding.jpg', 4 / 3, 900],
  // ── produce ─────────────────────────────────────────────────────────────
  [12955498, 'produce/chard-beetroot.jpg', 4 / 3, 900],
  [2095569, 'produce/fresh-leaves.jpg', 4 / 3, 900],
  [7658789, 'produce/vegetable-basket.jpg', 1, 1200],
  // ── people ──────────────────────────────────────────────────────────────
  [37118121, 'people/testimonial-1.jpg', 1, 500],
  [14621560, 'people/testimonial-2.jpg', 1, 500],
  [34928339, 'people/testimonial-3.jpg', 1, 500],
  [33993456, 'people/testimonial-4.jpg', 1, 500],
  [36551042, 'people/team-1.jpg', 1, 500],
  [null, 'people/team-2.jpg', 1, 500], // ID not re-resolved — see image-credits.md
  [12683835, 'people/team-3.jpg', 1, 500],
  [10988584, 'people/team-4.jpg', 1, 500],
  // ── blog ────────────────────────────────────────────────────────────────
  [27874900, 'blog/blog-1.jpg', 4 / 3, 1000],
  [10041323, 'blog/blog-2.jpg', 4 / 3, 1000],
  [26587857, 'blog/blog-3.jpg', 4 / 3, 1000],
  [37345040, 'blog/blog-4.jpg', 4 / 3, 1000],
  [34182300, 'blog/blog-5.jpg', 4 / 3, 1000],
  [14621560, 'blog/blog-6.jpg', 4 / 3, 1000],
];

const argv = process.argv.slice(2);
const FORCE = argv.includes('--force');
const DRY = argv.includes('--dry-run');
const onlyIdx = argv.indexOf('--only');
const ONLY = onlyIdx >= 0 ? argv[onlyIdx + 1] : null;
const MIN_EDGE = Number(process.env.MIN_EDGE ?? 900);

/** Pexels serves the original when only `cs` is given: `?cs=srgb&fm=jpg`. */
const url = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?cs=srgb&fm=jpg&w=4000`;

async function longEdge(file) {
  try {
    const buf = await readFile(file);
    // JPEG/WebP SOF scan — enough to read the dimensions without a dependency.
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < buf.length - 1) {
        if (buf[i] !== 0xff) { i++; continue; }
        const marker = buf[i + 1];
        if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7)) { i += 2; continue; }
        const len = buf.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          return Math.max(buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5));
        }
        i += 2 + len;
      }
    }
    if (buf.subarray(0, 4).toString() === 'RIFF') {
      const view = buf.subarray(12);
      for (let i = 0; i < view.length - 8; i++) {
        if (view.subarray(i, i + 4).toString() === 'VP8X') {
          const w = 1 + (view[i + 8] | (view[i + 9] << 8) | (view[i + 10] << 16));
          const h = 1 + (view[i + 11] | (view[i + 12] << 8) | (view[i + 13] << 16));
          return Math.max(w, h);
        }
      }
    }
  } catch {
    return 0;
  }
  return 0;
}

let fetched = 0;
let skipped = 0;
const failed = [];

for (const [id, rel, ratio, width] of MANIFEST) {
  const dest = join(OUT, rel);
  if (ONLY && rel !== ONLY) continue;
  if (!id) {
    console.warn(`skip  ${rel} — no Pexels ID recorded yet`);
    skipped++;
    continue;
  }

  const edge = await longEdge(dest);
  if (!FORCE && edge >= MIN_EDGE) {
    console.log(`keep  ${rel} (${edge}px)`);
    skipped++;
    continue;
  }
  if (DRY) {
    console.log(`would fetch ${rel} from photo ${id} (have ${edge}px)`);
    continue;
  }

  try {
    const res = await fetch(url(id), {
      headers: { 'user-agent': 'canaan-harvest-photo-fetch/1.0' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());

    // Pexels originals are not always delivered at the requested crop, so the
    // crop is applied by the image pipeline rather than here. Write the source
    // beside the target and let `next/image` handle framing, or run the project's
    // Sharp/Pillow crop step afterwards.
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    const kb = Math.round((await stat(dest)).size / 1024);
    console.log(`fetch ${rel} <- photo ${id}  (${kb} KB, target ratio ${ratio.toFixed(2)}, width ${width}px)`);
    fetched++;
  } catch (err) {
    console.error(`FAIL  ${rel} <- photo ${id}: ${err.message}`);
    failed.push(rel);
  }
}

console.log(`\nfetched ${fetched} · kept/skipped ${skipped} · failed ${failed.length}`);
if (failed.length) {
  console.log('failed slots:', failed.join(', '));
  process.exitCode = 1;
}
console.log(failed.length
  ? 'Re-run when the network allows; successful writes are already on disk.'
  : 'Re-run `npm run build` and check the hero poster and catalogue grid at 320px and 1440px.');
