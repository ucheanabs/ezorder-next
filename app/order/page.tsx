export const dynamic = 'force-dynamic';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const OrderClient = dynamic(() => import('./OrderClient'), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 text-slate-600">Loading…</div>}>
      <OrderClient />
    </Suspense>
  );
}
