import { NextResponse } from "next/server";
import { createOrder } from "../../../lib/db";

export async function POST(req: Request) {
  const data = await req.json();
  if (!data?.eventId || !Array.isArray(data?.items) || data.items.length === 0) {
    return NextResponse.json({ error: "eventId and items are required" }, { status: 400 });
    }
  const order = createOrder(data.eventId, data.items);
  return NextResponse.json(order, { status: 201 });
}
