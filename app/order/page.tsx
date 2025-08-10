import dynamicImport from 'next/dynamic';
const OrderClient = dynamicImport(() => import('./OrderClient'), { ssr: false });
export default function Page({ searchParams }: { searchParams: Record<string,string|string[]|undefined>}) {
  const eventId = typeof searchParams.eventId === 'string' ? searchParams.eventId : 'demo-001';
  return <OrderClient initialEventId={eventId} />;
}
