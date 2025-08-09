'use client';
import Header from './components/Header';
import Footer from './components/Footer';
import Link from 'next/link';
import { QrCode, Timer, CheckCircle2, ArrowRight, Shield, Sparkles, BarChart3 } from 'lucide-react';

function HeroArt(){
  return (
    <svg viewBox="0 0 800 400" className="w-full h-auto rounded-2xl shadow-soft" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#F5F0E5"/><stop offset="100%" stopColor="#e8f8eb"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="800" height="400" fill="url(#g1)"/>
      <g transform="translate(40,40)">
        <rect x="0" y="0" width="300" height="320" rx="20" fill="#fff" stroke="#E5E7EB"/>
        <text x="20" y="40" fontFamily="Inter" fontWeight="700" fontSize="18" fill="#4CAF50">QR Menu</text>
        <rect x="20" y="60" width="120" height="120" rx="10" fill="#F0FDF4" stroke="#C7F0CC"/>
        <text x="26" y="130" fontSize="12" fill="#4CAF50">Scan to Order</text>
        <rect x="160" y="60" width="120" height="20" rx="8" fill="#FFEDD5"/>
        <rect x="160" y="90" width="120" height="20" rx="8" fill="#E0F2FE"/>
        <rect x="20" y="190" width="260" height="20" rx="8" fill="#E5E7EB"/>
        <rect x="20" y="220" width="180" height="20" rx="8" fill="#E5E7EB"/>
        <rect x="20" y="260" width="120" height="30" rx="10" fill="#FF9800"/>
      </g>
      <g transform="translate(380,80)">
        <rect x="0" y="0" width="360" height="240" rx="20" fill="#fff" stroke="#E5E7EB"/>
        <text x="20" y="40" fontFamily="Inter" fontWeight="700" fontSize="18" fill="#4CAF50">Live Tracking</text>
        <rect x="20" y="70" width="100" height="24" rx="8" fill="#E0F2FE"/>
        <rect x="140" y="70" width="100" height="24" rx="8" fill="#FEF3C7"/>
        <rect x="260" y="70" width="80" height="24" rx="8" fill="#DCFCE7"/>
        <rect x="20" y="120" width="320" height="12" rx="6" fill="#DCFCE7"/>
        <rect x="20" y="150" width="260" height="12" rx="6" fill="#FEF3C7"/>
        <rect x="20" y="180" width="180" height="12" rx="6" fill="#E0F2FE"/>
      </g>
    </svg>
  )
}

export default function Page(){
  return (
    <div>
      <Header />
      <section className="section">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="badge"><Sparkles className="w-4 h-4"/> New</div>
            <h1 className="h1">Scan · Order · Enjoy</h1>
            <p className="text-lg text-brand-gray">The intelligent catering platform for events. QR ordering, table-specific delivery, and real-time order tracking — built for guests, caterers, and planners.</p>
            <div className="flex gap-3">

              <Link href="/order" className="btn btn-primary">Try Demo <ArrowRight className="w-4 h-4 ml-1"/></Link>

              <a href="#features" className="btn btn-accent">See Features</a>

            </div>

            <div className="flex items-center gap-4 text-sm text-brand-gray">

              <div className="flex items-center gap-2"><QrCode className="w-4 h-4 text-brand-green"/> QR Ordering</div>

              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-green"/> Table Delivery</div>

              <div className="flex items-center gap-2"><Timer className="w-4 h-4 text-brand-green"/> Live Tracking</div>

            </div>

          </div>

          <HeroArt/>

        </div>

      </section>


      <section id="features" className="section bg-white/60">

        <div className="max-w-6xl mx-auto px-4">

          <div className="grid md:grid-cols-3 gap-6">

            {[

              {title:'QR Code Ordering', desc:'One scan opens your event menu with categories, images, and special notes.'},

              {title:'Table-Specific Delivery', desc:'Every order is tagged to the guest’s table/seat for precise delivery.'},

              {title:'Real-Time Tracking', desc:'Guests and planners see status updates from placed to delivered.'}

            ].map((f) => (

              <div key={f.title} className="card p-6 space-y-2">

                <h3 className="h2 text-xl">{f.title}</h3>

                <p className="text-brand-gray">{f.desc}</p>

              </div>

            ))}

          </div>

        </div>

      </section>


      <section className="section">

        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">

          <div className="space-y-4">

            <h2 className="h2">Built for Planners & Caterers</h2>

            <p className="text-brand-gray">Monitor orders live, adjust menus on the fly, and coordinate multi-caterer service seamlessly. Post-event analytics reveal top items, prep time, and service performance.</p>

            <div className="flex gap-3">

              <Link href="/admin" className="btn btn-outline">Planner Dashboard</Link>

              <Link href="/caterer" className="btn btn-outline">Caterer Dashboard</Link>

            </div>

          </div>

          <img src="/illustrations/dashboard-mock.svg" alt="Dashboard mockup" className="rounded-2xl shadow-soft border"/>

        </div>

      </section>


      <section className="section bg-white/60">

        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6">

          <div className="card p-6">

            <div className="font-heading text-xl mb-2">For Guests</div>

            <ul className="list-disc pl-5 text-brand-gray space-y-1">

              <li>No queues — order from your seat</li>

              <li>Dietary notes and customization</li>

              <li>Live status notifications</li>

            </ul>

          </div>

          <div className="card p-6">

            <div className="font-heading text-xl mb-2">For Caterers</div>

            <ul className="list-disc pl-5 text-brand-gray space-y-1">

              <li>Consolidated order queue</li>

              <li>Table labels & print-ready tags</li>

              <li>Prep-time insights</li>

            </ul>

          </div>

          <div className="card p-6">

            <div className="font-heading text-xl mb-2">For Planners</div>

            <ul className="list-disc pl-5 text-brand-gray space-y-1">

              <li>Event-wide live view</li>

              <li>Menu toggles & stockouts</li>

              <li>Post-event analytics</li>

            </ul>

          </div>

        </div>

      </section>


      <Footer />

    </div>

  );

}