"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InstructorEditPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({ name: '', expertise: '' });
  const [errors, setErrors] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetch(`/api/instructors/id/${id}`)
      .then((r) => r.json())
      .then((j) => setForm(j.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);
    const res = await fetch('/api/instructors', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: Number(id), ...form }) });
    const j = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      const msg = j.error || 'Sunucu hatası';
      setErrors(msg);
      toast?.toast({ title: 'Hata', description: msg, type: 'error' });
      return;
    }
    toast?.toast({ title: 'Güncellendi', description: 'Eğitmen güncellendi', type: 'success' });
    router.push('/admin/instructors');
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Eğitmen Düzenle</h1>
      {loading ? <div>Yükleniyor...</div> : (
        <form onSubmit={handleSubmit} className="space-y-3 max-w-lg">
          <input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded" />
          <input value={form.expertise || ''} onChange={(e) => setForm({ ...form, expertise: e.target.value })} className="w-full p-2 border rounded" />
          {errors && <div className="text-sm text-red-600">{errors}</div>}
          <div className="flex gap-2">
            <button className="bg-primary text-white px-4 py-2 rounded">Güncelle</button>
            <button type="button" onClick={() => router.push('/admin/instructors')} className="px-4 py-2 border rounded">İptal</button>
          </div>
        </form>
      )}
    </div>
  );
}
