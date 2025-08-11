import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { Section, RepairCard, Service } from '../components/Shared';

export default function Repairs() {
  const [services, setServices] = useState<Service[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/api/services').then(r => r.json()).then(setServices).catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return services
      .filter(s => s.category === 'repairs')
      .filter(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }, [services, query]);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100">
      <Navbar />
      <header className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold">Trusted Phone & Laptop Repairs</h1>
        <p className="mt-3 text-neutral-300 max-w-2xl">Same‑day fixes for cracked screens, batteries, water damage, keyboards, and more. High‑quality parts, 90‑day warranty.</p>
        <div className="mt-6">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search repairs…" className="w-full md:w-1/2 rounded-md bg-neutral-800 border border-neutral-700 px-4 py-2 outline-none focus:border-brand-500" />
        </div>
      </header>
      <Section title="Repair Services">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => (
            <RepairCard key={s.id} id={s.id} title={s.title} description={s.description} />
          ))}
        </div>
      </Section>
      <Section title="Why choose us?" subtitle="We keep your devices working so you can keep moving.">
        <ul className="grid md:grid-cols-3 gap-4 text-sm text-neutral-300">
          <li className="rounded border border-neutral-800 p-4">Genuine or premium‑grade parts only</li>
          <li className="rounded border border-neutral-800 p-4">Most repairs done under 2 hours</li>
          <li className="rounded border border-neutral-800 p-4">Transparent pricing before we start</li>
        </ul>
      </Section>
    </div>
  );
}
