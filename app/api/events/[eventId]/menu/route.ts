import { NextResponse } from "next/server";
import { getEvent } from "../../../../../lib/db";

export async function GET(_: Request, { params }: { params: { eventId: string }}) {
  const ev = getEvent(params.eventId);
  if (!ev) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({
    menu: ev.menu,
    event: {
      id: ev.id,
      name: ev.name,
      date: ev.date,
      venue: ev.venue
    }
  });
}
