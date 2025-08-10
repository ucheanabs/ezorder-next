// app/qr/page.tsx
import NextDynamic from 'next/dynamic';
export const revalidate = false;

const QRClient = NextDynamic(() => import('./QRClient'), { ssr: false });

export default function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const eventId = typeof searchParams.eventId === 'string' ? searchParams.eventId : 'demo-001';
  const table = typeof searchParams.table === 'string' ? searchParams.table : '';
  const seat = typeof searchParams.seat === 'string' ? searchParams.seat : '';
  const name = typeof searchParams.name === 'string' ? searchParams.name : '';

  const sp = new URLSearchParams();
  if (eventId) sp.set('eventId', eventId);
  if (table) sp.set('table', table);
  if (seat) sp.set('seat', seat);
  if (name) sp.set('name', name);

  const href = `/order${sp.toString() ? `?${sp.toString()}` : ''}`;
  return <QRClient href={href} />;
}
