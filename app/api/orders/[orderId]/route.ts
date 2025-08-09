import { NextResponse } from 'next/server';
import { DB } from '../../../lib/db';

export async function GET(_req: Request, { params }: { params: { orderId: string }}){
  const order = DB.getOrder(params.orderId);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return NextResponse.json(order);
}