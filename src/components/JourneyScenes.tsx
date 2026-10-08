import type { JourneyBeat } from '@/data/content';

/**
 * The four scrollytelling scenes. Pure SVG, no raster assets, so they are
 * crisp at every breakpoint and cost nothing to load.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function SceneSeedling() {
  return (
    <svg viewBox="0 0 220 220" role="img" aria-label="A seedling planted in highland soil">
      <path d="M14 176 H 206" {...stroke} strokeWidth={3} />
      <path d="M40 190 H 180" {...stroke} strokeWidth={2} opacity={0.4} />
      <path d="M110 176 V 92" {...stroke} />
      <path d="M110 124 C 74 124, 62 96, 66 74 C 96 74, 110 96, 110 124 Z" {...stroke} />
      <path d="M110 134 C 146 134, 158 106, 154 84 C 124 84, 110 106, 110 134 Z" {...stroke} />
      <path d="M70 150 q 20 -10 40 0" {...stroke} strokeWidth={1.6} opacity={0.45} />
      <path d="M110 150 q 20 -10 40 0" {...stroke} strokeWidth={1.6} opacity={0.45} />
      <circle cx="110" cy="64" r="4.5" fill="currentColor" opacity={0.5} />
    </svg>
  );
}

export function SceneHarvest() {
  return (
    <svg viewBox="0 0 220 220" role="img" aria-label="Produce being harvested at sunrise">
      <circle cx="164" cy="58" r="26" fill="none" stroke="#d9a13a" strokeWidth={2.6} />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x1 = 164 + Math.cos(angle) * 34;
        const y1 = 58 + Math.sin(angle) * 34;
        const x2 = 164 + Math.cos(angle) * 44;
        const y2 = 58 + Math.sin(angle) * 44;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d9a13a" strokeWidth={2.2} strokeLinecap="round" />
        );
      })}
      <path d="M18 182 H 202" {...stroke} strokeWidth={3} />
      <path d="M62 182 V 128" {...stroke} strokeWidth={3} />
      <path d="M44 138 C 48 116, 62 108, 84 108 C 82 132, 68 140, 44 138 Z" {...stroke} />
      <circle cx="86" cy="140" r="16" {...stroke} />
      <circle cx="122" cy="148" r="13" {...stroke} />
      <path d="M52 182 V 160" {...stroke} strokeWidth={2} opacity={0.5} />
      <path d="M64 182 V 158" {...stroke} strokeWidth={2} opacity={0.5} />
    </svg>
  );
}

export function SceneSorting() {
  return (
    <svg viewBox="0 0 220 220" role="img" aria-label="Produce being sorted and graded at the packhouse">
      <path d="M20 60 L 200 60 L 200 66 L 20 66 Z" {...stroke} strokeWidth={2.2} />
      <path d="M20 162 L 200 162 L 200 168 L 20 168 Z" {...stroke} strokeWidth={2.2} />
      <rect x="38" y="82" width="40" height="34" rx="5" {...stroke} />
      <rect x="90" y="82" width="40" height="34" rx="5" {...stroke} />
      <rect x="142" y="82" width="40" height="34" rx="5" {...stroke} />
      <rect x="38" y="126" width="40" height="26" rx="5" {...stroke} opacity={0.5} />
      <rect x="90" y="126" width="40" height="26" rx="5" {...stroke} opacity={0.5} />
      <rect x="142" y="126" width="40" height="26" rx="5" {...stroke} opacity={0.5} />
      <path d="M50 99 l 8 8 l 14 -16" {...stroke} strokeWidth={3} />
      <path d="M102 99 l 8 8 l 14 -16" {...stroke} strokeWidth={3} />
      <circle cx="162" cy="99" r="10" {...stroke} />
      <path d="M156 99 h 12" {...stroke} />
    </svg>
  );
}

export function SceneDelivery() {
  return (
    <svg viewBox="0 0 220 220" role="img" aria-label="A refrigerated van delivering produce in Nairobi">
      <path d="M20 170 H 200" {...stroke} strokeWidth={3} />
      <path d="M28 128 H 118 V 168 H 28 Z" {...stroke} />
      <path d="M118 168 V 140 H 152 L 172 158 V 168 Z" {...stroke} />
      <path d="M40 128 V 108 H 106 V 128" {...stroke} opacity={0.5} />
      <circle cx="58" cy="172" r="13" {...stroke} />
      <circle cx="148" cy="172" r="13" {...stroke} />
      <path d="M136 150 h 14" {...stroke} strokeWidth={1.8} opacity={0.6} />
      <path d="M150 88 q 12 -14 24 0 q 12 -14 24 0" {...stroke} strokeWidth={1.8} opacity={0.45} />
      <path d="M60 150 h 34" {...stroke} strokeWidth={1.8} opacity={0.45} />
    </svg>
  );
}

export const JOURNEY_SCENES: Record<JourneyBeat['scene'], React.ComponentType> = {
  seedling: SceneSeedling,
  harvest: SceneHarvest,
  sorting: SceneSorting,
  delivery: SceneDelivery,
};
