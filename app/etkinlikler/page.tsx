import React from 'react';
import { query } from '@/lib/db';
import EventCard from '@/components/public/EventCard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Etkinlikler - Hakan Karsak Akademi' };

interface EventRow {
  id: number;
  title: string;
  slug: string;
  poster_image: string | null;
  event_type: string | null;
  start_date: string | null;
  location: string | null;
}

export default async function EventsPage() {
  try {
    const res = await query<EventRow>(
      "SELECT id, title, slug, poster_image, event_type, start_date, location FROM events WHERE status != 'deleted' ORDER BY display_order ASC, start_date ASC LIMIT 200"
    );
    const items = res.rows;

    return (
      <div className="py-6">
        <h1 className="text-2xl font-semibold mb-4">Etkinlikler</h1>
        {items.length === 0 ? (
          <div>Henüz etkinlik yok.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <h1 className="text-2xl font-semibold mb-4">Etkinlikler</h1>
        <div>Veri alınırken hata oluştu.</div>
      </div>
    );
  }
}

