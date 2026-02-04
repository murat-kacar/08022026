"use client";
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface EventItem {
  id: number;
  title: string;
  poster_image?: string;
  slug?: string;
}

export default function HeroCarousel() {
  const [items, setItems] = useState<EventItem[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/events?hero=true&limit=5')
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

  if (items.length === 0) {
    return (
      <section className="w-full rounded overflow-hidden">
        <div className="relative h-48 bg-gray-100 flex items-center justify-center">Hero alanı (veri yok)</div>
      </section>
    );
  }

  return (
    <section>
      <Swiper spaceBetween={10} slidesPerView={1} autoplay={{ delay: 4000 }} pagination={{ clickable: true }}>
        {items.map((it) => (
          <SwiperSlide key={it.id}>
            <motion.div whileHover={{ scale: 1.02 }} className="rounded-lg overflow-hidden">
              <Card>
                <div className="relative h-56 md:h-80">
                  <Image src={it.poster_image || '/assets/images/placeholder.jpg'} alt={it.title} fill className="object-cover" />
                  <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-2 rounded">{it.title}</div>
                </div>
              </Card>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
