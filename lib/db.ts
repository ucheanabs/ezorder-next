export type MenuItem = { id: string; name: string; price: number; qty: number };
export type Event = { id: string; name: string; date: string; venue: string; menu: MenuItem[]; createdAt: number };
export type OrderStatus = "pending" | "preparing" | "served";
export type Order = { id: string; eventId: string; items: { id: string; qty: number }[]; status: OrderStatus; createdAt: number; updatedAt: number };

const db = { events: new Map<string, Event>(), orders: new Map<string, Order>() };

function seed() {
  if (db.events.size > 0) return;
  const eventId = "demo-001";
  const menu: MenuItem[] = [
    { id: "jollof", name: "Jollof Rice", price: 2500, qty: 200 },
    { id: "fried_rice", name: "Fried Rice", price: 2500, qty: 150 },
    { id: "chicken", name: "Grilled Chicken", price: 3000, qty: 150 },
    { id: "salad", name: "Salad", price: 1500, qty: 100 },
    { id: "water", name: "Bottled Water", price: 500, qty: 500 }
  ];
  db.events.set(eventId, { id: eventId, name: "Sample Wedding", date: new Date().toISOString().slice(0,10), venue: "Demo Hall", menu, createdAt: Date.now() });
}
seed();

export function listEvents(): Event[] { return Array.from(db.events.values()).sort((a,b)=>b.createdAt-a.createdAt); }
export function getEvent(id: string): Event | undefined { return db.events.get(id); }
export function upsertEvent(e: { id?: string; name: string; date: string; venue: string; menu: MenuItem[]; createdAt?: number }): Event {
  const id = e.id && e.id.trim() !== "" ? e.id : `ev_${Date.now()}`;
  const event: Event = { id, name: e.name, date: e.date, venue: e.venue, menu: e.menu, createdAt: e.createdAt ?? Date.now() };
  db.events.set(id, event);
  return event;
}
export function deleteEvent(id: string): boolean { return db.events.delete(id); }

export function listOrders(eventId: string): Order[] { return Array.from(db.orders.values()).filter(o=>o.eventId===eventId).sort((a,b)=>b.createdAt-a.createdAt); }
export function getOrder(id: string): Order | undefined { return db.orders.get(id); }
export function createOrder(eventId: string, items: { id: string; qty: number }[]): Order {
  const id = `ord_${Date.now()}`;
  const now = Date.now();
  const order: Order = { id, eventId, items, status: "pending", createdAt: now, updatedAt: now };
  db.orders.set(id, order);
  return order;
}
export function updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
  const o = db.orders.get(id);
  if (!o) return;
  o.status = status;
  o.updatedAt = Date.now();
  db.orders.set(id, o);
  return o;
}
