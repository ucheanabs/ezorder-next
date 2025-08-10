'use client';
// app/qr/QRClient.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';

export default function QRClient({ href }: { href: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const abs = useMemo(() => {
    if (typeof window === 'undefined') return href;
    const url = new URL(href, window.location.origin);
    return url.toString();
  }, [href]);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, abs, { margin: 1, width: 260 }).catch(() => {});
  }, [abs]);

  async function copy() {
    try { await navigator.clipboard.writeText(abs); setCopied(true); setTimeout(()=>setCopied(false),1500); } catch {}
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-semibold text-emerald-700">Scan to Order</h1>
      <canvas ref={canvasRef} className="rounded-xl border bg-white p-3" />
      <div className="mt-4 break-all rounded-lg border bg-white p-3 text-sm">{abs}</div>
      <button onClick={copy} className="mt-3 rounded-md bg-emerald-600 px-4 py-2 text-white">{copied?'Copied!':'Copy link'}</button>
    </div>
  );
}
