import { NextResponse } from 'next/server';
import { DB } from '../../lib/db';

export async function POST(req: Request){
  const body = await req.json();
  const { eventId, table, seat, name, items } = body || {};
  if (!eventId || !table || !items || !Array.isArray(items) || items.length === 0){
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const ev = DB.getEvent(eventId);
  if (!ev) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  const order = DB.createOrder({ eventId, table: String(table), seat: seat || null, name: name || null, items });
  return NextResponse.json({ orderId: order.orderId, status: order.status }, { status: 201 });
}