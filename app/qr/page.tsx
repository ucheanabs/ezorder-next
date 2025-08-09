export const dynamic = 'force-dynamic';
import NextDynamic from 'next/dynamic';

const QRClient = NextDynamic(() => import('./QRClient'), { ssr: false });

export default function Page() {
  return <QRClient />;
}
