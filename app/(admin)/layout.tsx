import React from 'react';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <div className="admin-shell min-h-screen flex">
          <aside className="w-64 bg-white border-r p-4">Admin Sidebar</aside>
          <main className="flex-1 p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
