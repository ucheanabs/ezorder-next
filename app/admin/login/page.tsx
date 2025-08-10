'use client';
import { useState } from 'react';

export default function AdminLoginPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ passcode: code })
    });
    setLoading(false);
    if (res.ok) {
      window.location.href = '/admin';
    } else {
      const j = await res.json().catch(()=>({error:'Invalid passcode'}));
      setErr(j.error || 'Invalid passcode');
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-800 mb-4">Admin access</h1>
        <label className="block text-sm text-slate-600 mb-2">Passcode</label>
        <input
          type="password"
          value={code}
          onChange={e=>setCode(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Enter passcode"
          required
        />
        {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-emerald-600 text-white py-2 font-medium disabled:opacity-60"
        >
          {loading ? 'Checking…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
