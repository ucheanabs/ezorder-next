'use client';
import { useEffect, useMemo, useState } from 'react';

type MenuItem = { id: string; name: string; price: number; image?: string; cuisine?: 'nigerian'|'continental'; course?: 'starter'|'main'|'dessert'|'drink' };
type Api = { menu: MenuItem[]; event: { id: string; name: string; date: string; venue: string } };

export default function OrderClient({ initialEventId }: { initialEventId: string }) {
  const [eventId] = useState(initialEventId);
  const [data, setData] = useState<Api | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/events/${encodeURIComponent(eventId)}/menu`, { cache: 'no-store' });
        const j = await r.json();
        if (!r.ok) throw new Error(j?.error || 'Failed to load menu');
        if (alive) setData(j);
      } catch (e:any) { if (alive) setErr(e.message||'Error'); }
    })();
    return () => { alive = false; }
  }, [eventId]);

  const grouped = useMemo(() => {
    const g = { nigerian: { starter: [] as MenuItem[], main: [] as MenuItem[], dessert: [] as MenuItem[] }, continental: { starter: [] as MenuItem[], main: [] as MenuItem[], dessert: [] as MenuItem[] }, drinks: [] as MenuItem[] };
    (data?.menu||[]).forEach(m => {
      if (m.course === 'drink') g.drinks.push(m);
      else if (m.cuisine === 'nigerian' && m.course) (g.nigerian as any)[m.course].push(m);
      else if (m.cuisine === 'continental' && m.course) (g.continental as any)[m.course].push(m);
      else g.drinks.push(m);
    });
    return g;
  }, [data]);

  const total = useMemo(() => Object.entries(cart).reduce((s,[id,qty]) => {
    const item = data?.menu.find(m=>m.id===id); return s + (item ? item.price*qty : 0);
  }, 0), [cart, data]);

  function add(id: string) { setCart(c => ({ ...c, [id]: (c[id]||0)+1 })); }
  function sub(id: string) { setCart(c => { const q = (c[id]||0)-1; const n = { ...c }; if (q<=0) delete n[id]; else n[id]=q; return n; }); }

  async function place() {
    if (!data || total===0) return;
    setPlacing(true); setErr(null);
    try {
      const items = Object.entries(cart).map(([id,qty])=>({ id, qty }));
      const r = await fetch('/api/orders', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ eventId: data.event.id, items }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'Failed to place order');
      setOrderId(j.id); setCart({});
    } catch (e:any) { setErr(e.message||'Error'); } finally { setPlacing(false); }
  }

  if (err) return <div className="mx-auto max-w-2xl p-6 text-red-600">{err}</div>;
  if (!data) return <div className="mx-auto max-w-2xl p-6">Loading menu…</div>;

  function Section({ title, items }: { title: string; items: MenuItem[] }) {
    if (!items.length) return null;
    return (
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold text-emerald-700">{title}</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map(m => (
            <div key={m.id} className="flex items-center gap-3 rounded-lg border bg-white p-3">
              {m.image ? <img src={m.image} alt={m.name} className="h-14 w-14 rounded-md object-cover" /> : <div className="h-14 w-14 rounded-md bg-gray-100" />}
              <div className="flex-1">
                <div className="font-medium">{m.name}</div>
                <div className="text-sm text-slate-500">₦{m.price.toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>sub(m.id)} className="h-8 w-8 rounded bg-gray-100">-</button>
                <div className="w-6 text-center">{cart[m.id]||0}</div>
                <button onClick={()=>add(m.id)} className="h-8 w-8 rounded bg-emerald-600 text-white">+</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-1 text-2xl font-semibold text-emerald-700">{data.event.name}</h1>
      <div className="mb-6 text-sm text-slate-600">{data.event.venue} • {data.event.date}</div>
      <Section title="Nigerian • Starters" items={grouped.nigerian.starter} />
      <Section title="Nigerian • Mains" items={grouped.nigerian.main} />
      <Section title="Nigerian • Desserts" items={grouped.nigerian.dessert} />
      <Section title="Continental • Starters" items={grouped.continental.starter} />
      <Section title="Continental • Mains" items={grouped.continental.main} />
      <Section title="Continental • Desserts" items={grouped.continental.dessert} />
      <Section title="Drinks" items={grouped.drinks} />
      <div className="mt-6 flex items-center justify-between">
        <div className="text-lg font-semibold">Total: ₦{total.toLocaleString()}</div>
        <button disabled={placing || total===0} onClick={place} className="rounded-md bg-emerald-600 px-4 py-2 text-white disabled:opacity-50">
          {placing ? 'Placing…' : 'Place order'}
        </button>
      </div>
      {orderId && <div className="mt-4 rounded-md bg-emerald-50 p-3 text-emerald-700 text-sm">Order placed! ID: {orderId}</div>}
    </div>
  );
}
