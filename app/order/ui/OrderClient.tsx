'use client';
import { useEffect, useMemo, useState } from 'react';

type Seating={tables:number; seatsPerTable:number};
type MenuItem={id:string; name:string; price:number; cuisine:'nigerian'|'continental'; course:'starter'|'main'|'dessert'|'drink'; stock:number; image?:string};
type Event={id:string; name:string; seating:Seating};
type OrderItem={itemId:string; qty:number};

export default function OrderClient({ initial }:{ initial:{eventId:string; table:string; seat:string; name:string} }){
  const [events,setEvents]=useState<Event[]>([]);
  const [eventId,setEventId]=useState(initial.eventId||'');
  const [menu,setMenu]=useState<MenuItem[]>([]);
  const [name,setName]=useState(initial.name||'');
  const [table,setTable]=useState(initial.table||'');
  const [seat,setSeat]=useState(initial.seat||'');
  const [cart,setCart]=useState<Record<string,number>>({});
  const [placing,setPlacing]=useState(false);
  const [orderId,setOrderId]=useState('');

  useEffect(()=>{ fetch('/api/events').then(r=>r.json()).then(d=>setEvents(d.events||[])); },[]);
  useEffect(()=>{
    if(!eventId) return setMenu([]);
    fetch(`/api/events/${encodeURIComponent(eventId)}/menu`).then(r=>r.json()).then(d=>setMenu(d.menu||[]));
  },[eventId]);

  const grouped = useMemo(()=>{
    const g: Record<'nigerian'|'continental', Record<'starter'|'main'|'dessert'|'drink', MenuItem[]>> = {
      nigerian:{starter:[],main:[],dessert:[],drink:[]},
      continental:{starter:[],main:[],dessert:[],drink:[]}
    };
    for(const m of menu){ g[m.cuisine][m.course].push(m); }
    return g;
  },[menu]);

  const total = useMemo(()=>{
    return Object.entries(cart).reduce((sum,[id,qty])=>{
      const mi = menu.find(m=>m.id===id); return sum + (mi? mi.price*qty : 0);
    },0);
  },[cart,menu]);

  function add(id:string){ setCart(c=>{ const mi = menu.find(m=>m.id===id); const have = c[id]||0; if(!mi) return c; if(have>=mi.stock) return c; return {...c,[id]:have+1}; }); }
  function sub(id:string){ setCart(c=>{ const have=c[id]||0; if(have<=1){ const { [id]:_,...rest }=c; return rest; } return {...c,[id]:have-1}; }); }
  function clear(){ setCart({}); }

  async function place(){
    if(!eventId) return;
    if(total<=0) return;
    setPlacing(true);
    const items:OrderItem[] = Object.entries(cart).map(([itemId,qty])=>({ itemId, qty }));
    const res = await fetch('/api/orders',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
      eventId, guestName:name||'', table:Number(table||0), seat:Number(seat||0), items
    })});
    setPlacing(false);
    if(res.ok){ const o = await res.json(); setOrderId(o.id); clear(); }
  }

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="rounded border bg-white p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <select className="rounded border px-3 py-2" value={eventId} onChange={e=>setEventId(e.target.value)}>
          <option value="">Select event…</option>
          {events.map(ev=> <option key={ev.id} value={ev.id}>{ev.name}</option>)}
        </select>
        <input className="rounded border px-3 py-2" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="rounded border px-3 py-2" placeholder="Table" value={table} onChange={e=>setTable(e.target.value)} />
        <input className="rounded border px-3 py-2" placeholder="Seat" value={seat} onChange={e=>setSeat(e.target.value)} />
      </div>

      {eventId && (
        <div className="space-y-6">
          {(['nigerian','continental'] as const).map(cui=>(
            <div key={cui} className="space-y-4">
              <h2 className="text-xl font-semibold capitalize">{cui}</h2>
              {(['starter','main','dessert','drink'] as const).map(course=>(
                <div key={course}>
                  <div className="mb-2 font-medium capitalize">{course}</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {grouped[cui][course].map(mi=>(
                      <div key={mi.id} className="rounded border bg-white p-3">
                        {mi.image ? <img src={mi.image} alt="" className="mb-2 h-20 w-full rounded object-cover" /> : <div className="mb-2 h-20 w-full rounded bg-slate-100" />}
                        <div className="font-medium">{mi.name}</div>
                        <div className="text-sm text-slate-500">₦{mi.price.toLocaleString()} • In stock: {mi.stock}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <button onClick={()=>sub(mi.id)} className="rounded border px-3 py-1">-</button>
                          <div>{cart[mi.id]||0}</div>
                          <button onClick={()=>add(mi.id)} className="rounded bg-emerald-600 px-3 py-1 text-white">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="sticky bottom-0 rounded border bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Total: ₦{total.toLocaleString()}</div>
          <div className="flex gap-2">
            <button onClick={clear} className="rounded border px-3 py-2">Clear</button>
            <button onClick={place} disabled={placing || total===0 || !eventId} className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50">
              {placing?'Placing…':'Place order'}
            </button>
          </div>
        </div>
        {orderId && (
          <div className="mt-3 rounded bg-emerald-50 p-3 text-emerald-700">
            Order placed. ID: {orderId}
            <button onClick={()=>window.print()} className="ml-3 rounded border px-2 py-1">Print</button>
          </div>
        )}
      </div>
    </div>
  );
}
