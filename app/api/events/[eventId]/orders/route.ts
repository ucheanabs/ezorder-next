import { NextResponse } from "next/server";
import { listOrders } from "../../../../../lib/db";

export async function GET(_: Request, { params }: { params: { eventId: string }}) {
  const orders = listOrders(params.eventId);
  return NextResponse.json(orders);
}
