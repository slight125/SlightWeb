import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export type Service = { id: string; title: string; description: string; category: 'repairs' | 'sales' | 'software' };
export type Product = { id: string | number; name: string; price: number; condition: 'new' | 'refurbished'; specs: string[] };

export const Section: React.FC<{ title: string; children: React.ReactNode; subtitle?: string; className?: string }> = ({ title, subtitle, children, className }) => (
  <section className={`max-w-6xl mx-auto px-4 py-8 ${className ?? ''}`}>
    <h2 className="text-2xl md:text-3xl font-bold text-brand-400 mb-2">{title}</h2>
    {subtitle && <p className="text-neutral-300 mb-4">{subtitle}</p>}
    {children}
  </section>
);

export const Card: React.FC<{ title: string; subtitle?: string; children?: React.ReactNode; className?: string; icon?: React.ReactNode }> = ({ title, subtitle, children, className, icon }) => (
  <div className={`h-full flex flex-col rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 hover:border-brand-500/60 transition-colors ${className ?? ''}`}>
    {icon ? (
      <div className="flex items-start gap-3">
        <div className="text-xl pt-0.5">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-neutral-400 mb-2">{subtitle}</p>}
        </div>
      </div>
    ) : (
      <>
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && <p className="text-sm text-neutral-400 mb-2">{subtitle}</p>}
      </>
    )}
    {/* Content area */}
    <div className="mt-2 flex-1 flex flex-col">
      {children}
    </div>
  </div>
);

export const RepairCard: React.FC<{ id: string; title: string; description: string; image?: string }> = ({ id, title, description, image }) => {
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
  const fallback = 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1200&auto=format&fit=crop';
  return (
    <div className="rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900/60 hover:border-brand-500 transition-colors">
      <div className="relative w-full aspect-[4/3] bg-neutral-800 overflow-hidden">
        <img src={image || fallback} alt={title} className="h-full w-full object-cover hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-neutral-900/80 to-transparent"/>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-neutral-400 mb-3">{description}</p>
        <div className="flex items-center gap-3">
          <button onClick={book} disabled={busy} className="rounded bg-brand-600 hover:bg-brand-500 disabled:opacity-60 px-3 py-1.5 text-sm">{busy? 'Booking…' : user ? 'Book Service' : 'Login to Book'}</button>
          {msg && <span className="text-xs text-neutral-300">{msg}</span>}
        </div>
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
