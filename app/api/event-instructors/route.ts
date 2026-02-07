import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAuth } from '@/lib/api-auth';

// GET: return instructors for an event, or events for an instructor
export async function GET(req: Request) {
  const url = new URL(req.url);
  const eventId = url.searchParams.get('event_id');
  const instructorId = url.searchParams.get('instructor_id');

  try {
    if (eventId) {
      const res = await query(
        `SELECT i.* FROM instructors i
         JOIN event_instructors ei ON ei.instructor_id = i.id
         WHERE ei.event_id = $1
         ORDER BY i.display_order ASC`,
        [Number(eventId)]
      );
      return NextResponse.json({ data: res.rows });
    }
    if (instructorId) {
      const res = await query(
        `SELECT e.* FROM events e
         JOIN event_instructors ei ON ei.event_id = e.id
         WHERE ei.instructor_id = $1 AND e.status != 'deleted'
         ORDER BY e.start_date DESC`,
        [Number(instructorId)]
      );
      return NextResponse.json({ data: res.rows });
    }
    // return all relations
    const res = await query('SELECT * FROM event_instructors');
    return NextResponse.json({ data: res.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: set instructors for an event (replace all)
export async function POST(req: Request) {
  const authError = await requireAuth(req);
  if (authError) return authError;
  try {
    const body = await req.json();
    const { event_id, instructor_ids } = body as { event_id: number; instructor_ids: number[] };
    if (!event_id || !Array.isArray(instructor_ids)) {
      return NextResponse.json({ error: 'event_id and instructor_ids[] required' }, { status: 400 });
    }
    // replace all: delete existing, insert new
    await query('DELETE FROM event_instructors WHERE event_id=$1', [event_id]);
    for (const iid of instructor_ids) {
      await query('INSERT INTO event_instructors (event_id, instructor_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [event_id, iid]);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
