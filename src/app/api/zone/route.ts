import { NextResponse } from 'next/server';
import { getZoneRecords } from '@/lib/store';
import { DELIVERY_ZONES } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Normalises an area name for tolerant matching. */
function normalise(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * POST /api/zone
 * Delivery zone checker. Reads the zone table from Vercel KV when
 * configured, falling back to the bundled data, and answers yes/no plus the
 * lead time for covered areas or the nearest covered areas when not.
 */
export async function POST(request: Request) {
  let body: { area?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const query = normalise(body.area ?? '');
  if (!query) {
    return NextResponse.json({ error: 'Enter your area.' }, { status: 422 });
  }

  const zones = await getZoneRecords();

  /* Exact match first. */
  const exact = zones.find((z) => normalise(z.area) === query);
  if (exact) {
    return NextResponse.json({
      covered: true,
      area: exact.area,
      lead: exact.lead,
      county: exact.county,
    });
  }

  /* Then a contains match, longest zone name wins so "South B" beats "B". */
  const partial = zones
    .filter((z) => {
      const name = normalise(z.area);
      return query.includes(name) || name.includes(query);
    })
    .sort((a, b) => b.area.length - a.area.length)[0];

  if (partial) {
    return NextResponse.json({
      covered: true,
      area: partial.area,
      lead: partial.lead,
      county: partial.county,
    });
  }

  /* Not covered — suggest the closest names by shared token. */
  const tokens = new Set(query.split(' '));
  const nearest = zones
    .map((z) => ({
      area: z.area,
      score: normalise(z.area)
        .split(' ')
        .filter((t) => tokens.has(t)).length,
    }))
    .filter((z) => z.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((z) => z.area);

  return NextResponse.json({
    covered: false,
    area: body.area!.trim(),
    nearest:
      nearest.length > 0
        ? nearest
        : zones.slice(0, 4).map((z) => z.area),
    coveredCount: zones.length || DELIVERY_ZONES.length,
  });
}

export async function GET() {
  const zones = await getZoneRecords();
  return NextResponse.json({
    count: zones.length,
    zones: zones.map((z) => z.area),
  });
}
