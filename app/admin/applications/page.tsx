"use client";
import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ToastProvider';

interface Application {
  id: number;
  event_title: string | null;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  status: string;
  created_at: string;
}

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected';

export default function AdminApplicationsPage() {
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/applications');
    const j = await r.json();
    setItems(j.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: string) => {
    const res = await fetch('/api/applications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) {
      toast?.toast({ title: 'Hata', description: 'Güncelleme başarısız', type: 'error' });
      return;
    }
    toast?.toast({ title: 'Güncellendi', description: `Başvuru ${status === 'approved' ? 'onaylandı' : 'reddedildi'}`, type: 'success' });
    load();
  };

  const filtered = filter === 'all' ? items : items.filter((a) => a.status === filter);

  const counts = {
    all: items.length,
    pending: items.filter((a) => a.status === 'pending').length,
    approved: items.filter((a) => a.status === 'approved').length,
    rejected: items.filter((a) => a.status === 'rejected').length,
  };

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: `Tümü (${counts.all})` },
    { key: 'pending', label: `Bekleyen (${counts.pending})` },
    { key: 'approved', label: `Onaylı (${counts.approved})` },
    { key: 'rejected', label: `Reddedilen (${counts.rejected})` },
  ];

  const badgeClass = (s: string) => {
    if (s === 'approved') return 'admin-badge admin-badge-approved';
    if (s === 'rejected') return 'admin-badge admin-badge-rejected';
    return 'admin-badge admin-badge-pending';
  };

  const statusLabel = (s: string) => {
    if (s === 'approved') return 'Onaylı';
    if (s === 'rejected') return 'Reddedildi';
    return 'Bekliyor';
  };

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`admin-btn admin-btn-sm ${filter === tab.key ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-loading"><span className="admin-spinner" /> Yükleniyor...</div>
      ) : filtered.length === 0 ? (
        <div className="admin-card admin-empty">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
          </svg>
          <p>Başvuru bulunamadı.</p>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>İletişim</th>
                <th>Etkinlik</th>
                <th>Mesaj</th>
                <th>Tarih</th>
                <th>Durum</th>
                <th style={{ textAlign: 'right' }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id}>
                  <td style={{ fontWeight: 500, color: '#1e293b', whiteSpace: 'nowrap' }}>{app.name}</td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>{app.email}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.phone}</div>
                  </td>
                  <td>{app.event_title || '—'}</td>
                  <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {app.message || '—'}
                  </td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                    {new Date(app.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td>
                    <span className={badgeClass(app.status)}>{statusLabel(app.status)}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {app.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => updateStatus(app.id, 'approved')} className="admin-btn admin-btn-success admin-btn-sm">
                          Onayla
                        </button>
                        <button onClick={() => updateStatus(app.id, 'rejected')} className="admin-btn admin-btn-danger admin-btn-sm">
                          Reddet
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
