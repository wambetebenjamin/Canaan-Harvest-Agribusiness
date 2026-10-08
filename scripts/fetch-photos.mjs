#!/usr/bin/env node
/**
 * fetch-photos.mjs — re-download the site photography from Pexels.
 *
 * The photographs in `public/photos/` were sourced from Pexels under the
 * Pexels licence (free for commercial use, no attribution required). This
 * script records exactly which photo fills which slot so the set is
 * reproducible and auditable — see `docs/image-credits.md` for the full
 * credits table and `docs/PHOTO-SHOT-LIST.md` for the slot requirements.
 *
 *   npm run fetch:photos            # fetch any slot that is missing
 *   npm run fetch:photos -- --force # re-fetch every slot
 *   npm run fetch:photos -- --list  # print the manifest, download nothing
 *
 * Notes
 * -----
 * · Cropping is delegated to the Pexels CDN (`fit=crop&w=&h=`), so this script
 *   needs no image library — only Node's global `fetch` (Node 18+).
 * · Pexels' terms require that the download request be honoured from the
 *   `images.pexels.com` host rather than a scraper. This script requests that
 *   host directly and sends no credentials.
 * · Photographs of identifiable people are used for illustrative purposes in
 *   this project. They are stock models, not the customers or staff named in
 *   the site copy. See `docs/image-credits.md`.
 */

import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'photos');

/**
 * The slot manifest. `id` is the Pexels photo id; `cdn` overrides the file
 * name in the CDN path for the handful of legacy photos that do not use the
 * `pexels-photo-<id>.jpeg` convention.
 */
