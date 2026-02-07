"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  event_id?: number;
  event_title?: string;
  event_date?: string;
}

export default function ApplicationForm({ event_id, event_title, event_date }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
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
      e.currentTarget.reset();
      setSuccess(true);
    } catch (err) {
      setError('Başvuru gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <input name="name" placeholder="Ad Soyad *" aria-label="Ad Soyad" required minLength={3} className="w-full p-3 border rounded" />
      <input name="email" type="email" placeholder="Email *" aria-label="Email" required className="w-full p-3 border rounded" />
      <input name="phone" type="tel" placeholder="Telefon *" aria-label="Telefon" required className="w-full p-3 border rounded" />
      <textarea name="message" placeholder="Mesaj (opsiyonel)" aria-label="Mesaj" rows={4} className="w-full p-3 border rounded" />
      {success && <div className="text-sm text-green-600 font-medium">Başvurunuz alındı. Teşekkürler!</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Gönderiliyor...' : 'Başvuru Yap'}
      </Button>
    </form>
  );
}
