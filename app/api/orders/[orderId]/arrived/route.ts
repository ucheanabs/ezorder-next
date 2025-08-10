import { NextResponse } from "next/server";
import { updateOrderStatus } from "../../../../../lib/db";

export async function POST(_: Request, { params }: { params: { orderId: string }}) {
  const updated = updateOrderStatus(params.orderId, "served");
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}
