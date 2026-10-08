/**
 * Persistence adapter.
 *
 * Uses Vercel KV when KV_REST_API_URL + KV_REST_API_TOKEN are present.
 * Otherwise falls back to a JSON file under .data/ (gitignored) so orders,
 * subscriptions, partner applications and newsletter signups all persist
 * and remain inspectable during local development and previews.
 *
 * NOTE: @vercel/kv is deprecated upstream in favour of the Vercel Marketplace
 * Redis integration. It is used here because the build brief specifies
 * "Vercel KV"; the adapter boundary means swapping to Upstash Redis later is
 * a change to this file only.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { kv } from '@vercel/kv';

export type Collection = 'orders' | 'subscriptions' | 'partners' | 'newsletter' | 'enquiries';

export interface StoredRecord {
  id: string;
  createdAt: string;
  [key: string]: unknown;
}

const DATA_DIR = path.join(process.cwd(), '.data');

/**
 * True when Vercel KV credentials are present.
 *
 * Named `kvEnabled` and NOT `useKv` on purpose: a `use*` prefix makes the
 * React Hooks lint rule treat this plain boolean check as a Hook and fail the
 * build on every call site. It is not a Hook and must never become one.
 */
function kvEnabled(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function localPath(collection: Collection): string {
  return path.join(DATA_DIR, `${collection}.json`);
}

async function readLocal(collection: Collection): Promise<StoredRecord[]> {
  try {
    const raw = await fs.readFile(localPath(collection), 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocal(collection: Collection, records: StoredRecord[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(localPath(collection), JSON.stringify(records, null, 2), 'utf8');
}

/** Creates a collision-resistant id without a uuid dependency. */
export function makeId(prefix: string): string {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${stamp}${rand}`;
}

export async function saveRecord(
  collection: Collection,
  data: Record<string, unknown>
): Promise<StoredRecord> {
  const record: StoredRecord = {
    id: makeId(collection.slice(0, 4)),
    createdAt: new Date().toISOString(),
    ...data,
  };

  if (kvEnabled()) {
    // Sorted set keyed by timestamp gives a newest-first listing for free.
    const score = Date.now();
    await kv.zadd(`${collection}:by-date`, { score, member: record.id });
    await kv.set(`${collection}:${record.id}`, record);
    return record;
  }

  const records = await readLocal(collection);
  records.unshift(record);
  await writeLocal(collection, records);
  return record;
}

export async function listRecords(
  collection: Collection,
  limit = 50
): Promise<StoredRecord[]> {
  if (kvEnabled()) {
    const ids = await kv.zrange<string[]>(`${collection}:by-date`, 0, limit - 1, { rev: true });
    if (!ids.length) return [];
    const rows = await Promise.all(ids.map((id) => kv.get<StoredRecord>(`${collection}:${id}`)));
    return rows.filter((r): r is StoredRecord => Boolean(r));
  }
  const records = await readLocal(collection);
  return records.slice(0, limit);
}

/**
 * Zone lookup. Zone rows come from KV when configured; the bundled
 * data/delivery-zones.json is the source of truth otherwise.
 */
export async function getZoneRecords(): Promise<{ area: string; county: string; lead: string }[]> {
  if (kvEnabled()) {
    const rows = await kv.get<{ area: string; county: string; lead: string }[]>('zones:all');
    if (rows && Array.isArray(rows) && rows.length) return rows;
  }
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), 'src/data/delivery-zones.json'),
      'utf8'
    );
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function isStoreConfigured(): boolean {
  return kvEnabled();
}
