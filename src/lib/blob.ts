/**
 * Farm-photo upload adapter.
 *
 * Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is present. Otherwise the file
 * is written to public/uploads/ so partner applications can be exercised
 * end-to-end locally. Both paths return a publicly readable URL and enforce
 * the same type and size limits.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { put } from '@vercel/blob';

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
];

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export interface UploadResult {
  url: string;
  size: number;
  contentType: string;
  stored: 'blob' | 'local';
}

function safeExtension(file: File): string {
  const fromName = path.extname(file.name).toLowerCase();
  if (fromName && fromName.length <= 6) return fromName;
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/heic': '.heic',
    'image/heif': '.heif',
  };
  return map[file.type] ?? '.jpg';
}

export async function uploadFarmPhoto(file: File, slug: string): Promise<UploadResult> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Please upload a JPEG, PNG, WebP or HEIC image.');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('That image is larger than 8 MB. Please upload a smaller photo.');
  }

  const stamp = Date.now().toString(36);
  const filename = `farm-partners/${slug}-${stamp}${safeExtension(file)}`;

  if (isBlobConfigured()) {
    const blob = await put(filename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
      contentType: file.type,
    });
    return { url: blob.url, size: file.size, contentType: file.type, stored: 'blob' };
  }

  // Local fallback.
  const dir = path.join(process.cwd(), 'public', 'uploads', 'farm-partners');
  await fs.mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, path.basename(filename)), buffer);

  return {
    url: `/uploads/${filename}`,
    size: file.size,
    contentType: file.type,
    stored: 'local',
  };
}
