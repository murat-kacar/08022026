import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';

export async function GET(req: Request) {
  try {
    const token = req.headers.get('cookie')?.split(';').find(Boolean)?.split('token=')[1] || null;
    if (!token) return NextResponse.json({ user: null });
    const payload = await verifyToken(token);
    return NextResponse.json({ user: payload || null });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
