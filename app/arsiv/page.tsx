import React from 'react';
import { query } from '@/lib/db';
import EventCard from '@/components/public/EventCard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Arşiv - Hakan Karsak Akademi' };

interface EventRow {
  id: number;
  title: string;
  slug: string;
  poster_image: string | null;
  event_type: string | null;
  start_date: string | null;
  location: string | null;
}

export default async function ArchivePage() {
  try {
    const res = await query<EventRow>(
      `SELECT id, title, slug, poster_image, event_type, start_date, location
       FROM events
       WHERE status != 'deleted' AND COALESCE(end_date, start_date) < CURRENT_DATE
       ORDER BY start_date DESC LIMIT 100`
    );
    const items = res.rows;

    return (
      <div className="py-6">
        <h1 className="text-2xl font-semibold mb-2">Arşiv</h1>
        <p className="text-muted-foreground text-sm mb-6">Geçmiş etkinliklerimiz</p>
        {items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Arşivde henüz etkinlik bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((it) => (
              <EventCard
                key={it.id}
                slug={it.slug || String(it.id)}
                title={it.title}
                poster_image={it.poster_image}
                event_type={it.event_type}
                start_date={it.start_date}
                location={it.location}
              />
            ))}
          </div>
        )}
      </div>
    );
  } catch (_err) {
    return (
      <div className="py-6">
        <h1 className="text-2xl font-semibold mb-4">Arşiv</h1>
        <div>Veri alınırken hata oluştu.</div>
      </div>
    );
  }
}
