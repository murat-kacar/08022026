"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/components/ToastProvider';
import { useRouter } from 'next/navigation';
import MediaManager from '@/components/admin/MediaManager';

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

interface EventForm {
  title: string;
  event_type: string;
  start_date: string;
  end_date: string;
  location: string;
  description: string;
  poster_image: string;
  categories: string[];
  display_order: number;
  [key: string]: string | string[] | number;
}

export default function EventEditPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<EventForm>({
    title: '', event_type: '', start_date: '', end_date: '', location: '', description: '', poster_image: '', categories: [], display_order: 0
  });
  const [errors, setErrors] = useState<string | null>(null);
  const [media, setMedia] = useState<Array<{ id: number; media_type: string; url: string; thumbnail_url: string | null; original_name: string; display_order: number }>>([]);
  const toast = useToast();

  const fetchMedia = useCallback(() => {
    fetch(`/api/media?entity_type=event&entity_id=${id}`)
      .then((r) => r.json())
      .then((j) => setMedia(j.data || []))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    fetch(`/api/events/id/${id}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.data) {
          setForm({
            title: j.data.title || '',
            event_type: j.data.event_type || '',
            start_date: j.data.start_date || '',
            end_date: j.data.end_date || '',
            location: j.data.location || '',
            description: j.data.description || '',
            poster_image: j.data.poster_image || '',
            categories: j.data.categories || [],
            display_order: j.data.display_order ?? 0,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    fetchMedia();
  }, [id, fetchMedia]);

  const toggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors(null);
    const res = await fetch('/api/events', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: Number(id), ...form }) });
    const j = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      const msg = j.error || 'Sunucu hatası';
      setErrors(msg);
      toast?.toast({ title: 'Hata', description: msg, type: 'error' });
      return;
    }
    toast?.toast({ title: 'Güncellendi', description: 'Etkinlik güncellendi', type: 'success' });
    router.push('/admin/events');
  };

  if (loading) return <div className="admin-loading"><span className="admin-spinner" /> Yükleniyor...</div>;

  return (
    <div>
      <button onClick={() => router.push('/admin/events')} className="admin-btn admin-btn-secondary admin-btn-sm" style={{ marginBottom: '1.25rem' }}>
        ← Geri
      </button>

      <div className="admin-card" style={{ maxWidth: 720 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.25rem' }}>Etkinlik Bilgilerini Düzenle</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label className="admin-label">Başlık</label>
              <input
                className="admin-input"
                aria-label="Başlık"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                  value={form.start_date ? String(form.start_date).replace('Z', '').slice(0, 16) : ''}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="admin-label">Bitiş Tarihi</label>
                <input
                  type="datetime-local"
                  className="admin-input"
                  aria-label="Bitiş tarihi"
                  value={form.end_date ? String(form.end_date).replace('Z', '').slice(0, 16) : ''}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                />
              </div>
              <div>
                <label className="admin-label">Lokasyon</label>
                <input
                  className="admin-input"
                  aria-label="Lokasyon"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Açıklama</label>
              <textarea
                className="admin-input"
                rows={4}
                aria-label="Açıklama"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div>
                <label className="admin-label">Poster URL</label>
                <input
                  className="admin-input"
                  aria-label="Poster URL"
                  value={form.poster_image}
                  onChange={(e) => setForm({ ...form, poster_image: e.target.value })}
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
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
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

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
              {saving ? 'Kaydediliyor...' : 'Güncelle'}
            </button>
            <button type="button" onClick={() => router.push('/admin/events')} className="admin-btn admin-btn-secondary">
              İptal
            </button>
          </div>
        </form>
      </div>

      {/* Media manager */}
      <div className="admin-card" style={{ maxWidth: 720, marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.25rem' }}>Medya Yönetimi</h3>
        <MediaManager entityType="event" entityId={Number(id)} media={media} onRefresh={fetchMedia} />
      </div>
    </div>
  );
}
