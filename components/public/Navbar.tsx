'use client';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/etkinlikler', label: 'Etkinlikler' },
    { href: '/egitmenler', label: 'Eğitmenler' },
    { href: '/hakkimizda', label: 'Hakkımızda' },
    { href: '/sss', label: 'SSS' },
    { href: '/iletisim', label: 'İletişim' },
  ];

  return (
    <header className="sticky top-0 bg-white/70 backdrop-blur-sm z-50">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="text-lg font-bold">Hakan Karsak</Link>
        <nav className="hidden sm:flex gap-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="touch-target">{l.label}</Link>
          ))}
        </nav>
        <button
          className="sm:hidden p-2 touch-target"
          onClick={() => setOpen(!open)}
          aria-label="Menüyü aç/kapat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <nav className="sm:hidden border-t bg-white px-4 pb-3 space-y-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block py-2 touch-target" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
