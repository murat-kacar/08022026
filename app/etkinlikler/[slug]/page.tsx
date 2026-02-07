import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import { sanitize } from '@/lib/sanitize';
import type { Metadata } from 'next';
import ApplicationForm from '@/components/public/ApplicationForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const res = await query('SELECT title FROM events WHERE slug=$1 LIMIT 1', [params.slug]);
  const row = res.rows[0];
  return { title: row ? `${row.title} - Hakan Karsak Akademi` : 'Etkinlik' };
}

interface InstructorRow {
  id: number;
  name: string;
  slug: string;
  photo: string | null;
  expertise: string | null;
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    const res = await query("SELECT * FROM events WHERE slug=$1 AND status != 'deleted' LIMIT 1", [slug]);
    const row = res.rows[0];
    if (!row) return notFound();

    // many-to-many: get instructors for this event
    const instructorsRes = await query<InstructorRow>(
      `SELECT i.id, i.name, i.slug, i.photo, i.expertise
       FROM instructors i
       JOIN event_instructors ei ON ei.instructor_id = i.id
       WHERE ei.event_id = $1
       ORDER BY i.display_order ASC`,
      [row.id]
    );
    const instructors = instructorsRes.rows;

    return (
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-3">{row.title}</h1>
        <div className="text-sm text-muted-foreground mb-4">{row.start_date ? new Date(row.start_date).toLocaleString() : ''} {row.location ? `— ${row.location}` : ''}</div>
        {row.poster_image && <div className="mb-4 relative w-full h-64 md:h-96"><Image src={row.poster_image} alt={row.title} fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover rounded" /></div>}
        <div className="prose max-w-none mb-6">{row.description ? <div dangerouslySetInnerHTML={{ __html: sanitize(row.description) }} /> : <p>Açıklama yok.</p>}</div>

        {instructors.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Eğitmenler</h2>
            <div className="flex flex-wrap gap-4">
              {instructors.map((inst) => (
                <Link key={inst.id} href={`/egitmenler/${inst.slug}`} className="flex items-center gap-3 p-2 border rounded hover:shadow">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <Image src={inst.photo || '/assets/images/avatar-placeholder.png'} alt={inst.name} fill sizes="40px" className="object-cover rounded-full" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{inst.name}</div>
                    {inst.expertise && <div className="text-xs text-muted-foreground">{inst.expertise}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-3">Bu Etkinliğe Başvur</h2>
          <ApplicationForm event_id={row.id} event_title={row.title} event_date={row.start_date ? new Date(row.start_date).toISOString() : undefined} />
        </section>
      </div>
    );
  } catch (err) {
    console.error('Event detail error', err);
    return notFound();
  }
}
