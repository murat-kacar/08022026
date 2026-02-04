import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { motion } from 'framer-motion';

interface Props {
  slug: string;
  title: string;
  poster_image?: string;
  event_type?: string;
  start_date?: string;
  location?: string;
}

export function EventCard({ slug, title, poster_image = '/assets/images/placeholder.jpg', event_type, start_date, location }: Props) {
  return (
    <Link href={`/etkinlikler/${slug}`} className="block">
      <motion.div whileHover={{ scale: 1.02 }} className="cursor-pointer">
        <Card>
          <AspectRatio ratio={2 / 3}>
            <Image src={poster_image} alt={title} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
            {event_type && <Badge className="absolute top-2 right-2 bg-black/70 text-white">{event_type}</Badge>}
          </AspectRatio>
          <CardContent>
            <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{start_date}</p>
            {location && <p className="text-sm text-muted-foreground">{location}</p>}
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

export default EventCard;
