import React from 'react';
import './admin.css';
import ToastProvider from '@/components/ToastProvider';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { query } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side verify token and ensure the user exists.
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return redirect('/admin/login');
    const payload: any = await verifyToken(token).catch(() => null);
    if (!payload || !payload.sub) return redirect('/admin/login');
    const userId = payload.sub;
    const res = await query('SELECT id FROM users WHERE id=$1 LIMIT 1', [userId]);
    if (res.rows.length === 0) return redirect('/admin/login');
    // user exists — render admin shell
    return (
      // ToastProvider is a client component; server component can include it
      <ToastProvider>
        <div className="admin-shell min-h-screen flex">
          <aside className="w-64 bg-white border-r p-4">
            <div className="mb-6 font-semibold">Yönetim</div>
            <nav className="space-y-2">
              <a href="/admin/dashboard" className="block p-2 rounded hover:bg-gray-50">Dashboard</a>
              <a href="/admin/events" className="block p-2 rounded hover:bg-gray-50">Etkinlikler</a>
              <a href="/admin/instructors" className="block p-2 rounded hover:bg-gray-50">Eğitmenler</a>
              <a href="/admin/settings" className="block p-2 rounded hover:bg-gray-50">Site Ayarları</a>
            </nav>
          </aside>
          <main className="flex-1 p-4">{children}</main>
        </div>
      </ToastProvider>
    );
  } catch (err) {
    console.error('Admin layout auth error', err);
    return redirect('/admin/login');
  }
}
