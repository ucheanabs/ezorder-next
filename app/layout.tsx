import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EZOrder by VertexSolTech',
  description: 'QR ordering • Table delivery • Real-time tracking',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-gradient-to-br from-slate-50 via-emerald-50 to-white">
      <body className={`${inter.className} min-h-screen text-slate-800`}>
        <div className="fixed inset-x-0 top-0 z-40 border-b border-emerald-100/60 bg-white/80 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <a href="/" className="flex items-center gap-2 font-semibold text-emerald-700">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white">EZ</span>
              <span>EZOrder</span>
            </a>
            <div className="flex items-center gap-2">
              <a href="/order" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700">Order</a>
              <a href="/caterer" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700">Caterer</a>
              <a href="/admin" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700">Admin</a>
              <a href="/qr" className="ml-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700">QR Generator</a>
            </div>
          </nav>
        </div>
        <main className="pt-20">{children}</main>
        <footer className="border-t border-emerald-100/60 bg-white/60 mt-16">
          <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-500">
            © {new Date().getFullYear()} VertexSolTech • EZOrder
          </div>
        </footer>
      </body>
    </html>
  );
}
