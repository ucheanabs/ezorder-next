'use client';
import { useEffect, useMemo, useState } from 'react';

type Cuisine = "nigerian" | "continental";
type Course = "starters" | "mains" | "desserts" | "drinks";
type MenuItem = { id: string; cuisine: Cuisine; course: Course; name: string; description?: string; image?: string };
type EventInfo = { id: string; name: string; venue: string; zones: {name:string;tables:number;seatsPerTable:number}[]; isOpen: boolean };

export default function OrderClient({ initialEventId }: { initialEventId: string }) {
  const [ev, setEv] = useState<EventInfo | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cuisine, setCuisine] = useState<Cuisine>('nigerian');
  const [course, setCourse] = useState<Course>('mains');
  const [cart, setCart] = useState<{ id:string; qty:number }[]>([]);
  const [seat, setSeat] = useState({ zone:'A', table:'1', seat:'1', name:'' });
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [asked, setAsked] = useState(false);

  useEffect(()=>{ (async()=>{
    const r = await fetch(`/api/events/${initialEventId}/menu`, { cache:'no-store' }).then(r=>r.json());
    setMenu(r.menu||[]); setEv(r.event);
  })(); },[initialEventId]);

  const view = useMemo(()=>menu.filter(m=>m.cuisine===cuisine && m.course===course),[menu,cuisine,course]);
  const totalQty = useMemo(()=>cart.reduce((s,c)=>s+c.qty,0),[cart]);

  function add(id:string){ setCart(cs=>{ const f=cs.find(c=>c.id===id); return f? cs.map(c=>c.id===id?{...c,qty:c.qty+1}:c) : [...cs,{id,qty:1}] }); }
  function sub(id:string){ setCart(cs=>cs.flatMap(c=>c.id===id?[{...c,qty:Math.max(0,c.qty-1)}]:[c]).filter(c=>c.qty>0)); }

  async function place() {
    if (!ev?.id) return;
    setPlacing(true);
    try{
      const payload = { eventId: ev.id, seat, items: cart.map(c=>({ itemId: c.id, qty: c.qty })) };
      const r = await fetch('/api/orders', { method:'POST', body: JSON.stringify(payload) });
      const d = await r.json();
      if (r.ok) { setOrderId(d.id); setCart([]); setTimeout(()=>setAsked(true), 12*60*1000); }
      else alert(d.error||'Failed');
    } finally { setPlacing(false); }
  }

  async function arrived() {
    if (!orderId) return;
    await fetch(`/api/orders/${orderId}/arrived`, { method:'POST' });
    setAsked(false);
  }
  async function complain(type:"not_received"|"wrong_order"|"cold"|"other") {
    if (!orderId) return;
    await fetch(`/api/orders/${orderId}/complaint`, { method:'POST', body: JSON.stringify({ type }) }); alert('Thanks, we are on it.');
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-semibold text-emerald-700">{ev?.name||'Event'} • Order</h1>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-white p-3">
          <div className="font-medium mb-2">Your Seat</div>
          <div className="grid grid-cols-2 gap-2">
            <input className="border rounded px-2 py-1 col-span-2" placeholder="Your name" value={seat.name} onChange={e=>setSeat({...seat,name:e.target.value})}/>
            <select className="border rounded px-2 py-1" value={seat.zone} onChange={e=>setSeat({...seat,zone:e.target.value})}>
              {ev?.zones.map(z=><option key={z.name} value={z.name}>{z.name}</option>)}
            </select>
            <input className="border rounded px-2 py-1" placeholder="Table" value={seat.table} onChange={e=>setSeat({...seat,table:e.target.value})}/>
            <input className="border rounded px-2 py-1" placeholder="Seat" value={seat.seat} onChange={e=>setSeat({...seat,seat:e.target.value})}/>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-3 md:col-span-2">
          <div className="flex gap-2">
            <button className={"rounded px-3 py-2 "+(cuisine==='nigerian'?'bg-emerald-600 text-white':'bg-gray-100')} onClick={()=>setCuisine('nigerian')}>Nigerian</button>
            <button className={"rounded px-3 py-2 "+(cuisine==='continental'?'bg-emerald-600 text-white':'bg-gray-100')} onClick={()=>setCuisine('continental')}>Continental</button>
            <div className="ml-auto text-sm text-slate-500">Items: {totalQty}</div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(['starters','mains','desserts','drinks'] as Course[]).map(c=>(
              <button key={c} className={"rounded px-3 py-2 capitalize "+(course===c?'bg-slate-800 text-white':'bg-gray-100')} onClick={()=>setCourse(c)}>{c}</button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {view.map(m=>(
              <div key={m.id} className="rounded-xl border bg-white p-3">
                {m.image && <img src={m.image} alt="" className="h-32 w-full object-cover rounded-lg mb-2" />}
                <div className="font-medium">{m.name}</div>
                {m.description && <div className="text-sm text-slate-500">{m.description}</div>}
                <div className="mt-2 flex items-center gap-2">
                  <button className="rounded bg-gray-100 px-2 py-1" onClick={()=>sub(m.id)}>-</button>
                  <div className="w-8 text-center">{cart.find(c=>c.id===m.id)?.qty||0}</div>
                  <button className="rounded bg-emerald-600 text-white px-2 py-1" onClick={()=>add(m.id)}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-slate-500">{ev?.isOpen ? 'Ordering open' : 'Ordering closed'}</div>
            <button disabled={placing || !ev?.isOpen || !totalQty || !seat.name} className="rounded bg-emerald-600 text-white px-4 py-2 disabled:opacity-50" onClick={place}>
              {placing ? 'Placing…' : 'Place Order'}
            </button>
          </div>

          {orderId && <div className="mt-3 rounded bg-emerald-50 text-emerald-700 p-3 text-sm">Order placed! ID: {orderId}</div>}
          {asked && orderId && (
            <div className="mt-3 rounded bg-amber-50 text-amber-700 p-3 text-sm">
              Has your food arrived? <button className="ml-2 rounded bg-emerald-600 text-white px-2 py-1" onClick={arrived}>Yes</button>
              <button className="ml-2 rounded bg-rose-600 text-white px-2 py-1" onClick={()=>complain('not_received')}>Not yet</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
