import { NextResponse } from 'next/server';
import { DB } from '../../../../lib/db';

export async function GET(_req: Request, { params }: { params: { eventId: string }}) {
  const ev = DB.getEvent(params.eventId);
  if (!ev) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  return NextResponse.json({ eventId: params.eventId, name: ev.name, menu: ev.menu });
}