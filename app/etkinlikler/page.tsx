// Render events server-side so listing shows immediately.
import React from 'react';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  try {
    const apiUrl = new URL('/api/events?limit=200', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').toString();
    const res = await fetch(apiUrl, { cache: 'no-store' });
    const json = await res.json().catch(() => ({}));
    const items = json.data || [];

    return (
      <div className="py-6">
        <h1 className="text-2xl font-semibold mb-4">Etkinlikler</h1>
        {items.length === 0 ? (
          <div>Henüz etkinlik yok.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it: any) => (
              <a key={it.id} href={`/etkinlikler/${it.slug || it.id}`} className="block p-3 border rounded hover:shadow">
                <div className="font-medium">{it.title}</div>
                <div className="text-sm text-muted">{it.start_date ? new Date(it.start_date).toLocaleString() : ''}</div>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  } catch (err) {
    return (
      <div className="py-6">
        <h1 className="text-2xl font-semibold mb-4">Etkinlikler</h1>
        <div>Veri alınırken hata oluştu.</div>
      </div>
    );
  }
}

