import React, { useState } from 'react';
import Navbar from '../components/Navbar';

export default function Forgot() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (!res.ok) throw new Error(await res.text());
      setSent(true);
    } catch (e) { setError('Failed to send reset code'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <Navbar />
      <div className="grid place-items-center px-4 py-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-3 border border-neutral-800 bg-neutral-900/60 p-6 rounded">
          <h1 className="text-xl font-bold text-center">Forgot password</h1>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {sent ? (
            <p className="text-sm text-neutral-300">If an account exists for {email}, we sent a code to reset your password.</p>
          ) : (
            <>
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm text-neutral-300">Email</label>
                <input id="email" type="email" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
              </div>
              <button disabled={loading} className="w-full rounded bg-brand-600 hover:bg-brand-500 disabled:opacity-60 px-3 py-2 font-semibold">{loading?'Sending…':'Send code'}</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
