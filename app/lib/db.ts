export type MenuItem = { id: string; name: string; price: number; category: string };
export type OrderItem = { id: string; qty: number };
export type Order = {
  orderId: string;
  eventId: string;
  table: string;
  seat?: string | null;
  name?: string | null;
  items: OrderItem[];
  status: 'PLACED' | 'PREPARING' | 'ON_THE_WAY' | 'DELIVERED';
  history: { status: string; at: string }[];
};

const events: Record<string, { name: string; date: string; menu: MenuItem[] }> = {
  'demo-001': {
    name: 'Paul & Christy’s Wedding',
    date: '2025-10-25',
    menu: [
      { id: 'm1', name: 'Jollof Rice & Grilled Chicken', price: 4500, category: 'Mains' },
      { id: 'm2', name: 'Vegetable Spring Rolls', price: 2500, category: 'Appetizers' },
      { id: 'm3', name: 'Fruit Platter', price: 3000, category: 'Sides' },
      { id: 'm4', name: 'Fresh Juice', price: 1500, category: 'Drinks' }
    ]
  }
};

const orders: Record<string, Order> = {};

function id(len = 10){
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = ''; for (let i=0;i<len;i++) s += chars[Math.floor(Math.random()*chars.length)];
  return s;
}

export const DB = {
  getEvent(eventId: string){ return events[eventId] || null; },
  getMenu(eventId: string){ const ev = events[eventId]; return ev ? ev.menu : null; },
  listOrders(eventId: string, table?: string | null){
    return Object.values(orders).filter(o => o.eventId === eventId && (!table || o.table === String(table))).sort((a,b)=> (a.history[0]?.at < b.history[0]?.at ? 1:-1));
  },
  createOrder(payload: Omit<Order, 'orderId' | 'status' | 'history'>){
    const orderId = id(10);
    const now = new Date().toISOString();
    orders[orderId] = { ...payload, orderId, status: 'PLACED', history: [{ status: 'PLACED', at: now }] };
    return orders[orderId];
  },
  getOrder(orderId: string){ return orders[orderId] || null; },
  updateStatus(orderId: string, status: Order['status']){
    const o = orders[orderId]; if (!o) return null;
    const order = ['PLACED','PREPARING','ON_THE_WAY','DELIVERED'] as const;
    if (order.indexOf(status) < order.indexOf(o.status)) return o;
    o.status = status; o.history.push({ status, at: new Date().toISOString() });
    return o;
  }
};