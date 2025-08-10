import { NextResponse } from "next/server";
import { listOrders, getEvent } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { eventId: string }}) {
  const ev = getEvent(params.eventId);
  if (!ev) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ orders: listOrders(params.eventId) });
}
