import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const items = [
  { title: 'Etkinlikler', href: '/etkinlikler' },
  { title: 'Eğitmenler', href: '/egitmenler' },
  { title: 'Arşiv', href: '/arsiv' },
  { title: 'İletişim', href: '/iletisim' }
];

export default function QuickAccessCards() {
  return (
    <section>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((it) => (
          <Link key={it.href} href={it.href}>
            <motion.div whileHover={{ scale: 1.03 }} className="touch-target">
              <Card className="p-4 text-center">
                <div className="font-medium">{it.title}</div>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
