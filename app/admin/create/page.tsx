'use client';
// app/admin/create/page.tsx
'use client';

import { useState } from 'react';

type DraftItem = { name: string; qty: number };

export default function CreateEventPage() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [items, setItems] = useState<DraftItem[]>([{ name: '', qty: 0 }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateItem(i: number, patch: Partial<DraftItem>) {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  }
  function addRow() {
    setItems(prev => [...prev, { name: '', qty: 0 }]);
  }
  function removeRow(i: number) {
    setItems(prev => prev.filter((_, idx) => idx !== i));
  }

  async function submit() {
    setSaving(true);
    setError(null);
    try {
      const clean = items
        .map(it => ({ name: it.name.trim(), qty: Number(it.qty || 0) }))
        .filter(it => it.name);
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), date: date || undefined, venue: venue || undefined, menu: clean }),
      });
      if (!res.ok) throw new Error('Failed to create');
      const ev = await res.json();
      window.location.href = `/admin/events/${ev.id}`;
    } catch (e:any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Create Event</h1>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Event Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="e.g., Ade & Fola Wedding" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium">Venue</label>
            <input value={venue} onChange={e=>setVenue(e.target.value)} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="City / Hall" />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 text-sm font-medium">Menu Items (name + available qty)</div>
          <div className="space-y-2">
            {items.map((it, i)=>(
              <div key={i} className="grid grid-cols-6 gap-2">
                <input className="col-span-4 rounded-md border px-3 py-2" placeholder="Dish name" value={it.name} onChange={e=>updateItem(i,{name:e.target.value})}/>
                <input className="col-span-1 rounded-md border px-3 py-2" type="number" min={0} value={it.qty} onChange={e=>updateItem(i,{qty: Number(e.target.value)})}/>
                <button type="button" onClick={()=>removeRow(i)} className="col-span-1 rounded-md border px-3 py-2">Remove</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addRow} className="mt-3 rounded-md border px-3 py-2">Add Item</button>
        </div>

        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="pt-4">
          <button onClick={submit} disabled={saving || !name.trim()} className="rounded-md bg-emerald-600 px-4 py-2 text-white disabled:opacity-50">
            {saving ? 'Creating…' : 'Create Event'}
          </button>
        </div>
      </div>
    </div>
  );
}
