import React, { useMemo, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Section } from '../components/Shared';
import { Link, useLocation, useNavigate } from 'react-router-dom';

type CategoryKey = 'power' | 'pc' | 'audio';

type Accessory = {
  id: string | number;
  name: string;
  price: number;
  image_url?: string;
  category: 'laptop' | 'accessory' | CategoryKey;
};

const formatKES = (amount: number) => `KSh ${amount.toLocaleString('en-KE')}`;

// If DB is empty, we could show nothing or seed via Admin; no local seed here to avoid confusion

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  power: 'Power & Charging',
  pc: 'PC & Desk',
  audio: 'Audio & Mobile',
};

export default function Accessories() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialCat = (params.get('cat') as CategoryKey) || undefined;
  const initialSort = (params.get('sort') as 'newest'|'price_asc'|'price_desc') || 'newest';
  const initialPage = Number(params.get('page') || '1');

  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<CategoryKey | undefined>(initialCat);
  const [sort, setSort] = useState<'newest'|'price_asc'|'price_desc'>(initialSort);
  const [page, setPage] = useState<number>(Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1);
  const [items, setItems] = useState<Accessory[]>([]);
  const [total, setTotal] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    // keep URL in sync
    const next = new URLSearchParams();
    if (cat) next.set('cat', cat);
    if (sort && sort !== 'newest') next.set('sort', sort);
    if (page && page !== 1) next.set('page', String(page));
    navigate({ pathname: '/accessories', search: next.toString() }, { replace: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat, sort, page]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    params.set('category', 'accessory');
    params.set('sort', sort);
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    fetch(`/api/products/search?${params.toString()}`, { signal: controller.signal })
      .then(r => r.json())
      .then((data) => {
        setItems(data.items || []);
        setTotal(data.total || 0);
      }).catch((e) => { if (e?.name !== 'AbortError') console.error(e); });
    return () => controller.abort();
  }, [sort, page]);

  const visible = useMemo(() => {
    const q = query.toLowerCase();
    const mapped = items.map(i => ({
      ...i,
      // temporary mapping to show legacy category chips based on query filter from Sales
      _chip: cat === 'power' ? 'Power & Charging' : cat === 'pc' ? 'PC & Desk' : cat === 'audio' ? 'Audio & Mobile' : undefined
    }));
    return mapped.filter(i => (!q || i.name.toLowerCase().includes(q)));
  }, [items, query, cat]);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100">
      <Navbar />
      <header className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold">Accessories & Spare Parts</h1>
        <p className="mt-2 text-neutral-300">Find chargers, adapters, PC peripherals, earphones, and more.</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {(Object.keys(CATEGORY_LABELS) as CategoryKey[]).map(key => (
            <button
              key={key}
              onClick={() => setCat(prev => prev === key ? undefined : key)}
              className={`btn btn-sm ${cat === key ? 'bg-brand-600 border-brand-600 text-white' : 'btn-outline border-neutral-700 text-neutral-200'}`}
            >
              {CATEGORY_LABELS[key]}
            </button>
          ))}
          <button
            onClick={() => setCat(undefined)}
            className="btn btn-sm btn-ghost text-neutral-300"
          >
            Clear
          </button>
        </div>
        <div className="mt-4">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search accessories…"
            className="w-full md:w-1/2 rounded-md bg-neutral-800 border border-neutral-700 px-4 py-2 outline-none focus:border-brand-500"
          />
        </div>
      </header>

      <Section title="Available Items">
        <div className="mb-3 flex items-center gap-2">
          <label className="text-sm text-neutral-300">Sort</label>
          <select className="rounded bg-neutral-800 border border-neutral-700 px-2 py-1 text-sm" value={sort} onChange={e=>{ setSort(e.target.value as any); setPage(1); }}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>
        {visible.length === 0 ? (
          <p className="text-neutral-400">No items match your filters.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map(item => (
              <div key={item.id} className="rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900/60 hover:border-brand-500 transition-colors">
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-800">
                  <img src={item.image_url || 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop'} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-3">
                  <h3 className="min-h-[2.6rem] text-[0.95rem] font-medium line-clamp-2">{item.name}</h3>
                  <div className="mt-1 text-brand-400 font-semibold">{formatKES(item.price)}</div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
                    {cat && <span className="badge badge-sm border-0 bg-neutral-800 text-neutral-300">{CATEGORY_LABELS[cat]}</span>}
                    <Link to="/sales#accessories" className="text-brand-300 hover:underline">See categories</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {total > pageSize && (
          <div className="mt-6 flex items-center justify-between text-sm">
            <button className="btn btn-sm btn-outline border-neutral-700 text-neutral-200 disabled:opacity-50" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Previous</button>
            <span className="text-neutral-400">Page {page} of {Math.ceil(total/pageSize)}</span>
            <button className="btn btn-sm btn-outline border-neutral-700 text-neutral-200 disabled:opacity-50" disabled={page>=Math.ceil(total/pageSize)} onClick={()=>setPage(p=>p+1)}>Next</button>
          </div>
        )}
      </Section>
    </div>
  );
}
