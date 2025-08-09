cat > lib/db.ts <<'EOF'
export type MenuItem = { id?: string; name: string; price: number; qty: number };
export type Event = { id: string; name: string; date: string; venue: string; menu: MenuItem[]; createdAt: number };
export type OrderStatus = "pending" | "preparing" | "served";
export type Order = { id: string; eventId: string; items: { id: string; qty: number }[]; status: OrderStatus; createdAt: number; updatedAt: number };

const db = {
  events: new Map<string, Event>(),
  orders: new Map<string, Order>(),
};

function genId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36)}`;
}

// EVENTS
export function listEvents(): Event[] {
  return Array.from(db.events.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function getEvent(id: string): Event | undefined {
  return db.events.get(id);
}

export function upsertEvent(e: Omit<Event, "createdAt" | "id"> & { id?: string; createdAt?: number }): Event {
  const id = e.id || genId("ev");
  const menuWithIds = (e.menu || []).map(m => ({
    id: m.id || genId("mi"),
    name: m.name,
    price: Number(m.price) || 0,
    qty: Number(m.qty) || 0,
  }));
  const event: Event = {
    id,
    name: e.name || "",
    date: e.date || "",
    venue: e.venue || "",
    menu: menuWithIds,
    createdAt: e.createdAt ?? Date.now(),
  };
  db.events.set(id, event);
  return event;
}

export function deleteEvent(id: string): boolean {
  return db.events.delete(id);
}

// ORDERS (stubs you can expand later)
export function listOrders(eventId: string): Order[] {
  return Array.from(db.orders.values())
    .filter(o => o.eventId === eventId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function getOrder(id: string): Order | undefined {
  return db.orders.get(id);
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
  const o = db.orders.get(id);
  if (!o) return;
  o.status = status;
  o.updatedAt = Date.now();
  db.orders.set(id, o);
  return o;
}

// DEMO SEED (so the QR flow works immediately)
const demoEventId = "demo-001";
if (!db.events.has(demoEventId)) {
  upsertEvent({
    id: demoEventId,
    name: "Demo Wedding Event",
    date: "2025-08-15",
    venue: "Grand Ballroom, City Hotel",
    menu: [
      { name: "Jollof Rice", price: 2500, qty: 200 },
      { name: "Fried Rice", price: 2500, qty: 150 },
      { name: "Pepper Chicken", price: 3000, qty: 100 },
      { name: "Grilled Fish", price: 3500, qty: 80 },
      { name: "Soft Drinks", price: 500, qty: 300 },
    ],
  });
}
EOF
