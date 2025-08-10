import { NextResponse } from "next/server";
import { createOrder, getEvent } from "../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const data = await req.json();
  if (!data?.eventId || !Array.isArray(data?.items) || !data?.seat) {
    return NextResponse.json({ error: "eventId, seat, items required" }, { status: 400 });
  }
  const ev = getEvent(data.eventId);
  if (!ev || !ev.isOpen) return NextResponse.json({ error: "event closed" }, { status: 400 });
  const order = createOrder(data.eventId, data.items, data.seat);
  return NextResponse.json(order, { status: 201 });
}
