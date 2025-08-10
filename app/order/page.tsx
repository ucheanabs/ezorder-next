// app/order/page.tsx
import NextDynamic from 'next/dynamic';
export const dynamic = 'force-dynamic';

const OrderClient = NextDynamic(() => import('./OrderClient'), { ssr: false });

export default function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const eventId = typeof searchParams.eventId === 'string' ? searchParams.eventId : 'demo-001';
  const table = typeof searchParams.table === 'string' ? searchParams.table : '';
  const seat = typeof searchParams.seat === 'string' ? searchParams.seat : '';
  const name = typeof searchParams.name === 'string' ? searchParams.name : '';
  return <OrderClient initialEventId={eventId} initialTable={table} initialSeat={seat} initialName={name} />;
}
