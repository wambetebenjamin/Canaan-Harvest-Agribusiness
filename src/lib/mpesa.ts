/**
 * M-Pesa Daraja API adapter for recurring subscription billing.
 *
 * Sandbox and production endpoints are selected by MPESA_ENVIRONMENT.
 * Without consumer key/secret the module returns a clearly-labelled
 * simulated result so the subscription flow completes in development and
 * previews; the response shape mirrors Daraja's STK push contract so the UI
 * needs no branching.
 */

const BASE =
  process.env.MPESA_ENVIRONMENT === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

export interface StkPushResult {
  ok: boolean;
  simulated: boolean;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  customerMessage?: string;
  error?: string;
}

export function isMpesaConfigured(): boolean {
  return Boolean(process.env.MPESA_CONSUMER_KEY && process.env.MPESA_CONSUMER_SECRET);
}

function timestamp(): string {
  const d = new Date();
  const p = (n: number, w = 2) => String(n).padStart(w, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(
    d.getMinutes()
  )}${p(d.getSeconds())}`;
}

/** Normalises Kenyan numbers to the 2547XXXXXXXX form Daraja requires. */
export function normaliseMsisdn(input: string): string | null {
  const digits = input.replace(/[^\d]/g, '');
  if (/^254(7|1)\d{8}$/.test(digits)) return digits;
  if (/^0(7|1)\d{8}$/.test(digits)) return `254${digits.slice(1)}`;
  if (/^(7|1)\d{8}$/.test(digits)) return `254${digits}`;
  return null;
}

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const res = await fetch(`${BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Daraja auth failed (${res.status})`);
  const data: { access_token: string } = await res.json();
  return data.access_token;
}

export async function initiateStkPush(params: {
  phone: string;
  amount: number;
  accountReference: string;
  description: string;
}): Promise<StkPushResult> {
  const msisdn = normaliseMsisdn(params.phone);

  if (!msisdn) {
    return { ok: false, simulated: false, error: 'Enter a valid Kenyan phone number, e.g. 0712 345 678.' };
  }

  if (!isMpesaConfigured()) {
    console.info(
      `[mpesa] Simulated STK push → ${msisdn}, KES ${params.amount}, ref ${params.accountReference}`
    );
    return {
      ok: true,
      simulated: true,
      checkoutRequestId: `SIM-${Date.now().toString(36)}`,
      merchantRequestId: 'SIMULATED',
      customerMessage:
        'M-Pesa is not configured in this environment. Your subscription has been recorded and a real STK push will fire once Daraja credentials are added.',
    };
  }

  const ts = timestamp();
  const shortcode = process.env.MPESA_SHORTCODE ?? '174379';
  const password = Buffer.from(
    `${shortcode}${process.env.MPESA_PASSKEY ?? ''}${ts}`
  ).toString('base64');

  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: ts,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.max(1, Math.round(params.amount)),
        PartyA: msisdn,
        PartyB: shortcode,
        PhoneNumber: msisdn,
        CallBackURL:
          process.env.MPESA_CALLBACK_URL ??
          'https://canaanharvest.co.ke/api/subscription/callback',
        AccountReference: params.accountReference.slice(0, 12),
        TransactionDesc: params.description.slice(0, 13),
      }),
      cache: 'no-store',
    });

    const data = await res.json();

    if (data.ResponseCode === '0') {
      return {
        ok: true,
        simulated: false,
        checkoutRequestId: data.CheckoutRequestID,
        merchantRequestId: data.MerchantRequestID,
        customerMessage: data.CustomerMessage,
      };
    }

    return {
      ok: false,
      simulated: false,
      error: data.errorMessage ?? data.ResponseDescription ?? 'M-Pesa request was rejected.',
    };
  } catch (error) {
    return {
      ok: false,
      simulated: false,
      error: error instanceof Error ? error.message : 'M-Pesa request failed.',
    };
  }
}
