'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Clock3, Heart, Leaf, Minus, Plus, Search, ShoppingBag, Sparkles, WheatOff, X } from 'lucide-react';

type MenuItem = { id:string; name:string; description:string; price:number; time:string; tag:string; color:string; emoji:string };

const menu:MenuItem[] = [
  { id:'jollof', name:'Ember Jollof', description:'Fire-roasted pepper rice, citrus chicken, plantain crisp', price:5400, time:'14 min', tag:'Guest favourite', color:'#db582f', emoji:'🍛' },
  { id:'salmon', name:'Suya-glazed salmon', description:'Charred greens, coconut rice, yaji butter', price:7800, time:'18 min', tag:'Chef’s signature', color:'#bc724f', emoji:'🍣' },
  { id:'pasta', name:'Garden silk pasta', description:'Cashew cream, basil, roasted tomato, herb oil', price:4600, time:'12 min', tag:'Plant powered', color:'#6d8956', emoji:'🍝' },
  { id:'puff', name:'Truffle puff-puff', description:'Parmesan dust, smoked pepper dip', price:2600, time:'8 min', tag:'Perfect to share', color:'#c68e3e', emoji:'🥟' },
  { id:'zobo', name:'Hibiscus cloud', description:'Clarified zobo, pineapple, vanilla air', price:1800, time:'4 min', tag:'Zero proof', color:'#8f274e', emoji:'🍹' },
  { id:'cake', name:'Midnight chocolate', description:'Cocoa sponge, malt caramel, sea salt', price:3200, time:'6 min', tag:'Celebration pick', color:'#5e4037', emoji:'🍰' },
];

export default function OrderClient({ initial }:{ initial:{eventId:string;table:string;seat:string;name:string} }) {
  const [active,setActive]=useState('For you');
  const [cart,setCart]=useState<Record<string,number>>({});
  const [showCart,setShowCart]=useState(false);
  const [placed,setPlaced]=useState(false);
  const itemCount=Object.values(cart).reduce((a,b)=>a+b,0);
  const total=useMemo(()=>Object.entries(cart).reduce((sum,[id,qty])=>sum+(menu.find(m=>m.id===id)?.price||0)*qty,0),[cart]);
  const add=(id:string)=>setCart(c=>({...c,[id]:(c[id]||0)+1}));
  const sub=(id:string)=>setCart(c=>{const next={...c}; if((next[id]||0)<=1) delete next[id]; else next[id]--; return next;});

  if(placed) return (
    <div className="guest-success">
      <div className="success-orbit"><div className="success-check"><Check size={34}/></div></div>
      <span className="chip">Order EO-2418 confirmed</span>
      <h1>The kitchen has you.</h1>
      <p>Your order is in the flow. We’ll keep you updated—no need to wave anyone down.</p>
      <div className="timeline-card glass-card">
        {['Confirmed','Preparing','Ready for runner','At your table'].map((s,i)=><div className={`timeline-node ${i===0?'done':''}`} key={s}><i>{i===0?<Check size={13}/>:i+1}</i><span>{s}</span>{i===0&&<small>Just now</small>}</div>)}
      </div>
      <button className="primary-btn" onClick={()=>{setPlaced(false);setCart({});setShowCart(false)}}>Return to menu</button>
    </div>
  );

  return (
    <div className="guest-page">
      <div className="guest-shell">
        <header className="guest-welcome">
          <div><span className="event-label">Aurora Foundation Gala</span><h1>Good evening, {initial.name || 'Amara'}.</h1><p>Table {initial.table||'12'} · Seat {initial.seat||'4'} <span>•</span> Main service is open</p></div>
          <button className="icon-btn" aria-label="Search menu"><Search size={20}/></button>
        </header>
        <section className="concierge-card">
          <div className="concierge-icon"><Sparkles size={19}/></div>
          <div><strong>Curated for your evening</strong><p>Based on tonight’s menu rhythm, the Ember Jollof and Hibiscus Cloud will arrive beautifully together.</p></div>
          <ChevronRight size={20}/>
        </section>
        <div className="diet-row"><button><Leaf size={15}/> Plant based</button><button><WheatOff size={15}/> Gluten aware</button><button>🌶 Mild</button><button>More filters</button></div>
        <nav className="menu-tabs">{['For you','Starters','Mains','Drinks','Sweet'].map(t=><button className={active===t?'active':''} onClick={()=>setActive(t)} key={t}>{t}</button>)}</nav>
        <div className="menu-heading"><div><span className="section-kicker">Tonight’s edit</span><h2>{active}</h2></div><span>6 considered choices</span></div>
        <div className="menu-grid">
          {menu.map(item=><article className="food-card glass-card" key={item.id}>
            <div className="food-visual" style={{background:`radial-gradient(circle at 30% 20%, ${item.color}aa, transparent 32%), linear-gradient(145deg, ${item.color}, #18221e)`}}>
              <span>{item.emoji}</span><button aria-label={`Save ${item.name}`}><Heart size={17}/></button><div className="food-tag">{item.tag}</div>
            </div>
            <div className="food-info"><h3>{item.name}</h3><p>{item.description}</p><div className="food-meta"><span>₦{item.price.toLocaleString()}</span><small><Clock3 size={12}/> {item.time}</small></div>
              {(cart[item.id]||0)>0?<div className="qty-control"><button onClick={()=>sub(item.id)}><Minus size={15}/></button><strong>{cart[item.id]}</strong><button onClick={()=>add(item.id)}><Plus size={15}/></button></div>:<button className="add-btn" onClick={()=>add(item.id)}><Plus size={16}/> Add</button>}
            </div>
          </article>)}
        </div>
      </div>
      {itemCount>0&&<button className="floating-cart" onClick={()=>setShowCart(true)}><span><ShoppingBag size={18}/><b>{itemCount}</b></span><strong>View your order</strong><span>₦{total.toLocaleString()}</span></button>}
      {showCart&&<div className="cart-overlay" onClick={()=>setShowCart(false)}><aside className="cart-sheet" onClick={e=>e.stopPropagation()}>
        <div className="cart-head"><div><span className="section-kicker">Table {initial.table||'12'} · Seat {initial.seat||'4'}</span><h2>Your order</h2></div><button className="icon-btn" onClick={()=>setShowCart(false)}><X size={20}/></button></div>
        <div className="cart-items">{Object.entries(cart).map(([id,qty])=>{const m=menu.find(x=>x.id===id)!;return <div className="cart-item" key={id}><div className="cart-emoji" style={{background:m.color}}>{m.emoji}</div><div><strong>{m.name}</strong><small>Standard preparation</small></div><div className="mini-qty"><button onClick={()=>sub(id)}><Minus size={13}/></button><span>{qty}</span><button onClick={()=>add(id)}><Plus size={13}/></button></div><b>₦{(m.price*qty).toLocaleString()}</b></div>})}</div>
        <button className="service-note">＋ Add a dietary or service note</button>
        <div className="cart-total"><span>Total</span><strong>₦{total.toLocaleString()}</strong></div>
        <button className="place-order" onClick={()=>setPlaced(true)}><span>Send to kitchen</span><ChevronRight size={19}/></button>
        <p className="cart-assurance">You won’t be charged in this product preview.</p>
      </aside></div>}
    </div>
  );
}
