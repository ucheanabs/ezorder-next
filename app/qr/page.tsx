import { headers } from 'next/headers';
import QRClient from './QRClient';
export const dynamic = 'force-dynamic';
export default function Page({ searchParams }: { searchParams: Record<string,string|string[]|undefined>}) {
  const h = headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? '';
  const proto = h.get('x-forwarded-proto') ?? (host.includes('localhost') ? 'http' : 'https');
  const origin = `${proto}://${host}`;
  const sp = new URLSearchParams();
  const eventId = typeof searchParams.eventId === 'string' ? searchParams.eventId : '';
  const table = typeof searchParams.table === 'string' ? searchParams.table : '';
  const seat = typeof searchParams.seat === 'string' ? searchParams.seat : '';
  const name = typeof searchParams.name === 'string' ? searchParams.name : '';
  if (eventId) sp.set('eventId', eventId);
  if (table) sp.set('table', table);
  if (seat) sp.set('seat', seat);
  if (name) sp.set('name', name);
  const href = `${origin}/order${sp.toString() ? `?${sp.toString()}` : ''}`;
  return <QRClient href={href} />;
}
