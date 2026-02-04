"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Props {
  event_id?: number;
  event_title?: string;
  event_date?: string;
}

export default function ApplicationForm({ event_id, event_title, event_date }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      event_id,
      event_title,
      event_date,
      name: fd.get('name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      message: fd.get('message')
    };

    try {
      const res = await fetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Network response was not ok');
      router.refresh();
      e.currentTarget.reset();
      alert('Başvurunuz alındı. Teşekkürler.');
    } catch (err) {
      setError('Başvuru gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <input name="name" placeholder="Ad Soyad *" required minLength={3} className="w-full p-3 border rounded" />
      <input name="email" type="email" placeholder="Email *" required className="w-full p-3 border rounded" />
      <input name="phone" type="tel" placeholder="Telefon *" required className="w-full p-3 border rounded" />
      <textarea name="message" placeholder="Mesaj (opsiyonel)" rows={4} className="w-full p-3 border rounded" />
      {error && <div className="text-sm text-red-600">{error}</div>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Gönderiliyor...' : 'Başvuru Yap'}
      </Button>
    </form>
  );
}
