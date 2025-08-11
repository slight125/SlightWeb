import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { Section, Card, Product } from '../components/Shared';

export default function Sales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts).catch(console.error);
    fetch('/api/products/db').then(r => r.json()).then(setDbProducts).catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const src = dbProducts.length ? dbProducts : products;
    return src.filter(p => p.name.toLowerCase().includes(q));
  }, [products, dbProducts, query]);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100">
      <Navbar />
      <header className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold">Quality Laptops — New & Refurbished</h1>
        <p className="mt-3 text-neutral-300 max-w-2xl">Thoroughly tested, fairly priced, and ready for work or school. Ask about bulk orders and warranties.</p>
        <div className="mt-6">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search laptops…" className="w-full md:w-1/2 rounded-md bg-neutral-800 border border-neutral-700 px-4 py-2 outline-none focus:border-brand-500" />
        </div>
      </header>
      <Section title="Available Laptops">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <Card key={p.id} title={`${p.name} — $${p.price}`} subtitle={p.condition === 'new' ? 'Brand New' : 'Refurbished'}>
              <ul className="mt-2 text-sm text-neutral-300 list-disc list-inside">
                {p.specs.map(s => (<li key={s}>{s}</li>))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Included with every purchase">
        <ul className="grid md:grid-cols-3 gap-4 text-sm text-neutral-300">
          <li className="rounded border border-neutral-800 p-4">Free basic setup and system updates</li>
          <li className="rounded border border-neutral-800 p-4">30‑day warranty with upgrade options</li>
          <li className="rounded border border-neutral-800 p-4">Charger and clean protective case</li>
        </ul>
      </Section>
    </div>
  );
}
