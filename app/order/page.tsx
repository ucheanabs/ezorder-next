cat > app/order/page.tsx <<'EOF'
export const dynamic = 'force-dynamic';
import NextDynamic from 'next/dynamic';
import { Suspense } from 'react';

const OrderClient = NextDynamic(() => import('./OrderClient'), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 text-slate-600">Loading…</div>}>
      <OrderClient />
    </Suspense>
  );
}
EOF
