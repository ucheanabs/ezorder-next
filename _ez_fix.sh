#!/usr/bin/env bash
set -euo pipefail

rm -rf "app/api/events/[eventId]/[id]" 2>/dev/null || true

mkdir -p lib
cat > lib/db.ts <<'TS'
export type MenuItem = { name: string; price: number; qty: number };
export type Event = { id: string; name: string; date: string; venue: string; menu: MenuItem[]; createdAt: number };
export type OrderStatus = "pending" | "preparing" | "served";
export type Order = { id: string; eventId: string; items: { id: string; qty: number }[]; status: OrderStatus; createdAt: number; updatedAt: number };

const db = { events: new Map<string, Event>(), orders: new Map<string, Order>() };

export function listEvents(): Event[] { return Array.from(db.events.values()).sort((a,b)=>b.createdAt-a.createdAt); }
export function getEvent(id: string): Event | undefined { return db.events.get(id); }
export function upsertEvent(e: Omit<Event,"createdAt"> & { createdAt?: number }): Event {
  const id = e.id || `ev_\${Date.now()}`;
  const event: Event = { ...e, id, createdAt: e.createdAt || Date.now() };
  db.events.set(id, event);
  return event;
}
export function deleteEvent(id: string): boolean { return db.events.delete(id); }
export function createOrder(eventId: string, items: { id: string; qty: number }[]): Order {
  const id = `ord_\${Date.now()}`;
  const o: Order = { id, eventId, items, status: "pending", createdAt: Date.now(), updatedAt: Date.now() };
  db.orders.set(id, o);
  return o;
}
export function listOrders(eventId: string): Order[] { return Array.from(db.orders.values()).filter(o=>o.eventId===eventId).sort((a,b)=>b.createdAt-a.createdAt); }
export function getOrder(id: string): Order | undefined { return db.orders.get(id); }
export function updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
  const o = db.orders.get(id); if (!o) return;
  o.status = status; o.updatedAt = Date.now(); db.orders.set(id, o); return o;
}

upsertEvent({
  id: "demo-001",
  name: "Demo Event",
  date: "2025-12-31",
  venue: "Demo Venue",
  menu: [
    { name: "Jollof Rice & Chicken", price: 2500, qty: 100 },
    { name: "Fried Rice & Fish", price: 3000, qty: 80 },
    { name: "Pounded Yam & Egusi", price: 3500, qty: 50 }
  ]
});
TS

mkdir -p "app/api/events"
cat > "app/api/events/route.ts" <<'TS'
import { NextResponse } from "next/server";
import { listEvents, upsertEvent } from "../../../lib/db";

export async function GET() {
  return NextResponse.json(listEvents());
}

export async function POST(req: Request) {
  const data = await req.json();
  if (!data?.name) return NextResponse.json({ error: "name is required" }, { status: 400 });
  const ev = upsertEvent({
    id: data.id,
    name: data.name,
    date: data.date,
    venue: data.venue,
    menu: Array.isArray(data.menu) ? data.menu : [],
  });
  return NextResponse.json(ev, { status: 201 });
}
TS

mkdir -p "app/api/events/[eventId]"
cat > "app/api/events/[eventId]/route.ts" <<'TS'
import { NextResponse } from "next/server";
import { getEvent, upsertEvent, deleteEvent } from "../../../../lib/db";

export async function GET(_: Request, { params }: { params: { eventId: string }}) {
  const ev = getEvent(params.eventId);
  if (!ev) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(ev);
}

export async function PUT(req: Request, { params }: { params: { eventId: string }}) {
  const data = await req.json();
  const ev = upsertEvent({
    id: params.eventId,
    name: data.name,
    date: data.date,
    venue: data.venue,
    menu: Array.isArray(data.menu) ? data.menu : [],
  });
  return NextResponse.json(ev);
}

export async function DELETE(_: Request, { params }: { params: { eventId: string }}) {
  deleteEvent(params.eventId);
  return NextResponse.json({ ok: true });
}
TS

mkdir -p "app/api/events/[eventId]/menu"
cat > "app/api/events/[eventId]/menu/route.ts" <<'TS'
import { NextResponse } from "next/server";
import { getEvent } from "../../../../../lib/db";

export async function GET(_: Request, { params }: { params: { eventId: string }}) {
  const ev = getEvent(params.eventId);
  if (!ev) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ menu: ev.menu, event: { id: ev.id, name: ev.name, date: ev.date, venue: ev.venue } });
}
TS

mkdir -p "app/api/events/[eventId]/orders"
cat > "app/api/events/[eventId]/orders/route.ts" <<'TS'
import { NextResponse } from "next/server";
import { listOrders, createOrder } from "../../../../../lib/db";

export async function GET(_: Request, { params }: { params: { eventId: string }}) {
  return NextResponse.json(listOrders(params.eventId));
}

export async function POST(req: Request, { params }: { params: { eventId: string }}) {
  const data = await req.json();
  if (!Array.isArray(data?.items) || data.items.length === 0) {
    return NextResponse.json({ error: "items are required" }, { status: 400 });
  }
  const order = createOrder(params.eventId, data.items);
  return NextResponse.json(order, { status: 201 });
}
TS

mkdir -p "app/api/orders/[orderId]"
cat > "app/api/orders/[orderId]/route.ts" <<'TS'
import { NextResponse } from "next/server";
import { getOrder } from "../../../../lib/db";

export async function GET(_: Request, { params }: { params: { orderId: string }}) {
  const o = getOrder(params.orderId);
  if (!o) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(o);
}
TS

mkdir -p "app/api/orders/[orderId]/status"
cat > "app/api/orders/[orderId]/status/route.ts" <<'TS'
import { NextResponse } from "next/server";
import { updateOrderStatus } from "../../../../../lib/db";

export async function PATCH(req: Request, { params }: { params: { orderId: string }}) {
  const body = await req.json();
  const updated = updateOrderStatus(params.orderId, body?.status);
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}
TS

cat > app/order/page.tsx <<'TS'
import dynamicImport from 'next/dynamic';
const OrderClient = dynamicImport(() => import('./OrderClient'), { ssr: false });
export default function Page({ searchParams }: { searchParams: Record<string,string|string[]|undefined>}) {
  const eventId = typeof searchParams.eventId === 'string' ? searchParams.eventId : 'demo-001';
  return <OrderClient initialEventId={eventId} />;
}
TS

git add -A
git commit -m "fix(api): add db and all routes with bracket-safe paths; fix order wrapper"
npm run build
vercel --prod
