'use client';
import { useEffect, useState } from 'react';

type Item = { id:string; qty:number };
type Order = { id:string; eventId:string; items:Item[]; status:'pending'|'preparing'|'served'; createdAt:number; updatedAt:number };

export default function Page() {
  const [eventId, setEventId] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!eventId) return;
    setLoading(true);
    const res = await fetch(`/api/events/${encodeURIComponent(eventId)}/orders`, { cache:'no-store' });
    const data = await res.json();
    setOrders(Array.isArray(data?.orders) ? data.orders : []);
    setLoading(false);
  }

  useEffect(() => {
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, [eventId]);

  async function setStatus(id:string, status:'pending'|'preparing'|'served') {
    await fetch(`/api/orders/${encodeURIComponent(id)}/status`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status }) });
    load();
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Caterer Dashboard</h1>
      <div className="mb-4 flex gap-2">
        <input value={eventId} onChange={e=>setEventId(e.target.value)} placeholder="Event ID" className="border rounded px-3 py-2 w-64" />
        <button onClick={load} className="rounded bg-emerald-600 text-white px-4 py-2">Load Orders</button>
      </div>
      {loading ? <div>Loading…</div> : (
        <div className="grid md:grid-cols-2 gap-4">
          {orders.map(o=>(
            <div key={o.id} className="rounded-lg border bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Order {o.id}</div>
                <div className="text-sm px-2 py-0.5 rounded-full border">
                  {o.status}
                </div>
              </div>
              <div className="mt-2 text-sm text-slate-600">
                {o.items.map(it => (
                  <div key={it.id} className="flex justify-between">
                    <span>{it.id}</span>
                    <span>x{it.qty}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={()=>setStatus(o.id,'preparing')} className="rounded border px-3 py-1">Preparing</button>
                <button onClick={()=>setStatus(o.id,'served')} className="rounded bg-emerald-600 text-white px-3 py-1">Mark Served</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
