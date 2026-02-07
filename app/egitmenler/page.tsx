import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Eğitmenler - Hakan Karsak Akademi' };

interface InstructorRow {
  id: number;
  name: string;
  slug: string;
  photo: string | null;
  expertise: string | null;
}

export default async function InstructorsPage() {
  try {
    const res = await query<InstructorRow>(
      'SELECT * FROM instructors ORDER BY display_order ASC LIMIT 100'
    );
    const items = res.rows;

    return (
      <div className="py-6">
        <h1 className="text-2xl font-semibold mb-4">Eğitmenler</h1>
        {items.length === 0 ? (
          <div>Henüz eğitmen eklenmemiş.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <Link key={it.id} href={`/egitmenler/${it.slug}`} className="block">
                <div className="p-4 border rounded hover:shadow text-center">
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <Image
                      src={it.photo || '/assets/images/avatar-placeholder.png'}
                      alt={it.name}
                      fill
                      sizes="96px"
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div className="font-medium">{it.name}</div>
                  {it.expertise && <div className="text-sm text-muted-foreground">{it.expertise}</div>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  } catch (_err) {
    return (
      <div className="py-6">
        <h1 className="text-2xl font-semibold mb-4">Eğitmenler</h1>
        <div>Veri alınırken hata oluştu.</div>
      </div>
    );
  }
}