const MANIFEST = [
  // ── Farm ────────────────────────────────────────────────────────────────
  { slot: 'farm/farm-field-aerial.webp', id: 30255157, w: 1200, h: 630, format: 'webp',
    photographer: 'Vince Pictures', page: 'aerial-view-of-patchwork-farms-in-mau-narok-kenya-30255157',
    subject: 'Aerial view of patchwork farm fields, Mau Narok, Nakuru County, Kenya' },
  { slot: 'farm/field-rows.jpg', id: 36674642, w: 800, h: 600,
    photographer: 'Rufaro Makaya', page: 'rural-farmers-working-in-african-fields-36674642',
    subject: 'Farmers working rows of crops in an African village landscape' },
  { slot: 'farm/farmer-harvest-kale.jpg', id: 30541315, w: 600, h: 800,
    photographer: 'Fatima Yusuf', page: 'african-woman-harvesting-tea-leaves-in-field-30541313',
    subject: 'A woman harvesting a green crop by hand' },
  { slot: 'farm/harvest-greens.jpg', id: 12326843, w: 800, h: 600,
    photographer: 'Tamara Elnova', page: 'person-holding-a-green-onions-12326843',
    subject: 'Hands holding a bunch of freshly cut greens' },
  { slot: 'farm/packhouse-grading.jpg', id: 11678433, w: 800, h: 600,
    photographer: 'Mark Stebnicki', page: 'a-person-in-gray-long-sleeves-putting-the-broccoli-in-a-box-11678433',
    subject: 'Produce being sorted and packed into boxes' },
  { slot: 'farm/seedling-nursery.jpg', id: 7156429, w: 800, h: 600,
    photographer: 'Gustavo Fring', page: 'hands-holding-the-tray-with-green-plants-7156429',
    subject: 'Hands tending seedlings in nursery trays' },
  { slot: 'farm/soil-cultivation.jpg', id: 10988584, w: 800, h: 600,
    photographer: 'Safari Consoler', page: 'topless-man-holding-a-hoe-10988584',
    subject: 'A farmer working the soil with a hoe' },
  { slot: 'farm/harvest-basket.jpg', id: 4975349, w: 800, h: 600,
    photographer: 'Gustavo Fring', page: 'old-man-farmer-with-basket-of-fresh-vegetables-4975349',
    subject: 'A farmer carrying a basket of freshly picked vegetables' },
  { slot: 'farm/seedlings-planted.jpg', id: 18468251, w: 800, h: 600,
    photographer: 'qolloe', page: 'woman-planting-seedling-18468251',
    subject: 'A woman setting young plants into a prepared bed' },
  { slot: 'farm/field-weeding.jpg', id: 10988631, w: 800, h: 600,
    photographer: 'Safari Consoler', page: 'elderly-farmer-holding-a-hoe-10988631',
    subject: 'A farmer working a field with a hoe' },

  // ── Produce ─────────────────────────────────────────────────────────────
  { slot: 'produce/chard-beetroot.jpg', id: 9301, w: 1000, h: 750, cdn: 'healthy-vegetables-restaurant-nature.jpg',
    photographer: 'ClickerHappy', page: 'healthy-vegetables-hand-gardening-9301',
    subject: 'A hand holding freshly lifted root vegetables with their tops' },
  { slot: 'produce/fresh-leaves.jpg', id: 28935178, w: 800, h: 600,
    photographer: 'Dresden Benke', page: 'fresh-green-curly-kale-in-garden-28935178',
    subject: 'Fresh leafy greens growing in a garden bed' },
  { slot: 'produce/vegetable-basket.jpg', id: 30520745, w: 800, h: 800,
    photographer: 'Özge Arsoy', page: 'fresh-assorted-vegetables-in-a-basket-30520745',
    subject: 'Assorted fresh vegetables in a harvest basket' },

  // ── People — testimonial avatars ────────────────────────────────────────
  { slot: 'people/testimonial-1.jpg', id: 38681751, w: 400, h: 400,
    photographer: 'Tochukwu Ekeh', page: 'professional-female-chef-in-white-uniform-portrait-38681751',
    subject: 'A Black woman chef in a white uniform' },
  { slot: 'people/testimonial-2.jpg', id: 32224390, w: 400, h: 400,
    photographer: 'Tochukwu Ekeh', page: 'professional-portrait-of-a-black-chef-in-dark-uniform-32224390',
    subject: 'A Black male chef in a dark uniform' },
  { slot: 'people/testimonial-3.jpg', id: 37118121, w: 400, h: 400,
    photographer: 'Speak Media Uganda', page: 'confident-african-woman-in-business-attire-indoors-37118121',
    subject: 'An African woman in business attire' },
  { slot: 'people/testimonial-4.jpg', id: 33993457, w: 400, h: 400,
    photographer: '2xman Yef', page: 'african-farmer-sitting-in-a-cornfield-33993457',
    subject: 'A farmer seated in a field of tall crops' },

  // ── People — team ───────────────────────────────────────────────────────
  { slot: 'people/team-1.jpg', id: 29852895, w: 600, h: 600,
    photographer: 'Ifeyinka Adeyemo', page: 'professional-corporate-headshot-of-smiling-woman-29852895',
    subject: 'A smiling African woman in a black suit' },
  { slot: 'people/team-2.jpg', id: 31307734, w: 600, h: 600,
    photographer: 'Korede Adenola', page: 'confident-professional-woman-portrait-in-studio-31307734',
    subject: 'An African woman seated, arms crossed' },
  { slot: 'people/team-3.jpg', id: 2216607, w: 600, h: 600,
    photographer: 'Dellon Thomas', page: 'man-wearing-suit-2216607',
    subject: 'A man in a dark suit against a dark background' },
  { slot: 'people/team-4.jpg', id: 29387557, w: 600, h: 600,
    photographer: 'King Cyrus Studios', page: 'confident-young-business-professional-in-formal-attire-29387557',
    subject: 'A young African man in a brown suit' },

  // ── Blog ────────────────────────────────────────────────────────────────
  { slot: 'blog/blog-1.jpg', id: 35726906, w: 640, h: 400,
    photographer: 'LekePOV', page: 'african-market-stall-with-fresh-produce-35726906',
    subject: 'A vendor selling fresh produce at a market stall' },
  { slot: 'blog/blog-2.jpg', id: 35811576, w: 640, h: 400,
    photographer: 'Derrick Pare', page: 'african-vendor-carrying-vegetables-outdoors-35811576',
    subject: 'A vendor carrying freshly harvested vegetables' },
  { slot: 'blog/blog-3.jpg', id: 34235513, w: 640, h: 400,
    photographer: 'Shesunze Shamaye', page: 'traditional-nigerian-cooking-outdoors-in-en-34235513',
    subject: 'A woman cooking over a large pot outdoors' },
  { slot: 'blog/blog-4.jpg', id: 34411687, w: 640, h: 400,
    photographer: 'mk_photoz', page: 'african-farmer-inspecting-crops-in-field-34411687',
    subject: 'A farmer inspecting crops in a field' },
  { slot: 'blog/blog-5.jpg', id: 33679617, w: 640, h: 400,
    photographer: 'Robert So', page: 'agricultural-irrigation-system-in-sunny-field-33679617',
    subject: 'An irrigation system running across a field' },
  { slot: 'blog/blog-6.jpg', id: 6944032, w: 640, h: 400,
    photographer: 'Vlada Karpovich', page: 'a-man-in-a-black-shirt-whisking-egg-6944032',
    subject: 'A chef preparing fresh ingredients in a kitchen' },
];

