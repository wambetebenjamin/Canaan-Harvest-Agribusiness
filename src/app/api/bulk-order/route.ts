import { NextResponse } from 'next/server';
import { saveRecord } from '@/lib/store';
import { sendMail } from '@/lib/mail';
import { sendWhatsApp } from '@/lib/whatsapp';
import { isCaptchaConfigured, verifyCaptcha, verifyCaptchaV2 } from '@/lib/captcha-server';
import { V2_CODE } from '@/lib/codes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface OrderItem {
  produce: string;
  quantity: string;
  packSize?: string;
}

interface BulkOrderBody {
  businessName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  deliveryAddress?: string;
  frequency?: string;
  deliveryDay?: string;
  notes?: string;
  items?: OrderItem[];
  captchaToken?: string;
  captchaVersion?: 'v2' | 'v3';
  captchaAction?: string;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/**
 * POST /api/bulk-order
 * Verifies reCAPTCHA → saves the order to Vercel KV → sends a WhatsApp
 * notification and an email confirmation. Each downstream step degrades
 * gracefully when its credentials are absent.
 */
export async function POST(request: Request) {
  let body: BulkOrderBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  /* ── CAPTCHA ─────────────────────────────────────────────────────────── */
  if (isCaptchaConfigured()) {
    const captcha =
      body.captchaVersion === 'v2'
        ? await verifyCaptchaV2(body.captchaToken)
        : await verifyCaptcha(body.captchaToken, body.captchaAction ?? 'bulk_order');

    if (!captcha.ok) {
      return NextResponse.json(
        {
          error: captcha.reason ?? 'Verification failed.',
          code: captcha.requiresV2 ? V2_CODE : undefined,
        },
        { status: 400 }
      );
    }
  }

  /* ── Validation ──────────────────────────────────────────────────────── */
  const missing: string[] = [];
  if (!body.businessName?.trim()) missing.push('businessName');
  if (!body.contactName?.trim()) missing.push('contactName');
  if (!body.phone?.trim()) missing.push('phone');
  if (!body.email?.trim() || !isEmail(body.email)) missing.push('email');
  if (!body.deliveryAddress?.trim()) missing.push('deliveryAddress');

  const items = (body.items ?? []).filter(
    (i) => i.produce?.trim() && i.quantity?.trim()
  );
  if (!items.length) missing.push('items');

  if (missing.length) {
    return NextResponse.json(
      { error: `Please complete: ${missing.join(', ')}.`, fields: missing },
      { status: 422 }
    );
  }

  /* ── Persist ─────────────────────────────────────────────────────────── */
  let record;
  try {
    record = await saveRecord('orders', {
      type: 'bulk-order',
      businessName: body.businessName!.trim(),
      contactName: body.contactName!.trim(),
      phone: body.phone!.trim(),
      email: body.email!.trim(),
      deliveryAddress: body.deliveryAddress!.trim(),
      frequency: body.frequency ?? 'Once',
      deliveryDay: body.deliveryDay ?? '',
      notes: body.notes ?? '',
      items,
      status: 'new',
    });
  } catch (error) {
    console.error('[bulk-order] persist failed:', error);
    return NextResponse.json(
      { error: 'We could not save your order. Please try again or call us.' },
      { status: 500 }
    );
  }

  /* ── Notify ──────────────────────────────────────────────────────────── */
  const itemLines = items
    .map((i) => `• ${i.produce} — ${i.quantity}${i.packSize ? ` (${i.packSize})` : ''}`)
    .join('\n');

  const summary = [
    `New bulk order ${record.id}`,
    '',
    `Business:  ${body.businessName}`,
    `Contact:   ${body.contactName}`,
    `Phone:     ${body.phone}`,
    `Email:     ${body.email}`,
    `Address:   ${body.deliveryAddress}`,
    `Frequency: ${body.frequency ?? 'Once'}`,
    body.deliveryDay ? `Day:       ${body.deliveryDay}` : '',
    '',
    'Items:',
    itemLines,
    body.notes ? `\nNotes: ${body.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const [whatsapp, mail] = await Promise.all([
    sendWhatsApp(summary),
    sendMail({
      to: body.email,
      replyTo: process.env.MAIL_TO,
      subject: `We have your bulk order (${record.id}) — Canaan Harvest`,
      text: [
        `Hello ${body.contactName},`,
        '',
        'Thank you for your bulk order request. Here is what we received:',
        '',
        itemLines,
        '',
        `Delivery address: ${body.deliveryAddress}`,
        `Preferred frequency: ${body.frequency ?? 'Once'}`,
        '',
        `Your reference is ${record.id}. We will confirm availability and a delivery window within one working day.`,
        '',
        'Canaan Harvest Agribusiness',
        'WhatsApp: 0112 272 061',
      ].join('\n'),
    }),
  ]);

  return NextResponse.json({
    ok: true,
    id: record.id,
    message: `Order received. Your reference is ${record.id} — we will confirm within one working day.`,
    whatsappSent: whatsapp.sent,
    whatsappDeepLink: whatsapp.deepLink,
    emailSent: mail.sent,
  });
}
