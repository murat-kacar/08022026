import React from 'react';
import HeroCarousel from '../components/public/HeroCarousel';
import QuickAccessCards from '../components/public/QuickAccessCards';
import ArchiveCarousel from '../components/public/ArchiveCarousel';
import CTASection from '../components/public/CTASection';

export default function HomePage() {
  return (
    <div className="space-y-6 py-6">
      <HeroCarousel />
      <QuickAccessCards />
      <ArchiveCarousel />
      <CTASection />
    </div>
  );
}
