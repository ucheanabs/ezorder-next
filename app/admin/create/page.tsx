'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type MenuItem = { id:string; name:string; price:number; cuisine:'nigerian'|'continental'; course:'starter'|'main'|'dessert'|'drink'; stock:number; image?:string };

export default function Page(){
  const [name,setName]=useState('');
  const [date,setDate]=useState('');
  const [venue,setVenue]=useState('');
  const [tables,setTables]=useState(10);
  const [seatsPerTable,setSeatsPerTable]=useState(10);
  const [menu,setMenu]=useState<MenuItem[]>([]);
  const router = useRouter();

  function addItem(){
    setMenu(m=>[...m,{ id:`mi_${Date.now()}`, name:'', price:0, cuisine:'nigerian', course:'starter', stock:0, image:'' }]);
  }
  function update(i:number, key:keyof MenuItem, val:any){
    setMenu(m=>m.map((it,ix)=>ix===i?{...it,[key]: key==='price'||key==='stock'?Number(val):val }:it));
  }
  async function submit(e:React.FormEvent){
    e.preventDefault();
    const body = { name, date, venue, seating:{ tables:Number(tables), seatsPerTable:Number(seatsPerTable) }, menu };
    const res = await fetch('/api/events',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    if(res.ok){ const ev = await res.json(); router.replace(`/admin/events/${ev.id}`); }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Create Event</h1>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="rounded border px-3 py-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="rounded border px-3 py-2" placeholder="Date (YYYY-MM-DD)" value={date} onChange={e=>setDate(e.target.value)} />
          <input className="rounded border px-3 py-2 md:col-span-2" placeholder="Venue" value={venue} onChange={e=>setVenue(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="number" className="rounded border px-3 py-2" placeholder="Tables" value={tables} onChange={e=>setTables(Number(e.target.value))} />
          <input type="number" className="rounded border px-3 py-2" placeholder="Seats per table" value={seatsPerTable} onChange={e=>setSeatsPerTable(Number(e.target.value))} />
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-semibold">Menu Items</div>
            <button type="button" onClick={addItem} className="rounded border px-3 py-2">Add Item</button>
          </div>
          <div className="space-y-3">
            {menu.map((it,i)=>(
              <div key={it.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 rounded border p-3">
                <input className="rounded border px-2 py-2" placeholder="Name" value={it.name} onChange={e=>update(i,'name',e.target.value)} />
                <input type="number" className="rounded border px-2 py-2" placeholder="Price" value={it.price} onChange={e=>update(i,'price',e.target.value)} />
                <select className="rounded border px-2 py-2" value={it.cuisine} onChange={e=>update(i,'cuisine',e.target.value)}>
                  <option value="nigerian">Nigerian</option>
                  <option value="continental">Continental</option>
                </select>
                <select className="rounded border px-2 py-2" value={it.course} onChange={e=>update(i,'course',e.target.value)}>
                  <option value="starter">Starter</option>
                  <option value="main">Main</option>
                  <option value="dessert">Dessert</option>
                  <option value="drink">Drink</option>
                </select>
                <input type="number" className="rounded border px-2 py-2" placeholder="Stock" value={it.stock} onChange={e=>update(i,'stock',e.target.value)} />
                <input className="rounded border px-2 py-2" placeholder="Image URL (optional)" value={it.image||''} onChange={e=>update(i,'image',e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <button className="rounded bg-emerald-600 px-4 py-2 text-white">Save Event</button>
      </form>
    </div>
  );
}
