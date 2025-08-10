'use client';
// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';

type MenuItem = { id: string; name: string; qty: number };
type Event = { id: string; name: string; date?: string; venue?: string; isOpen: boolean; createdAt: number; menu: MenuItem[] };

export default function AdminHome() {
  const [events, setEvents] = useState<Event[] | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/events', { cache: 'no-store' });
      const json = await res.json();
      setEvents(json.events || []);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin – Events</h1>
        <a href="/admin/create" className="rounded-md bg-emerald-600 px-4 py-2 text-white">Create Event</a>
      </div>

      {!events && <div className="mt-8 text-slate-600">Loading…</div>}
      {events && events.length === 0 && <div className="mt-8 text-slate-600">No events yet. Create one to begin.</div>}

      {events && events.length > 0 && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {events.map(ev => (
            <div key={ev.id} className="rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{ev.name}</div>
                  <div className="text-sm text-slate-600">{ev.date || 'No date'} • {ev.venue || 'No venue'}</div>
                  <div className="mt-1 text-xs text-slate-500">{ev.menu.length} dishes • {ev.isOpen ? 'Open' : 'Closed'}</div>
                </div>
                <a className="text-emerald-700 underline" href={`/admin/events/${ev.id}`}>Manage</a>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a className="rounded-md border px-3 py-1 text-sm" href={`/qr?eventId=${encodeURIComponent(ev.id)}`}>Generate QR</a>
                <a className="rounded-md border px-3 py-1 text-sm" href={`/order?eventId=${encodeURIComponent(ev.id)}`} target="_blank">Preview Guest View</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
