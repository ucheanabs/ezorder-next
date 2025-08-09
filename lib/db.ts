export type OrderStatus = "received" | "preparing" | "en_route" | "delivered";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

export type Event = {
  id: string;
  name: string;
  date?: string;
  venue?: string;
  menu: MenuItem[];
  createdAt: number;
  updatedAt: number;
};

export type OrderLine = { id: string; qty: number };

export type Order = {
  id: string;
  eventId: string;
  table?: string;
  seat?: string;
  name?: string;
  lines: OrderLine[];
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
};

type DBShape = {
  events: Map<string, Event>;
  orders: Map<string, Order>;
};

const g = globalThis as unknown as { __EZ_DB__?: DBShape };

if (!g.__EZ_DB__) {
  g.__EZ_DB__ = {
    events: new Map<string, Event>(),
    orders: new Map<string, Order>(),
  };
}
const db = g.__EZ_DB__!;

const uid = () =>
  Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);

export function listEvents(): Event[] {
  return Array.from(db.events.values()).sort((a,b) => b.updatedAt - a.updatedAt);
}
export function getEvent(id: string): Event | undefined {
  return db.events.get(id);
}
export function upsertEvent(input: Partial<Event> & { name: string; menu?: MenuItem[]; id?: string; date?: string; venue?: string }): Event {
  const now = Date.now();
  const id = input.id?.trim() || uid();
  const existing = db.events.get(id);
  const menu = (input.menu ?? existing?.menu ?? []).map(m => ({
    id: m.id?.trim() || uid(),
    name: m.name,
    price: Number(m.price||0),
    image: m.image,
  }));
  const ev: Event = {
    id,
    name: input.name,
    date: input.date ?? existing?.date,
    venue: input.venue ?? existing?.venue,
    menu,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  db.events.set(id, ev);
  return ev;
}
export function deleteEvent(id: string) {
  db.events.delete(id);
  for (const [oid, o] of db.orders.entries()) {
    if (o.eventId === id) db.orders.delete(oid);
  }
}

export function createOrder(input: { eventId: string; table?: string; seat?: string; name?: string; lines: OrderLine[] }): Order {
  const now = Date.now();
  const id = uid();
  const order: Order = {
    id,
    eventId: input.eventId,
    table: input.table,
    seat: input.seat,
    name: input.name,
    lines: input.lines.map(l => ({ id: l.id, qty: Number(l.qty||0) })),
    status: "received",
    createdAt: now,
    updatedAt: now,
  };
  db.orders.set(id, order);
  return order;
}
export function listOrdersByEvent(eventId: string): Order[] {
  return Array.from(db.orders.values())
    .filter(o => o.eventId === eventId)
    .sort((a,b) => b.createdAt - a.createdAt);
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
