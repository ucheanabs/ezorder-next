'use client';

import { useState } from 'react';
import { AlertTriangle, Check, ChefHat, ChevronRight, Clock3, Flame, MoreHorizontal, Printer, Radio, Route, ShieldCheck, Sparkles, Users } from 'lucide-react';

const seed = [
  {id:'2418',table:12,seat:4,name:'Amara',items:['Ember Jollof','Hibiscus Cloud'],age:'02:14',status:'New',allergy:false},
  {id:'2416',table:8,seat:1,name:'Kemi',items:['Suya-glazed salmon'],age:'06:42',status:'Cooking',allergy:true},
  {id:'2414',table:21,seat:2,name:'Daniel',items:['Garden silk pasta','Puff-puff'],age:'08:18',status:'Plating',allergy:false},
  {id:'2411',table:4,seat:7,name:'Maya',items:['Ember Jollof'],age:'11:04',status:'Ready',allergy:false},
];

export default function Caterer() {
  const [orders,setOrders]=useState(seed);
  const [toast,setToast]=useState('');
  const advance=(id:string)=>setOrders(os=>os.map(o=>o.id===id?{...o,status:o.status==='New'?'Cooking':o.status==='Cooking'?'Plating':o.status==='Plating'?'Ready':'Dispatched'}:o));
  const print=(id:string)=>{setToast(`Ticket EO-${id} sent to Hot Kitchen`);setTimeout(()=>setToast(''),2600)};
  return <div className="ops-page">
    <aside className="ops-sidebar">
      <div className="ops-logo"><Sparkles size={17}/></div>
      {[ChefHat,Radio,Route,Printer,Users].map((Icon,i)=><button className={i===0?'active':''} key={i}><Icon size={19}/></button>)}
      <div className="ops-avatar">UC</div>
    </aside>
    <main className="ops-main">
      <header className="ops-head"><div><span className="section-kicker">Kitchen orchestration</span><h1>Service flow</h1></div><div className="ops-live"><span className="pulse"/> Aurora Gala Â· live <b>482 guests</b></div></header>
      <section className="ops-metrics">
        <div><span>Active orders</span><strong>24</strong><small>8 entered in 5 min</small></div>
        <div><span>Median rhythm</span><strong>8:24</strong><small className="good">â†“ 1:12 tonight</small></div>
        <div><span>Ready now</span><strong>7</strong><small>3 runners nearby</small></div>
        <div><span>Flow health</span><strong>94%</strong><small className="good">Excellent</small></div>
      </section>
      <section className="flow-alert"><div className="ai-icon"><Sparkles size={18}/></div><div><strong>Service brain recommendation</strong><p>Fire 3 salmon orders together now. Tables 8, 16 and 21 are aligned within the same course window.</p></div><button>Batch orders <ChevronRight size={15}/></button></section>
      <div className="station-head"><div><h2>Hot kitchen</h2><span>12 active Â· capacity 76%</span></div><div className="station-tabs"><button className="active">All</button><button>New 6</button><button>Cooking 8</button><button>Ready 7</button></div></div>
      <section className="kitchen-grid">
        {orders.map(o=><article className={`kitchen-ticket ${o.allergy?'allergy':''}`} key={o.id}>
          <div className="ticket-top"><span>EO-{o.id}</span><span className={`ticket-status ${o.status.toLowerCase()}`}>{o.status}</span><button><MoreHorizontal size={17}/></button></div>
          <div className="ticket-place"><div className="table-badge">T{o.table}<small>S{o.seat}</small></div><div><strong>{o.name}</strong><span><Clock3 size={12}/> {o.age} in flow</span></div></div>
          {o.allergy&&<div className="allergy-alert"><ShieldCheck size={15}/><strong>Allergy-safe protocol</strong><span>Nut-free Â· verify station</span></div>}
          <div className="ticket-items">{o.items.map((x,i)=><div key={x}><b>{i+1}Ã—</b><span>{x}</span><small>{i===0?'Standard Â· no changes':'Serve chilled'}</small></div>)}</div>
          <div className="ticket-actions"><button onClick={()=>print(o.id)} title="Print ticket"><Printer size={16}/></button><button className="advance-btn" onClick={()=>advance(o.id)}>{o.status==='Ready'?'Dispatch':o.status==='Plating'?'Mark ready':'Advance'} <ChevronRight size={15}/></button></div>
        </article>)}
      </section>
    </main>
    {toast&&<div className="ops-toast"><Check size={16}/>{toast}</div>}
  </div>
}

