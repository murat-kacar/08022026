"use client";
import React, { use, useEffect, useState, useCallback } from 'react';
import { useToast } from '@/components/ToastProvider';
import { useRouter } from 'next/navigation';
import MediaManager from '@/components/admin/MediaManager';

export default function InstructorEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({ name: '', expertise: '', title: '', bio: '' });
  const [media, setMedia] = useState<Array<{ id: number; media_type: string; url: string; thumbnail_url: string | null; original_name: string; display_order: number }>>([]);
  const [errors, setErrors] = useState<string | null>(null);
  const toast = useToast();

  const fetchMedia = useCallback(() => {
    fetch(`/api/media?entity_type=instructor&entity_id=${id}`)
      .then((r) => r.json())
      .then((j) => setMedia(j.data || []))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    fetch(`/api/instructors/id/${id}`)
      .then((r) => r.json())
      .then((j) => setForm(j.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
    fetchMedia();
  }, [id, fetchMedia]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors(null);
    const res = await fetch('/api/instructors', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: Number(id), ...form }) });
    const j = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      const msg = j.error || 'Sunucu hatası';
      setErrors(msg);
      toast?.toast({ title: 'Hata', description: msg, type: 'error' });
      return;
    }
    toast?.toast({ title: 'Güncellendi', description: 'Eğitmen güncellendi', type: 'success' });
    router.push('/admin/instructors');
  };

  if (loading) return <div className="admin-loading"><span className="admin-spinner" /> Yükleniyor...</div>;

  return (
    <div>
      <button onClick={() => router.push('/admin/instructors')} className="admin-btn admin-btn-secondary admin-btn-sm" style={{ marginBottom: '1.25rem' }}>
        ← Geri
      </button>

      <div className="admin-card" style={{ maxWidth: 640 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.25rem' }}>Eğitmen Bilgilerini Düzenle</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="admin-label">İsim</label>
              <input className="admin-input" aria-label="İsim" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Unvan</label>
              <input className="admin-input" aria-label="Unvan" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Örn: Prof. Dr., Sanat Yönetmeni" />
            </div>
            <div>
              <label className="admin-label">Uzmanlık</label>
              <input className="admin-input" aria-label="Uzmanlık" value={form.expertise || ''} onChange={(e) => setForm({ ...form, expertise: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Biyografi</label>
              <textarea className="admin-input" rows={5} aria-label="Biyografi" value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
          </div>

          {errors && <div className="admin-error" style={{ marginBottom: '1rem' }}>{errors}</div>}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
              {saving ? 'Kaydediliyor...' : 'Güncelle'}
            </button>
            <button type="button" onClick={() => router.push('/admin/instructors')} className="admin-btn admin-btn-secondary">
              İptal
            </button>
          </div>
        </form>
      </div>

      {/* Media manager */}
      <div className="admin-card" style={{ maxWidth: 640, marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '1.25rem' }}>Medya Yönetimi</h3>
        <MediaManager entityType="instructor" entityId={Number(id)} media={media} onRefresh={fetchMedia} />
      </div>
    </div>
  );
}
