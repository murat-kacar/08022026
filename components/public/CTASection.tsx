import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Etkinlikleri Keşfet</h2>
            <p className="text-sm opacity-90">Sanat ve kültür dolu etkinliklere göz atın ve başvurun.</p>
          </div>
          <div>
            <Link href="/etkinlikler">
              <Button className="bg-white text-primary">Etkinliklere Göz At</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
