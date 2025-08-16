import { NextResponse } from "next/server";
import { setOrderComplaint } from "../../../../../lib/db";

export async function POST(req: Request, { params }: { params: { orderId: string }}) {
  const body = await req.json().catch(()=>({}));
  const updated = setOrderComplaint(params.orderId, String(body?.message || ''));
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}
