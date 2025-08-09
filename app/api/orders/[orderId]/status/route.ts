import { NextResponse } from "next/server";
import { updateOrderStatus } from "../../../../../lib/db";

export async function PUT(req: Request, { params }: { params: { orderId: string }}) {
  const data = await req.json();
  const order = updateOrderStatus(params.orderId, data?.status);
  if (!order) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(order);
}
