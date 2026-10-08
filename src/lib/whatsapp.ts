/**
 * WhatsApp Business notification.
 *
 * Uses the Cloud API when WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID
 * are present. Otherwise the composed message is logged and the caller also
 * receives a pre-filled click-to-chat link, so an operator can act on the
 * notification immediately without the API being wired up.
 */

const GRAPH_URL = 'https://graph.facebook.com/v21.0';

export function isWhatsAppConfigured(): boolean {
  return Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
}

export function whatsappDeepLink(message: string): string {
  const number = process.env.WHATSAPP_NUMBER ?? '254112272061';
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export async function sendWhatsApp(
  message: string
): Promise<{ sent: boolean; skipped?: boolean; deepLink: string; error?: string }> {
  const deepLink = whatsappDeepLink(message);

  if (!isWhatsAppConfigured()) {
    console.info(
      [
        '\n──────── WHATSAPP (API not configured — logged instead) ────────',
        message,
        '',
        `Click-to-send: ${deepLink}`,
        '───────────────────────────────────────────────────────────────\n',
      ].join('\n')
    );
    return { sent: false, skipped: true, deepLink };
  }

  const to = process.env.WHATSAPP_NUMBER ?? '254112272061';

  try {
    const res = await fetch(
      `${GRAPH_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { preview_url: false, body: message },
        }),
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      return { sent: false, deepLink, error: `WhatsApp API ${res.status}: ${detail.slice(0, 200)}` };
    }
    return { sent: true, deepLink };
  } catch (error) {
    return {
      sent: false,
      deepLink,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
