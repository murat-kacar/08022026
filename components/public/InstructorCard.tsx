import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface Props {
  name: string;
  photo?: string;
  expertise?: string;
  slug?: string;
}

export default function InstructorCard({ name, photo = '/assets/images/avatar-placeholder.png', expertise, slug }: Props) {
  return (
    <Link href={slug ? `/egitmenler/${slug}` : '#'}>
      <motion.div whileHover={{ translateY: -4 }} className="cursor-pointer">
        <Card className="text-center p-4">
          <div className="mx-auto w-24 h-24 relative rounded-full overflow-hidden mb-3">
            <Image src={photo} alt={name} fill className="object-cover" />
          </div>
          <CardContent className="pt-0">
            <div className="font-medium">{name}</div>
            {expertise && <div className="text-sm text-muted">{expertise}</div>}
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
