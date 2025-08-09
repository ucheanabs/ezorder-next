export const dynamic = "force-dynamic"
'use client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';

export default function Caterer(){
  const [eventId, setEventId] = useState('demo-001');
  const [orders, setOrders] = useState<any[]>([]);

  async function load(){
    const res = await fetch(`/api/events/${eventId}/orders`);
    if (!res.ok) return;
    setOrders(await res.json());
  }
  useEffect(() => { load(); const t = setInterval(load, 3000); return () => clearInterval(t); }, [eventId]);

  async function updateStatus(orderId:string, status:string){
    await fetch(`/api/orders/${orderId}/status`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ status }) });
    load();
  }

  return (
    <div>
      <Header />
      <main className="max-w-6xl mx-auto px-4 section space-y-6">
        <div className="flex items-center justify-between">

          <h1 className="h1">Caterer Console</h1>

          <div className="flex items-center gap-2">

            <input value={eventId} onChange={e=>setEventId(e.target.value)} className="border rounded-xl px-3 py-2"/>

            <button className="btn btn-outline" onClick={load}>Refresh</button>

          </div>

        </div>


        <div className="grid gap-3">

          {orders.map(o => (

            <div key={o.orderId} className="card p-4 flex items-center justify-between flex-wrap gap-4">

              <div>

                <div className="font-heading">Order #{o.orderId}</div>

                <div className="text-sm text-brand-gray">Table {o.table}{o.seat?'-'+o.seat:''} {o.name?('· '+o.name):''}</div>

                <div className="text-sm">{o.items.map((it:any)=>`${it.id}×${it.qty}`).join(', ')}</div>

              </div>

              <div className="flex items-center gap-2">

                {['PLACED','PREPARING','ON_THE_WAY','DELIVERED'].map(s => (

                  <button key={s} className={`btn ${o.status===s ? 'btn-primary' : 'btn-outline'}`} onClick={()=>updateStatus(o.orderId, s)}>{s.replaceAll('_',' ')}</button>

                ))}

              </div>

            </div>

          ))}

        </div>

      </main>

      <Footer />

    </div>

  )

}