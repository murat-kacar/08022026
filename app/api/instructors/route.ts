import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '50', 10);
  const homepage = url.searchParams.get('homepage');

  try {
    const where: string[] = [];
    const params: any[] = [];
    if (homepage === 'true') where.push('show_on_homepage = true');

    const sql = `SELECT * FROM instructors ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY display_order ASC LIMIT $1`;
    const res = await query(sql, [limit]);
    return NextResponse.json({ data: res.rows });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // Protected endpoint should be implemented — skeleton only
  try {
    const body = await req.json();
    const { name, bio, photo, expertise, slug } = body;
    const res = await query(
      `INSERT INTO instructors (name, bio, photo, expertise, slug) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, bio || null, photo || null, expertise || null, slug]
    );
    return NextResponse.json({ data: res.rows[0] }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
