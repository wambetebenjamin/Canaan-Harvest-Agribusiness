'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * EFFECT-05 — live buyer presence.
 *
 * Connects to the WebSocket endpoint advertised by NEXT_PUBLIC_WS_URL
 * (defaulting to same-origin `/api/ws`). Behaviour:
 *
 *   • optimistic local join on mount, before the socket reports anything,
 *     so the board never flashes an empty state
 *   • exponential backoff reconnect with jitter, capped at 30s
 *   • heartbeat pings keep the presence row alive
 *   • graceful single-visitor state when the socket cannot be reached —
 *     the board still renders, it simply stops claiming other buyers
 *
 * NOTE ON DEPLOYMENT: Vercel's serverless runtime does not keep long-lived
 * WebSocket connections open. `/api/ws` therefore answers the handshake
 * politely and closes; the hook falls back to the single-visitor state. To
 * enable true multi-user presence in production, point NEXT_PUBLIC_WS_URL at
 * a dedicated WebSocket host. See docs/DECISIONS.md.
 */

export interface RemoteCursor {
  id: string;
  color: string;
  label: string;
  /** Normalised 0–1 coordinates within the produce grid. */
  x: number;
  y: number;
  updatedAt: number;
}

export interface PresenceState {
  count: number;
  cursors: RemoteCursor[];
  connected: boolean;
}

const CURSOR_COLORS = ['#116530', '#d9a13a', '#c8553d', '#2f6f8f', '#7a4f9c', '#2f8f4e'];
const NAMES = ['Hotel buyer', 'Restaurant', 'Exporter', 'Household', 'Supermarket', 'Café'];

const HEARTBEAT_MS = 20_000;
const CURSOR_TTL_MS = 12_000;

export function usePresence(): PresenceState {
  const [count, setCount] = useState(1); // optimistic: this visitor
  const [cursors, setCursors] = useState<RemoteCursor[]>([]);
  const [connected, setConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const attemptRef = useRef(0);
  const closedRef = useRef(false);
  const heartbeatRef = useRef<number | null>(null);
  const reconnectRef = useRef<number | null>(null);

  const resolveUrl = useCallback((): string | null => {
    const explicit = process.env.NEXT_PUBLIC_WS_URL;
    if (explicit) return explicit;
    if (typeof window === 'undefined') return null;
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${proto}//${window.location.host}/api/ws`;
  }, []);

  useEffect(() => {
    closedRef.current = false;
    let cursorCleanup: number | null = null;

    const connect = () => {
      if (closedRef.current) return;
      const url = resolveUrl();
      if (!url) return;

      let socket: WebSocket;
      try {
        socket = new WebSocket(url);
      } catch {
        scheduleReconnect();
        return;
      }

      wsRef.current = socket;

      socket.onopen = () => {
        attemptRef.current = 0;
        setConnected(true);
        socket.send(JSON.stringify({ type: 'join', role: 'buyer' }));

        // Heartbeat
        if (heartbeatRef.current) window.clearInterval(heartbeatRef.current);
        heartbeatRef.current = window.setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'ping', at: Date.now() }));
          }
        }, HEARTBEAT_MS);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string);
          if (typeof data.count === 'number') {
            setCount(Math.max(1, data.count));
          }
          if (Array.isArray(data.cursors)) {
            setCursors(
              (data.cursors as RemoteCursor[]).filter(
                (c) => Date.now() - c.updatedAt < CURSOR_TTL_MS
              )
            );
          }
        } catch {
          /* ignore malformed frames */
        }
      };

      socket.onclose = () => {
        setConnected(false);
        setCursors([]);
        if (heartbeatRef.current) window.clearInterval(heartbeatRef.current);
        scheduleReconnect();
      };

      socket.onerror = () => {
        // onclose follows; nothing to do beyond letting the fallback stand.
        setConnected(false);
      };
    };

    const scheduleReconnect = () => {
      if (closedRef.current) return;
      attemptRef.current += 1;
      const base = Math.min(30_000, 1000 * 2 ** Math.min(attemptRef.current, 5));
      const jitter = Math.random() * 500;
      reconnectRef.current = window.setTimeout(connect, base + jitter);
    };

    // Expire stale cursors on a timer so dots do not linger.
    cursorCleanup = window.setInterval(() => {
      setCursors((prev) => prev.filter((c) => Date.now() - c.updatedAt < CURSOR_TTL_MS));
    }, 4000);

    connect();

    return () => {
      closedRef.current = true;
      if (heartbeatRef.current) window.clearInterval(heartbeatRef.current);
      if (reconnectRef.current) window.clearTimeout(reconnectRef.current);
      if (cursorCleanup) window.clearInterval(cursorCleanup);
      wsRef.current?.close();
    };
  }, [resolveUrl]);

  return { count, cursors, connected };
}

export function cursorColor(index: number): string {
  return CURSOR_COLORS[index % CURSOR_COLORS.length];
}

export function cursorLabel(index: number): string {
  return NAMES[index % NAMES.length];
}
