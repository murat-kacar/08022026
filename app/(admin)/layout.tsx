import React from 'react';
import './admin.css';
import ToastProvider from '@/components/ToastProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
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
}
