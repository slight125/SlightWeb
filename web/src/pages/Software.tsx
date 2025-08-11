import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { Section, Card, Service } from '../components/Shared';

export default function Software() {
  const [services, setServices] = useState<Service[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then(setServices).catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return services
      .filter(s => s.category === 'software')
      .filter(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }, [services, query]);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100">
      <Navbar />
      <header className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold">Custom Software & Websites</h1>
        <p className="mt-3 text-neutral-300 max-w-2xl">From fast landing pages to full‑stack business apps. We build, host, and maintain so you can focus on growth.</p>
        <div className="mt-6">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search services…" className="w-full md:w-1/2 rounded-md bg-neutral-800 border border-neutral-700 px-4 py-2 outline-none focus:border-brand-500" />
        </div>
      </header>
      <Section title="What we offer">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => (
            <Card key={s.id} title={s.title} subtitle={s.description} />
          ))}
        </div>
      </Section>
      <Section title="Our stack">
        <div className="grid md:grid-cols-3 gap-4 text-sm text-neutral-300">
          <div className="rounded border border-neutral-800 p-4">React, Vite, TailwindCSS</div>
          <div className="rounded border border-neutral-800 p-4">Node.js, Express, PostgreSQL</div>
          <div className="rounded border border-neutral-800 p-4">CI/CD, Monitoring, SEO best practices</div>
        </div>
      </Section>
    </div>
  );
}
