export type Cuisine = 'nigerian' | 'continental';
export type Course = 'starter' | 'main' | 'dessert' | 'drink';

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  cuisine: Cuisine;
  course: Course;
  stock: number;
  image?: string;
};

export type Seating = { tables: number; seatsPerTable: number };

export type Event = {
  id: string;
  name: string;
  date: string;
  venue: string;
  seating: Seating;
  menu: MenuItem[];
  createdAt: number;
};

export type OrderStatus = 'pending' | 'preparing' | 'served';

export type Order = {
  id: string;
  eventId: string;
  guestName: string;
  table: number;
  seat: number;
  items: { itemId: string; qty: number }[];
  status: OrderStatus;
  complaint?: string;
  arrivedAt?: number | null;
  createdAt: number;
  updatedAt: number;
};

const db = {
  events: new Map<string, Event>(),
  orders: new Map<string, Order>(),
};

// ---- EVENT HELPERS ----
export function listEvents(): Event[] {
  return Array.from(db.events.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function getEvent(id: string): Event | undefined {
  return db.events.get(id);
}

export function upsertEvent(e: Omit<Event, 'createdAt'> & { createdAt?: number }): Event {
  const id = e.id || `ev_${Date.now()}`;
  const existing = db.events.get(id);
  const createdAt = existing?.createdAt ?? e.createdAt ?? Date.now();
  const event: Event = {
    id,
    name: e.name,
    date: e.date,
    venue: e.venue,
    seating: e.seating,
    menu: e.menu?.map(m => ({ ...m, stock: Math.max(0, Number(m.stock ?? 0)) })) ?? [],
    createdAt,
  };
  db.events.set(id, event);
  return event;
}

export function deleteEvent(id: string): boolean {
  return db.events.delete(id);
}

// ---- ORDERS ----
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

export function setOrderArrived(id: string, arrived: boolean): Order | undefined {
  const o = db.orders.get(id);
  if (!o) return;
  o.arrivedAt = arrived ? Date.now() : null;
  o.updatedAt = Date.now();
  db.orders.set(id, o);
  return o;
}

export function setOrderComplaint(id: string, message: string): Order | undefined {
  const o = db.orders.get(id);
  if (!o) return;
  o.complaint = String(message || '');
  o.updatedAt = Date.now();
  db.orders.set(id, o);
  return o;
}

export function createOrder(eventId: string, guestName: string, table: number, seat: number, items: { itemId: string; qty: number }[]): Order {
  const ev = db.events.get(eventId);
  if (!ev) throw new Error('event not found');
  if (!Array.isArray(items) || items.length === 0) throw new Error('items required');

  // stock check first
  for (const li of items) {
    const mi = ev.menu.find(m => m.id === li.itemId);
    if (!mi) throw new Error('menu item not found');
    if (li.qty <= 0) throw new Error('qty invalid');
    if (mi.stock < li.qty) throw new Error(`insufficient stock for ${mi.name}`);
  }
  // decrement stock
  for (const li of items) {
    const mi = ev.menu.find(m => m.id === li.itemId)!;
    mi.stock -= li.qty;
  }
  db.events.set(ev.id, ev);

  const id = `ord_${Date.now()}`;
  const now = Date.now();
  const o: Order = {
    id,
    eventId,
    guestName: String(guestName || ''),
    table: Number(table || 0),
    seat: Number(seat || 0),
    items: items.map(i => ({ itemId: i.itemId, qty: Number(i.qty) })),
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    arrivedAt: null,
  };
  db.orders.set(id, o);
  return o;
}

// ---- SEED ----
(function seed() {
  if (db.events.size > 0) return;
  const demo: Event = {
    id: 'demo-001',
    name: 'Demo Gala Night',
    date: new Date().toISOString().slice(0, 10),
    venue: 'Lagos Convention Centre',
    seating: { tables: 15, seatsPerTable: 10 },
    createdAt: Date.now(),
    menu: [
      // Nigerian
      { id: 'ng-starter-puff', name: 'Puff Puff', price: 500, cuisine: 'nigerian', course: 'starter', stock: 120, image: '' },
      { id: 'ng-main-jollof', name: 'Jollof Rice + Chicken', price: 3500, cuisine: 'nigerian', course: 'main', stock: 150, image: '' },
      { id: 'ng-dessert-plantain', name: 'Caramelized Plantain', price: 1200, cuisine: 'nigerian', course: 'dessert', stock: 80, image: '' },
      { id: 'ng-drink-zobo', name: 'Zobo', price: 800, cuisine: 'nigerian', course: 'drink', stock: 200, image: '' },
      // Continental
      { id: 'ct-starter-bruschetta', name: 'Bruschetta', price: 1800, cuisine: 'continental', course: 'starter', stock: 60, image: '' },
      { id: 'ct-main-pasta', name: 'Creamy Alfredo Pasta', price: 4200, cuisine: 'continental', course: 'main', stock: 100, image: '' },
      { id: 'ct-dessert-cheesecake', name: 'Cheesecake', price: 2200, cuisine: 'continental', course: 'dessert', stock: 50, image: '' },
      { id: 'ct-drink-sparkling', name: 'Sparkling Drink', price: 1000, cuisine: 'continental', course: 'drink', stock: 150, image: '' },
    ],
  };
  db.events.set(demo.id, demo);
})();
