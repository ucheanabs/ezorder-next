cat > app/order/OrderClient.tsx <<'EOF'
'use client';
import { useEffect, useState } from 'react';

type MenuItem = { id: string; name: string; price: number; qty: number };

export default function OrderClient({ initialEventId }: { initialEventId: string }) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [eventName, setEventName] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/events/${encodeURIComponent(initialEventId)}/menu`, { cache: 'no-store' });
        const j = await res.json();
        if (!res.ok) throw new Error(j?.error || 'failed');
        if (alive) {
          setMenu(j.menu || []);
          setEventName(j.event?.name || 'Order');
        }
      } catch (e) {
        if (alive) setError('Could not load menu');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [initialEventId]);

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const m = menu.find(x => x.id === id);
    return sum + (m ? m.price * qty : 0);
  }, 0);

  function inc(id: string) { setCart(c => ({ ...c, [id]: Math.min((c[id]||0)+1, 99) })); }
  function dec(id: string) {
    setCart(c => {
      const q = Math.max((c[id]||0)-1, 0);
      const n = { ...c };
      if (q === 0) delete n[id]; else n[id] = q;
      return n;
    });
  }

  async function placeOrder() {
    const items = Object.entries(cart).map(([id, qty]) => ({ id, qty }));
    if (items.length === 0) return;
    setPlacing(true); setError(null); setOrderId(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: initialEventId, items })
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || 'failed');
      setOrderId(j.id);
      setCart({});
    } catch (e) {
      setError('Could not place order');
    } finally {
      setPlacing(false);
    }
  }

  if (loading) return <div className="mx-auto max-w-3xl p-6">Loading…</div>;
  if (error) return <div className="mx-auto max-w-3xl p-6 text-red-600">{error}</div>;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">{eventName}</h1>

      {menu.length === 0 && <div className="text-gray-600">No menu items for this event.</div>}

      <div className="grid gap-3">
        {menu.map(m => (
          <div key={m.id} className="flex items-center justify-between rounded-lg border p-3 bg-white">
            <div>
              <div className="font-medium">{m.name}</div>
              <div className="text-sm text-gray-500">₦{m.price.toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded border px-2 py-1" onClick={() => dec(m.id)}>-</button>
              <div className="w-8 text-center">{cart[m.id] || 0}</div>
              <button className="rounded border px-2 py-1" onClick={() => inc(m.id)}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-lg font-semibold">Total: ₦{total.toLocaleString()}</div>
        <button disabled={placing || total===0} onClick={placeOrder} className="rounded-md bg-emerald-600 px-4 py-2 text-white disabled:opacity-50">
          {placing ? 'Placing…' : 'Place order'}
        </button>
      </div>

      {orderId && <div className="mt-4 rounded-md bg-emerald-50 p-3 text-emerald-700 text-sm">Order placed! ID: {orderId}</div>}
    </div>
  );
}
EOF
