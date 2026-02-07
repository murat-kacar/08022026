"use client";
import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ToastProvider';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((data) => { setForm(data.data || {}); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    if (form.contact_email && !/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(form.contact_email)) {
      setErrors('Geçerli bir e-posta adresi girin.');
      return;
    }
    if (form.canonical_domain && !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(form.canonical_domain.replace(/^https?:\/\//, '').replace(/\/$/, ''))) {
      setErrors('Geçerli bir domain girin (ör. example.com).');
      return;
    }

    setSaving(true);
    const res = await fetch('/api/site-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const j = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      const msg = j.error || 'Sunucu hatası';
      setErrors(msg);
      toast?.toast({ title: 'Hata', description: msg, type: 'error' });
      return;
    }
    toast?.toast({ title: 'Kaydedildi', description: 'Site ayarları kaydedildi', type: 'success' });
  };

  if (loading) return <div className="admin-loading"><span className="admin-spinner" /> Yükleniyor...</div>;

  return (
    <div>
      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
        Sitenin genel ayarlarını buradan yönetebilirsiniz.
      </p>

      <div className="admin-card" style={{ maxWidth: 640 }}>
        <form onSubmit={handleSubmit}>
          {/* Genel */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>Genel</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label className="admin-label">Site Başlığı</label>
                <input className="admin-input" value={form.site_title || ''} onChange={(e) => handleChange('site_title', e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Site Açıklaması</label>
                <textarea className="admin-textarea" value={form.site_description || ''} onChange={(e) => handleChange('site_description', e.target.value)} rows={3} />
              </div>
            </div>
          </div>

          {/* İletişim & Domain */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>İletişim & Domain</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="admin-label">İletişim E-posta</label>
                <input className="admin-input" type="email" placeholder="ornek@domain.com" value={form.contact_email || ''} onChange={(e) => handleChange('contact_email', e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Canonical Domain</label>
                <input className="admin-input" placeholder="example.com" value={form.canonical_domain || ''} onChange={(e) => handleChange('canonical_domain', e.target.value)} />
              </div>
            </div>
          </div>

          {errors && <div className="admin-error" style={{ marginBottom: '1rem' }}>{errors}</div>}

          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </button>
        </form>
      </div>
    </div>
  );
}
