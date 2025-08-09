'use client';
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useMemo, useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function QRGenerator() {
  const [eventId, setEventId] = useState('demo-001');
  const [tableStart, setTableStart] = useState(1);
  const [tableEnd, setTableEnd] = useState(10);
  const [seats, setSeats] = useState('A,B,C,D');
  const [origin, setOrigin] = useState<string>('');

  // Only read window.location on the client
  useEffect(() => {
    if (typeof window !== 'undefined') setOrigin(window.location.origin);
  }, []);

  const targets = useMemo(() => {
    const arr: string[] = [];
    for (let t = tableStart; t <= tableEnd; t++) {
      const seatList = seats.trim() ? seats.split(',').map(s => s.trim()) : [''];
      seatList.forEach(seat => {
        const path = `/order?eventId=${encodeURIComponent(eventId)}&table=${t}${seat ? `&seat=${encodeURIComponent(seat)}` : ''}`;
        // Use absolute URL in the browser, relative string during SSR to avoid invalid URL
        arr.push(origin ? `${origin}${path}` : path);
      });
    }
    return arr;
  }, [eventId, tableStart, tableEnd, seats, origin]);

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold text-emerald-700">QR Generator</h1>
      <div className="grid md:grid-cols-4 gap-3">
        <label className="flex flex-col gap-1">
          <span>Event ID</span>
          <input className="border rounded px-3 py-2" value={eventId} onChange={e=>setEventId(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          <span>Table Start</span>
          <input type="number" className="border rounded px-3 py-2" value={tableStart} onChange={e=>setTableStart(parseInt(e.target.value||'1',10))} />
        </label>
        <label className="flex flex-col gap-1">
          <span>Table End</span>
          <input type="number" className="border rounded px-3 py-2" value={tableEnd} onChange={e=>setTableEnd(parseInt(e.target.value||'1',10))} />
        </label>
        <label className="flex flex-col gap-1">
          <span>Seats (comma-sep, optional)</span>
          <input className="border rounded px-3 py-2" value={seats} onChange={e=>setSeats(e.target.value)} placeholder="A,B,C,D or empty" />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {targets.map((url, i) => <QRCard key={i} url={url} />)}
      </div>
    </main>
  );
}

function QRCard({ url }: { url: string }) {
  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    // Generate QR only in the browser; relative or absolute both work for scanners
    QRCode.toDataURL(url, { margin: 1, width: 300 }).then(setSrc).catch(() => setSrc(''));
  }, [url]);

  // Avoid `new URL()` on the server — parse the query by hand
  const qs = url.includes('?') ? url.split('?')[1] : '';
  const params = new URLSearchParams(qs);
  const eventId = params.get('eventId') || '';
  const table = params.get('table') || '';
  const seat = params.get('seat') || '';

  return (
    <div className="border rounded-2xl p-4 bg-white shadow">
      <div className="text-sm text-gray-600 mb-2">{eventId}</div>
      {src && <img src={src} alt="QR" className="w-full rounded" />}
      <div className="mt-2 font-semibold">Table {table}{seat ? ` · Seat ${seat}` : ''}</div>
      <div className="text-xs text-gray-500 break-all mt-1">{url}</div>
    </div>
  );
}
