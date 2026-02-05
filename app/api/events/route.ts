import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { slugify } from '@/lib/slugify';

export const runtime = 'nodejs';

type EventBody = {
  id?: number;
  title: string;
  description?: string;
  event_type?: string;
  start_date?: string;
  end_date?: string;
  location?: string;
  poster_image?: string;
  slug?: string;
};

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
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: EventBody = await req.json();
    if (!body.title || body.title.trim().length < 3) return NextResponse.json({ error: 'Title is required and must be at least 3 characters' }, { status: 400 });
    if (body.start_date && isNaN(Date.parse(body.start_date))) return NextResponse.json({ error: 'start_date must be a valid ISO date' }, { status: 400 });
    const slug = body.slug ? body.slug : slugify(body.title || '');
    const res = await query(
      `INSERT INTO events (title, description, event_type, start_date, end_date, location, poster_image, slug, show_on_homepage, show_in_hero, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'published') RETURNING *`,
      [body.title, body.description || null, body.event_type || null, body.start_date || null, body.end_date || null, body.location || null, body.poster_image || null, slug, !!(body as any).show_on_homepage, !!(body as any).show_in_hero]
    );
    return NextResponse.json({ data: res.rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body: EventBody = await req.json();
    if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    if (body.title && body.title.trim().length < 3) return NextResponse.json({ error: 'Title must be at least 3 characters' }, { status: 400 });
    if (body.start_date && isNaN(Date.parse(body.start_date))) return NextResponse.json({ error: 'start_date must be a valid ISO date' }, { status: 400 });
    // preserve existing values when fields are not provided
    const existing = await query('SELECT * FROM events WHERE id=$1 LIMIT 1', [body.id]);
    if (existing.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const cur = existing.rows[0];
    const slug = body.slug ? body.slug : slugify(body.title || cur.title || '');
    const res = await query(
      `UPDATE events SET title=$1, description=$2, event_type=$3, start_date=$4, end_date=$5, location=$6, poster_image=$7, slug=$8, show_on_homepage=$9, show_in_hero=$10, updated_at=NOW() WHERE id=$11 RETURNING *`,
      [body.title || cur.title, body.description ?? cur.description, body.event_type || cur.event_type, body.start_date || cur.start_date, body.end_date || cur.end_date, body.location || cur.location, body.poster_image || cur.poster_image, slug, (body as any).show_on_homepage ?? cur.show_on_homepage, (body as any).show_in_hero ?? cur.show_in_hero, body.id]
    );
    return NextResponse.json({ data: res.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const id = body.id;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await query('DELETE FROM events WHERE id=$1', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
