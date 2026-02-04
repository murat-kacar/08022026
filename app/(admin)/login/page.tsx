"use client";
import React, { useState } from 'react';

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = { username: fd.get('username'), password: fd.get('password') };
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Giriş başarısız');
      window.location.href = '/admin/dashboard';
    } catch (err) {
      alert('Giriş başarısız');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-semibold mb-4">Admin Girişi</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="username" placeholder="Kullanıcı adı" required className="w-full p-3 border rounded" />
        <input name="password" type="password" placeholder="Şifre" required className="w-full p-3 border rounded" />
        <button type="submit" disabled={loading} className="w-full bg-primary text-white p-3 rounded">{loading ? 'Giriş...' : 'Giriş'}</button>
      </form>
    </div>
  );
}
