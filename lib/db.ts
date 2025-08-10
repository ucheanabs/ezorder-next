export type Cuisine = "nigerian" | "continental";
export type Course = "starters" | "mains" | "desserts" | "drinks";

export type MenuItem = {
  id: string;
  cuisine: Cuisine;
  course: Course;
  name: string;
  description?: string;
  image?: string;
  price: number;
  availableQty: number;
};

export type SeatInfo = { zone: string; table: string; seat: string; name: string };

export type Event = {
  id: string;
  name: string;
  date: string;
  venue: string;
  zones: { name: string; tables: number; seatsPerTable: number }[];
  menu: MenuItem[];
  createdAt: number;
  isOpen: boolean;
};

export type OrderStatus = "pending" | "preparing" | "served";
export type ComplaintType = "not_received" | "wrong_order" | "cold" | "other";

export type Order = {
  id: string;
  eventId: string;
  items: { itemId: string; qty: number }[];
  seat: SeatInfo;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  arrived?: boolean;
  complaint?: { type: ComplaintType; note?: string; createdAt: number };
};

const db = {
  events: new Map<string, Event>(),
  orders: new Map<string, Order>(),
};

function nid(prefix: string) { return `${prefix}_${Math.random().toString(36).slice(2,8)}${Date.now().toString().slice(-4)}`; }

export function listEvents(): Event[] {
  return Array.from(db.events.values()).sort((a,b)=>b.createdAt-a.createdAt);
}
export function getEvent(id: string) { return db.events.get(id); }
export function upsertEvent(e: Omit<Event,"createdAt"> & { createdAt?: number }) {
  const id = e.id || nid("ev");
  const ev: Event = { ...e, id, createdAt: e.createdAt ?? Date.now() };
  db.events.set(id, ev); return ev;
}
export function deleteEvent(id: string) { return db.events.delete(id); }

export function createOrder(eventId: string, items: { itemId: string; qty: number }[], seat: SeatInfo) {
  const id = nid("ord");
  const o: Order = { id, eventId, items, seat, status: "pending", createdAt: Date.now(), updatedAt: Date.now() };
  db.orders.set(id, o); return o;
}
export function listOrders(eventId: string) {
  return Array.from(db.orders.values()).filter(o=>o.eventId===eventId).sort((a,b)=>b.createdAt-a.createdAt);
}
export function getOrder(id: string) { return db.orders.get(id); }
export function updateOrderStatus(id: string, status: OrderStatus) {
  const o = db.orders.get(id); if (!o) return;
  o.status = status; o.updatedAt = Date.now(); db.orders.set(id,o); return o;
}
export function markArrived(id: string) {
  const o = db.orders.get(id); if (!o) return;
  o.arrived = true; o.updatedAt = Date.now(); db.orders.set(id,o); return o;
}
export function fileComplaint(id: string, type: ComplaintType, note?: string) {
  const o = db.orders.get(id); if (!o) return;
  o.complaint = { type, note, createdAt: Date.now() }; o.updatedAt = Date.now(); db.orders.set(id,o); return o;
}

/* Seed demo event with hierarchy + images */
(function seed(){
  if (db.events.size) return;
  const demoMenu: MenuItem[] = [
    { id: nid("mi"), cuisine:"nigerian", course:"starters", name:"Pepper Soup Shots", image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop", price:1500, availableQty:200 },
    { id: nid("mi"), cuisine:"nigerian", course:"mains", name:"Jollof Rice & Chicken", image:"https://images.unsplash.com/photo-1604909052743-86c2b5c86c27?q=80&w=800&auto=format&fit=crop", price:5000, availableQty:300 },
    { id: nid("mi"), cuisine:"nigerian", course:"desserts", name:"Puff-Puff Platter", image:"https://images.unsplash.com/photo-1612198182963-c3c71e2c5080?q=80&w=800&auto=format&fit=crop", price:2000, availableQty:180 },
    { id: nid("mi"), cuisine:"nigerian", course:"drinks", name:"Chapman", image:"https://images.unsplash.com/photo-1541976076758-347942db1970?q=80&w=800&auto=format&fit=crop", price:1500, availableQty:400 },
    { id: nid("mi"), cuisine:"continental", course:"starters", name:"Bruschetta", image:"https://images.unsplash.com/photo-1604908176997-431b7a1d73b8?q=80&w=800&auto=format&fit=crop", price:2500, availableQty:150 },
    { id: nid("mi"), cuisine:"continental", course:"mains", name:"Roast Chicken & Potatoes", image:"https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop", price:6500, availableQty:250 },
    { id: nid("mi"), cuisine:"continental", course:"desserts", name:"Cheesecake Slice", image:"https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=800&auto=format&fit=crop", price:2500, availableQty:160 },
    { id: nid("mi"), cuisine:"continental", course:"drinks", name:"Sparkling Water", image:"https://images.unsplash.com/photo-1502741338009-cac2772e18bc?q=80&w=800&auto=format&fit=crop", price:1000, availableQty:500 },
  ];
  const demo: Event = {
    id: "demo-001",
    name: "EZOrder Demo Gala",
    date: new Date().toISOString().slice(0,10),
    venue: "Victoria Island, Lagos",
    zones: [{name:"A",tables:5,seatsPerTable:10},{name:"B",tables:5,seatsPerTable:10}],
    menu: demoMenu,
    createdAt: Date.now(),
    isOpen: true,
  };
  db.events.set(demo.id, demo);
})();
