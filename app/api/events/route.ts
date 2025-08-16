import { NextResponse } from "next/server";
import { listEvents, upsertEvent } from "../../../lib/db";

export async function GET() {
  const events = listEvents().map(e => ({
    id: e.id, name: e.name, date: e.date, venue: e.venue,
    seating: e.seating, menuCount: e.menu.length, createdAt: e.createdAt
  }));
  return NextResponse.json({ events });
}

export async function POST(req: Request) {
  const data = await req.json();
  if (!data?.name) return NextResponse.json({ error: "name required" }, { status: 400 });
  const ev = upsertEvent({
    id: data.id,
    name: data.name,
    date: data.date || new Date().toISOString().slice(0,10),
    venue: data.venue || '',
    seating: data.seating && data.seating.tables && data.seating.seatsPerTable
      ? { tables: Number(data.seating.tables), seatsPerTable: Number(data.seating.seatsPerTable) }
      : { tables: 10, seatsPerTable: 10 },
    menu: Array.isArray(data.menu) ? data.menu : [],
    createdAt: Date.now(),
  });
  return NextResponse.json(ev, { status: 201 });
}
