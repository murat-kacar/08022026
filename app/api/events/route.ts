import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const limit = parseInt(url.searchParams.get('limit') || '50', 10);
  const featured = url.searchParams.get('featured');
  const homepage = url.searchParams.get('homepage');
  const hero = url.searchParams.get('hero');

  try {
    const where: string[] = ["status = 'published'"];
    const params: any[] = [];

    if (type) {
      params.push(type);
      where.push(`event_type = $${params.length}`);
    }
    if (featured === 'true') where.push('is_featured = true');
    if (homepage === 'true') where.push('show_on_homepage = true');
    if (hero === 'true') where.push('show_in_hero = true');

    const sql = `SELECT * FROM events WHERE ${where.join(' AND ')} ORDER BY display_order ASC, start_date ASC LIMIT $${params.length + 1}`;
    params.push(limit);

    const res = await query(sql, params);
    return NextResponse.json({ data: res.rows });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
