cat > app/admin/page.tsx <<'EOF'
'use client';
import { useEffect, useState } from 'react';

type MenuItem = { name: string; price: number; qty: number };
type Event = { id: string; name: string; date: string; venue: string; menu: MenuItem[]; createdAt: number };

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [menu, setMenu] = useState<MenuItem[]>([{ name: '', price: 0, qty: 0 }]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/events', { cache: 'no-store' });
      const data = await res.json();
      setEvents(Array.isArray(data.events) ? data.events : []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const addDish = () => setMenu(m => [...m, { name: '', price: 0, qty: 0 }]);
  const removeDish = (idx: number) => setMenu(m => m.filter((_, i) => i !== idx));
  const updateDish = (idx: number, field: keyof MenuItem, value: string) => {
    setMenu(m => {
      const copy = [...m];
      (copy[idx] as any)[field] = (field === 'price' || field === 'qty') ? Number(value || 0) : value;
      return copy;
    });
  };

  const canSubmit = name.trim() !== '' && menu.some(d => d.name.trim() !== '');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const clean = menu
      .filter(d => d.name.trim() !== '')
      .map(d => ({ name: d.name.trim(), price: Number(d.price) || 0, qty: Number(d.qty) || 0 }));
    const body = { name: name.trim(), date: date.trim(), venue: venue.trim(), menu: clean };
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) { setMsg('Failed to create event'); return; }
    setName(''); setDate(''); setVenue(''); setMenu([{ name: '', price: 0, qty: 0 }]);
    await load();
    setMsg('Event created');
  }

  function orderLink(id: string) {
    if (typeof window === 'undefined') return `/order?eventId=${id}`;
    return `${window.location.origin}/order?eventId=${id}&table=1&seat=A`;
  }

  async function onDelete(id: string) {
    if (!confirm('Delete this event?')) return;
    await fetch(`/api/events/${encodeURIComponent(id)}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-emerald-700">Admin: Create Event</h1>

      <form onSubmit={onSubmit} className="card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="input" placeholder="Event name" value={name} onChange={e => setName(e.target.value)} />
          <input className="input" placeholder="Date (e.g. 2025-08-15)" value={date} onChange={e => setDate(e.target.value)} />
          <input className="input" placeholder="Venue" value={venue} onChange={e => setVenue(e.target.value)} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Menu Items</h2>
            <button type="button" className="btn btn-primary" onClick={addDish}>+ Add Dish</button>
          </div>
          {menu.map((d, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <input className="input md:col-span-6" placeholder="Name" value={d.name} onChange={e => updateDish(idx, 'name', e.target.value)} />
              <input className="input md:col-span-3" placeholder="Price (₦)" type="number" min="0" value={d.price} onChange={e => updateDish(idx, 'price', e.target.value)} />
              <input className="input md:col-span-2" placeholder="Qty" type="number" min="0" value={d.qty} onChange={e => updateDish(idx, 'qty', e.target.value)} />
              <button type="button" className="btn btn-outline md:col-span-1" onClick={() => removeDish(idx)}>Remove</button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button className="btn btn-primary" disabled={!canSubmit}>Create Event</button>
          {msg && <span className="text-sm text-emerald-700">{msg}</span>}
        </div>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-3">Existing Events</h2>
        {loading ? <div>Loading…</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(ev => (
              <div key={ev.id} className="card p-5 space-y-2">
                <div className="font-semibold text-emerald-700">{ev.name}</div>
                <div className="text-sm text-slate-600">{ev.date} • {ev.venue}</div>
                <div className="text-sm text-slate-500">{ev.menu?.length ?? 0} dishes</div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <a className="btn btn-outline" href={`/qr?path=${encodeURIComponent(`/order?eventId=${ev.id}&table=1&seat=A`)}`} target="_blank">Open QR</a>
                  <button type="button" className="btn btn-outline" onClick={() => navigator.clipboard.writeText(orderLink(ev.id))}>Copy Order Link</button>
                  <a className="btn btn-outline" href={`/order?eventId=${ev.id}&table=1&seat=A`} target="_blank">Test Order</a>
                  <button type="button" className="btn btn-accent" onClick={() => onDelete(ev.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
EOF
