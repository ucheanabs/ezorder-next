import { NextResponse } from "next/server";
import { getOrder } from "../../../../lib/db";

export async function GET(_: Request, { params }: { params: { orderId: string }}) {
  const order = getOrder(params.orderId);
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(order);
}
