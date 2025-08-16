'use client';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (u:string)=>fetch(u).then(r=>r.json());

export default function Page(){
  const { data, mutate } = useSWR<{events:any[]}>('/api/events', fetcher);
  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events</h1>
        <Link href="/admin/create" className="rounded bg-emerald-600 px-3 py-2 text-white">Create Event</Link>
      </div>
      <div className="space-y-3">
        {data?.events?.map(ev=>(
          <div key={ev.id} className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{ev.name}</div>
                <div className="text-sm text-slate-500">{ev.date} • {ev.venue}</div>
                <div className="text-xs text-slate-500">Menu items: {ev.menuCount} • Seating: {ev.seating?.tables} tables × {ev.seating?.seatsPerTable} seats</div>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/events/${ev.id}`} className="rounded border px-3 py-2">Edit</Link>
                <Link href={`/caterer?eventId=${ev.id}`} className="rounded border px-3 py-2">Open Caterer</Link>
                <Link href={`/qr?eventId=${ev.id}`} className="rounded border px-3 py-2">QR</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
