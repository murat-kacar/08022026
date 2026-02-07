"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';

const EVENT_TYPES = [
  { value: 'workshop', label: 'Atölye' },
  { value: 'seminar', label: 'Seminer' },
  { value: 'conference', label: 'Konferans' },
  { value: 'exhibition', label: 'Sergi' },
  { value: 'concert', label: 'Konser' },
  { value: 'other', label: 'Diğer' },
];

const CATEGORIES = [
  { value: 'hero', label: 'Hero (Anasayfa Slider)' },
  { value: 'homepage', label: 'Anasayfa' },
  { value: 'featured', label: 'Öne Çıkan' },
];

interface EventItem {
  id: number;
  title: string;
  event_type: string;
  start_date: string;
  slug: string;
  categories: string[];
  display_order: number;
}

export default function AdminEventsPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  type EventForm = { title: string; event_type: string; start_date: string; categories: string[]; display_order: number };
  const [form, setForm] = useState<EventForm>({ title: '', event_type: '', start_date: '', categories: ['hero', 'homepage'], display_order: 0 });
  const [errors, setErrors] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/events?limit=100');
    const j = await r.json();
    setItems(j.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const validate = (f: typeof form) => {
    if (!f.title || f.title.trim().length < 3) return 'Başlık en az 3 karakter olmalı.';
    if (f.start_date && isNaN(Date.parse(f.start_date))) return 'Geçerli bir tarih girin.';
    return null;
  };

  const toggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    if (v) { setErrors(v); return; }
    setErrors(null);
    setCreating(true);
    const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const j = await res.json().catch(() => ({}));
    setCreating(false);
    if (!res.ok) {
      const msg = j.error || 'Sunucu hatası';
      setErrors(msg);
      toast?.toast({ title: 'Hata', description: msg, type: 'error' });
      return;
    }
    toast?.toast({ title: 'Oluşturuldu', description: 'Etkinlik oluşturuldu — medya eklemek için düzenleme sayfasına yönlendiriliyorsunuz', type: 'success' });
    setForm({ title: '', event_type: '', start_date: '', categories: ['hero', 'homepage'], display_order: 0 });
    setShowForm(false);
    // Redirect to edit page so user can add media
    if (j.data?.id) {
      router.push(`/admin/events/edit/${j.data.id}`);
    } else {
      load();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu etkinliği silmek istediğinize emin misiniz?')) return;
    const res = await fetch('/api/events', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast?.toast({ title: 'Hata', description: j.error || 'Silinemedi', type: 'error' });
      return;
    }
    toast?.toast({ title: 'Silindi', description: 'Etkinlik silindi', type: 'success' });
    load();
  };

  const formatDate = (d: string) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return d; }
  };

  const catLabel = (cats: string[]) => {
    if (!cats || cats.length === 0) return '—';
    return cats.map((c) => CATEGORIES.find((x) => x.value === c)?.label || c).join(', ');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{items.length} etkinlik</p>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'İptal' : '+ Yeni Etkinlik'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Yeni Etkinlik Oluştur</h3>
          <form onSubmit={handleCreate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="admin-label">Başlık *</label>
                <input
                  className="admin-input"
                  placeholder="Etkinlik başlığı"
                  aria-label="Başlık"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="admin-label">Tür</label>
                <select
                  className="admin-input"
                  aria-label="Tür"
                  value={form.event_type}
                  onChange={(e) => setForm({ ...form, event_type: e.target.value })}
                >
                  <option value="">Seçiniz</option>
                  {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Başlangıç Tarihi</label>
                <input
                  type="datetime-local"
                  className="admin-input"
                  aria-label="Başlangıç tarihi"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="admin-label">Sıralama</label>
                <input
                  type="number"
                  className="admin-input"
                  aria-label="Sıralama"
                  value={form.display_order}
                  onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label className="admin-label">Kategoriler (görüntülenecek konumlar)</label>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {CATEGORIES.map((cat) => (
                  <div key={cat.value} className="admin-checkbox-row">
                    <input
                      type="checkbox"
                      checked={form.categories.includes(cat.value)}
                      onChange={() => toggleCategory(cat.value)}
                    />
                    <span>{cat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            {errors && <div className="admin-error" style={{ marginBottom: '1rem' }}>{errors}</div>}
            <button type="submit" disabled={creating} className="admin-btn admin-btn-primary">
              {creating ? 'Oluşturuluyor...' : 'Oluştur'}
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
          <p>Henüz etkinlik eklenmemiş.</p>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Başlık</th>
                <th>Tür</th>
                <th>Tarih</th>
                <th>Kategoriler</th>
                <th>Sıra</th>
                <th style={{ textAlign: 'right' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td style={{ fontWeight: 500, color: '#1e293b' }}>{it.title}</td>
                  <td><span className="admin-badge admin-badge-info">{EVENT_TYPES.find((t) => t.value === it.event_type)?.label || it.event_type || '—'}</span></td>
                  <td>{formatDate(it.start_date)}</td>
                  <td style={{ fontSize: '0.8rem' }}>{catLabel(it.categories)}</td>
                  <td>{it.display_order}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Link href={`/admin/events/edit/${it.id}`} className="admin-btn admin-btn-secondary admin-btn-sm">
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
