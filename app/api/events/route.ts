import { NextResponse } from "next/server";
import { listEvents, upsertEvent } from "../../../lib/db";

export async function GET() {
  return NextResponse.json({ events: listEvents() });
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
