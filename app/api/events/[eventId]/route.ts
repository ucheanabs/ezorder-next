// app/api/events/[eventId]/route.ts
import { NextResponse } from "next/server";
import { getEvent, upsertEvent, deleteEvent, setEventOpen } from "../../../../lib/db";

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
    isOpen: data.isOpen ?? true,
  });
  return NextResponse.json(ev);
}

export async function PATCH(req: Request, { params }: { params: { eventId: string }}) {
  const body = await req.json();
  if (typeof body?.isOpen !== "boolean") return NextResponse.json({ error: "isOpen boolean required" }, { status: 400 });
  const ev = setEventOpen(params.eventId, body.isOpen);
  if (!ev) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(ev);
}

export async function DELETE(_: Request, { params }: { params: { eventId: string }}) {
  deleteEvent(params.eventId);
  return NextResponse.json({ ok: true });
}
