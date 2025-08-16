'use client';
import { useEffect, useState } from 'react';

type Event = { id:string; name:string; date:string; venue:string };
type Order = { id:string; items:{id:string;qty:number}[]; status:'pending'|'preparing'|'served'; createdAt:number; complaint?:string };

export default function EventDetailClient({ id }: { id: string }) {
  const [ev,setEv] = useState<Event|null>(null);
  const [orders,setOrders] = useState<Order[]>([]);
  const [err,setErr] = useState<string|null>(null);

  async function load(){
    try{
      const e = await fetch(`/api/events/${encodeURIComponent(id)}`,{cache:'no-store'}); const ej = await e.json(); if(!e.ok) throw new Error(ej.error||'Error'); setEv(ej);
      const r = await fetch(`/api/events/${encodeURIComponent(id)}/orders`,{cache:'no-store'}); const j = await r.json(); if(!r.ok) throw new Error(j.error||'Error'); setOrders(j.orders||[]);
    }catch(e:any){ setErr(e.message||'Error'); }
  }
  useEffect(()=>{ load(); },[id]);

  async function setStatus(orderId:string,status:string){ await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})}); await load(); }

  if (err) return <div className="mx-auto max-w-3xl p-6 text-red-600">{err}</div>;
  if (!ev) return <div className="mx-auto max-w-3xl p-6">Loading…</div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-emerald-700">{ev.name}</h1>
        <div className="text-sm text-slate-600">{ev.venue} • {ev.date}</div>
      </div>
      <div className="rounded border bg-white">
        <div className="border-b p-3 font-medium">Orders</div>
        <div className="divide-y">
          {orders.map(o=>(
            <div key={o.id} className="p-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">#{o.id}</div>
                <div className="text-slate-600">{new Date(o.createdAt).toLocaleTimeString()}</div>
              </div>
              <div className="mt-1 text-slate-700">{o.items.map(i=>`${i.id}×${i.qty}`).join(', ')}</div>
              {o.complaint && <div className="mt-1 text-red-600">Complaint: {o.complaint}</div>}
              <div className="mt-2 flex gap-2">
                <button onClick={()=>setStatus(o.id,'pending')} className="rounded bg-gray-100 px-2 py-1">Pending</button>
                <button onClick={()=>setStatus(o.id,'preparing')} className="rounded bg-amber-500 px-2 py-1 text-white">Preparing</button>
                <button onClick={()=>setStatus(o.id,'served')} className="rounded bg-emerald-600 px-2 py-1 text-white">Served</button>
              </div>
            </div>
          ))}
          {!orders.length && <div className="p-3 text-sm text-slate-500">No orders yet.</div>}
        </div>
      </div>
    </div>
  );
}
