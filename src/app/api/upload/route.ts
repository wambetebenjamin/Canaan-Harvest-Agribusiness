import { NextResponse } from 'next/server';
import { uploadFarmPhoto } from '@/lib/blob';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/upload
 * Multipart farm-photo upload to Vercel Blob (or the local fallback).
 * Returns the public URL that /api/farm-partner stores with the application.
 *
 * Type and size are enforced in lib/blob.ts so both storage paths apply the
 * same limits.
 */
export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Expected a multipart form upload.' },
      { status: 400 }
    );
  }

  const file = form.get('file');
  const slug = String(form.get('slug') ?? 'partner').replace(/[^a-z0-9-]/gi, '');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file received.' }, { status: 422 });
  }

  try {
    const result = await uploadFarmPhoto(file, slug || 'partner');
    return NextResponse.json({
      ok: true,
      url: result.url,
      size: result.size,
      contentType: result.contentType,
      stored: result.stored,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed.' },
      { status: 400 }
    );
  }
}

export const maxDuration = 30;
