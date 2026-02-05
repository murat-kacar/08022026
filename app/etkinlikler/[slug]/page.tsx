import React from 'react';
import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  try {
    const res = await query('SELECT * FROM events WHERE slug=$1 AND status=$2 LIMIT 1', [slug, 'published']);
    const row = res.rows[0];
    if (!row) return notFound();

    const sanitize = (html: string) => {
      return sanitizeHtml(html || '', {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: ['src', 'alt', 'width', 'height'],
          a: ['href', 'target', 'rel']
        },
        allowedSchemesByTag: {
          img: ['http', 'https', 'data']
        }
      });
    };

    return (
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-3">{row.title}</h1>
        <div className="text-sm text-muted mb-4">{row.start_date ? new Date(row.start_date).toLocaleString() : ''} {row.location ? `— ${row.location}` : ''}</div>
        {row.poster_image && <div className="mb-4"><img src={row.poster_image} alt={row.title} className="w-full max-h-96 object-cover rounded" /></div>}
        <div className="prose max-w-none">{row.description ? <div dangerouslySetInnerHTML={{ __html: sanitize(row.description) }} /> : <p>Açıklama yok.</p>}</div>
      </div>
    );
  } catch (err) {
    console.error('Event detail error', err);
    return notFound();
  }
}
