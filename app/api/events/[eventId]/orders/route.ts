import { NextResponse } from "next/server";
import { listOrders, createOrder } from "../../../../../lib/db";

export async function GET(_: Request, { params }: { params: { eventId: string }}) {
  return NextResponse.json(listOrders(params.eventId));
}

export async function POST(req: Request, { params }: { params: { eventId: string }}) {
  const data = await req.json();
  if (!Array.isArray(data?.items) || data.items.length === 0) {
    return NextResponse.json({ error: "items are required" }, { status: 400 });
  }
  const order = createOrder(params.eventId, data.items);
  return NextResponse.json(order, { status: 201 });
}
