import { NextResponse } from "next/server";
import { markArrived } from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function POST(_: Request, { params }: { params: { orderId: string }}) {
  const updated = markArrived(params.orderId);
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}
