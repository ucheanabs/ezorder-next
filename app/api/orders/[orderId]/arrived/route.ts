import { NextResponse } from "next/server";
import { setOrderArrived } from "../../../../../lib/db";

export async function POST(req: Request, { params }: { params: { orderId: string }}) {
  const body = await req.json().catch(()=>({}));
  const updated = setOrderArrived(params.orderId, Boolean(body?.arrived ?? true));
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}
