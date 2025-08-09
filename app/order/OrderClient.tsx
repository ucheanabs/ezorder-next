cat > app/order/OrderClient.tsx <<'EOF'
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type MenuItem = { id: string; name: string; price: number; image?: string };
type Line = { id: string; qty: number };
type PlaceOrderBody = { eventId: string; table?: string; seat?: string; name?: string; lines: Line[] };

const money = (n:number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(n);

export default function OrderClient() {
  const searchParams = useSearchParams();
  const eventId = searchParams?.get('eventId') || 'demo-001';
  const table = searchParams?.get('table') || '';
  const seat = searchParams?.get('seat') || '';
  const name = searchParams?.get('name') || '';

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle'|'placed'|'preparing'|'out_for_delivery'|'delivered'>('idle');
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/events/${encodeURIComponent(eventId)}/menu`, { cache: 'no-store' });
        const data = await r.json();
        if (alive) setMenu(Array.isArray(data) ? data : []);
      } catch { if (alive) setError('Could not load menu.'); }
    })();
    return () => { alive = false; };
  }, [eventId]);

  const items = useMemo(() => menu.map(m => ({ ...m, qty: cart[m.id] || 0 })), [menu, cart]);
  const total = useMemo(() => items.reduce((s,i)=> s + (i.price||0) * (i.qty||0), 0), [items]);

  const inc = (id:string) => setCart(c => ({ ...c, [id]: (c[id]||0) + 1 }));
  const dec = (id:string) => setCart(c => ({ ...c, [id]: Math.max(0, (c[id]||0) - 1) }));

  const placeOrder = async () => {
    try {
      setError(null);
      const lines: Line[] = items.filter(i=>i.qty>0).map(i=>({ id: i.id, qty: i.qty }));
      if (!lines.length) { setToast('Add some items first.'); return; }
      setPlacing(true);
      const body: PlaceOrderBody = { eventId, table, seat, name, lines };
      const r = await fetch('/api/orders', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body) });
      if (!r.ok) throw new Error();
      const data = await r.json();
      setOrderId(data?.id || null);
      setStatus('placed');
      setToast('Order placed!');
    } catch {
      setError('Could not place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;
    const t = setInterval(async () => {
      try {
        const r = await fetch(`/api/orders/${orderId}/status`, { cache:'no-store' });
        if (!r.ok) return;
        const data = await r.json();
        const s = (data?.status as typeof status) || 'placed';
        setStatus(s);
      } catch {}
    }, 3000);
    return () => clearInterval(t);
  }, [orderId]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-10 border-b border-emerald-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="text-lg font-bold text-emerald-800">EZ Order</div>
          <div className="text-xs text-slate-600">Event {eventId}{table && ` • Table ${table}`}{seat && ` • Seat ${seat}`}{name && ` • ${name}`}</div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[1fr_360px]">
        <section>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {menu.length === 0 && !error && [...Array(6)].map((_,i)=>(
              <div key={i} className="h-44 animate-pulse rounded-2xl bg-emerald-100" />
            ))}
            {menu.map(item=>(
              <div key={item.id} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm transition hover:shadow">
                <div className="h-28 w-full rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100" />
                <div className="mt-3 flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{item.name}</div>
                    <div className="text-sm text-slate-600">{money(item.price||0)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>dec(item.id)} className="h-8 w-8 rounded-lg border border-slate-200">-</button>
                    <div className="w-6 text-center text-sm">{cart[item.id]||0}</div>
                    <button onClick={()=>inc(item.id)} className="h-8 w-8 rounded-lg bg-emerald-600 text-white">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        </section>

        <aside className="h-max rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-emerald-700">Your Order</div>
          <ul className="mt-3 space-y-3">
            {items.filter(i=>i.qty>0).map(i=>(
              <li key={i.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{i.name} × {i.qty}</span>
                <span className="font-medium text-slate-900">{money(i.price * i.qty)}</span>
              </li>
            ))}
            {items.every(i=>!i.qty) && <li className="text-sm text-slate-500">No items yet.</li>}
          </ul>
          <div className="mt-4 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span className="font-medium">{money(total)}</span></div>
            <div className="mt-2 flex justify-between"><span className="text-slate-600">Service</span><span className="font-medium">{money(0)}</span></div>
            <div className="mt-3 flex justify-between text-base font-semibold"><span>Total</span><span className="text-emerald-700">{money(total)}</span></div>
          </div>
          <button onClick={placeOrder} disabled={!total || placing} className="mt-5 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
            {placing ? 'Placing…' : 'Place Order'}
          </button>

          {orderId && (
            <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm">
              <div className="font-semibold text-emerald-800">Order Status</div>
              <Status status={status}/>
              <div className="mt-2 text-xs text-emerald-700">Order ID: {orderId}</div>
            </div>
          )}
        </aside>
      </main>

      {toast && <Toast text={toast} onClose={()=>setToast(null)} />}
    </div>
  );
}

function Status({ status }:{ status:string }) {
  const steps = ['placed','preparing','out_for_delivery','delivered'] as const;
  const idx = Math.max(0, steps.indexOf(status as any));
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
      {steps.map((s,i)=>(
        <div key={s} className={"inline-flex items-center gap-2 rounded-full px-3 py-1 " + (i<=idx ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-800")}>
          <span className="capitalize">{s.replaceAll('_',' ')}</span>
          {i<steps.length-1 && <span>→</span>}
        </div>
      ))}
    </div>
  );
}

function Toast({ text, onClose }:{ text:string; onClose:()=>void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
      {text}
    </div>
  );
}
EOF
