'use client';
import { useEffect, useState } from 'react';

export default function CatererPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const eventId = 'demo-001';

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/events/${eventId}/orders`);
      const data = await res.json();
      setOrders(data);
    };
    load();
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, []);

  const advance = async (id:string, status:string) => {
    const next = status==='placed' ? 'preparing' : status==='preparing' ? 'out_for_delivery' : 'delivered';
    await fetch(`/api/orders/${id}/status`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ status: next })});
    setOrders(os => os.map(o => o.id===id ? { ...o, status: next } : o));
  };

  return (
    <div className="mx-auto max-w-7xl px-4">
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Caterer Dashboard</h1>
      <p className="text-sm text-slate-600">Update order statuses and manage fulfillment</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {orders.map((o:any)=>(
          <div key={o.id} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">Order</div>
              <div className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">{o.status}</div>
            </div>
            <div className="mt-1 text-xl font-bold">#{o.id.slice(0,8)} • Table {o.table}{o.seat ? ` • ${o.seat}` : ''}</div>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
              {o.lines.map((l:any)=> <li key={l.id}>{l.name} × {l.qty}</li>)}
            </ul>
            <div className="mt-4 flex justify-end">
              <button onClick={()=>advance(o.id, o.status)} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                {o.status==='placed' ? 'Start Preparing' : o.status==='preparing' ? 'Send to Table' : 'Mark Delivered'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
