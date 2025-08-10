'use client';
// app/order/OrderClient.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

type MenuItem = { id: string; name: string; qty: number };
type ApiMenu = { event: { id: string; name: string; isOpen: boolean }, menu: MenuItem[] };

type Props = { initialEventId: string; initialTable?: string; initialSeat?: string; initialName?: string; };

export default function OrderClient({ initialEventId, initialTable, initialSeat, initialName }: Props) {
  const [eventId, setEventId] = useState(initialEventId);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [eventName, setEventName] = useState('');
  const [open, setOpen] = useState(true);
  const [lines, setLines] = useState<Record<string, number>>({});
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setError(null);
      const res = await fetch(`/api/events/${encodeURIComponent(eventId)}/menu`, { cache: 'no-store' });
      if (!res.ok) { setError('Event not found'); return; }
      const data: ApiMenu = await res.json();
      if (!alive) return;
      setMenu(data.menu || []);
      setEventName(data.event?.name || '');
      setOpen(Boolean(data.event?.isOpen));
      setLines({});
    })();
    return () => { alive = false; };
  }, [eventId]);

  const totalItems = useMemo(() => Object.values(lines).reduce((a,b)=>a+b,0), [lines]);

  function inc(id: string, max: number) {
    setLines(prev => ({ ...prev, [id]: Math.min((prev[id]||0)+1, max) }));
  }
  function dec(id: string) {
    setLines(prev => ({ ...prev, [id]: Math.max((prev[id]||0)-1, 0) }));
  }

  async function placeOrder() {
    setPlacing(true);
    setError(null);
    try {
      const items = Object.entries(lines).filter(([,q])=>q>0).map(([id,q])=>({ id, qty: q }));
      if (items.length === 0) throw new Error('Add at least one item');
      const res = await fetch('/api/orders', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ eventId, items, meta: { table: initialTable, seat: initialSeat, name: initialName } })});
      if (!res.ok) throw new Error('Could not place order');
      const ord = await res.json();
      setOrderId(ord.id);
      setLines({});
    } catch (e:any) {
      setError(e.message || 'Failed');
    } finally {
      setPlacing(false);
    }
  }

  if (!open) {
    return <div className="mx-auto max-w-2xl px-4 py-10 text-slate-700">
      <div className="text-xl font-semibold">{eventName || 'Event'}</div>
      <div className="mt-2 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">Ordering is closed for this event.</div>
    </div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-semibold">{eventName || 'Select your meal'}</div>
          <div className="text-sm text-slate-600">
            {initialName ? `Guest: ${initialName}` : null}
            {initialTable ? ` • Table ${initialTable}` : null}
            {initialSeat ? ` • Seat ${initialSeat}` : null}
          </div>
        </div>
        <div className="text-sm text-slate-600">Items: {totalItems}</div>
      </div>

      {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {menu.length === 0 ? (
        <div className="mt-6 text-slate-600">Menu not available yet.</div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {menu.map(m => {
            const q = lines[m.id] || 0;
            return (
              <div key={m.id} className="rounded-xl border bg-white p-4">
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-slate-500">Available: {m.qty}</div>
                <div className="mt-3 flex items-center gap-3">
                  <button onClick={()=>dec(m.id)} className="h-8 w-8 rounded-md border">-</button>
                  <div className="w-8 text-center">{q}</div>
                  <button onClick={()=>inc(m.id, m.qty)} className="h-8 w-8 rounded-md border">+</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="text-lg font-semibold">Selected: {totalItems}</div>
        <button disabled={placing || totalItems===0} onClick={placeOrder} className="rounded-md bg-emerald-600 px-4 py-2 text-white disabled:opacity-50">
          {placing ? 'Placing…' : 'Place order'}
        </button>
      </div>
      {orderId && <div className="mt-4 rounded-md bg-emerald-50 p-3 text-emerald-700 text-sm">Order placed! ID: {orderId}</div>}
    </div>
  );
}
