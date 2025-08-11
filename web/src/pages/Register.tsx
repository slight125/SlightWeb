import React, { useState } from 'react';
import { useAuth } from '../auth';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      await register(firstName, lastName, email, password);
      nav('/login?registered=1');
    } catch (e: any) {
      if (e?.status === 409) setError('Email already registered');
      else if (e?.status === 400) setError('Invalid details');
      else setError(e?.message || 'Register failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <Navbar />
      {/* Page content */}
      <div className="grid place-items-center px-4 py-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-3 border border-neutral-800 bg-neutral-900/60 p-6 rounded">
          <h1 className="text-xl font-bold">Create account</h1>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-1">
              <label htmlFor="firstName" className="text-sm text-neutral-300">First name</label>
              <input id="firstName" name="firstName" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" placeholder="Allan" value={firstName} onChange={e=>setFirstName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label htmlFor="lastName" className="text-sm text-neutral-300">Last name</label>
              <input id="lastName" name="lastName" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" placeholder="Githinji" value={lastName} onChange={e=>setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm text-neutral-300">Email</label>
            <input id="email" name="email" type="email" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm text-neutral-300">Password</label>
            <input id="password" name="password" type="password" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label htmlFor="confirm" className="text-sm text-neutral-300">Confirm password</label>
            <input id="confirm" name="confirm" type="password" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" placeholder="••••••••" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} />
          </div>
          <button disabled={loading} className="w-full rounded bg-brand-600 hover:bg-brand-500 disabled:opacity-60 px-3 py-2 font-semibold">{loading?'Creating…':'Create account'}</button>
          <p className="text-sm text-neutral-400">Have an account? <Link className="text-brand-400" to="/login">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
}
