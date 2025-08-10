import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { passcode } = await req.json().catch(() => ({}));
  const expected = process.env.ADMIN_PASSCODE || 'EZAdmin2025';
  if (passcode !== expected) {
    return NextResponse.json({ error: 'Invalid passcode' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: 'ez_admin',
    value: '1',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return res;
}
