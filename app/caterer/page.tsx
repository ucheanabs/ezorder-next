'use client';
import { useEffect, useMemo, useState } from 'react';

type Order={id:string; guestName:string; table:number; seat:number; items:{itemId:string; qty:number}[]; status:'pending'|'preparing'|'served'; complaint?:string; arrivedAt?:number|null; createdAt:number; updatedAt:number};
type Event={id:string; name:string};

export default function Page({ searchParams }: { searchParams?: Record<string,string> }){
  const urlParams = typeof window === 'undefined' ? null : new URLSearchParams(window.location.search);
  const initialEventId = urlParams?.get('eventId') || '';

  const [events,setEvents]=useState<Event[]>([]);
  const [eventId,setEventId]=useState(initialEventId);
  const [orders,setOrders]=useState<Order[]>([]);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{ fetch('/api/events').then(r=>r.json()).then(d=>setEvents(d.events||[])); },[]);
  useEffect(()=>{
    if(!eventId){ setOrders([]); return; }
    let active=true;
    async function pull(){ setLoading(true); const r=await fetch(`/api/events/${eventId}/orders`); const d=await r.json(); if(active){ setOrders(d.orders||[]); setLoading(false);} }
    pull();
    const t = setInterval(pull, 4000);
    return ()=>{ active=false; clearInterval(t); };
  },[eventId]);

  const counts = useMemo(()=>{
    const total = orders.length;
    const served = orders.filter(o=>o.status==='served').length;
    const pending = orders.filter(o=>o.status!=='served').length;
    return { total, served, pending };
  },[orders]);

  async function mark(id:string, status:'pending'|'preparing'|'served'){
    await fetch(`/api/orders/${id}/status`,{ method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status })});
  }
  async function arrived(id:string){ await fetch(`/api/orders/${id}/arrived`,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ arrived:true })}); }
  async function complain(id:string){
    const message = prompt('Complaint message') || '';
    if(!message) return;
    await fetch(`/api/orders/${id}/complaint`,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message })});
  }

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <select className="rounded border px-3 py-2" value={eventId} onChange={e=>setEventId(e.target.value)}>
          <option value="">Select event…</option>
          {events.map(ev=> <option key={ev.id} value={ev.id}>{ev.name}</option>)}
        </select>
        <div className="rounded border bg-white px-3 py-2">Total: {counts.total}</div>
        <div className="rounded border bg-white px-3 py-2">Pending: {counts.pending}</div>
        <div className="rounded border bg-white px-3 py-2">Served: {counts.served}</div>
      </div>

      <div className="rounded border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-2 text-left">Time</th>
              <th className="p-2 text-left">Guest</th>
              <th className="p-2 text-left">Table/Seat</th>
              <th className="p-2 text-left">Items</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o=>(
              <tr key={o.id} className="border-t">
                <td className="p-2">{new Date(o.createdAt).toLocaleTimeString()}</td>
                <td className="p-2">{o.guestName||'-'}</td>
                <td className="p-2">T{o.table}-S{o.seat}</td>
                <td className="p-2">{o.items.map(i=>`${i.itemId}×${i.qty}`).join(', ')}</td>
                <td className="p-2">{o.status}</td>
                <td className="p-2 space-x-2">
                  <button onClick={()=>mark(o.id,'preparing')} className="rounded border px-2 py-1">Preparing</button>
                  <button onClick={()=>mark(o.id,'served')} className="rounded border px-2 py-1">Served</button>
                  <button onClick={()=>arrived(o.id)} className="rounded border px-2 py-1">Arrived</button>
                  <button onClick={()=>complain(o.id)} className="rounded border px-2 py-1">Complaint</button>
                  <button onClick={()=>window.print()} className="rounded border px-2 py-1">Print</button>
                </td>
              </tr>
            ))}
            {(!orders || orders.length===0) && (
              <tr><td colSpan={6} className="p-4 text-center text-slate-500">{loading?'Loading…':'No orders'}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
