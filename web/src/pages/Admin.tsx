import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { Link, useNavigate } from 'react-router-dom';

export default function Admin() {
  const { user, token, logout } = useAuth();
  const nav = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', price: '', condition: 'new', specs: '', imageUrl: '', category: 'laptop' });

  useEffect(() => {
    if (!token) return;
    fetch('/api/admin/products', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setItems).catch(console.error);
  }, [token]);

  if (!user || user.role !== 'admin') return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100 grid place-items-center px-4">
      <div className="text-center">
        <p className="mb-4">Admins only.</p>
        <Link className="text-brand-400" to="/">Go Home</Link>
      </div>
    </div>
  );

  const createItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      price: Number(form.price),
      condition: form.condition as 'new' | 'refurbished',
      specs: form.specs.split(',').map(s => s.trim()).filter(Boolean),
  imageUrl: form.imageUrl || undefined,
  category: (form.category as 'laptop'|'accessory')
    };
    const res = await fetch('/api/admin/products', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
  const created = await res.json();
  setItems(prev => [created, ...prev]);
  setForm({ name: '', price: '', condition: 'new', specs: '', imageUrl: '', category: 'laptop' });
    }
  };

  const remove = async (id: number) => {
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setItems(prev => prev.filter(p => p.id !== id));
  };

  const update = async (id: number, patch: any) => {
    const res = await fetch(`/api/admin/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(patch) });
    if (res.ok) {
      const upd = await res.json();
      setItems(prev => prev.map(p => p.id === id ? upd : p));
    }
  };

  // Cloudinary Upload Widget
  const openUpload = (onDone: (url: string)=>void) => {
    const w: any = (window as any);
    if (!w.cloudinary) {
      alert('Cloudinary script not loaded');
      return;
    }
    const widget = w.cloudinary.createUploadWidget({
      cloudName: 'dtm601o6j',
      uploadPreset: 'Slight Tech Web',
      multiple: false,
      sources: ['local','camera','url'],
      maxFileSize: 5_000_000
    }, (error: any, result: any) => {
      if (!error && result && result.event === 'success') {
        onDone(result.info.secure_url);
      }
    });
    widget.open();
  };

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100 px-4 py-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="space-x-3">
          <Link className="text-sm text-brand-400" to="/dashboard">My Dashboard</Link>
          <button className="text-sm text-neutral-300" onClick={() => { logout(); nav('/'); }}>Logout</button>
        </div>
      </div>
      <form onSubmit={createItem} className="mt-6 grid md:grid-cols-7 gap-2">
        <input className="rounded bg-neutral-800 border border-neutral-700 px-3 py-2" placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
        <input className="rounded bg-neutral-800 border border-neutral-700 px-3 py-2" placeholder="Price" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} />
  <select aria-label="Condition" className="rounded bg-neutral-800 border border-neutral-700 px-3 py-2" value={form.condition} onChange={e=>setForm(f=>({...f,condition:e.target.value}))}>
          <option value="new">new</option>
          <option value="refurbished">refurbished</option>
        </select>
        <select aria-label="Category" className="rounded bg-neutral-800 border border-neutral-700 px-3 py-2" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
          <option value="laptop">laptop</option>
          <option value="accessory">accessory</option>
        </select>
        <input className="rounded bg-neutral-800 border border-neutral-700 px-3 py-2" placeholder="Specs (comma-separated)" value={form.specs} onChange={e=>setForm(f=>({...f,specs:e.target.value}))} />
        <div className="flex items-center gap-2">
          <button type="button" className="rounded bg-neutral-800 border border-neutral-700 px-3 py-2" onClick={()=>openUpload((url)=>setForm(f=>({...f,imageUrl:url})))}>Upload Image</button>
          {form.imageUrl && <span className="text-xs text-neutral-400 truncate max-w-[10rem]">{form.imageUrl}</span>}
        </div>
        <button className="rounded bg-brand-600 hover:bg-brand-500 px-3 py-2">Add</button>
      </form>
      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(p => (
          <div key={p.id} className="rounded border border-neutral-800 bg-neutral-900/60 p-3 space-y-2">
            {p.image_url && (
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-md border border-neutral-800">
                <img src={p.image_url} alt="Product" className="h-full w-full object-cover" />
              </div>
            )}
            <input aria-label="Product name" placeholder="Product name" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-1.5" value={p.name} onChange={e=>setItems(prev=>prev.map(x=>x.id===p.id?{...x,name:e.target.value}:x))} />
            <div className="grid grid-cols-3 gap-2 text-sm items-center">
              <input aria-label="Price" placeholder="Price" className="rounded bg-neutral-800 border border-neutral-700 px-3 py-1.5" value={p.price} onChange={e=>setItems(prev=>prev.map(x=>x.id===p.id?{...x,price:e.target.value}:x))} />
              <select aria-label="Condition" className="rounded bg-neutral-800 border border-neutral-700 px-3 py-1.5" value={p.condition} onChange={e=>setItems(prev=>prev.map(x=>x.id===p.id?{...x,condition:e.target.value}:x))}>
                <option value="new">new</option>
                <option value="refurbished">refurbished</option>
              </select>
              <input aria-label="Specs" placeholder="Specs (comma-separated)" className="rounded bg-neutral-800 border border-neutral-700 px-3 py-1.5" value={(p.specs||[]).join(', ')} onChange={e=>setItems(prev=>prev.map(x=>x.id===p.id?{...x,specs:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}:x))} />
            </div>
            <div className="text-xs text-neutral-400">Category: <span className="badge badge-sm border-0 bg-neutral-800 text-neutral-300">{p.category || 'laptop'}</span></div>
            <div className="flex items-center gap-2">
              <button type="button" className="text-sm text-neutral-300 underline" onClick={()=>openUpload((url)=>update(p.id,{ imageUrl: url }))}>Change Image</button>
              {p.image_url && <a href={p.image_url} target="_blank" rel="noreferrer" className="text-xs text-neutral-400">View</a>}
            </div>
            <div className="flex gap-3 text-sm">
              <button className="text-brand-400" onClick={()=>update(p.id, { name: p.name, price: Number(p.price), condition: p.condition, specs: p.specs, category: p.category || 'laptop' })}>Save</button>
              <button className="text-red-400" onClick={()=>remove(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
