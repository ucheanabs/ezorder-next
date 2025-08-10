// lib/db.ts

export type MenuItem = { id: string; name: string; qty: number; price?: number };
export type Event = {
  id: string;
  name: string;
  date?: string;
  venue?: string;
  menu: MenuItem[];
  createdAt: number;
  isOpen: boolean;
};
export type OrderStatus = "pending" | "preparing" | "served";
export type Order = {
  id: string;
  eventId: string;
  items: { id: string; qty: number }[];
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
};

const db = {
  events: new Map<string, Event>(),
  orders: new Map<string, Order>(),
};

function uid(p = ""): string {
  return `${p}${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

// ---- EVENTS ----
export function listEvents(): Event[] {
  return Array.from(db.events.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function getEvent(id: string): Event | undefined {
  return db.events.get(id);
}

export function upsertEvent(input: Partial<Event> & { id?: string; name: string; menu: Omit<MenuItem,"id">[] | MenuItem[] }): Event {
  const id = input.id || uid("ev_");
  const existing = db.events.get(id);
  const normalizedMenu: MenuItem[] = (input.menu || []).map((m: any) => ({
    id: m.id || uid("it_"),
    name: String(m.name || "").trim(),
    qty: Number(m.qty || 0),
    price: m.price != null ? Number(m.price) : undefined,
  }));
  const event: Event = {
    id,
    name: input.name,
    date: input.date,
    venue: input.venue,
    menu: normalizedMenu,
    isOpen: input.isOpen ?? existing?.isOpen ?? true,
    createdAt: existing?.createdAt ?? Date.now(),
  };
  db.events.set(id, event);
  return event;
}

export function deleteEvent(id: string): boolean {
  return db.events.delete(id);
}

export function setEventOpen(id: string, isOpen: boolean): Event | undefined {
  const e = db.events.get(id);
  if (!e) return;
  e.isOpen = isOpen;
  db.events.set(id, e);
  return e;
}

// ---- ORDERS ----
export function createOrder(eventId: string, items: { id: string; qty: number }[]): Order {
  const id = uid("ord_");
  const o: Order = { id, eventId, items, status: "pending", createdAt: Date.now(), updatedAt: Date.now() };
  db.orders.set(id, o);
  return o;
}

export function getOrder(id: string): Order | undefined {
  return db.orders.get(id);
}

export function listOrders(eventId: string): Order[] {
  return Array.from(db.orders.values())
    .filter(o => o.eventId === eventId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
  const o = db.orders.get(id);
  if (!o) return;
  o.status = status;
  o.updatedAt = Date.now();
  db.orders.set(id, o);
  return o;
}

// ---- DEMO SEED ----
if (!db.events.size) {
  upsertEvent({
    id: "demo-001",
    name: "Demo Wedding",
    date: new Date().toISOString().slice(0,10),
    venue: "Lagos",
    menu: [
      { name: "Jollof Rice", qty: 120, price: 0 },
      { name: "Fried Rice", qty: 100, price: 0 },
      { name: "Chicken", qty: 150, price: 0 },
      { name: "Moi-Moi", qty: 80, price: 0 },
      { name: "Salad", qty: 70, price: 0 },
    ],
    isOpen: true,
  });
}
