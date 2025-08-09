export type MenuItem = { id: string; name: string; price: number; qty: number };
export type Event = { id: string; name: string; date: string; venue: string; menu: MenuItem[]; createdAt: number };
export type OrderStatus = "pending" | "preparing" | "served";
export type Order = { id: string; eventId: string; items: { id: string; qty: number }[]; status: OrderStatus; createdAt: number; updatedAt: number };

const db = {
  events: new Map<string, Event>(),
  orders: new Map<string, Order>(),
};

// seed demo event
(() => {
  const id = "demo-001";
  if (!db.events.has(id)) {
    db.events.set(id, {
      id,
      name: "Demo Gala Night",
      date: new Date().toISOString().slice(0,10),
      venue: "Main Hall",
      createdAt: Date.now(),
      menu: [
        { id: "jollof", name: "Jollof Rice", price: 2500, qty: 100 },
        { id: "friedrice", name: "Fried Rice", price: 2600, qty: 80 },
        { id: "chicken", name: "Grilled Chicken", price: 3500, qty: 70 },
        { id: "salad", name: "Salad", price: 1500, qty: 60 },
        { id: "water", name: "Bottled Water", price: 500, qty: 200 },
      ],
    });
  }
})();

// EVENTS
export function listEvents(): Event[] {
  return Array.from(db.events.values()).sort((a,b)=>b.createdAt-a.createdAt);
}
export function getEvent(id: string): Event | undefined {
  return db.events.get(id);
}
export function upsertEvent(e: Omit<Event,"createdAt"> & { createdAt?: number }): Event {
  const id = e.id || `ev_${Date.now()}`;
  const ev: Event = { ...e, id, createdAt: e.createdAt ?? Date.now() };
  db.events.set(id, ev);
  return ev;
}
export function deleteEvent(id: string): boolean { return db.events.delete(id); }

// ORDERS
export function createOrder(eventId: string, items: { id: string; qty: number }[]): Order {
  const id = `ord_${Date.now()}`;
  const o: Order = { id, eventId, items, status: "pending", createdAt: Date.now(), updatedAt: Date.now() };
  db.orders.set(id, o);
  return o;
}
export function listOrders(eventId: string): Order[] {
  return Array.from(db.orders.values()).filter(o=>o.eventId===eventId).sort((a,b)=>b.createdAt-a.createdAt);
}
export function getOrder(id: string): Order | undefined { return db.orders.get(id); }
export function updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
  const o = db.orders.get(id); if (!o) return;
  o.status = status; o.updatedAt = Date.now(); db.orders.set(id, o); return o;
}
