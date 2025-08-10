// app/admin/events/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';

type MenuItem = { id: string; name: string; qty: number };
type Event = { id: string; name: string; date?: string; venue?: string; isOpen: boolean; menu: MenuItem[] };

export default function EventDetail({ params }: { params: { id: string }}) {
  const [ev, setEv] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch(`/api/events/${params.id}`, { cache: 'no-store' });
    if (res.ok) setEv(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function toggleOpen() {
    if (!ev) return;
    setSaving(true);
    await fetch(`/api/events/${ev.id}`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ isOpen: !ev.isOpen }) });
    await load();
    setSaving(false);
  }

  if (!ev) return <div className="mx-auto max-w-3xl px-4 py-8 text-slate-600">Loading…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{ev.name}</h1>
          <div className="text-sm text-slate-600">{ev.date || 'No date'} • {ev.venue || 'No venue'}</div>
        </div>
        <div className="flex gap-2">
          <a className="rounded-md border px-3 py-2 text-sm" href={`/qr?eventId=${encodeURIComponent(ev.id)}`}>Generate QR</a>
          <a className="rounded-md border px-3 py-2 text-sm" href={`/order?eventId=${encodeURIComponent(ev.id)}`} target="_blank">Preview Guest View</a>
          <button onClick={toggleOpen} disabled={saving} className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white">{ev.isOpen ? 'Close Event' : 'Open Event'}</button>
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-white p-4">
        <div className="text-lg font-semibold">Menu ({ev.menu.length})</div>
        <ul className="mt-3 list-inside list-disc text-sm">
          {ev.menu.map(m => (<li key={m.id}>{m.name} – qty {m.qty}</li>))}
        </ul>
      </div>
    </div>
  );
}
