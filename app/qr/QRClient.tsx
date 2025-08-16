'use client';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export default function QRClient({ href }: { href: string }) {
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const [copied, setCopied] = useState(false);
  useEffect(()=>{ if (canvasRef.current) QRCode.toCanvas(canvasRef.current, href, { width: 260 }); }, [href]);
  async function copy(){ try{ await navigator.clipboard.writeText(href); setCopied(true); setTimeout(()=>setCopied(false),1200);}catch{} }
  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-semibold text-emerald-700">Scan to Order</h1>
      <canvas ref={canvasRef} className="rounded-xl border bg-white p-3" />
      <div className="mt-4 break-all rounded-lg border bg-white p-3 text-sm">{href}</div>
      <button onClick={copy} className="mt-3 rounded-md bg-emerald-600 px-4 py-2 text-white">{copied?'Copied!':'Copy link'}</button>
    </div>
  );
}
