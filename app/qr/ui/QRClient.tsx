'use client';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

type Event={id:string; name:string};

export default function QRClient(){
  const [events,setEvents]=useState<Event[]>([]);
  const [eventId,setEventId]=useState('');
  const [table,setTable]=useState('');
  const [seat,setSeat]=useState('');
  const [name,setName]=useState('');
  const [href,setHref]=useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(()=>{ fetch('/api/events').then(r=>r.json()).then(d=>setEvents(d.events||[])); },[]);

  useEffect(()=>{
    const url = new URL(window.location.origin + '/order');
    if(eventId) url.searchParams.set('eventId', eventId);
    if(table) url.searchParams.set('table', table);
    if(seat) url.searchParams.set('seat', seat);
    if(name) url.searchParams.set('name', name);
    const link = url.toString();
    setHref(link);
    if(canvasRef.current){ QRCode.toCanvas(canvasRef.current, link, { width: 320 }); }
  },[eventId,table,seat,name]);

  return (
    <div className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">QR Link</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select className="rounded border px-3 py-2" value={eventId} onChange={e=>setEventId(e.target.value)}>
          <option value="">Select event…</option>
          {events.map(ev=> <option key={ev.id} value={ev.id}>{ev.name}</option>)}
        </select>
        <input className="rounded border px-3 py-2" placeholder="Table" value={table} onChange={e=>setTable(e.target.value)} />
        <input className="rounded border px-3 py-2" placeholder="Seat" value={seat} onChange={e=>setSeat(e.target.value)} />
        <input className="rounded border px-3 py-2 md:col-span-2" placeholder="Guest name (optional)" value={name} onChange={e=>setName(e.target.value)} />
      </div>
      <canvas ref={canvasRef} className="rounded border bg-white p-3" />
      <div className="rounded border bg-white p-3 text-xs break-all">{href}</div>
    </div>
  );
}
