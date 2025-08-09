import { NextResponse } from "next/server";
import { listOrders } from "../../../../../lib/db";

export async function GET(_: Request, { params }: { params: { eventId: string }}) {
  return NextResponse.json({ orders: listOrders(params.eventId) });
}
