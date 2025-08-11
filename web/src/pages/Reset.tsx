import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';

export default function Reset() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const res = await fetch('/api/auth/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp, newPassword }) });
      if (!res.ok) throw new Error(await res.text());
      setOk(true);
      setTimeout(()=> nav('/login'), 1200);
    } catch (e) { setError('Reset failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <Navbar />
      <div className="grid place-items-center px-4 py-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-3 border border-neutral-800 bg-neutral-900/60 p-6 rounded">
          <h1 className="text-xl font-bold text-center">Reset password</h1>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {ok && <div className="text-green-400 text-sm">Password updated. Redirecting…</div>}
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm text-neutral-300">Email</label>
            <input id="email" type="email" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label htmlFor="otp" className="text-sm text-neutral-300">Code</label>
            <input id="otp" type="text" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" placeholder="6-digit code" value={otp} onChange={e=>setOtp(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm text-neutral-300">New password</label>
            <input id="password" type="password" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" placeholder="••••••••" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
          </div>
          <button disabled={loading} className="w-full rounded bg-brand-600 hover:bg-brand-500 disabled:opacity-60 px-3 py-2 font-semibold">{loading?'Updating…':'Update password'}</button>
          <p className="text-sm text-neutral-400">Didn’t get a code? <Link className="text-brand-400" to="/forgot">Request a new one</Link></p>
        </form>
      </div>
    </div>
  );
}
