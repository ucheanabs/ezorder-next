export type MenuItem = { id: string; name: string; price: number };
export type Event = { id: string; name: string; date: string; venue: string; menu: MenuItem[]; createdAt: number };
export type OrderItem = { id: string; qty: number };
export type OrderStatus = 'pending' | 'preparing' | 'served';
export type Order = { id: string; eventId: string; items: OrderItem[]; status: OrderStatus; createdAt: number; updatedAt: number };

const db = { events: new Map<string, Event>(), orders: new Map<string, Order>() };

// Seed a demo event so /order works immediately
if (!db.events.has('demo-001')) {
  db.events.set('demo-001', {
    id: 'demo-001',
    name: 'Demo Gala Night',
    date: new Date().toISOString().slice(0,10),
    venue: 'Demo Hall',
    menu: [
      { id: 'jollof-rice', name: 'Jollof Rice', price: 2500 },
      { id: 'fried-rice', name: 'Fried Rice', price: 2500 },
      { id: 'grilled-chicken', name: 'Grilled Chicken', price: 3500 },
      { id: 'salad', name: 'Salad', price: 1500 },
    ],
    createdAt: Date.now(),
  });
}

export function listEvents(): Event[] {
  return Array.from(db.events.values()).sort((a,b)=>b.createdAt-a.createdAt);
}
export function getEvent(id: string): Event | undefined { return db.events.get(id); }
export function upsertEvent(e: Omit<Event,'createdAt'> & { createdAt?: number }): Event {
  const id = (e.id || '').trim() || `ev_${Date.now()}`;
  const ev: Event = { ...e, id, createdAt: e.createdAt ?? Date.now() };
  db.events.set(id, ev);
  return ev;
}
export function deleteEvent(id: string): boolean { return db.events.delete(id); }

export function createOrder(eventId: string, items: OrderItem[]): Order {
  const id = `ord_${Date.now()}`;
  const now = Date.now();
  const order: Order = { id, eventId, items, status: 'pending', createdAt: now, updatedAt: now };
  db.orders.set(id, order);
  return order;
}
export function listOrders(eventId: string): Order[] {
  return Array.from(db.orders.values()).filter(o=>o.eventId===eventId).sort((a,b)=>b.createdAt-a.createdAt);
}
export function getOrder(id: string): Order | undefined { return db.orders.get(id); }
export function updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
  const o = db.orders.get(id); if (!o) return;
  o.status = status; o.updatedAt = Date.now(); db.orders.set(id, o);
  return o;
}
