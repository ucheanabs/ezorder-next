import { NextResponse } from "next/server";
import { fileComplaint } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { orderId: string }}) {
  const body = await req.json();
  if (!body?.type) return NextResponse.json({ error: "type required" }, { status: 400 });
  const updated = fileComplaint(params.orderId, body.type, body.note);
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}
