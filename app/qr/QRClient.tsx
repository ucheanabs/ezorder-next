'use client';

import { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';

export default function QRClient() {
  const [qr, setQr] = useState('');
  const [eventId, setEventId] = useState('demo-001');
  const [table, setTable] = useState('1');
  const [seat, setSeat] = useState('A');
  const [name, setName] = useState('');

  const orderUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const p = new URLSearchParams({ eventId, table, seat });
    if (name) p.set('name', name);
    return `${origin}/order?${p.toString()}`;
  }, [eventId, table, seat, name]);

  useEffect(() => {
    if (!orderUrl) return;
    QRCode.toDataURL(orderUrl, { width: 320, margin: 2 })
      .then(setQr)
      .catch(() => setQr(''));
  }, [orderUrl]);

  const inputCls =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-emerald-200';

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="flex items-center justify-between">
          <div className="text-2xl font-bold text-emerald-800">EZ Order</div>
          <a href="/" className="text-sm text-slate-600 hover:text-slate-900">Home</a>
        </header>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
            <div className="text-sm font-semibold text-emerald-700">Scan to Order</div>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Instant table ordering</h1>
            <p className="mt-2 text-slate-600">Point your camera at the code to open the ordering page.</p>

            <div className="mt-8 flex items-center justify-center">
              {qr ? (
                <img src={qr} alt="QR Code" className="rounded-2xl bg-white p-4 shadow-xl" />
              ) : (
                <div className="h-80 w-80 animate-pulse rounded-2xl bg-emerald-100" />
              )}
            </div>

            <div className="mt-6 flex items-center justify-center">
              <a
                href={orderUrl}
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Try the ordering flow
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-700">Demo parameters</div>
            <div className="mt-4 grid gap-4">
              <Field label="Event ID">
                <input value={eventId} onChange={e=>setEventId(e.target.value)} className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Table">
                  <input value={table} onChange={e=>setTable(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Seat">
                  <input value={seat} onChange={e=>setSeat(e.target.value)} className={inputCls} />
                </Field>
              </div>
              <Field label="Name (optional)">
                <input value={name} onChange={e=>setName(e.target.value)} className={inputCls} />
              </Field>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 break-all">
                {orderUrl || 'Building link…'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({label, children}:{label:string; children:React.ReactNode}) {
  return (
    <label className="block text-sm">
      <div className="mb-1 font-medium text-slate-700">{label}</div>
      {children}
    </label>
  );
}
