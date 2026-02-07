import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const res = await query('SELECT name FROM instructors WHERE slug=$1 LIMIT 1', [params.slug]);
  const row = res.rows[0];
  return { title: row ? `${row.name} - Hakan Karsak Akademi` : 'Eğitmen' };
}

interface EventRow {
  id: number;
  title: string;
  slug: string;
  start_date: string | null;
  event_type: string | null;
}

export default async function InstructorDetailPage({ params }: { params: { slug: string } }) {
  try {
    const res = await query('SELECT * FROM instructors WHERE slug=$1 LIMIT 1', [params.slug]);
    const instructor = res.rows[0];
    if (!instructor) return notFound();

    // many-to-many: get events for this instructor
    const eventsRes = await query<EventRow>(
      `SELECT e.id, e.title, e.slug, e.start_date, e.event_type
       FROM events e
       JOIN event_instructors ei ON ei.event_id = e.id
       WHERE ei.instructor_id = $1 AND e.status != 'deleted'
       ORDER BY e.start_date DESC`,
      [instructor.id]
    );
    const events = eventsRes.rows;

    return (
      <div className="py-6">
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <div className="relative w-40 h-40 flex-shrink-0">
            <Image
              src={instructor.photo || '/assets/images/avatar-placeholder.png'}
              alt={instructor.name}
              fill
              sizes="160px"
              className="object-cover rounded-full"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{instructor.name}</h1>
            {instructor.expertise && (
              <p className="text-muted-foreground mb-3">{instructor.expertise}</p>
            )}
            {instructor.bio && (
              <div className="prose max-w-none">
                <p>{instructor.bio}</p>
              </div>
            )}
          </div>
        </div>

        {events.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-3">Verdiği Etkinlikler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {events.map((ev) => (
                <Link
                  key={ev.id}
                  href={`/etkinlikler/${ev.slug}`}
                  className="block p-3 border rounded hover:shadow"
                >
                  <div className="font-medium">{ev.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {ev.event_type && <span>{ev.event_type} — </span>}
                    {ev.start_date ? new Date(ev.start_date).toLocaleDateString('tr-TR') : ''}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  } catch (err) {
    console.error('Instructor detail error', err);
    return notFound();
  }
}
