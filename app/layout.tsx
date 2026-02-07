import './globals.css';
import React from 'react';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';

export const metadata = {
  title: 'Hakan Karsak Akademi',
  description: 'Sanat ve kültür etkinlikleri'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <Navbar />
        <main className="min-h-screen max-w-5xl mx-auto px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
