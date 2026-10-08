import { NextResponse } from 'next/server';
import { saveRecord } from '@/lib/store';
import { sendMail } from '@/lib/mail';
import { sendWhatsApp } from '@/lib/whatsapp';
import { isCaptchaConfigured, verifyCaptcha, verifyCaptchaV2 } from '@/lib/captcha-server';
import { V2_CODE } from '@/lib/codes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/farm-partner
 * Receives the partnership application. The farm photo has already been
 * uploaded to Vercel Blob by /api/upload, which returns the URL carried in
 * farmPhotoUrl.
 */
export async function POST(request: Request) {
  let body: {
    farmerName?: string;
    location?: string;
    farmSizeAcres?: string;
    cropTypes?: string[];
    waterSource?: string;
    phone?: string;
    email?: string;
    notes?: string;
    farmPhotoUrl?: string | null;
    captchaToken?: string;
    captchaVersion?: 'v2' | 'v3';
    captchaAction?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (isCaptchaConfigured()) {
    const captcha =
      body.captchaVersion === 'v2'
        ? await verifyCaptchaV2(body.captchaToken)
        : await verifyCaptcha(body.captchaToken, body.captchaAction ?? 'farm_partner');

    if (!captcha.ok) {
      return NextResponse.json(
        { error: captcha.reason, code: captcha.requiresV2 ? V2_CODE : undefined },
        { status: 400 }
      );
    }
  }

  const missing: string[] = [];
  if (!body.farmerName?.trim()) missing.push('farmerName');
  if (!body.location?.trim()) missing.push('location');
  if (!body.farmSizeAcres || Number(body.farmSizeAcres) <= 0) missing.push('farmSizeAcres');
  if (!body.cropTypes?.length) missing.push('cropTypes');
  if (!body.phone?.trim()) missing.push('phone');
  if (!body.email?.trim()) missing.push('email');

  if (missing.length) {
    return NextResponse.json(
      { error: `Please complete: ${missing.join(', ')}.`, fields: missing },
      { status: 422 }
    );
  }

  const record = await saveRecord('partners', {
    type: 'farm-partner-application',
    farmerName: body.farmerName!.trim(),
    location: body.location!.trim(),
    farmSizeAcres: Number(body.farmSizeAcres),
    cropTypes: body.cropTypes,
    waterSource: body.waterSource ?? '',
    phone: body.phone!.trim(),
    email: body.email!.trim(),
    notes: body.notes ?? '',
    farmPhotoUrl: body.farmPhotoUrl ?? null,
    status: 'new',
  });

  const summary = [
    `New farm partner application ${record.id}`,
    '',
    `Farmer:    ${body.farmerName}`,
    `Location:  ${body.location}`,
    `Size:      ${body.farmSizeAcres} acres`,
    `Crops:     ${body.cropTypes!.join(', ')}`,
    `Water:     ${body.waterSource ?? 'not stated'}`,
    `Phone:     ${body.phone}`,
    `Email:     ${body.email}`,
    body.farmPhotoUrl ? `Photo:     ${body.farmPhotoUrl}` : 'Photo:     none uploaded',
    body.notes ? `\nNotes: ${body.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const [whatsapp, mail] = await Promise.all([
    sendWhatsApp(summary),
    sendMail({
      to: body.email,
      replyTo: process.env.MAIL_TO,
      subject: `We have your farm partnership application (${record.id})`,
      text: [
        `Hello ${body.farmerName},`,
        '',
        'Thank you for applying to the Canaan Harvest farm partnership programme.',
        '',
        `We have recorded ${body.farmSizeAcres} acres at ${body.location}, growing ${body.cropTypes!.join(', ')}.`,
        `Your reference is ${record.id}.`,
        '',
        'A field officer will contact you within five working days to arrange an assessment visit.',
        '',
        'Canaan Harvest Agribusiness',
        'WhatsApp: 0112 272 061',
      ].join('\n'),
    }),
  ]);

  return NextResponse.json({
    ok: true,
    id: record.id,
    message: `Application received. Your reference is ${record.id} — a field officer will be in touch within five working days.`,
    whatsappSent: whatsapp.sent,
    emailSent: mail.sent,
  });
}
