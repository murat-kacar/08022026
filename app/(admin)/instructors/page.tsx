"use client";
import React, { useEffect, useState } from 'react';

export default function AdminInstructorsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', expertise: '' });
  const toast = useToast();
  const [errors, setErrors] = useState<string | null>(null);

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
    const res = await fetch('/api/instructors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = j.error || 'Sunucu hatası';
      setErrors(msg);
      toast?.toast({ title: 'Hata', description: msg, type: 'error' });
      return;
    }
    setForm({ name: '', expertise: '' });
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Silmek istiyor musunuz?')) return;
    const res = await fetch('/api/instructors', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
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
      <h1 className="text-2xl font-semibold mb-4">Eğitmenler</h1>
      <form onSubmit={handleCreate} className="mb-4 space-y-2 max-w-lg">
        <input placeholder="İsim" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded" required />
        <input placeholder="Uzmanlık" value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} className="w-full p-2 border rounded" />
        {errors && <div className="text-sm text-red-600">{errors}</div>}
        <button className="bg-primary text-white px-4 py-2 rounded">Oluştur</button>
      </form>

      {loading ? <div>Yükleniyor...</div> : (
        <div className="space-y-2">
          {items.map((it) => (
            <div key={it.id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-muted">{it.expertise}</div>
              </div>
              <div className="space-x-2">
                <a href={`/admin/instructors/edit/${it.id}`} className="text-sm text-primary">Düzenle</a>
                <button onClick={() => handleDelete(it.id)} className="text-sm text-red-600">Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
