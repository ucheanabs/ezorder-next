import NextDynamic from 'next/dynamic';
export const dynamic = 'force-dynamic';

const OrderClient = NextDynamic(() => import('./OrderClient'), { ssr: false });

export default function Page({ searchParams }: { searchParams: Record<string,string|string[]|undefined>}) {
  const eventId = typeof searchParams.eventId === 'string' ? searchParams.eventId : 'demo-001';
  return <OrderClient initialEventId={eventId} />;
}
