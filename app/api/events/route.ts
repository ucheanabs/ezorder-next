import { NextResponse } from "next/server";
import { listEvents, upsertEvent } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ events: listEvents() });
}

export async function POST(req: Request) {
  const data = await req.json();
  const ev = upsertEvent({
    id: data.id,
    name: data.name,
    date: data.date,
    venue: data.venue,
    zones: Array.isArray(data.zones) ? data.zones : [],
    menu: Array.isArray(data.menu) ? data.menu : [],
    isOpen: data.isOpen ?? true,
  });
  return NextResponse.json(ev, { status: 201 });
}
