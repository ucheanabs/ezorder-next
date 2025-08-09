'use client';
import { useEffect, useMemo, useState } from 'react';

export default function AdminPage() {
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

  const metrics = useMemo(() => {
    const total = orders.reduce((s,o)=> s + o.lines.reduce((x,l)=> x + l.price*l.qty,0), 0);
    const count = orders.length;
    const pending = orders.filter(o=>o.status==='placed').length;
    const delivering = orders.filter(o=>o.status==='preparing' || o.status==='out_for_delivery').length;
    return { total, count, pending, delivering };
  }, [orders]);

  return (
    <div className="mx-auto max-w-7xl px-4">
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Admin Dashboard</h1>
      <p className="text-sm text-slate-600">Live overview for event {eventId}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Card label="Revenue" value={`₦${metrics.total.toLocaleString()}`} />
        <Card label="Orders" value={metrics.count} />
        <Card label="Pending" value={metrics.pending} />
        <Card label="In Progress" value={metrics.delivering} />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-emerald-100">
          <thead className="bg-emerald-50">
            <tr className="text-left text-sm text-slate-600">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Table</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50 bg-white">
            {orders.map((o:any) => (
              <tr key={o.id} className="text-sm text-slate-700">
                <td className="px-4 py-3 font-medium">{o.id.slice(0,8)}</td>
                <td className="px-4 py-3">{o.name || '-'}</td>
                <td className="px-4 py-3">{o.table}{o.seat ? ` • ${o.seat}` : ''}</td>
                <td className="px-4 py-3">{o.lines.map((l:any)=> `${l.name}×${l.qty}`).join(', ')}</td>
                <td className="px-4 py-3">₦{o.lines.reduce((s:number,l:any)=> s+l.price*l.qty,0).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className="rounded-lg bg-emerald-50 px-2 py-1 text-emerald-700">{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({label, value}:{label:string; value:React.ReactNode}) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{label}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}
