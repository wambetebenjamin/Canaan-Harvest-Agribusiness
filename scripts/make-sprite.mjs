/**
 * Generates the EFFECT-31 stop-motion sprite sheet.
 *
 * 12 frames of a seed growing into a plant, laid out horizontally in a
 * single SVG so the card makes exactly ONE request (per the brief).
 * Run with: node scripts/make-sprite.mjs
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const FRAMES = 12;
const SIZE = 176;
const ACCENT = '#116530';
const SOIL = '#8a6a43';

/** Eased growth curve — slow start, quick middle, settled end. */
function growth(t) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function frame(index) {
  const t = index / (FRAMES - 1);
  const g = growth(t);

  // Stem rises from the soil line.
  const soilY = 132;
  const stemTop = soilY - 74 * g;

  // Leaf pair opens as the stem grows; the second appears midway.
  const leaf1 = Math.max(0, Math.min(1, (t - 0.18) / 0.5));
  const leaf2 = Math.max(0, Math.min(1, (t - 0.45) / 0.45));

  // Seed fades into the soil in the first third.
  const seedOpacity = Math.max(0, 1 - t / 0.34);

  const leafW = 20 + 16 * leaf1;
  const leafH = 11 + 9 * leaf1;

  return `
  <g>
    <!-- pot / soil -->
    <path d="M40 132 H 136" stroke="${SOIL}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M52 138 H 124" stroke="${SOIL}" stroke-width="3" stroke-linecap="round" opacity="0.45" fill="none"/>

    ${
      seedOpacity > 0.01
        ? `<ellipse cx="88" cy="122" rx="9" ry="12" fill="${SOIL}" opacity="${seedOpacity.toFixed(2)}"/>`
        : ''
    }

    <!-- stem -->
    <path d="M88 ${soilY} L 88 ${stemTop.toFixed(1)}" stroke="${ACCENT}" stroke-width="4.5"
          stroke-linecap="round" fill="none"/>

    ${
      leaf1 > 0.02
        ? `<path d="M88 ${(soilY - 26 * g - 8).toFixed(1)}
             C ${(88 - leafW).toFixed(1)} ${(soilY - 30 * g - 10).toFixed(1)},
               ${(88 - leafW).toFixed(1)} ${(soilY - 30 * g + leafH).toFixed(1)},
               88 ${(soilY - 26 * g - 6).toFixed(1)} Z"
             fill="${ACCENT}" opacity="${(0.85 * leaf1).toFixed(2)}"/>`
        : ''
    }

    ${
      leaf2 > 0.02
        ? `<path d="M88 ${(stemTop + 16).toFixed(1)}
             C ${(88 + leafW).toFixed(1)} ${(stemTop + 4).toFixed(1)},
               ${(88 + leafW).toFixed(1)} ${(stemTop + 16 + leafH).toFixed(1)},
               88 ${(stemTop + 18).toFixed(1)} Z"
             fill="${ACCENT}" opacity="${(0.9 * leaf2).toFixed(2)}"/>`
        : ''
    }

    <!-- terminal bud once nearly grown -->
    ${
      t > 0.66
        ? `<circle cx="88" cy="${(stemTop - 3).toFixed(1)}" r="${(4.5 * leaf2).toFixed(1)}"
                   fill="#2f8f4e" opacity="${(leaf2 * 0.95).toFixed(2)}"/>`
        : ''
    }
  </g>`;
}

let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE * FRAMES} ${SIZE}" width="${SIZE * FRAMES}" height="${SIZE}">\n`;
svg += `  <title>Stop-motion frames of a seed growing into a plant</title>\n`;
for (let i = 0; i < FRAMES; i += 1) {
  svg += `  <g transform="translate(${i * SIZE}, 0)">${frame(i)}\n  </g>\n`;
}
svg += `</svg>\n`;

const out = join(process.cwd(), 'public', 'sprites', 'seed-growth-sprite.svg');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, svg, 'utf8');
console.log(`Wrote ${out} — ${FRAMES} frames at ${SIZE}px.`);
