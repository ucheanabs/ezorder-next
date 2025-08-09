import { NextResponse } from 'next/server';
import { DB } from '../../../../lib/db';

export async function GET(req: Request, { params }: { params: { eventId: string }}){
  const url = new URL(req.url);
  const table = url.searchParams.get('table');
  const list = DB.listOrders(params.eventId, table);
  return NextResponse.json(list);
}