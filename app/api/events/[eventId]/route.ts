import { NextResponse } from "next/server";
import { getEvent, upsertEvent, deleteEvent } from "@/lib/db";

export const dynamic = "force-dynamic";

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
    zones: Array.isArray(data.zones) ? data.zones : [],
    menu: Array.isArray(data.menu) ? data.menu : [],
    isOpen: data.isOpen ?? true,
  });
  return NextResponse.json(ev);
}

export async function DELETE(_: Request, { params }: { params: { eventId: string }}) {
  deleteEvent(params.eventId);
  return NextResponse.json({ ok: true });
}
