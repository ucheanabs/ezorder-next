import { NextResponse } from "next/server";
import { createOrder } from "../../../lib/db";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const order = createOrder(
      String(data.eventId || ''),
      String(data.guestName || ''),
      Number(data.table || 0),
      Number(data.seat || 0),
      Array.isArray(data.items) ? data.items : []
    );
    return NextResponse.json(order, { status: 201 });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 400 });
  }
}
