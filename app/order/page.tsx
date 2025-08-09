'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MenuCard from '../components/MenuCard';
import StatusTimeline from '../components/StatusTimeline';
import { useEffect, useMemo, useState } from 'react';

const money = (n:number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(n);

export default function OrderPage() {
  const [menu, setMenu] = useState<any[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<string>('idle');
  const [orderId, setOrderId] = useState<string | null>(null);

  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const eventId = params.get('eventId') || 'demo-001';
  const table = params.get('table') || '';
  const seat = params.get('seat') || '';
  const name = params.get('name') || '';

  useEffect(() => {
    fetch(`/api/events/${eventId}/menu`).then(r=>r.json()).then(setMenu);
  }, [eventId]);

  const items = useMemo(() => menu.map((m:any) => ({ ...m, qty: cart[m.id] || 0 })), [menu, cart]);
  const total = useMemo(() => items.reduce((s,i)=> s + i.price * i.qty, 0), [items]);

  const placeOrder = async () => {
    const lines = items.filter(i=>i.qty>0).map(i=>({ id:i.id, qty:i.qty }));
    if (!lines.length) return;
    setStatus('placing');
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ eventId, table, seat, name, lines })
    });
    const data = await res.json();
    setOrderId(data.id);
    setStatus('placed');
  };

  useEffect(() => {
    if (!orderId) return;
    const t = setInterval(async () => {
      const res = await fetch(`/api/orders/${orderId}/status`);
      const data = await res.json();
      setStatus(data.status || 'placed');
    }, 3000);
    return () => clearInterval(t);
  }, [orderId]);

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order</h1>
          <p className="text-sm text-slate-600">Event {eventId}{table && ` • Table ${table}`}{seat && ` • Seat ${seat}`}{name && ` • ${name}`}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm text-slate-700">Total: <span className="font-semibold text-emerald-700">{money(total)}</span></div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map(item => (
          <div key={item.id} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <MenuCard item={item} />
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm font-medium text-slate-700">{money(item.price)}</div>
              <div className="flex items-center gap-2">
                <button onClick={()=> setCart(c => ({...c, [item.id]: Math.max(0, (c[item.id]||0)-1)}))} className="rounded-lg border px-3 py-1">-</button>
                <span className="min-w-[2ch] text-center">{item.qty}</span>
                <button onClick={()=> setCart(c => ({...c, [item.id]: (c[item.id]||0)+1}))} className="rounded-lg border px-3 py-1">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-6 mt-8 flex justify-end">
        <button onClick={placeOrder} disabled={!total || status==='placing'} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
          {status==='placing' ? 'Placing...' : 'Place Order'}
        </button>
      </div>

      {orderId && (
        <div className="mt-10 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm font-semibold text-emerald-700">Order Status</div>
          <StatusTimeline status={status}/>
        </div>
      )}
    </div>
  );
}
