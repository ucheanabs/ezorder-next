'use client';

import { Activity, AlertCircle, ArrowUpRight, Check, Clock3, Command, Map, Radio, Sparkles, TrendingUp, Users, Utensils, Zap } from 'lucide-react';

const tables = Array.from({length:24},(_,i)=>({n:i+1,state:[4,13].includes(i)?'alert':[2,7,11,17].includes(i)?'waiting':[5,9,19].includes(i)?'empty':'flow'}));

export default function Admin() {
 return <div className="command-page">
   <div className="command-shell">
    <header className="command-head"><div><span className="section-kicker">Event command</span><h1>Aurora Gala</h1><p>Grand Pavilion · Saturday, 25 July</p></div><div className="command-actions"><button><Radio size={15}/> Live view</button><button className="dark"><Command size={15}/> Actions</button></div></header>
    <section className="command-status"><span className="pulse"/><strong>Service is flowing beautifully</strong><span>482 guests · Main course · 8:42 PM</span><b>94% health</b></section>
    <section className="command-metrics">
      <article><div><span>Guests served</span><Users size={18}/></div><strong>428 <small>/ 482</small></strong><p><TrendingUp size={13}/> 89% complete</p></article>
      <article><div><span>Service rhythm</span><Clock3 size={18}/></div><strong>8:24 <small>min</small></strong><p><TrendingUp size={13}/> 12% faster than plan</p></article>
      <article><div><span>Kitchen load</span><Utensils size={18}/></div><strong>76<small>%</small></strong><p>Balanced across 3 stations</p></article>
      <article><div><span>Guest sentiment</span><Sparkles size={18}/></div><strong>4.8<small>/5</small></strong><p><TrendingUp size={13}/> Exceptional</p></article>
    </section>
    <section className="command-grid">
      <article className="room-card command-card">
        <div className="card-head"><div><span className="section-kicker">Room pulse</span><h2>Grand Pavilion</h2></div><button><Map size={16}/> Zones</button></div>
        <div className="floor-map">{tables.map(t=><div className={`map-table ${t.state}`} key={t.n}><span>{t.n}</span>{t.state==='alert'&&<AlertCircle size={12}/>} {t.state==='waiting'&&<Clock3 size={11}/>}</div>)}</div>
        <div className="map-legend"><span><i className="flow"/>Flowing</span><span><i className="waiting"/>Waiting</span><span><i className="alert"/>Attention</span><span><i className="empty"/>Open</span></div>
      </article>
      <article className="insight-card command-card">
        <div className="card-head"><div><span className="section-kicker">Live intelligence</span><h2>What needs you</h2></div><Activity size={18}/></div>
        <div className="insight-list">
          <div className="critical"><i><AlertCircle size={17}/></i><div><strong>Table 5 is incomplete</strong><p>Seat 6 is 4 minutes behind the rest of the table.</p><button>Resolve now <ArrowUpRight size={13}/></button></div></div>
          <div><i><Zap size={17}/></i><div><strong>Kitchen opportunity</strong><p>Batch 3 salmon orders and save an estimated 4 minutes.</p><button>View batch <ArrowUpRight size={13}/></button></div></div>
          <div><i><Check size={17}/></i><div><strong>West zone recovered</strong><p>Runner reassignment brought service rhythm back to target.</p></div></div>
        </div>
      </article>
      <article className="rhythm-card command-card">
        <div className="card-head"><div><span className="section-kicker">Service rhythm</span><h2>Last 60 minutes</h2></div><span className="chip">On target</span></div>
        <div className="chart-bars">{[34,42,39,58,63,49,70,66,78,74,86,82].map((h,i)=><div key={i}><span style={{height:`${h}%`}}/></div>)}</div>
        <div className="chart-axis"><span>7:45</span><span>8:00</span><span>8:15</span><span>8:30</span><span>Now</span></div>
      </article>
    </section>
   </div>
 </div>
}
