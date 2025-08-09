'use client';
import { useEffect, useState } from 'react';

type MenuItem = { id?: string; name: string; price: number };
type Event = { id: string; name: string; date: string; venue: string; menu: MenuItem[]; createdAt: number };
type OrderItem = { id: string; qty: number };
type Order = { id: string; eventId: string; items: OrderItem[]; status: 'pending'|'preparing'|'served'; createdAt: number };

const money = (n:number)=> new Intl.NumberFormat('en-NG', { style:'currency', currency:'NGN'}).format(n);

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<{id:string; name:string; date:string; venue:string; menu:MenuItem[]}>({ id:'', name:'', date:'', venue:'', menu:[] });
  const [item, setItem] = useState<{name:string; price:string}>({ name:'', price:'' });
  const [selected, setSelected] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);

  async function loadEvents() {
    const res = await fetch('/api/events', { cache:'no-store' });
    const data = await res.json();
    setEvents(Array.isArray(data.events)? data.events : []);
  }
  useEffect(()=>{ loadEvents(); },[]);

  useEffect(()=>{
    let timer: any;
    async function poll() {
      if (!selected) return;
      const res = await fetch(`/api/events/${encodeURIComponent(selected)}/orders`, { cache:'no-store' });
      const data = await res.json();
      setOrders(Array.isArray(data.orders)? data.orders : []);
    }
    poll();
    timer = setInterval(poll, 5000);
    return ()=> clearInterval(timer);
  }, [selected]);

  function addItem() {
    if (!item.name || !item.price) return;
    const price = Number(item.price);
    const id = item.name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    setForm(f=>({...f, menu:[...f.menu, { id, name:item.name, price }]}));
    setItem({name:'', price:''});
  }
  function removeItem(idx:number) {
    setForm(f=>({...f, menu: f.menu.filter((_,i)=>i!==idx)}));
  }

  async function saveEvent() {
    setLoading(true);
    try {
      const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('failed');
      setForm({id:'', name:'', date:'', venue:'', menu:[]});
      await loadEvents();
    } finally { setLoading(false); }
  }

  async function setStatus(orderId:string, status: Order['status']) {
    await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status }) });
    setOrders(os => os.map(o => o.id===orderId ? {...o, status} : o));
  }

  const selectedEvent = events.find(e=>e.id===selected);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-semibold mb-4">Create / Update Event</h2>
          <div className="grid gap-3">
            <input value={form.id} onChange={e=>setForm({...form, id:e.target.value})} placeholder="Event ID (optional, e.g. gala-2025)" className="rounded-md border p-2"/>
            <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Event Name" className="rounded-md border p-2"/>
            <input value={form.date} onChange={e=>setForm({...form, date:e.target.value})} placeholder="Date (YYYY-MM-DD)" className="rounded-md border p-2"/>
            <input value={form.venue} onChange={e=>setForm({...form, venue:e.target.value})} placeholder="Venue" className="rounded-md border p-2"/>

            <div className="rounded-md border p-3">
              <div className="font-medium mb-2">Menu</div>
              <div className="flex gap-2">
                <input value={item.name} onChange={e=>setItem({...item, name:e.target.value})} placeholder="Item name" className="flex-1 rounded-md border p-2"/>
                <input value={item.price} onChange={e=>setItem({...item, price:e.target.value})} placeholder="Price (NGN)" className="w-40 rounded-md border p-2"/>
                <button onClick={addItem} className="rounded-md bg-emerald-600 px-3 py-2 text-white">Add</button>
              </div>
              <ul className="mt-3 space-y-2">
                {form.menu.map((m,idx)=>(
                  <li key={idx} className="flex items-center justify-between rounded border p-2">
                    <div>{m.name} • {money(m.price)}</div>
                    <button onClick={()=>removeItem(idx)} className="text-red-600">remove</button>
                  </li>
                ))}
              </ul>
            </div>

            <button disabled={loading} onClick={saveEvent} className="rounded-md bg-emerald-600 px-4 py-2 text-white disabled:opacity-50">
              {loading ? 'Saving…' : 'Save Event'}
            </button>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-semibold mb-4">Events</h2>
          <div className="space-y-3">
            {events.map(ev=>(
              <div key={ev.id} className={"rounded border p-3 " + (selected===ev.id ? 'border-emerald-400' : '')}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{ev.name}</div>
                    <div className="text-sm text-slate-500">{ev.date} • {ev.venue}</div>
                    <div className="text-xs text-slate-500">ID: {ev.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={`/qr?eventId=${encodeURIComponent(ev.id)}`} className="rounded-md border px-3 py-2 text-sm">QR</a>
                    <a href={`/order?eventId=${encodeURIComponent(ev.id)}`} className="rounded-md border px-3 py-2 text-sm">Order Page</a>
                    <button onClick={()=>setSelected(ev.id)} className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">{selected===ev.id?'Viewing':'View Orders'}</button>
                  </div>
                </div>
              </div>
            ))}
            {events.length===0 && <div className="text-sm text-slate-500">No events yet.</div>}
          </div>
        </div>
      </div>

      {selectedEvent && (
        <div className="mt-8 rounded-xl border bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Orders • {selectedEvent.name}</h2>
            <div className="text-sm text-slate-500">{orders.length} total</div>
          </div>
          <div className="mt-3 grid gap-3">
            {orders.map(o=>{
              const total = o.items.reduce((sum,it)=>{
                const mi = selectedEvent.menu.find(m=>m.id===it.id);
                return sum + (mi ? mi.price * it.qty : 0);
              },0);
              return (
                <div key={o.id} className="rounded border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">#{o.id}</div>
                    <div className="text-sm">{new Date(o.createdAt).toLocaleTimeString()}</div>
                  </div>
                  <ul className="mt-2 text-sm">
                    {o.items.map(it=>{
                      const mi = selectedEvent.menu.find(m=>m.id===it.id);
                      return <li key={it.id}>{mi?.name ?? it.id} × {it.qty}</li>;
                    })}
                  </ul>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm font-medium">Total: {money(total)}</div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border px-2 py-1 text-xs">{o.status}</span>
                      <button onClick={()=>setStatus(o.id,'preparing')} className="rounded-md border px-2 py-1 text-xs">Preparing</button>
                      <button onClick={()=>setStatus(o.id,'served')} className="rounded-md border px-2 py-1 text-xs">Served</button>
                    </div>
                  </div>
                </div>
              );
            })}
            {orders.length===0 && <div className="text-sm text-slate-500">No orders yet.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
