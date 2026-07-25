import Link from 'next/link';
import { ArrowRight, CheckCircle2, Printer, Radio, ScanLine, Sparkles, UtensilsCrossed } from 'lucide-react';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow"><span className="pulse" /> Event intelligence is live</div>
          <h1>Hospitality,<br/><em>orchestrated.</em></h1>
          <div className="hero-copy">
            <div>
              <p>EZOrder turns every seat, kitchen station, and service moment into one beautifully coordinated experienceâ€”so remarkable service feels effortless.</p>
              <div className="button-row">
                <Link href="/order?eventId=demo-001&table=12&seat=4&name=Amara" className="primary-btn">Experience as a guest <ArrowRight size={16}/></Link>
                <Link href="/admin" className="secondary-btn">Open command center</Link>
              </div>
            </div>
            <div className="live-board" aria-label="Live event overview">
              <div className="live-top"><span className="live-title">Aurora Gala Â· Live</span><span className="live-signal"><i className="signal-dot"/>All systems flowing</span></div>
              <div className="metric-grid">
                <div className="metric"><div className="metric-label">Guests served</div><div className="metric-value">428 <small>â†‘ 12%</small></div></div>
                <div className="metric"><div className="metric-label">Service rhythm</div><div className="metric-value">8.4m <small>excellent</small></div></div>
              </div>
              <div className="order-stream">
                <div className="stream-row"><div className="table-orb">T12</div><div className="stream-main"><strong>Amara Â· Seat 4</strong><span>Jollof, citrus chicken Â· 2 items</span></div><span className="status">en route</span></div>
                <div className="stream-row"><div className="table-orb">T08</div><div className="stream-main"><strong>Table 8 Â· shared</strong><span>Starter course Â· 6 guests</span></div><span className="status amber">plating</span></div>
                <div className="stream-row"><div className="table-orb">T21</div><div className="stream-main"><strong>Daniel Â· Seat 2</strong><span>Allergy-safe meal verified</span></div><span className="status">ready</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="trust-strip"><span>One intelligent service layer</span><div className="trust-items"><span>Guests</span><span>Kitchen</span><span>Runners</span><span>Organizers</span></div></div>
      </section>

      <section className="section-shell">
        <div className="section-kicker">Beyond the QR menu</div>
        <h2 className="section-title">Every moving part, moving as one.</h2>
        <p className="section-lede">A living operational layer that understands every guest, every course, and every service promiseâ€”then helps your team deliver it.</p>
        <div className="bento">
          <article className="bento-card dark">
            <div className="bento-number">01 Â· SERVICE BRAIN</div><div className="orbit"/>
            <h3>The right action, before anyone has to ask.</h3>
            <p>EZOrder continuously prioritizes preparation, catches delays, protects allergy-safe meals, and guides runners to the exact seat.</p>
          </article>
          <article className="bento-card">
            <div className="bento-number">02 Â· ROOM PULSE</div>
            <h3>See the room breathe.</h3>
            <p>A live floor plan turns service pressure into calm, actionable signals.</p>
            <div className="floor-mini">{['01','02','03','04','05','06','07','08','09','10'].map((n,i)=><div key={n} className={`floor-table ${i===3?'alert':i<6?'good':''}`}>{n}</div>)}</div>
          </article>
          <article className="bento-card full">
            <div className="bento-number">03 Â· ONE CONTINUOUS JOURNEY</div>
            <div className="flow-line">
              {[['Scan','Seat recognized'],['Choose','Menu adapts'],['Prepare','Kitchen paced'],['Deliver','Runner guided'],['Delight','Moment measured']].map(([a,b],i)=><div className="flow-step" key={a}><span>0{i+1}</span><strong>{a}</strong><small>{b}</small></div>)}
            </div>
            <h3 style={{marginTop:32}}>Friction disappears. Hospitality remains.</h3>
          </article>
        </div>
      </section>

      <section className="section-shell" style={{paddingTop:20}}>
        <div className="section-kicker">Built for real-world pressure</div>
        <h2 className="section-title">Digital precision. Physical reliability.</h2>
        <div className="bento" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
          {[
            [Printer,'Printer-ready','Route resilient tickets to kitchen, bar, and dessert stations with duplicate protection.'],
            [Radio,'Live by design','Every status, table signal, and service handoff stays synchronized in real time.'],
            [CheckCircle2,'Service recovery','Detect a late or incomplete table early and intervene before frustration becomes a complaint.']
          ].map(([Icon,title,copy]:any)=><article className="bento-card" style={{minHeight:300}} key={title}><Icon size={26}/><h3 style={{marginTop:72}}>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="cta-block">
        <div className="section-kicker" style={{color:'#c9ff54'}}>The demo is alive</div>
        <h2>Step inside the future of event service.</h2>
        <div className="button-row">
          <Link href="/order?eventId=demo-001&table=12&seat=4&name=Amara" className="primary-btn lime"><ScanLine size={17}/> Scan into Table 12</Link>
          <Link href="/caterer?eventId=demo-001" className="secondary-btn" style={{color:'white',borderColor:'rgba(255,255,255,.18)',background:'rgba(255,255,255,.05)'}}><UtensilsCrossed size={17}/> Run service</Link>
        </div>
      </section>
      <footer className="footer"><span>Â© 2026 EZOrder Â· Hospitality, orchestrated.</span><span>Designed for remarkable service.</span></footer>
    </>
  );
}

