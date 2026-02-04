import { NextResponse } from 'next/server';
import { query } from '../../../../lib/db';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  try {
    const res = await query('SELECT * FROM events WHERE slug = $1 LIMIT 1', [slug]);
    if (res.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: res.rows[0] });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
