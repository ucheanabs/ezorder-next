// app/api/orders/[orderId]/route.ts
import { NextResponse } from "next/server";
import { getOrder } from "../../../../lib/db";

export async function GET(_: Request, { params }: { params: { orderId: string }}) {
  const o = getOrder(params.orderId);
  if (!o) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(o);
}
