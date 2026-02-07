import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { slugify } from '@/lib/slugify';
import { requireAuth } from '@/lib/api-auth';

// Valid category values for event placement
const VALID_CATEGORIES = ['hero', 'homepage', 'featured'] as const;

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
  categories?: string[];
  display_order?: number;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const limit = parseInt(url.searchParams.get('limit') || '50', 10);
  const category = url.searchParams.get('category');     // e.g. hero, homepage, featured
  const archive = url.searchParams.get('archive');       // true → past events only
  const upcoming = url.searchParams.get('upcoming');     // true → future events only

  try {
    const where: string[] = ["status != 'deleted'"];
    const params: (string | number | boolean)[] = [];

    if (type) {
      params.push(type);
      where.push(`event_type = $${params.length}`);
    }
    if (category) {
      params.push(category);
      where.push(`$${params.length} = ANY(categories)`);
    }
    if (archive === 'true') {
      where.push(`COALESCE(end_date, start_date) < CURRENT_DATE`);
    }
    if (upcoming === 'true') {
      where.push(`COALESCE(end_date, start_date) >= CURRENT_DATE`);
    }

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
  const authError = await requireAuth(req);
  if (authError) return authError;
  try {
    const body: EventBody = await req.json();
    if (!body.title || body.title.trim().length < 3) return NextResponse.json({ error: 'Title is required and must be at least 3 characters' }, { status: 400 });
    if (body.start_date && isNaN(Date.parse(body.start_date))) return NextResponse.json({ error: 'start_date must be a valid ISO date' }, { status: 400 });
    const cats = (body.categories || []).filter((c) => VALID_CATEGORIES.includes(c as typeof VALID_CATEGORIES[number]));
    const slug = body.slug ? body.slug : slugify(body.title || '');
    const res = await query(
      `INSERT INTO events (title, description, event_type, start_date, end_date, location, poster_image, slug, categories, display_order, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'active') RETURNING *`,
      [body.title, body.description || null, body.event_type || null, body.start_date || null, body.end_date || null, body.location || null, body.poster_image || null, slug, cats, body.display_order ?? 0]
    );
    return NextResponse.json({ data: res.rows[0] }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  try {
    const body: EventBody = await req.json();
    if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    if (body.title && body.title.trim().length < 3) return NextResponse.json({ error: 'Title must be at least 3 characters' }, { status: 400 });
    if (body.start_date && isNaN(Date.parse(body.start_date))) return NextResponse.json({ error: 'start_date must be a valid ISO date' }, { status: 400 });
    const existing = await query('SELECT * FROM events WHERE id=$1 LIMIT 1', [body.id]);
    if (existing.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const cur = existing.rows[0];
    const cats = body.categories !== undefined
      ? (body.categories || []).filter((c) => VALID_CATEGORIES.includes(c as typeof VALID_CATEGORIES[number]))
      : cur.categories;
    const slug = body.slug ? body.slug : slugify(body.title || cur.title || '');
    const res = await query(
      `UPDATE events SET title=$1, description=$2, event_type=$3, start_date=$4, end_date=$5, location=$6, poster_image=$7, slug=$8, categories=$9, display_order=$10, updated_at=NOW() WHERE id=$11 RETURNING *`,
      [body.title || cur.title, body.description ?? cur.description, body.event_type || cur.event_type, body.start_date || cur.start_date, body.end_date || cur.end_date, body.location || cur.location, body.poster_image || cur.poster_image, slug, cats, body.display_order ?? cur.display_order, body.id]
    );
    return NextResponse.json({ data: res.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  try {
    const body = await req.json();
    const id = body.id;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await query('DELETE FROM events WHERE id=$1', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
