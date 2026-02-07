import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { slugify } from '@/lib/slugify';
import { requireAuth } from '@/lib/api-auth';

type InstructorBody = {
  id?: number;
  name: string;
  bio?: string;
  photo?: string;
  expertise?: string;
  slug?: string;
  display_order?: number;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '50', 10);
  const homepage = url.searchParams.get('homepage');

  try {
    const where: string[] = [];
    if (homepage === 'true') where.push('show_on_homepage = true');

    const sql = `SELECT * FROM instructors ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY display_order ASC LIMIT $1`;
    const res = await query(sql, [limit]);
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
    const body: InstructorBody = await req.json();
    if (!body.name || body.name.trim().length < 3) return NextResponse.json({ error: 'Name is required and must be at least 3 characters' }, { status: 400 });
    const slug = body.slug ? body.slug : slugify(body.name || '');
    const res = await query(
      `INSERT INTO instructors (name, bio, photo, expertise, slug, display_order) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [body.name, body.bio || null, body.photo || null, body.expertise || null, slug, body.display_order || 999]
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
    const body: InstructorBody = await req.json();
    if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    if (body.name && body.name.trim().length < 3) return NextResponse.json({ error: 'Name must be at least 3 characters' }, { status: 400 });
    const existing = await query('SELECT * FROM instructors WHERE id=$1 LIMIT 1', [body.id]);
    if (existing.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const cur = existing.rows[0];
    const slug = body.slug ? body.slug : slugify(body.name || cur.name || '');
    const res = await query(
      `UPDATE instructors SET name=$1, bio=$2, photo=$3, expertise=$4, slug=$5, display_order=$6 WHERE id=$7 RETURNING *`,
      [body.name || cur.name, body.bio ?? cur.bio, body.photo ?? cur.photo, body.expertise ?? cur.expertise, slug, body.display_order ?? cur.display_order, body.id]
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
    await query('DELETE FROM instructors WHERE id=$1', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
