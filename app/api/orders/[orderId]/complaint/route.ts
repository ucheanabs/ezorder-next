import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { orderId: string }}) {
  const body = await req.json();
  // Store complaint (for now, just log it)
  console.log("Complaint for order", params.orderId, ":", body?.message || "No message");
  return NextResponse.json({ ok: true });
}
