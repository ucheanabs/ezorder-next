'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type MenuItem = { id:string; name:string; price:number; cuisine:'nigerian'|'continental'; course:'starter'|'main'|'dessert'|'drink'; stock:number; image?:string };
type Event = { id:string; name:string; date:string; venue:string; seating:{tables:number; seatsPerTable:number}; menu:MenuItem[] };

export default function Page(){
  const { id } = useParams<{id:string}>();
  const [ev,setEv]=useState<Event|null>(null);
  const [saving,setSaving]=useState(false);

  useEffect(()=>{ fetch(`/api/events/${id}`).then(r=>r.json()).then(setEv); },[id]);

  function updateField<K extends keyof Event>(k:K,v:any){ setEv(e=> e?({...e,[k]:v}):e); }
  function updateMenu(i:number, k:keyof MenuItem, v:any){ setEv(e=> e?({...e, menu:e.menu.map((m,ix)=>ix===i?{...m,[k]: k==='price'||k==='stock'?Number(v):v }:m)}):e); }
  function addItem(){ setEv(e=> e?({...e, menu:[...e.menu,{id:`mi_${Date.now()}`, name:'', price:0, cuisine:'nigerian', course:'starter', stock:0, image:'' }]}):e); }

  async function save(){
    if(!ev) return;
    setSaving(true);
    await fetch(`/api/events/${ev.id}`,{ method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(ev) });
    setSaving(false);
  }

  if(!ev) return <div className="p-6">Loading…</div>;
  return (
    <div className="mx-auto max-w-4xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{ev.name}</h1>
        <button onClick={save} disabled={saving} className="rounded bg-emerald-600 px-4 py-2 text-white">{saving?'Saving…':'Save'}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="rounded border px-3 py-2" value={ev.name} onChange={e=>updateField('name', e.target.value)} />
        <input className="rounded border px-3 py-2" value={ev.date} onChange={e=>updateField('date', e.target.value)} />
        <input className="rounded border px-3 py-2 md:col-span-1" value={ev.venue} onChange={e=>updateField('venue', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input type="number" className="rounded border px-3 py-2" value={ev.seating.tables} onChange={e=>updateField('seating',{...ev.seating, tables:Number(e.target.value)})} />
        <input type="number" className="rounded border px-3 py-2" value={ev.seating.seatsPerTable} onChange={e=>updateField('seating',{...ev.seating, seatsPerTable:Number(e.target.value)})} />
      </div>

      <div className="mt-2">
        <div className="mb-2 flex items-center justify-between">
          <div className="font-semibold">Menu</div>
          <button type="button" onClick={addItem} className="rounded border px-3 py-2">Add Item</button>
        </div>
        <div className="space-y-3">
          {ev.menu.map((it,i)=>(
            <div key={it.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 rounded border p-3">
              <input className="rounded border px-2 py-2" value={it.name} onChange={e=>updateMenu(i,'name',e.target.value)} />
              <input type="number" className="rounded border px-2 py-2" value={it.price} onChange={e=>updateMenu(i,'price',e.target.value)} />
              <select className="rounded border px-2 py-2" value={it.cuisine} onChange={e=>updateMenu(i,'cuisine',e.target.value)}>
                <option value="nigerian">Nigerian</option>
                <option value="continental">Continental</option>
              </select>
              <select className="rounded border px-2 py-2" value={it.course} onChange={e=>updateMenu(i,'course',e.target.value)}>
                <option value="starter">Starter</option>
                <option value="main">Main</option>
                <option value="dessert">Dessert</option>
                <option value="drink">Drink</option>
              </select>
              <input type="number" className="rounded border px-2 py-2" value={it.stock} onChange={e=>updateMenu(i,'stock',e.target.value)} />
              <input className="rounded border px-2 py-2" placeholder="Image URL" value={it.image||''} onChange={e=>updateMenu(i,'image',e.target.value)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
