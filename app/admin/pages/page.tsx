"use client";
import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ToastProvider';

interface PageItem {
  slug: string;
  title: string;
  content: string;
  updated_at: string;
}

const PAGE_SLUGS = ['hakkimizda', 'sss', 'iletisim'];
const PAGE_LABELS: Record<string, string> = {
  hakkimizda: 'Hakkımızda',
  sss: 'Sıkça Sorulan Sorular',
  iletisim: 'İletişim',
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    const results: PageItem[] = [];
    for (const slug of PAGE_SLUGS) {
      const r = await fetch(`/api/pages/${slug}`);
      if (r.ok) {
        const j = await r.json();
        results.push(j.data);
      }
    }
    setPages(results);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openEdit = (slug: string) => {
    const page = pages.find((p) => p.slug === slug);
    if (page) {
      setForm({ title: page.title, content: page.content });
      setActive(slug);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active) return;
    setSaving(true);
    const res = await fetch(`/api/pages/${active}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      toast?.toast({ title: 'Hata', description: 'Kaydetme başarısız', type: 'error' });
      return;
    }
    toast?.toast({ title: 'Kaydedildi', description: `${PAGE_LABELS[active] || active} güncellendi`, type: 'success' });
    setActive(null);
    load();
  };

  if (loading) return <div className="admin-loading"><span className="admin-spinner" /> Yükleniyor...</div>;

  if (active) {
    return (
      <div>
        <button onClick={() => setActive(null)} className="admin-btn admin-btn-secondary admin-btn-sm" style={{ marginBottom: '1.25rem' }}>
          ← Geri
        </button>

        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>{PAGE_LABELS[active] || active}</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>Sayfa içeriğini düzenleyin</p>
            </div>
            <span className="admin-badge admin-badge-info">{active}</span>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '1rem' }}>
              <label className="admin-label">Sayfa Başlığı</label>
              <input
                className="admin-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                aria-label="Sayfa başlığı"
              />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="admin-label">İçerik (HTML destekler)</label>
              <textarea
                className="admin-textarea"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                aria-label="Sayfa içeriği"
                rows={16}
                style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem', lineHeight: 1.6 }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button type="button" onClick={() => setActive(null)} className="admin-btn admin-btn-secondary">
                İptal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
        Hakkımızda, SSS ve İletişim sayfalarının içeriklerini yönetin.
      </p>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {pages.map((p) => (
          <div key={p.slug} className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 550, color: '#1e293b', marginBottom: '0.2rem' }}>{PAGE_LABELS[p.slug] || p.slug}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Son güncelleme: {p.updated_at ? new Date(p.updated_at).toLocaleString('tr-TR') : '—'}
              </div>
            </div>
            <button onClick={() => openEdit(p.slug)} className="admin-btn admin-btn-secondary admin-btn-sm">
              Düzenle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
