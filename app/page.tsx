export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <span>New</span><span>Tap • Scan • Served</span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              QR-based ordering for events that move fast
            </h1>
            <p className="mt-4 text-slate-600 leading-7">
              EZOrder turns every table into a smart ordering station.
              Guests scan a QR, order in seconds, and watch live status through to table-specific delivery.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/order" className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">Try the ordering flow</a>
              <a href="/admin" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300">View admin dashboard</a>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-3">
              <li className="rounded-xl border border-emerald-100 bg-white p-4"><span className="font-semibold text-emerald-700">QR code ordering</span><br/>No apps. No lines.</li>
              <li className="rounded-xl border border-emerald-100 bg-white p-4"><span className="font-semibold text-emerald-700">Table-specific delivery</span><br/>Seat & table metadata.</li>
              <li className="rounded-xl border border-emerald-100 bg-white p-4"><span className="font-semibold text-emerald-700">Real-time tracking</span><br/>Live status updates.</li>
            </ul>
          </div>
          <div className="relative">
            <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <img src="/illustrations/dashboard-mock.svg" alt="Dashboard" className="w-full rounded-lg"/>
            </div>
            <div className="absolute -bottom-6 -right-6 hidden rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm md:block">
              <div className="text-xs font-semibold text-slate-600">Live Orders</div>
              <div className="mt-2 h-24 w-48 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
