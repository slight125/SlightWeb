import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { Section, Card, Product } from '../components/Shared';
import { FaPlug, FaKeyboard, FaMouse, FaHeadphones, FaBatteryThreeQuarters, FaUsb, FaWifi, FaTv, FaLightbulb, FaBluetooth, FaMobileAlt, FaStar, FaTools, FaShieldAlt, FaSync } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Sales() {
  // Client-side seed fallback when API is unavailable
  const clientSeed = [
    { id: 'seed-1', name: 'Ultrabook X1', price: 1299, condition: 'new', specs: ['13.3" OLED','16GB RAM','512GB SSD'] },
    { id: 'seed-2', name: 'ProBook R5 (Refurb)', price: 699, condition: 'refurbished', specs: ['15.6" IPS','16GB RAM','256GB SSD'] }
  ];
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'newest'|'price_asc'|'price_desc'>('newest');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [usingFallback, setUsingFallback] = useState(false);
  const [fallbackAll, setFallbackAll] = useState<any[] | null>(null);
  const pageSize = 12;

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    params.set('category', 'laptop');
    params.set('sort', sort);
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    fetch(`/api/products/search?${params.toString()}`, { signal: controller.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`search ${r.status}`);
        return r.json();
      })
      .then(async (data) => {
        const serverItems = Array.isArray(data?.items) ? data.items : [];
        const serverTotal = Number(data?.total || 0);
        if (serverItems.length > 0 || serverTotal > 0) {
          setUsingFallback(false);
          setFallbackAll(null);
          setItems(serverItems);
          setTotal(serverTotal);
          return;
        }
        // Fallback: no DB configured or empty result — use seed products
        let all: any[] = [];
        try {
          const r2 = await fetch('/api/products', { signal: controller.signal });
          all = r2.ok ? await r2.json() : [];
        } catch {}
        if (!Array.isArray(all) || all.length === 0) {
          all = clientSeed;
        }
        setUsingFallback(true);
        setFallbackAll(all);
        setTotal(all.length);
        // Apply client-side sorting and pagination for fallback
        const sorted = [...all].sort((a, b) => {
          if (sort === 'price_asc') return Number(a.price) - Number(b.price);
          if (sort === 'price_desc') return Number(b.price) - Number(a.price);
          return 0; // 'newest' — keep seed order
        });
        const offset = (page - 1) * pageSize;
        setItems(sorted.slice(offset, offset + pageSize));
      })
      .catch(async (e) => {
        if (e?.name === 'AbortError') return;
        // On any error, fallback to seed products endpoint
        try {
          let all: any[] = [];
          try {
            const r2 = await fetch('/api/products', { signal: controller.signal });
            all = r2.ok ? await r2.json() : [];
          } catch {}
          if (!Array.isArray(all) || all.length === 0) all = clientSeed;
          setUsingFallback(true);
          setFallbackAll(all);
          setTotal(all.length);
          const sorted = [...all].sort((a, b) => {
            if (sort === 'price_asc') return Number(a.price) - Number(b.price);
            if (sort === 'price_desc') return Number(b.price) - Number(a.price);
            return 0;
          });
          const offset = (page - 1) * pageSize;
          setItems(sorted.slice(offset, offset + pageSize));
        } catch (err) {
          console.error('products fallback failed', err);
        }
      });
    return () => controller.abort();
  }, [sort, page]);

  // Recompute slice on sort/page when using fallback
  useEffect(() => {
    if (!usingFallback || !fallbackAll) return;
    const sorted = [...fallbackAll].sort((a, b) => {
      if (sort === 'price_asc') return Number(a.price) - Number(b.price);
      if (sort === 'price_desc') return Number(b.price) - Number(a.price);
      return 0;
    });
    const offset = (page - 1) * pageSize;
    setItems(sorted.slice(offset, offset + pageSize));
  }, [usingFallback, fallbackAll, sort, page]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(p => p.name.toLowerCase().includes(q));
  }, [items, query]);

  // Reset to first page when search query changes for better UX
  useEffect(() => { setPage(1); }, [query]);

  // Helpers
  const productImage = (name: string) => {
    const n = name.toLowerCase();
    if (/(macbook|apple)/.test(n)) return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop';
    if (/dell/.test(n)) return 'https://images.unsplash.com/photo-1527443224154-c4e054f7fd41?q=80&w=1600&auto=format&fit=crop';
    if (/(hp|hewlett)/.test(n)) return 'https://images.unsplash.com/photo-1559163499-413811fb2344?q=80&w=1600&auto=format&fit=crop';
    if (/lenovo/.test(n)) return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1600&auto=format&fit=crop';
    if (/asus/.test(n)) return 'https://images.unsplash.com/photo-1537498425277-c283d32ef9db?q=80&w=1600&auto=format&fit=crop';
    if (/acer/.test(n)) return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop';
  return 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop';
  };

  const formatKES = (amount: number) => `KSh ${amount.toLocaleString('en-KE')}`;
  const hash = (s: string) => s.split('').reduce((a,c)=> ((a<<5)-a) + c.charCodeAt(0) | 0, 0);
  const ratingFor = (name: string) => {
    const h = Math.abs(hash(name));
    const stars = 4 + (h % 10) / 10; // 4.0 - 4.9
    const count = 80 + (h % 600); // 80 - 679
    return { stars: Math.round(stars * 10) / 10, count };
  };

  // Animations
  const list = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100">
      <Navbar />
      {/* Accessories quick access at top */}
      <Section title="Accessories & Spare Parts" subtitle="Phone accessories, laptop accessories, and common spares — we’ve got you.">
        <div id="accessories" className="scroll-mt-24 md:scroll-mt-28 grid md:grid-cols-3 gap-4">
          <div className="relative group">
            <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-brand-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
            <Card title="Power & Charging" subtitle="Chargers, adapters, cables" className="relative hover:border-brand-500/60">
            <ul className="mt-2 text-sm text-neutral-300 space-y-1">
              <li>
                <Link to="/accessories?cat=power" className="flex items-center gap-2 hover:text-brand-300">
                  <FaPlug className="text-brand-400"/> Laptop/phone chargers, power cables
                </Link>
              </li>
              <li>
                <Link to="/accessories?cat=power" className="flex items-center gap-2 hover:text-brand-300">
                  <FaUsb className="text-brand-400"/> Adapters, OTG, extensions
                </Link>
              </li>
              <li>
                <Link to="/accessories?cat=power" className="flex items-center gap-2 hover:text-brand-300">
                  <FaBatteryThreeQuarters className="text-brand-400"/> Remote batteries, TV/Fridge guards
                </Link>
              </li>
            </ul>
            </Card>
          </div>
          <div className="relative group">
            <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
            <Card title="PC & Desk" subtitle="Keyboards, mice, stands, cleaners" className="relative hover:border-cyan-500/60">
            <ul className="mt-2 text-sm text-neutral-300 space-y-1">
              <li>
                <Link to="/accessories?cat=pc" className="flex items-center gap-2 hover:text-brand-300">
                  <FaKeyboard className="text-brand-400"/> Keyboards (wired & wireless)
                </Link>
              </li>
              <li>
                <Link to="/accessories?cat=pc" className="flex items-center gap-2 hover:text-brand-300">
                  <FaMouse className="text-brand-400"/> Mouse (wired & wireless)
                </Link>
              </li>
              <li>
                <Link to="/accessories?cat=pc" className="flex items-center gap-2 hover:text-brand-300">
                  <FaTv className="text-brand-400"/> HDMI, VGA cables; laptop stands
                </Link>
              </li>
              <li>
                <Link to="/accessories?cat=pc" className="flex items-center gap-2 hover:text-brand-300">
                  <FaLightbulb className="text-brand-400"/> Foam cleaners, bulbs, snake lights, heaters
                </Link>
              </li>
            </ul>
            </Card>
          </div>
          <div className="relative group">
            <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
            <Card title="Audio & Mobile" subtitle="Earphones and protection" className="relative hover:border-emerald-500/60">
            <ul className="mt-2 text-sm text-neutral-300 space-y-1">
              <li>
                <Link to="/accessories?cat=audio" className="flex items-center gap-2 hover:text-brand-300">
                  <FaHeadphones className="text-brand-400"/> Earphones, earpods, neckbands
                </Link>
              </li>
              <li>
                <Link to="/accessories?cat=audio" className="flex items-center gap-2 hover:text-brand-300">
                  <FaBluetooth className="text-brand-400"/> Bluetooth speakers
                </Link>
              </li>
              <li>
                <Link to="/accessories?cat=audio" className="flex items-center gap-2 hover:text-brand-300">
                  <FaMobileAlt className="text-brand-400"/> Screen protectors, phone covers
                </Link>
              </li>
              <li>
                <Link to="/accessories?cat=audio" className="flex items-center gap-2 hover:text-brand-300">
                  <FaUsb className="text-brand-400"/> Flash disks
                </Link>
              </li>
            </ul>
            </Card>
          </div>
        </div>
        <p className="mt-4 text-neutral-300 text-sm">Looking for something else? Contact us and we’ll source it for you.</p>
      </Section>
      <header className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold">Quality Laptops — New & Refurbished</h1>
        <p className="mt-3 text-neutral-300 max-w-2xl">Thoroughly tested, fairly priced, and ready for work or school. Ask about bulk orders and warranties.</p>
        <div className="mt-6 grid gap-3 md:grid-cols-2 items-center">
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search laptops…" className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-4 py-2 outline-none focus:border-brand-500" />
          <div className="flex items-center gap-2 justify-start md:justify-end">
            <label className="text-sm text-neutral-300">Sort</label>
            <select className="rounded bg-neutral-800 border border-neutral-700 px-2 py-1 text-sm" value={sort} onChange={e=>{ setSort(e.target.value as any); setPage(1); }}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
            </select>
          </div>
        </div>
  {/* Removed Shop Accessories button as requested */}
      </header>
      <Section title="Available Laptops">
        {usingFallback && (
          <p className="-mt-3 mb-3 text-xs text-neutral-400">Showing sample laptops while the database is offline.</p>
        )}
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-6 text-neutral-300">No laptops found. Try clearing the search or adjusting sort.</div>
        ) : (
        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={list}>
          {filtered.map(p => {
            const img = (p as any).image_url || productImage(p.name);
            const { stars, count } = ratingFor(p.name);
            const brandOfficial = /(dell|hp|lenovo|asus|acer|apple|macbook)/i.test(p.name);
            return (
              <motion.div variants={item} key={p.id} className="rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900/60 hover:border-brand-500 transition-colors hover:shadow-xl hover:shadow-black/20 will-change-transform">
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-800">
                  <img src={img} alt={`${p.name} photo`} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-3">
                  <h3 className="min-h-[3.25rem] text-[0.95rem] font-medium line-clamp-2">{p.name}</h3>
                  <div className="mt-1 text-brand-400 font-semibold">{formatKES(Number(p.price))}</div>
                  <div className="mt-1 flex items-center gap-1 text-amber-400">
                    {Array.from({length:5}).map((_,i)=> (
                      <FaStar key={i} className={i < Math.floor(stars) ? 'fill-current' : 'opacity-30'} />
                    ))}
                    <span className="ml-2 text-xs text-neutral-400">({count})</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {brandOfficial && <span className="badge badge-sm border-0 bg-brand-600/20 text-brand-300">Brand Official</span>}
                    <span className="badge badge-sm border-0 bg-neutral-800 text-neutral-300">{p.condition === 'new' ? 'New' : 'Refurb'}</span>
                    <span className="badge badge-sm border-0 bg-cyan-600/20 text-cyan-300">Fulfilled by Slight Tech</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        )}
      </Section>
      {total > pageSize && (
        <div className="max-w-6xl mx-auto px-4 -mt-4 mb-6 flex items-center justify-between text-sm">
          <button className="btn btn-sm btn-outline border-neutral-700 text-neutral-200 disabled:opacity-50" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Previous</button>
          <span className="text-neutral-400">Page {page} of {Math.ceil(total/pageSize)}</span>
          <button className="btn btn-sm btn-outline border-neutral-700 text-neutral-200 disabled:opacity-50" disabled={page>=Math.ceil(total/pageSize)} onClick={()=>setPage(p=>p+1)}>Next</button>
        </div>
      )}
      <Section title="Included with every purchase" className="py-6">
        <ul className="grid md:grid-cols-3 gap-4 text-sm">
          <li className="group rounded-xl border border-brand-700/40 bg-neutral-900/60 p-4 hover:border-brand-500/60 transition-colors">
            <div className="flex items-start gap-3">
              <span className="inline-grid place-items-center w-9 h-9 rounded-lg bg-brand-600/15 text-brand-300 ring-1 ring-brand-500/20"><FaTools /></span>
              <div>
                <div className="text-neutral-200 font-medium">Free basic setup and system updates</div>
                <div className="text-neutral-400">We install essentials and optimize settings for you.</div>
              </div>
            </div>
          </li>
          <li className="group rounded-xl border border-amber-700/40 bg-neutral-900/60 p-4 hover:border-amber-500/60 transition-colors">
            <div className="flex items-start gap-3">
              <span className="inline-grid place-items-center w-9 h-9 rounded-lg bg-amber-600/15 text-amber-300 ring-1 ring-amber-500/20"><FaShieldAlt /></span>
              <div>
                <div className="text-neutral-200 font-medium">30‑day warranty with upgrade options</div>
                <div className="text-neutral-400">Extended coverage available at checkout.</div>
              </div>
            </div>
          </li>
          <li className="group rounded-xl border border-emerald-700/40 bg-neutral-900/60 p-4 hover:border-emerald-500/60 transition-colors">
            <div className="flex items-start gap-3">
              <span className="inline-grid place-items-center w-9 h-9 rounded-lg bg-emerald-600/15 text-emerald-300 ring-1 ring-emerald-500/20"><FaPlug /></span>
              <div>
                <div className="text-neutral-200 font-medium">Charger and clean protective case</div>
                <div className="text-neutral-400">Cables inspected; we include a fresh clean.</div>
              </div>
            </div>
          </li>
        </ul>
        <div className="mt-3 text-xs text-neutral-400 flex items-center gap-2"><FaSync className="opacity-80"/> Need help migrating data? We can assist with transfers.</div>
      </Section>
    </div>
  );
}
