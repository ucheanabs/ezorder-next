'use client';
export const dynamic = "force-dynamic";
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuCard from '../components/MenuCard';
import StatusTimeline from '../components/StatusTimeline';
import { useEffect, useMemo, useState } from 'react';

const money = (n:number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(n);

export default function OrderPage(){
  const [eventId, setEventId] = useState<string>('demo-001');
  const [tableNo, setTableNo] = useState<string>('');
  const [seatNo, setSeatNo] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [eventName, setEventName] = useState<string>('');
  const [menu, setMenu] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [orderId, setOrderId] = useState<string>('');
  const [status, setStatus] = useState<string>('PLACED');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const e = params.get('eventId'); const t = params.get('table'); const s = params.get('seat'); const n = params.get('name');
    if (e) setEventId(e); if (t) setTableNo(t); if (s) setSeatNo(s); if (n) setGuestName(n);
  }, []);

  async function loadMenu(){
    const res = await fetch(`/api/events/${eventId}/menu`);
    if (!res.ok) return;
    const data = await res.json();
    setEventName(data.name); setMenu(data.menu);
  }

  useEffect(() => { loadMenu(); }, [eventId]);

  const total = useMemo(() => cart.reduce((s, c) => s + c.price * c.qty, 0), [cart]);

  function add(item:any){
    setCart(prev => {
      const i = prev.findIndex((p:any) => p.id === item.id);
      if (i >= 0){ const copy = [...prev]; copy[i].qty++; return copy; }
      return [...prev, { ...item, qty: 1 }];
    });
  }
  function remove(item:any){
    setCart(prev => {
      const i = prev.findIndex((p:any) => p.id === item.id);
      if (i >= 0){ const copy = [...prev]; copy[i].qty--; if (copy[i].qty <= 0) copy.splice(i,1); return copy; }
      return prev;
    });
  }

  async function placeOrder(){
    const payload = {
      eventId, table: tableNo, seat: seatNo || null, name: guestName || null,
      items: cart.map(c => ({ id: c.id, qty: c.qty }))
    };
    const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    setOrderId(data.orderId);
    setStatus('PLACED');
    pollStatus(data.orderId);
  }

  async function pollStatus(id:string){
    const res = await fetch(`/api/orders/${id}`);
    if (!res.ok) return;
    const data = await res.json();
    setStatus(data.status);
    if (data.status !== 'DELIVERED') setTimeout(() => pollStatus(id), 2500);
  }

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto px-4 section space-y-6">
        <div className="card p-6">

          <div className="flex items-center justify-between gap-3 flex-wrap">

            <div>

              <div className="pill">Event: {eventId} · {eventName || 'Loading...'}</div>

              <div className="text-sm text-brand-gray">Table {tableNo || '—'} {seatNo ? ('· Seat ' + seatNo) : ''} {guestName ? ('· ' + guestName) : ''}</div>

            </div>

            <form className="flex items-center gap-2 flex-wrap" onSubmit={(e)=> e.preventDefault()}>

              <input placeholder="Event Id" className="border rounded-xl px-3 py-2" value={eventId} onChange={e=>setEventId(e.target.value)} />

              <input placeholder="Table" className="border rounded-xl px-3 py-2 w-24" value={tableNo} onChange={e=>setTableNo(e.target.value)} />

              <input placeholder="Seat" className="border rounded-xl px-3 py-2 w-24" value={seatNo} onChange={e=>setSeatNo(e.target.value)} />

              <input placeholder="Name" className="border rounded-xl px-3 py-2" value={guestName} onChange={e=>setGuestName(e.target.value)} />

              <button className="btn btn-outline" onClick={loadMenu}>Load Menu</button>

            </form>

          </div>

        </div>


        <div className="grid md:grid-cols-3 gap-6">

          <section className="md:col-span-2 space-y-3">

            <h2 className="h2">Menu</h2>

            <div className="grid sm:grid-cols-2 gap-3">

              {menu.map((m:any) => (

                <MenuCard key={m.id} item={m} onAdd={add} onRemove={remove} qty={cart.find(c=>c.id===m.id)?.qty} />

              ))}

            </div>

          </section>


          <aside className="space-y-3">

            <h2 className="h2">Your Order</h2>

            <div className="card p-4 space-y-2">

              {cart.length === 0 && <div className="text-brand-gray">No items yet</div>}

              {cart.map(c => (<div key={c.id} className="flex items-center justify-between">

                <div>{c.name} × {c.qty}</div><div className="font-semibold">{money(c.price * c.qty)}</div>

              </div>))}

              <div className="hr my-2"></div>

              <div className="flex items-center justify-between font-semibold">

                <div>Total</div><div>{money(total)}</div>

              </div>

              <button className="btn btn-accent w-full mt-2" disabled={!cart.length || !tableNo} onClick={placeOrder}>Place Order</button>

              {orderId && <div className="text-sm text-brand-gray">Order #{orderId}</div>}

            </div>

            <div className="space-y-2">

              <h3 className="h2 text-xl">Live Tracking</h3>

              <StatusTimeline status={status} />

            </div>

          </aside>

        </div>

      </main>

      <Footer />

    </div>

  )

}