'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PASS = (process.env.NEXT_PUBLIC_ADMIN_PASSCODE as string) || '1234';

export default function Page() {
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim() === PASS) {
      try { localStorage.setItem('ez_admin_ok', '1'); } catch {}
      document.cookie = 'ez_admin_ok=1; Path=/; Max-Age=604800; SameSite=Lax';
      router.replace('/admin');
    } else {
      setErr('Invalid passcode');
    }
  }

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="mb-4 text-xl font-semibold">Admin Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          value={code}
          onChange={e=>setCode(e.target.value)}
          placeholder="Enter passcode"
          className="w-full rounded border px-3 py-2"
          autoFocus
        />
        <button type="submit" className="rounded bg-emerald-600 px-4 py-2 text-white w-full">Enter</button>
        {err && <p className="text-sm text-red-600">{err}</p>}
      </form>
    </div>
  );
}
