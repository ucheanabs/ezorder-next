import { NextResponse } from "next/server";
import { updateOrderStatus } from "../../../../../lib/db";

export async function PATCH(req: Request, { params }: { params: { orderId: string }}) {
  const body = await req.json();
  const updated = updateOrderStatus(params.orderId, body?.status);
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}
