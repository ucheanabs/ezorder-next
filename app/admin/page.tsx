export const dynamic = "force-dynamic"
'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { OrdersOverTime, TopItems } from '../components/Charts';

export default function Admin(){
  const [eventId, setEventId] = useState('demo-001');
  const [orders, setOrders] = useState<any[]>([]);

  async function load(){
    const res = await fetch(`/api/events/${eventId}/orders`);
    if (!res.ok) return;
    setOrders(await res.json());
  }

  useEffect(() => { load(); const t = setInterval(load, 3000); return () => clearInterval(t); }, [eventId]);

  const byHour = Array.from({ length: 10 }).map((_,i)=>({ time: `${12+i}:00`, orders: Math.floor(Math.random()*14)+2 }));
  const top = [{ name: 'Jollof', count: 32 }, { name: 'Spring Rolls', count: 21 }, { name: 'Fruit', count:16 }];

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto px-4 section space-y-6">
        <div className="flex items-center justify-between">

          <h1 className="h1">Planner Dashboard</h1>

          <div className="flex items-center gap-2">

            <input value={eventId} onChange={e=>setEventId(e.target.value)} className="border rounded-xl px-3 py-2"/>

            <button className="btn btn-outline" onClick={load}>Refresh</button>

          </div>

        </div>


        <div className="grid md:grid-cols-2 gap-6">

          <div className="card p-4"><div className="font-heading mb-2">Orders by Time</div><OrdersOverTime data={byHour}/></div>

          <div className="card p-4"><div className="font-heading mb-2">Top Items</div><TopItems data={top}/></div>

        </div>


        <div className="card p-4 overflow-auto">

          <table className="w-full text-sm">

            <thead><tr className="text-left"><th className="p-2">Order ID</th><th className="p-2">Table</th><th className="p-2">Name</th><th className="p-2">Items</th><th className="p-2">Status</th></tr></thead>

            <tbody>

              {orders.map((o:any) => (

                <tr key={o.orderId} className="border-t">

                  <td className="p-2">{o.orderId}</td>

                  <td className="p-2">{o.table}{o.seat?'-'+o.seat:''}</td>

                  <td className="p-2">{o.name || ''}</td>

                  <td className="p-2">{o.items.map((it:any)=>`${it.id}×${it.qty}`).join(', ')}</td>

                  <td className="p-2 font-semibold">{o.status}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </main>

      <Footer />

    </div>

  )

}