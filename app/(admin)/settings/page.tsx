"use client";
import React, { useEffect, useState } from 'react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((data) => {
        setForm(data.data || {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    // basic email validation
    if (form.contact_email && !/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(form.contact_email)) {
      setErrors('Geçerli bir e-posta adresi girin.');
      return;
    }
    // basic domain validation (no protocol)
    if (form.canonical_domain && !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(form.canonical_domain.replace(/^https?:\/\//, '').replace(/\/$/, ''))) {
      setErrors('Geçerli bir domain girin (ör. example.com).');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/site-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const j = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      const msg = j.error || 'Sunucu hatası';
      setErrors(msg);
      toast?.toast({ title: 'Hata', description: msg, type: 'error' });
      return;
    }
    toast?.toast({ title: 'Kaydedildi', description: 'Site ayarları kaydedildi', type: 'success' });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Site Ayarları</h1>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-xl">
        <label className="block">
          <div className="text-sm font-medium">Site Başlığı</div>
          <input value={form.site_title || ''} onChange={(e) => handleChange('site_title', e.target.value)} className="w-full p-2 border rounded" />
        </label>
        <label className="block">
          <div className="text-sm font-medium">Site Açıklaması</div>
          <textarea value={form.site_description || ''} onChange={(e) => handleChange('site_description', e.target.value)} className="w-full p-2 border rounded" />
        </label>
        <label className="block">
          <div className="text-sm font-medium">İletişim E-posta</div>
          <input value={form.contact_email || ''} onChange={(e) => handleChange('contact_email', e.target.value)} className="w-full p-2 border rounded" />
        </label>
        <label className="block">
          <div className="text-sm font-medium">Canonical Domain</div>
          <input value={form.canonical_domain || ''} onChange={(e) => handleChange('canonical_domain', e.target.value)} className="w-full p-2 border rounded" />
        </label>
        <div className="flex gap-2">
          {errors && <div className="text-sm text-red-600 self-center">{errors}</div>}
          <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded">{loading ? 'Kaydediliyor...' : 'Kaydet'}</button>
        </div>
      </form>
    </div>
  );
}
