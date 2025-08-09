import { NextResponse } from 'next/server';
import { DB } from '../../../../lib/db';

export async function POST(req: Request, { params }: { params: { orderId: string }}){
  const body = await req.json();
  const { status } = body || {};
  const valid = ['PLACED','PREPARING','ON_THE_WAY','DELIVERED'];
  if (!valid.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  const order = DB.updateStatus(params.orderId, status);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return NextResponse.json({ ok: true, order });
}