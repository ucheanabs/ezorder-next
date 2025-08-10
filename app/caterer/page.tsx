'use client';
import { useEffect, useMemo, useState } from 'react';

type Order = {
  id: string;
  status: "pending"|"preparing"|"served";
  items: { itemId: string; qty: number }[];
  seat: { zone: string; table: string; seat: string; name: string };
  arrived?: boolean;
  complaint?: { type: string; note?: string };
};
type Event = { id: string; name: string; zones: { name:string; tables:number; seatsPerTable:number }[] };

const PASS = process.env.NEXT_PUBLIC_CATERER_PASS || 'serve123';

export default function Caterer() {
  const sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const eventId = sp?.get('eventId') || 'demo-001';

  const [ok, setOk] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ev, setEv] = useState<Event | null>(null);
  const [filter, setFilter] = useState<{zone?:string; table?:string; status?:string}>({});

  useEffect(()=>{ const p = prompt('Enter caterer passcode'); if (p===PASS) setOk(true); },[]);
  useEffect(()=>{ if(!ok) return;
    (async()=>{
      const e = await fetch(`/api/events/${eventId}`).then(r=>r.json());
      setEv({ id:e.id, name:e.name, zones:e.zones });
    })();
    const tick = async()=>{ const r = await fetch(`/api/events/${eventId}/orders`,{cache:'no-store'}).then(r=>r.json()); setOrders(r.orders||[]); };
    tick(); const id = setInterval(tick, 4000); return ()=>clearInterval(id);
  },[ok,eventId]);

  const view = useMemo(()=>orders.filter(o=>{
    if (filter.zone && o.seat.zone!==filter.zone) return false;
    if (filter.table && o.seat.table!==filter.table) return false;
    if (filter.status && o.status!==filter.status) return false;
    return true;
  }),[orders,filter]);

  async function setStatus(id:string, status:"pending"|"preparing"|"served") {
    await fetch(`/api/orders/${id}/status`, { method:'PATCH', body: JSON.stringify({ status }) });
  }

  function printSelection(ids: string[]) {
    const sel = orders.filter(o=>ids.includes(o.id));
    const html = `
      <html><head><title>Tickets</title>
      <style>body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto} .t{border:1px solid #ddd;border-radius:8px;padding:12px;margin:10px;}</style>
      </head><body>
      ${sel.map(o=>`<div class="t">
        <div><b>Order:</b> ${o.id}</div>
        <div><b>Seat:</b> Zone ${o.seat.zone} • Table ${o.seat.table} • Seat ${o.seat.seat} • ${o.seat.name||''}</div>
        <div><b>Status:</b> ${o.status}${o.arrived?' • Arrived':''}${o.complaint?` • Complaint: ${o.complaint.type}`:''}</div>
        <ul>${o.items.map(i=>`<li>${i.qty} × ${i.itemId}</li>`).join('')}</ul>
      </div>`).join('')}
      <script>window.onload=()=>window.print()</script>
      </body></html>`;
    const w = window.open('', '_blank'); if (!w) return;
    w.document.write(html); w.document.close();
  }

  const ids = view.map(v=>v.id);

  if (!ok) return null;

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="text-2xl font-semibold text-emerald-700">Caterer • {ev?.name||''}</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <select className="border rounded px-2 py-1" value={filter.zone||''} onChange={e=>setFilter(s=>({...s,zone:e.target.value||undefined}))}>
          <option value="">All zones</option>
          {ev?.zones.map(z=><option key={z.name} value={z.name}>{z.name}</option>)}
        </select>
        <input className="border rounded px-2 py-1" placeholder="Table (e.g. 1)" value={filter.table||''} onChange={e=>setFilter(s=>({...s,table:e.target.value||undefined}))}/>
        <select className="border rounded px-2 py-1" value={filter.status||''} onChange={e=>setFilter(s=>({...s,status:e.target.value||undefined}))}>
          <option value="">All status</option>
          <option>pending</option><option>preparing</option><option>served</option>
        </select>
        <button className="rounded bg-slate-800 text-white px-3 py-2" onClick={()=>printSelection(ids)}>Print batch</button>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {view.map(o=>(
          <div key={o.id} className="rounded-xl border bg-white p-3">
            <div className="text-xs text-slate-500">{o.id}</div>
            <div className="font-medium">Zone {o.seat.zone} • Table {o.seat.table} • Seat {o.seat.seat}</div>
            <div className="text-sm">{o.seat.name}</div>
            <ul className="text-sm mt-2 list-disc pl-5">
              {o.items.map(i=><li key={i.itemId}>{i.qty} × {i.itemId}</li>)}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <button className="rounded bg-amber-500 text-white px-2 py-1" onClick={()=>setStatus(o.id,'preparing')}>Preparing</button>
              <button className="rounded bg-emerald-600 text-white px-2 py-1" onClick={()=>setStatus(o.id,'served')}>Served</button>
              <button className="rounded bg-gray-100 px-2 py-1" onClick={()=>printSelection([o.id])}>Print</button>
              {o.complaint && <span className="rounded bg-rose-100 text-rose-700 px-2 py-1">Complaint: {o.complaint.type}</span>}
              {o.arrived && <span className="rounded bg-emerald-100 text-emerald-700 px-2 py-1">Arrived</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
