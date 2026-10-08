import { NextResponse } from 'next/server';
import { saveRecord } from '@/lib/store';
import { sendMail } from '@/lib/mail';
import { sendWhatsApp } from '@/lib/whatsapp';
import { initiateStkPush, isMpesaConfigured, normaliseMsisdn } from '@/lib/mpesa';
import { isCaptchaConfigured, verifyCaptcha, verifyCaptchaV2 } from '@/lib/captcha-server';
import { V2_CODE } from '@/lib/codes';
import { BOXES } from '@/data/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/subscription
 * Records a weekly box signup in Vercel KV and triggers M-Pesa Daraja
 * recurring billing. When Daraja credentials are absent the payment is
 * simulated (clearly labelled in the response) so the flow completes.
 */
export async function POST(request: Request) {
  let body: {
    boxId?: string;
    fullName?: string;
    phone?: string;
    email?: string;
    deliveryAddress?: string;
    preferredDay?: string;
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
        : await verifyCaptcha(body.captchaToken, body.captchaAction ?? 'subscription');

    if (!captcha.ok) {
      return NextResponse.json(
        { error: captcha.reason, code: captcha.requiresV2 ? V2_CODE : undefined },
        { status: 400 }
      );
    }
  }

  /* ── Validate against the real box catalogue, never a client-sent price ── */
  const box = BOXES.find((b) => b.id === body.boxId);
  if (!box) {
    return NextResponse.json({ error: 'Choose a subscription box.' }, { status: 422 });
  }

  const missing: string[] = [];
  if (!body.fullName?.trim()) missing.push('fullName');
  if (!body.phone?.trim()) missing.push('phone');
  if (!body.email?.trim()) missing.push('email');
  if (!body.deliveryAddress?.trim()) missing.push('deliveryAddress');
  if (missing.length) {
    return NextResponse.json(
      { error: `Please complete: ${missing.join(', ')}.`, fields: missing },
      { status: 422 }
    );
  }

  const msisdn = normaliseMsisdn(body.phone!);
  if (!msisdn) {
    return NextResponse.json(
      { error: 'Enter a valid Kenyan M-Pesa number, e.g. 0712 345 678.' },
      { status: 422 }
    );
  }

  /* ── Persist ─────────────────────────────────────────────────────────── */
  const record = await saveRecord('subscriptions', {
    type: 'weekly-box',
    boxId: box.id,
    boxName: box.name,
    pricePerWeek: box.pricePerWeek,
    fullName: body.fullName!.trim(),
    phone: msisdn,
    email: body.email!.trim(),
    deliveryAddress: body.deliveryAddress!.trim(),
    preferredDay: body.preferredDay ?? 'Tuesday',
    status: 'pending-payment',
  });

  /* ── M-Pesa STK push ─────────────────────────────────────────────────── */
  const payment = await initiateStkPush({
    phone: msisdn,
    amount: box.pricePerWeek,
    accountReference: record.id,
    description: 'Weekly box',
  });

  if (!payment.ok) {
    return NextResponse.json(
      {
        error: payment.error ?? 'We could not start the M-Pesa payment.',
        id: record.id,
      },
      { status: 502 }
    );
  }

  /* ── Notify ──────────────────────────────────────────────────────────── */
  await Promise.all([
    sendWhatsApp(
      [
        `New subscription ${record.id}`,
        '',
        `Box:      ${box.name} — KES ${box.pricePerWeek}/week`,
        `Name:     ${body.fullName}`,
        `Phone:    ${msisdn}`,
        `Email:    ${body.email}`,
        `Address:  ${body.deliveryAddress}`,
        `Day:      ${body.preferredDay ?? 'Tuesday'}`,
        '',
        payment.simulated
          ? 'PAYMENT: simulated (Daraja not configured)'
          : `Payment: STK push sent, checkout ${payment.checkoutRequestId}`,
      ].join('\n')
    ),
    sendMail({
      to: body.email,
      subject: `Your ${box.name} subscription is set up — Canaan Harvest`,
      text: [
        `Hello ${body.fullName},`,
        '',
        `Your ${box.name} subscription is recorded at KES ${box.pricePerWeek} per week.`,
        payment.simulated
          ? 'M-Pesa is not configured in this environment, so no live payment request was sent. Your subscription is saved and billing will begin once Daraja credentials are added.'
          : 'An M-Pesa request has been sent to your phone. Enter your PIN to authorise the first weekly payment.',
        '',
        `Delivery: ${body.deliveryAddress}`,
        `Preferred day: ${body.preferredDay ?? 'Tuesday'}`,
        `Reference: ${record.id}`,
        '',
        'You can pause or change your box any time by replying to this email or messaging us on WhatsApp.',
        '',
        'Canaan Harvest Agribusiness',
      ].join('\n'),
    }),
  ]);

  return NextResponse.json({
    ok: true,
    id: record.id,
    simulatedPayment: payment.simulated,
    mpesaConfigured: isMpesaConfigured(),
    checkoutRequestId: payment.checkoutRequestId,
    message: payment.simulated
      ? `Subscription recorded. ${payment.customerMessage ?? ''}`
      : `An M-Pesa request for KES ${box.pricePerWeek} has been sent to ${msisdn}. Enter your PIN to confirm.`,
  });
}
