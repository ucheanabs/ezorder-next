import QRClient from './QRClient';

export const revalidate = false;

export default function Page({ searchParams }: { searchParams: Record<string,string|string[]|undefined>}) {
  const host = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_BASE_URL || '' : window.location.origin;
  const base = host || '';
  const sp = new URLSearchParams();
  const eventId = typeof searchParams.eventId === 'string' ? searchParams.eventId : 'demo-001';
  const zone = typeof searchParams.zone === 'string' ? searchParams.zone : '';
  const table = typeof searchParams.table === 'string' ? searchParams.table : '';
  const seat = typeof searchParams.seat === 'string' ? searchParams.seat : '';
  const name = typeof searchParams.name === 'string' ? searchParams.name : '';
  if (eventId) sp.set('eventId', eventId);
  if (zone) sp.set('zone', zone);
  if (table) sp.set('table', table);
  if (seat) sp.set('seat', seat);
  if (name) sp.set('name', name);
  const href = `${base}/order${sp.toString() ? `?${sp.toString()}` : ''}`;
  return <QRClient href={href} />;
}
