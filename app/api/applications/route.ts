import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event_id, event_title, event_date, name, email, phone, message } = body;

    if (!name || !email || !phone) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const res = await query(
      `INSERT INTO applications (event_id, event_title, event_date, name, email, phone, message) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [event_id || null, event_title || null, event_date || null, name, email, phone, message || null]
    );

    return NextResponse.json({ data: res.rows[0] }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  // For admin use — not exposed publicly in this skeleton
  try {
    const res = await query('SELECT * FROM applications ORDER BY created_at DESC LIMIT 100');
    return NextResponse.json({ data: res.rows });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
