import { NextResponse } from "next/server";
import { listEvents, upsertEvent } from "../../../lib/db";

export async function GET() {
  return NextResponse.json({ events: listEvents() });
}

export async function POST(req: Request) {
  const data = await req.json();
  if (!data?.name || !data?.date || !data?.venue) {
    return NextResponse.json({ error: "name, date, and venue are required" }, { status: 400 });
  }
  const menu = Array.isArray(data.menu) ? data.menu.map((m:any)=>({
    id: String(m.id || m.name || `m_${Date.now()}`),
    name: String(m.name || ""),
    price: Number(m.price || 0),
    qty: Number(m.qty || 0),
  })) : [];
  const ev = upsertEvent({ id: data.id, name: data.name, date: data.date, venue: data.venue, menu });
  return NextResponse.json(ev, { status: 201 });
}
