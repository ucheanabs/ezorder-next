'use client';
// @ts-nocheck
import { useEffect, useState } from 'react';

type MenuItem = { id?: string; name: string; price: number; qty: number };
type Event = { id: string; name: string; date: string; venue: string; menu: MenuItem[]; createdAt: number };

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [menu, setMenu] = useState<MenuItem[]>([{ name: '', price: 0, qty: 0 }]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setError(null);
    try {
      const res = await fetch('/api/events', { cache: 'no-store' });
      const j = await res.json();
      setEvents(j.events || []);
    } catch (e:any) {
      setError('Failed to load events');
    }
  }
  useEffect(()=>{ refresh(); },[]);

  function addRow() { setMenu(m => [...m, { name:'', price:0, qty:0 }]); }
  function removeRow(i:number) { setMenu(m => m.filter((_,idx)=>idx!==i)); }
  function updateRow(i:number, field:keyof MenuItem, val:any) {
    setMenu(m => m.map((row,idx)=> idx===i ? {...row, [field]: field==='name' ? val : Number(val)} : row));
  }

  async function createEvent(e:any) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const clean = menu
        .filter(m => m.name.trim() !== '')
        .map(m => ({ id: m.id || m.name.toLowerCase().replace(/\s+/g,'_'), name: m.name, price: Number(m.price||0), qty: Number(m.qty||0) }));
      const res = await fetch('/api/events', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ name, date, venue, menu: clean })
      });
      if (!res.ok) throw new Error('create failed');
      setName(''); setDate(''); setVenue(''); setMenu([{ name:'', price:0, qty:0 }]);
      await refresh();
    } catch (e:any) {
      setError('Could not create event');
    } finally {
      setBusy(false);
    }
  }

  async function removeEvent(id:string) {
    setBusy(true);
    try {
      await fetch(`/api/events/${encodeURIComponent(id)}`, { method:'DELETE' });
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-emerald-700">Admin</h1>

      <form onSubmit={createEvent} className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Create Event</h2>
        {error && <div className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <div className="grid gap-4 md:grid-cols-3">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Event name" className="rounded-md border px-3 py-2" required />
          <input value={date} onChange={e=>setDate(e.target.value)} type="date" className="rounded-md border px-3 py-2" required />
          <input value={venue} onChange={e=>setVenue(e.target.value)} placeholder="Venue" className="rounded-md border px-3 py-2" required />
        </div>

        <div className="mt-6">
          <div className="mb-2 text-sm font-medium">Menu items</div>
          <div className="grid gap-2">
            {menu.map((row,i)=>(
              <div key={i} className="grid grid-cols-12 gap-2">
                <input className="col-span-6 rounded-md border px-3 py-2" placeholder="Name" value={row.name} onChange={e=>updateRow(i,'name',e.target.value)} />
                <input className="col-span-3 rounded-md border px-3 py-2" placeholder="Price" type="number" value={row.price} onChange={e=>updateRow(i,'price',e.target.value)} />
                <input className="col-span-2 rounded-md border px-3 py-2" placeholder="Qty" type="number" value={row.qty} onChange={e=>updateRow(i,'qty',e.target.value)} />
                <button type="button" onClick={()=>removeRow(i)} className="col-span-1 rounded-md border px-2 text-sm">✕</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addRow} className="mt-3 rounded-md border px-3 py-2 text-sm">Add item</button>
        </div>

        <button disabled={busy} className="mt-6 rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white disabled:opacity-50">
          {busy ? 'Saving…' : 'Create event'}
        </button>
      </form>

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Events</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((ev)=>(
            <div key={ev.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{ev.name}</div>
                  <div className="text-sm text-gray-500">{ev.date} · {ev.venue}</div>
                </div>
                <button onClick={()=>removeEvent(ev.id)} className="rounded-md border px-3 py-1 text-sm">Delete</button>
              </div>
              <div className="mt-3 text-sm text-gray-600">{ev.menu.length} items</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a className="rounded-md border px-3 py-1 text-sm" href={`/order?eventId=${encodeURIComponent(ev.id)}`} target="_blank">Open Order Page</a>
                <a className="rounded-md border px-3 py-1 text-sm" href={`/qr?url=${encodeURIComponent(`/order?eventId=${encodeURIComponent(ev.id)}`)}`} target="_blank">Show QR</a>
                <a className="rounded-md border px-3 py-1 text-sm" href={`/api/events/${encodeURIComponent(ev.id)}`} target="_blank">View JSON</a>
              </div>
            </div>
          ))}
          {events.length===0 && <div className="text-sm text-gray-500">No events yet.</div>}
        </div>
      </div>
    </div>
  );
}
