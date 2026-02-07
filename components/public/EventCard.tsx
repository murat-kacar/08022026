import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface Props {
  slug: string;
  title: string;
  poster_image?: string | null;
  event_type?: string | null;
  start_date?: string | null;
  location?: string | null;
}

const typeLabels: Record<string, string> = {
  workshop: 'Atölye',
  seminar: 'Seminer',
  conference: 'Konferans',
  exhibition: 'Sergi',
  concert: 'Konser',
  other: 'Diğer',
};

export default function EventCard({ slug, title, poster_image, event_type, start_date, location }: Props) {
  const dateStr = start_date ? new Date(start_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  return (
    <Link href={`/etkinlikler/${slug}`} className="group block border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-44 bg-gray-100">
        <Image
          src={poster_image || '/assets/images/placeholder.jpg'}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {event_type && (
          <Badge className="absolute top-2 left-2" variant="secondary">
            {typeLabels[event_type] || event_type}
          </Badge>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{title}</h3>
        <div className="mt-1 flex flex-col gap-0.5 text-sm text-muted-foreground">
          {dateStr && <span>{dateStr}</span>}
          {location && <span>{location}</span>}
        </div>
      </div>
    </Link>
  );
}
