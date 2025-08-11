import React, { useState } from 'react';
import { useAuth } from '../auth';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await login(email, password);
      nav('/dashboard');
    } catch (e: any) {
      const msg = e?.message || '';
      if (e?.status === 404) setError('Email not found');
      else if (e?.status === 401) setError('Incorrect password');
      else setError(msg || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <Navbar />
      <div className="grid place-items-center px-4 py-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-3 border border-neutral-800 bg-neutral-900/60 p-6 rounded">
          <h1 className="text-xl font-bold text-center">Sign in</h1>
  {sp.get('registered') && <div className="text-green-400 text-sm">Account created. Please sign in.</div>}
  {error && <div className="text-red-400 text-sm">{error}</div>}
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm text-neutral-300">Email</label>
            <input id="email" name="email" type="email" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm text-neutral-300">Password</label>
            <input id="password" name="password" type="password" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
        <button disabled={loading} className="w-full rounded bg-brand-600 hover:bg-brand-500 disabled:opacity-60 px-3 py-2 font-semibold">{loading?'Signing in…':'Sign in'}</button>
        <div className="flex items-center justify-between text-sm text-neutral-400">
          <p>No account? <Link className="text-brand-400" to="/register">Register</Link></p>
          <Link className="text-brand-400" to="/forgot">Forgot password?</Link>
        </div>
      </form>
      </div>
    </div>
  );
}
