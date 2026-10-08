import { NextResponse } from 'next/server';
import { saveRecord } from '@/lib/store';
import { sendMail } from '@/lib/mail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface DarajaCallback {
  Body?: {
    stkCallback?: {
      MerchantRequestID?: string;
      CheckoutRequestID?: string;
      ResultCode?: number;
      ResultDesc?: string;
      CallbackMetadata?: { Item?: { Name: string; Value?: string | number }[] };
    };
  };
}

/**
 * POST /api/subscription/callback
 * Safaricom Daraja posts STK push outcomes here. We persist the result for
 * reconciliation and email the subscriber on success.
 *
 * Always answers 200 with the Daraja-expected acknowledgement shape, even on
 * an unrecognised payload, so Safaricom does not retry indefinitely.
 */
export async function POST(request: Request) {
  let payload: DarajaCallback;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }

  const callback = payload.Body?.stkCallback;
  if (!callback) {
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }

  const meta = Object.fromEntries(
    (callback.CallbackMetadata?.Item ?? []).map((item) => [item.Name, item.Value])
  );

  const succeeded = callback.ResultCode === 0;

  await saveRecord('subscriptions', {
    type: 'mpesa-callback',
    checkoutRequestId: callback.CheckoutRequestID ?? '',
    merchantRequestId: callback.MerchantRequestID ?? '',
    resultCode: callback.ResultCode ?? -1,
    resultDesc: callback.ResultDesc ?? '',
    amount: meta.Amount ?? null,
    mpesaReceiptNumber: meta.MpesaReceiptNumber ?? null,
    transactionDate: meta.TransactionDate ?? null,
    phone: meta.PhoneNumber ?? null,
    status: succeeded ? 'paid' : 'failed',
  });

  if (succeeded && meta.MpesaReceiptNumber) {
    console.info(
      `[mpesa] Payment confirmed: receipt ${meta.MpesaReceiptNumber}, KES ${meta.Amount}`
    );
  } else {
    console.warn(`[mpesa] Payment not completed: ${callback.ResultDesc}`);
  }

  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
}
