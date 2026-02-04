"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { motion } from 'framer-motion';

interface EventItem {
  id: number;
  title: string;
  poster_image?: string;
  slug?: string;
}

export default function ArchiveCarousel() {
  const [items, setItems] = useState<EventItem[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/events?homepage=true&limit=10')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setItems(data?.data || []);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  if (items.length === 0) return <div className="text-sm text-muted">Arşivde gösterilecek etkinlik yok.</div>;

  return (
    <section>
      <Swiper spaceBetween={12} slidesPerView={'auto'}>
        {items.map((it) => (
          <SwiperSlide key={it.id} style={{ width: 160 }}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Card>
                <AspectRatio ratio={2 / 3}>
                  <Image src={it.poster_image || '/assets/images/placeholder.jpg'} alt={it.title} fill className="object-cover" />
                </AspectRatio>
                <div className="p-2 text-sm font-medium">{it.title}</div>
              </Card>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
