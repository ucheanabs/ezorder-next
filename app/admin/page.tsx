'use client';
import { useEffect, useMemo, useState } from 'react';

type Cuisine = "nigerian" | "continental";
type Course = "starters" | "mains" | "desserts" | "drinks";
type MenuItem = { id?: string; cuisine: Cuisine; course: Course; name: string; description?: string; image?: string; price: number; availableQty: number };
type Zone = { name: string; tables: number; seatsPerTable: number };
type Event = { id: string; name: string; date: string; venue: string; zones: Zone[]; menu: MenuItem[]; isOpen: boolean; createdAt: number };

const PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || 'admin123';

export default function AdminPage() {
  const [ok, setOk] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [curr, setCurr] = useState<Event | null>(null);
  const [item, setItem] = useState<MenuItem>({ cuisine:'nigerian', course:'starters', name:'', description:'', image:'', price:0, availableQty:0 });

  useEffect(()=>{ const p = prompt('Enter admin passcode'); if (p===PASS) setOk(true); },[]);
  useEffect(()=>{ if(ok) refresh(); },[ok]);

  async function refresh() {
    const r = await fetch('/api/events', { cache:'no-store' }); const d = await r.json(); setEvents(d.events || []);
  }
  function blankEvent(): Event {
    return { id:'', name:'', date:'', venue:'', zones:[{name:'A',tables:5,seatsPerTable:10},{name:'B',tables:5,seatsPerTable:10}], menu:[], isOpen:true, createdAt: Date.now() } as Event;
  }
  async function saveEvent(e: Event) {
    const payload = { ...e, id: e.id || undefined };
    if (e.id) {
      await fetch(`/api/events/${e.id}`, { method:'PUT', body: JSON.stringify(payload) });
    } else {
      const r = await fetch('/api/events', { method:'POST', body: JSON.stringify(payload) }); const ne = await r.json(); e.id = ne.id;
    }
    await refresh();
  }
  function addItem() {
    if (!curr) return; const id = `mi_${Math.random().toString(36).slice(2,7)}`;
    const next = { ...curr, menu:[...curr.menu, { ...item, id }] }; setCurr(next);
  }
  function removeItem(id: string) {
    if (!curr) return; setCurr({ ...curr, menu: curr.menu.filter(m=>m.id!==id) });
  }

  const qrHref = useMemo(()=>{
    if (!curr?.id) return '';
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const sp = new URLSearchParams({ eventId: curr.id });
    return `${base}/qr?${sp.toString()}`;
  }, [curr?.id]);

  if (!ok) return null;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-semibold text-emerald-700">Admin • Events & Menu</h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-white">
          <div className="font-medium mb-2">Events</div>
          <button className="mb-3 rounded-md bg-emerald-600 px-3 py-2 text-white" onClick={()=>setCurr(blankEvent())}>New Event</button>
          <div className="space-y-2 max-h-80 overflow-auto">
            {events.map(e=>(
              <div key={e.id} className={"p-3 rounded-lg border "+(curr?.id===e.id?'border-emerald-400':'')}>
                <div className="font-semibold">{e.name}</div>
                <div className="text-xs text-slate-500">{e.venue} • {e.date}</div>
                <div className="mt-2 flex gap-2">
                  <button className="text-xs rounded bg-gray-100 px-2 py-1" onClick={async()=>{
                    const r = await fetch(`/api/events/${e.id}`, { cache:'no-store' }); const d = await r.json(); setCurr(d);
                  }}>Edit</button>
                  <a className="text-xs rounded bg-gray-100 px-2 py-1" href={`/qr?eventId=${e.id}`} target="_blank">QR</a>
                  <a className="text-xs rounded bg-gray-100 px-2 py-1" href={`/caterer?eventId=${e.id}`} target="_blank">Caterer</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-white md:col-span-2">
          {!curr ? <div className="text-slate-500">Select or create an event.</div> : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="border rounded px-3 py-2" placeholder="Event name" value={curr.name} onChange={e=>setCurr({...curr,name:e.target.value})}/>
                <input className="border rounded px-3 py-2" placeholder="Venue" value={curr.venue} onChange={e=>setCurr({...curr,venue:e.target.value})}/>
                <input className="border rounded px-3 py-2" type="date" value={curr.date} onChange={e=>setCurr({...curr,date:e.target.value})}/>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={curr.isOpen} onChange={e=>setCurr({...curr,isOpen:e.target.checked})}/> Event open</label>
              </div>

              <div>
                <div className="font-medium mb-2">Zones & Seating</div>
                <div className="space-y-2">
                  {curr.zones.map((z,idx)=>(
                    <div key={idx} className="grid grid-cols-3 gap-2">
                      <input className="border rounded px-2 py-1" value={z.name} onChange={e=>{const nz=[...curr.zones]; nz[idx]={...z,name:e.target.value}; setCurr({...curr,zones:nz});}} placeholder="Zone"/>
                      <input className="border rounded px-2 py-1" type="number" value={z.tables} onChange={e=>{const nz=[...curr.zones]; nz[idx]={...z,tables:Number(e.target.value)}; setCurr({...curr,zones:nz});}} placeholder="Tables"/>
                      <input className="border rounded px-2 py-1" type="number" value={z.seatsPerTable} onChange={e=>{const nz=[...curr.zones]; nz[idx]={...z,seatsPerTable:Number(e.target.value)}; setCurr({...curr,zones:nz});}} placeholder="Seats/Table"/>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-medium mb-2">Add Menu Item</div>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                  <select className="border rounded px-2 py-1" value={item.cuisine} onChange={e=>setItem({...item, cuisine: e.target.value as Cuisine})}>
                    <option value="nigerian">Nigerian</option><option value="continental">Continental</option>
                  </select>
                  <select className="border rounded px-2 py-1" value={item.course} onChange={e=>setItem({...item, course: e.target.value as Course})}>
                    <option value="starters">Starters</option><option value="mains">Mains</option><option value="desserts">Desserts</option><option value="drinks">Drinks</option>
                  </select>
                  <input className="border rounded px-2 py-1 md:col-span-2" placeholder="Name" value={item.name} onChange={e=>setItem({...item,name:e.target.value})}/>
                  <input className="border rounded px-2 py-1" placeholder="Image URL" value={item.image||''} onChange={e=>setItem({...item,image:e.target.value})}/>
                  <input className="border rounded px-2 py-1" type="number" placeholder="Qty" value={item.availableQty} onChange={e=>setItem({...item,availableQty:Number(e.target.value)})}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  <input className="border rounded px-2 py-1" placeholder="Description (optional)" value={item.description||''} onChange={e=>setItem({...item,description:e.target.value})}/>
                  <input className="border rounded px-2 py-1" type="number" placeholder="Price (hidden to guests)" value={item.price} onChange={e=>setItem({...item,price:Number(e.target.value)})}/>
                </div>
                <button className="mt-2 rounded bg-emerald-600 text-white px-3 py-2" onClick={addItem}>Add Item</button>
              </div>

              <div>
                <div className="font-medium mb-2">Menu</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {curr.menu.map(m=>(
                    <div key={m.id} className="border rounded-xl p-3 bg-white">
                      {m.image && <img src={m.image} alt="" className="h-28 w-full object-cover rounded-lg mb-2" />}
                      <div className="text-xs uppercase text-slate-500">{m.cuisine} • {m.course}</div>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-slate-500">Qty: {m.availableQty}</div>
                      <button className="mt-2 text-xs rounded bg-gray-100 px-2 py-1" onClick={()=>removeItem(m.id!)}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="rounded bg-slate-800 text-white px-3 py-2" onClick={()=>saveEvent(curr)}>Save Event</button>
                {qrHref && <a className="rounded bg-gray-100 px-3 py-2" href={qrHref} target="_blank">Open QR Page</a>}
                {curr.id && <a className="rounded bg-gray-100 px-3 py-2" href={`/caterer?eventId=${curr.id}`} target="_blank">Open Caterer Dashboard</a>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
