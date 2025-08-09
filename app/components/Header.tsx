'use client';
import Link from 'next/link';
import { QrCode, Utensils, BarChart3 } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-brand-green text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-heading font-bold">
          <QrCode className="w-6 h-6" /><span>EZOrder</span>
          <span className="text-white/80 text-xs ml-2">by VertexSolTech</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/order" className="hover:underline flex items-center gap-2"><Utensils className="w-4 h-4"/>Order</Link>
          <Link href="/caterer" className="hover:underline flex items-center gap-2"><BarChart3 className="w-4 h-4"/>Caterer</Link>
          <Link href="/admin" className="hover:underline">Admin</Link>
        </nav>
      </div>
    </header>
  );
}