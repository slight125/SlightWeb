import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export type Service = { id: string; title: string; description: string; category: 'repairs' | 'sales' | 'software' };
export type Product = { id: string | number; name: string; price: number; condition: 'new' | 'refurbished'; specs: string[] };

export const Section: React.FC<{ title: string; children: React.ReactNode; subtitle?: string }> = ({ title, subtitle, children }) => (
  <section className="max-w-6xl mx-auto px-4 py-8">
    <h2 className="text-2xl md:text-3xl font-bold text-brand-400 mb-2">{title}</h2>
    {subtitle && <p className="text-neutral-300 mb-4">{subtitle}</p>}
    {children}
  </section>
);

export const Card: React.FC<{ title: string; subtitle?: string; children?: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 hover:border-brand-500 transition-colors">
    <h3 className="text-lg font-semibold">{title}</h3>
    {subtitle && <p className="text-sm text-neutral-400 mb-2">{subtitle}</p>}
    {children}
  </div>
);

export const RepairCard: React.FC<{ id: string; title: string; description: string }> = ({ id, title, description }) => {
  const { user, token } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const book = async () => {
    if (!user) return nav('/login');
    setBusy(true); setMsg(null);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ serviceId: id })
      });
      if (!res.ok) throw new Error('Booking failed');
      setMsg('Appointment requested!');
    } catch (e: any) {
      setMsg(e?.message || 'Booking failed');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 hover:border-brand-500 transition-colors">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-neutral-400 mb-2">{description}</p>
      <div className="flex items-center gap-3">
        <button onClick={book} disabled={busy} className="rounded bg-brand-600 hover:bg-brand-500 disabled:opacity-60 px-3 py-1.5 text-sm">{busy? 'Booking…' : user ? 'Book Service' : 'Login to Book'}</button>
        {msg && <span className="text-xs text-neutral-300">{msg}</span>}
      </div>
    </div>
  );
};

export const QuoteForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to send');
      }
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <form className="space-y-3" onSubmit={submit}>
      <input
        className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-4 py-2"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="email"
        className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-4 py-2"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <textarea
        className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-4 py-2"
        placeholder="What do you need?"
        rows={4}
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
      />
      <div className="flex items-center gap-3">
        <button disabled={status === 'sending'} type="submit" className="rounded-md bg-brand-600 hover:bg-brand-500 disabled:opacity-60 px-4 py-2 font-medium">
          {status === 'sending' ? 'Sending…' : 'Send'}
        </button>
        {status === 'success' && <span className="text-sm text-green-400">Sent! We'll get back soon.</span>}
        {status === 'error' && <span className="text-sm text-red-400">{error}</span>}
      </div>
    </form>
  );
};
