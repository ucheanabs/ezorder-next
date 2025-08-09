'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const money = (n:number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(n);

type Line = { id: string; name: string; price: number; qty?: number };
type Order = { id: string; lines: Line[]; status: string; table?: string; seat?: string; name?: string };

export default function OrderPage() {
  const searchParams = useSearchParams();
  const [menu, setMenu] = useState<Line[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<'idle'|'placing'|'placed'|'preparing'|'out_for_delivery'|'delivered'>('idle');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eventId = searchParams?.get('eventId') || 'demo-001';
  const table = searchParams?.get('table') || '';
  const seat = searchParams?.get('seat') || '';
  const name = searchParams?.get('name') || '';

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/events/${encodeURIComponent(eventId)}/menu`, { cache: 'no-store' });
        i

cat > app/order/page.tsx <<'EOF'
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const money = (n:number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(n);

type Line = { id: string; name: string; price: number; qty?: number };
type Order = { id: string; lines: Line[]; status: string; table?: string; seat?: string; name?: string };

export default function OrderPage() {
  const searchParams = useSearchParams();
  const [menu, setMenu] = useState<Line[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<'idle'|'placing'|'placed'|'preparing'|'out_for_delivery'|'delivered'>('idle');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eventId = searchParams?.get('eventId') || 'demo-001';
  const table = searchParams?.get('table') || '';
  const seat = searchParams?.get('seat') || '';
  const name = searchParams?.get('name') || '';

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`/api/events/${encodeURIComponent(eventId)}/menu`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Menu HTTP ${res.status}`);
        const data = await res.json();
        if (alive) setMenu(Array.isArray(data) ? data : []);
      } catch (e:any) {
        if (alive) setError('Could not load menu. Please refresh.');
      }
    })();
    return () => { alive = false; };
  }, [eventId]);

  const items = useMemo(() => menu.map(m => ({ ...m, qty: cart[m.id] || 0 })), [menu, cart]);
  const total = useMemo(() => items.reduce((s,i)=> s + (i.price||0) * (i.qty||0), 0), [items]);

  const placeOrder = async () => {
    try {
      setError(null);
      const lines = items.filter(i=> (i.qty||0) > 0).map(i=>({ id:i.id, qty:i.qty||0 }));
      if (!lines.length) return;
      setStatus('placing');
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ eventId, table, seat, name, lines })
      });
      if (!res.ok) throw new Error(`Order HTTP ${res.status}`);
      const data: Order & { id: string } = await res.json();
      setOrderId(data.id);
      setStatus('placed');
    } catch (e:any) {
      setStatus('idle');
      setError('Could not place order. Please try again.');
    }
  };

  useEffect(() => {
    if (!orderId) return;
    const t = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        setStatus((data?.status as any) || 'placed');
      } catch {}
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

      {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map(item => (
          <div key={item.id} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 shrink-0 rounded-lg bg-emerald-100" />
              <div className="flex-1">
                <div className="font-semibold text-slate-800">{item.name}</div>
                <div className="text-sm text-slate-500">{money(item.price||0)}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm font-medium text-slate-700">{money(item.price||0)}</div>
              <div className="flex items-center gap-2">
                <button onClick={()=> setCart(c => ({...c, [item.id]: Math.max(0, (c[item.id]||0)-1)}))} className="rounded-lg border px-3 py-1">-</button>
                <span className="min-w-[2ch] text-center">{item.qty||0}</span>
                <button onClick={()=> setCart(c => ({...c, [item.id]: (c[item.id]||0)+1}))} className="rounded-lg border px-3 py-1">+</button>
              </div>
            </div>
          </div>
        ))}
        {!items.length && !error && (
          <div className="col-span-full rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            Loading menu…
          </div>
        )}
      </div>

      <div className="sticky bottom-6 mt-8 flex justify-end">
        <button onClick={placeOrder} disabled={!total || status==='placing'} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
          {status==='placing' ? 'Placing…' : 'Place Order'}
        </button>
      </div>

      {orderId && (
        <div className="mt-10 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm font-semibold text-emerald-700">Order Status</div>
          <Status status={status}/>
        </div>
      )}
    </div>
  );
}

function Status({ status }:{ status: string }) {
  const steps = ['placed','preparing','out_for_delivery','delivered'] as const;
  const idx = Math.max(0, steps.indexOf(status as any));
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      {steps.map((s,i)=>(
        <div key={s} className={"inline-flex items-center gap-2 rounded-full px-3 py-1 " + (i<=idx ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700")}>
          <span className="capitalize">{s.replaceAll('_',' ')}</span>
          {i<steps.length-1 && <span className="mx-1 text-emerald-400">→</span>}
        </div>
      ))}
    </div>
  );
}
