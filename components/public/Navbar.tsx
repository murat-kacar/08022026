import Link from 'next/link';
import React from 'react';

export default function Navbar() {
  return (
    <header className="sticky top-0 bg-white/70 backdrop-blur-sm z-50">
      <div className="container flex items-center justify-between h-14">
        <Link href="/" className="text-lg font-bold">Hakan Karsak</Link>
        <nav className="hidden sm:flex gap-4">
          <Link href="/etkinlikler" className="touch-target">Etkinlikler</Link>
          <Link href="/egitmenler" className="touch-target">Eğitmenler</Link>
          <Link href="/hakkimizda" className="touch-target">Hakkımızda</Link>
          <Link href="/sss" className="touch-target">SSS</Link>
          <Link href="/iletisim" className="touch-target">İletişim</Link>
        </nav>
      </div>
    </header>
  );
}
