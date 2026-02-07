"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';

interface InstructorItem {
  id: number;
  name: string;
  expertise: string;
  slug: string;
}

export default function AdminInstructorsPage() {
  const [items, setItems] = useState<InstructorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', expertise: '' });
  const [errors, setErrors] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/instructors?limit=200');
    const j = await r.json();
    setItems(j.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    if (!form.name || form.name.trim().length < 3) {
      setErrors('İsim en az 3 karakter olmalıdır.');
      return;
    }
    setCreating(true);
    const res = await fetch('/api/instructors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const j = await res.json().catch(() => ({}));
    setCreating(false);
    if (!res.ok) {
      const msg = j.error || 'Sunucu hatası';
      setErrors(msg);
      toast?.toast({ title: 'Hata', description: msg, type: 'error' });
      return;
    }
    toast?.toast({ title: 'Oluşturuldu', description: 'Eğitmen eklendi', type: 'success' });
    setForm({ name: '', expertise: '' });
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu eğitmeni silmek istediğinize emin misiniz?')) return;
    const res = await fetch('/api/instructors', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast?.toast({ title: 'Hata', description: j.error || 'Silinemedi', type: 'error' });
      return;
    }
    toast?.toast({ title: 'Silindi', description: 'Eğitmen silindi', type: 'success' });
    load();
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{items.length} eğitmen</p>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'İptal' : '+ Yeni Eğitmen'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Yeni Eğitmen Ekle</h3>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="admin-label">İsim *</label>
                <input className="admin-input" placeholder="Eğitmen adı" aria-label="İsim" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="admin-label">Uzmanlık</label>
                <input className="admin-input" placeholder="ör: Resim, Müzik" aria-label="Uzmanlık" value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} />
              </div>
            </div>
            {errors && <div className="admin-error" style={{ marginBottom: '1rem' }}>{errors}</div>}
            <button type="submit" disabled={creating} className="admin-btn admin-btn-primary">
              {creating ? 'Ekleniyor...' : 'Ekle'}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="admin-loading"><span className="admin-spinner" /> Yükleniyor...</div>
      ) : items.length === 0 ? (
        <div className="admin-card admin-empty">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
          <p>Henüz eğitmen eklenmemiş.</p>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>İsim</th>
                <th>Uzmanlık</th>
                <th>Slug</th>
                <th style={{ textAlign: 'right' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td style={{ fontWeight: 500, color: '#1e293b' }}>{it.name}</td>
                  <td>{it.expertise || '—'}</td>
                  <td><span style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'monospace' }}>{it.slug}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Link href={`/admin/instructors/edit/${it.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
                        Düzenle
                      </Link>
                      <button onClick={() => handleDelete(it.id)} className="admin-btn admin-btn-danger admin-btn-sm">
                        Sil
                      </button>
                    </div>
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