const args = new Set(process.argv.slice(2));
const FORCE = args.has('--force') || args.has('-f');
const LIST_ONLY = args.has('--list') || args.has('-l');

const exists = async (p) => access(p).then(() => true, () => false);

/** Pexels CDN URL for one manifest entry. */
function cdnUrl(entry) {
  const file = entry.cdn ?? `pexels-photo-${entry.id}.jpeg`;
  const params = new URLSearchParams({
    auto: 'compress',
    cs: 'tinysrgb',
    fit: 'crop',
    w: String(entry.w),
    h: String(entry.h),
  });
  if (entry.format === 'webp') params.set('fm', 'webp');
  return `https://images.pexels.com/photos/${entry.id}/${file}?${params}`;
}

function printManifest() {
  const rows = MANIFEST.map((e) => [
    e.slot.padEnd(32),
    String(e.id).padEnd(10),
    `${e.w}x${e.h}`.padEnd(10),
    e.photographer,
  ]);
  console.log(['SLOT'.padEnd(32), 'PEXELS ID'.padEnd(10), 'SIZE'.padEnd(10), 'PHOTOGRAPHER'].join(''));
  console.log('-'.repeat(90));
  for (const row of rows) console.log(row.join(''));
  console.log(`\n${MANIFEST.length} slots. Full credits: docs/image-credits.md`);
}

if (LIST_ONLY) {
  printManifest();
  process.exit(0);
}

let downloaded = 0;
let skipped = 0;
const failures = [];

for (const entry of MANIFEST) {
  const dest = join(OUT, entry.slot);

  if (!FORCE && (await exists(dest))) {
    skipped += 1;
    continue;
  }

  const url = cdnUrl(entry);
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const type = res.headers.get('content-type') ?? '';
    if (!type.startsWith('image/')) {
      throw new Error(`expected an image, got content-type "${type}"`);
    }
    // A .webp slot must really be WebP — serving JPEG bytes under a .webp
    // extension would send the wrong media type from /public.
    if (entry.format === 'webp' && !type.includes('webp')) {
      throw new Error(
        `slot needs WebP but the CDN returned "${type}". ` +
          'Re-encode before committing, or fetch as JPEG and update the slot to .jpg.',
      );
    }

    const bytes = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, bytes);
    downloaded += 1;
    const kb = (bytes.length / 1024).toFixed(0);
    console.log(`✓ ${entry.slot}  (${entry.w}x${entry.h}, ${kb} KB)  ${entry.photographer}`);
  } catch (err) {
    failures.push({ slot: entry.slot, url, message: err.message });
    console.error(`✗ ${entry.slot}: ${err.message}`);
  }
}

console.log(`\nDownloaded ${downloaded}, skipped ${skipped} (already present), failed ${failures.length}.`);
if (failures.length) {
  console.error('\nFailed slots:');
  for (const f of failures) console.error(`  ${f.slot}\n    ${f.url}\n    ${f.message}`);
  console.error('\nIf every request failed with a network error, this environment cannot reach');
  console.error('images.pexels.com. Download the photos in a browser from the page URLs in');
  console.error('docs/image-credits.md and crop each to the size shown by `npm run fetch:photos -- --list`.');
  process.exit(1);
}
