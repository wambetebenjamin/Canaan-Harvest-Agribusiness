import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/ws — WebSocket presence endpoint for EFFECT-05.
 *
 * IMPORTANT DEPLOYMENT NOTE
 * Vercel's Node.js serverless functions do not support long-lived WebSocket
 * upgrades. Attempting one here would hang the invocation rather than
 * connect, so this route answers honestly with a 501 and a JSON body
 * describing how to enable real presence. The client hook
 * (src/hooks/usePresence.ts) treats any non-upgrade response as "offline"
 * and settles into the graceful single-visitor state.
 *
 * To switch presence on for production, deploy a dedicated WebSocket host
 * (a long-running Node service, Ably, Pusher, PartyKit or similar) and set
 * NEXT_PUBLIC_WS_URL to its endpoint. No client code change is required.
 */
export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      error: 'WebSocket upgrades are not supported on this runtime.',
      code: 'ws_unsupported',
      presence: 'single-visitor-fallback',
      enable: {
        envVar: 'NEXT_PUBLIC_WS_URL',
        detail:
          'Point NEXT_PUBLIC_WS_URL at a dedicated WebSocket host. The client reconnects automatically and will begin reporting live buyer counts and collaborator cursors without any code change.',
      },
    },
    { status: 501 }
  );
}

export async function POST() {
  return NextResponse.json(
    { ok: false, code: 'ws_unsupported', error: 'Use GET for the capability probe.' },
    { status: 501 }
  );
}
