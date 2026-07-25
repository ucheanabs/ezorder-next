'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const nav = [
  { href: '/order?eventId=demo-001&table=12&seat=4&name=Amara', label: 'Guest' },
  { href: '/caterer?eventId=demo-001', label: 'Operations' },
  { href: '/admin', label: 'Command' },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="EZOrder home">
        <span className="brand-mark"><Sparkles size={16} /></span>
        <span>EZ<span className="brand-light">Order</span></span>
      </Link>
      <nav className="main-nav" aria-label="Primary navigation">
        {nav.map(item => (
          <Link className={pathname.startsWith(item.href.split('?')[0]) ? 'active' : ''} href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link href="/order?eventId=demo-001&table=12&seat=4&name=Amara" className="header-cta">
        Enter demo <ArrowUpRight size={15} />
      </Link>
    </header>
  );
}

