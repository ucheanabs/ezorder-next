import { NextResponse } from "next/server";
import { createOrder, listOrders, getEvent } from "../../../lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });
  return NextResponse.json({ orders: listOrders(eventId) });
}

export async function POST(req: Request) {
  const data = await req.json();
  const eventId = data?.eventId;
  const items = Array.isArray(data?.items) ? data.items : [];
  if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });
  const ev = getEvent(eventId);
  if (!ev) return NextResponse.json({ error: "event not found" }, { status: 404 });

  const valid = items
    .map((it:any)=>({ id: String(it.id), qty: Math.max(1, Number(it.qty || 0)) }))
    .filter((it:any)=> ev.menu.some(m=> m.id === it.id));

  const order = createOrder(eventId, valid);
  return NextResponse.json(order, { status: 201 });
}
