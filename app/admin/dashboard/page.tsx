"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  events: number;
  instructors: number;
  applications: number;
  pending: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ events: 0, instructors: 0, applications: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [evRes, insRes, appRes] = await Promise.all([
          fetch('/api/events?limit=1'),
          fetch('/api/instructors?limit=1'),
          fetch('/api/applications'),
        ]);
        const [evJ, insJ, appJ] = await Promise.all([evRes.json(), insRes.json(), appRes.json()]);

        const events = evJ.total ?? (evJ.data?.length || 0);
        const instructors = insJ.total ?? (insJ.data?.length || 0);
        const apps = appJ.data || [];
        const pending = apps.filter((a: { status: string }) => a.status === 'pending').length;

        setStats({ events, instructors, applications: apps.length, pending });
      } catch (err) {
        console.error('[Dashboard] Stats load error', err);
      }
      setLoading(false);
    };
    load();
  }, []);

  const cards = [
    {
      label: 'Etkinlikler',
      value: stats.events,
      iconBg: '#eff6ff',
      iconColor: '#3b82f6',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
      ),
      href: '/admin/events',
    },
    {
      label: 'Eğitmenler',
      value: stats.instructors,
      iconBg: '#f0fdf4',
      iconColor: '#22c55e',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>
      ),
      href: '/admin/instructors',
    },
    {
      label: 'Toplam Başvuru',
      value: stats.applications,
      iconBg: '#fefce8',
      iconColor: '#eab308',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
        </svg>
      ),
      href: '/admin/applications',
    },
    {
      label: 'Bekleyen Başvuru',
      value: stats.pending,
      iconBg: '#fef2f2',
      iconColor: '#ef4444',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      href: '/admin/applications',
    },
  ];

  return (
    <div>
      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map((c) => (
          <Link href={c.href} key={c.label} className="admin-stat-card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
            <div className="admin-stat-icon" style={{ background: c.iconBg, color: c.iconColor }}>
              {c.icon}
            </div>
            <div>
              <div className="admin-stat-value">
                {loading ? '—' : c.value}
              </div>
              <div className="admin-stat-label">{c.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="admin-card">
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Hızlı İşlemler</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link href="/admin/events" className="admin-btn admin-btn-primary admin-btn-sm">
            + Yeni Etkinlik
          </Link>
          <Link href="/admin/instructors" className="admin-btn admin-btn-primary admin-btn-sm">
            + Yeni Eğitmen
          </Link>
          <Link href="/admin/applications" className="admin-btn admin-btn-secondary admin-btn-sm">
            Başvuruları Gör
          </Link>
          <Link href="/admin/pages" className="admin-btn admin-btn-secondary admin-btn-sm">
            Sayfaları Düzenle
          </Link>
        </div>
      </div>
    </div>
  );
}
