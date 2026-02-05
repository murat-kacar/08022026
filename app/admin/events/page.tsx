"use client";
import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ToastProvider';

type EventItem = any;

export default function AdminEventsPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  type EventForm = { title: string; event_type: string; start_date: string; show_on_homepage?: boolean; show_in_hero?: boolean };
  const [form, setForm] = useState<EventForm>({ title: '', event_type: '', start_date: '', show_on_homepage: false, show_in_hero: false });
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    const r = await fetch('/api/events?limit=100');
    const j = await r.json();
    setItems(j.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const [errors, setErrors] = useState<string | null>(null);

  const validate = (f: typeof form) => {
    if (!f.title || f.title.trim().length < 3) return 'Başlık en az 3 karakter olmalı.';
    if (f.start_date && isNaN(Date.parse(f.start_date))) return 'Başlangıç tarihi geçerli bir ISO tarih olmalı.';
    return null;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    if (v) { setErrors(v); return; }
    setErrors(null);
    const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = j.error || 'Sunucu hatası';
      setErrors(msg);
      toast?.toast({ title: 'Hata', description: msg, type: 'error' });
      return;
    }
    setForm({ title: '', event_type: '', start_date: '' });
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Silmek istiyor musunuz?')) return;
    const res = await fetch('/api/events', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = j.error || 'Sunucu hatası';
      setErrors(msg);
      toast?.toast({ title: 'Hata', description: msg, type: 'error' });
      return;
    }
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Etkinlikler</h1>
      <form onSubmit={handleCreate} className="mb-4 space-y-2 max-w-lg">
        <input placeholder="Başlık" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full p-2 border rounded" required />
        <input placeholder="Tür" value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })} className="w-full p-2 border rounded" />
        <input placeholder="Başlangıç (ISO)" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full p-2 border rounded" />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={!!(form as any).show_on_homepage} onChange={(e) => setForm({ ...form, show_on_homepage: e.target.checked })} />
          <span className="text-sm">Anasayfada göster</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={!!(form as any).show_in_hero} onChange={(e) => setForm({ ...form, show_in_hero: e.target.checked })} />
          <span className="text-sm">Hero alanında göster</span>
        </label>
        {errors && <div className="text-sm text-red-600">{errors}</div>}
        <button className="bg-primary text-white px-4 py-2 rounded">Oluştur</button>
      </form>

      {loading ? <div>Yükleniyor...</div> : (
        <div className="space-y-2">
          {items.map((it: EventItem) => (
            <div key={it.id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-sm text-muted">{it.event_type} — {it.start_date}</div>
              </div>
              <div className="space-x-2">
                <a href={`/admin/events/edit/${it.id}`} className="text-sm text-primary">Düzenle</a>
                <button onClick={() => handleDelete(it.id)} className="text-sm text-red-600">Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
