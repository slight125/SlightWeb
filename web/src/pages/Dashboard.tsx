import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, token, logout, update } = useAuth();
  const nav = useNavigate();
  const [appts, setAppts] = useState<any[]>([]);
  const [active, setActive] = useState<'overview'|'appointments'|'repairs'|'sales'|'software'|'account'|'quotes'|'book'>('overview');
  const [me, setMe] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const [meMsg, setMeMsg] = useState<string | null>(null);
  const [services, setServices] = useState<Array<{ id: string; title: string }>>([]);
  const [booking, setBooking] = useState<{ serviceId: string; notes: string; date: string; time: string }>({ serviceId: '', notes: '', date: '', time: '' });
  const [bookingMsg, setBookingMsg] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Array<{ id: number; name: string; email: string; message: string; created_at: string }>>([]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/appointments/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setAppts).catch(console.error);
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then((d) => setMe({ firstName: d.firstName, lastName: d.lastName, email: d.email })).catch(() => {});
  fetch('/api/services').then(r=>r.json()).then((rows)=> setServices(rows.map((s:any)=>({ id:s.id, title:s.title })))).catch(()=>{});
  fetch('/api/quotes/my', { headers: { Authorization: `Bearer ${token}` } }).then(r=>r.json()).then(setQuotes).catch(()=>{});
  }, [token]);

  if (!user) return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100 grid place-items-center px-4">
      <div className="text-center">
        <p className="mb-4">You need to sign in to view your dashboard.</p>
        <Link className="text-brand-400" to="/login">Go to Login</Link>
      </div>
    </div>
  );

  const SidebarLink = ({ id, label }: { id: typeof active; label: string }) => (
    <button onClick={() => setActive(id)} className={`w-full text-left px-3 py-2 rounded hover:bg-neutral-800 ${active===id?'bg-neutral-800 text-white':'text-neutral-300'}`}>{label}</button>
  );

  const Overview = useMemo(() => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="text-sm text-neutral-400">Upcoming</div>
          <div className="text-2xl font-bold">{appts.length}</div>
        </div>
        <div className="rounded border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="text-sm text-neutral-400">Repairs</div>
          <div className="text-2xl font-bold">Book</div>
        </div>
        <div className="rounded border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="text-sm text-neutral-400">Sales</div>
          <div className="text-2xl font-bold">Browse</div>
        </div>
      </div>
      <div className="rounded border border-neutral-800 bg-neutral-900/60 p-4">
        <h3 className="font-semibold mb-2">Quick actions</h3>
        <div className="flex flex-wrap gap-2">
          <Link to="/repairs" className="px-3 py-2 rounded bg-brand-600 hover:bg-brand-500">Book a repair</Link>
          <Link to="/sales" className="px-3 py-2 rounded bg-neutral-800 border border-neutral-700">Shop laptops</Link>
          <Link to="/software" className="px-3 py-2 rounded bg-neutral-800 border border-neutral-700">Request software help</Link>
          <Link to="/contact" className="px-3 py-2 rounded bg-neutral-800 border border-neutral-700">Contact us</Link>
        </div>
      </div>
    </div>
  ), [appts.length]);

  const Appointments = (
    <div>
      <h2 className="text-xl font-semibold mb-2">My Appointments</h2>
      <ul className="space-y-2">
        {appts.map(a => (
          <li key={a.id} className="rounded border border-neutral-800 bg-neutral-900/60 p-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm">Service: {a.service_id}</div>
              <div className="text-sm">Date: {a.date || 'N/A'}</div>
              <div className="text-sm">Time: {a.time || 'N/A'}</div>
              <div className="text-sm text-neutral-400">Status: {a.status}</div>
            </div>
            {a.status !== 'canceled' && (
              <button className="text-sm text-red-300 hover:text-red-200" onClick={async()=>{
                const res = await fetch(`/api/appointments/${a.id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } });
                if (res.ok) setAppts(list => list.map(x => x.id===a.id? { ...x, status:'canceled' } : x));
              }}>Cancel</button>
            )}
          </li>
        ))}
        {!appts.length && <li className="text-neutral-400">No appointments yet.</li>}
      </ul>
    </div>
  );

  const Account = (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Account</h2>
      <div className="rounded border border-neutral-800 bg-neutral-900/60 p-4">
        <div className="text-sm text-neutral-400">Name</div>
        <div className="font-medium">{user.name}</div>
      </div>
      <div className="rounded border border-neutral-800 bg-neutral-900/60 p-4">
        <div className="text-sm text-neutral-400">Email</div>
        <div className="font-medium">{user.email}</div>
      </div>
      <div className="rounded border border-neutral-800 bg-neutral-900/60 p-4">
        <h3 className="font-semibold mb-2">Edit Profile</h3>
        {meMsg && <div className="text-sm mb-2 text-green-400">{meMsg}</div>}
        <form
          onSubmit={async (e)=>{
            e.preventDefault(); setMeMsg(null);
            if (!me) return;
            const res = await fetch('/api/auth/me', { method:'PUT', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` }, body: JSON.stringify(me) });
            if (res.ok) { const data = await res.json(); update(data.user, data.token); setMe({ firstName: data.user.name.split(' ')[0] || '', lastName: data.user.name.split(' ').slice(1).join(' ') || '', email: data.user.email }); setMeMsg('Profile updated'); }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <div>
            <label htmlFor="me_first" className="text-sm text-neutral-400">First name</label>
            <input id="me_first" placeholder="First name" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" value={me?.firstName||''} onChange={e=>setMe(m=>m?{...m, firstName:e.target.value}:m)} />
          </div>
          <div>
            <label htmlFor="me_last" className="text-sm text-neutral-400">Last name</label>
            <input id="me_last" placeholder="Last name" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" value={me?.lastName||''} onChange={e=>setMe(m=>m?{...m, lastName:e.target.value}:m)} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="me_email" className="text-sm text-neutral-400">Email</label>
            <input id="me_email" placeholder="you@example.com" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" type="email" value={me?.email||''} onChange={e=>setMe(m=>m?{...m, email:e.target.value}:m)} />
          </div>
          <div className="sm:col-span-2">
            <button className="px-3 py-2 rounded bg-brand-600 hover:bg-brand-500">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  );

  const Quotes = (
    <div className="space-y-2">
  <h2 className="text-xl font-semibold">My Quotes</h2>
      <ul className="space-y-2">
        {quotes.map(q => (
          <li key={q.id} className="rounded border border-neutral-800 bg-neutral-900/60 p-3">
            <div className="text-sm font-medium">{q.name} <span className="text-neutral-400">({q.email})</span></div>
            <div className="text-sm text-neutral-300 whitespace-pre-wrap">{q.message}</div>
            <div className="text-xs text-neutral-500 mt-1">{new Date(q.created_at).toLocaleString()}</div>
          </li>
        ))}
  {!quotes.length && <li className="text-neutral-400">No quotes yet.</li>}
      </ul>
    </div>
  );

  const Book = (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Book an Appointment</h2>
      {bookingMsg && <div className="text-green-400 text-sm">{bookingMsg}</div>}
      <form onSubmit={async (e)=>{
        e.preventDefault(); setBookingMsg(null);
        if (!booking.serviceId || !booking.date || !booking.time) return;
        const res = await fetch('/api/appointments', {
          method:'POST',
          headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
          body: JSON.stringify({
            serviceId: booking.serviceId,
            notes: booking.notes,
            date: booking.date,
            time: booking.time
          })
        });
        if (res.ok) {
          setBooking({ serviceId:'', notes:'', date:'', time:'' });
          setBookingMsg('Appointment booked.');
          setActive('appointments');
        }
      }} className="space-y-3">
        <div>
          <label htmlFor="book_service" className="text-sm text-neutral-400">Service</label>
          <select id="book_service" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" value={booking.serviceId} onChange={e=>setBooking(b=>({ ...b, serviceId: e.target.value }))}>
            <option value="">Select a service…</option>
            {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="book_date" className="text-sm text-neutral-400">Date</label>
            <input id="book_date" type="date" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" value={booking.date} onChange={e=>setBooking(b=>({ ...b, date: e.target.value }))} />
          </div>
          <div className="flex-1">
            <label htmlFor="book_time" className="text-sm text-neutral-400">Time</label>
            <input id="book_time" type="time" className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" value={booking.time} onChange={e=>setBooking(b=>({ ...b, time: e.target.value }))} />
          </div>
        </div>
        <div>
          <label htmlFor="book_notes" className="text-sm text-neutral-400">Notes (optional)</label>
          <textarea id="book_notes" placeholder="Describe your issue..." className="w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" rows={3} value={booking.notes} onChange={e=>setBooking(b=>({ ...b, notes: e.target.value }))} />
        </div>
        <button className="px-3 py-2 rounded bg-brand-600 hover:bg-brand-500">Book appointment</button>
      </form>
    </div>
  );

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
          <div className="space-x-3">
            {user.role === 'admin' && <Link className="text-sm text-brand-400" to="/admin">Admin</Link>}
            <button className="text-sm text-neutral-300" onClick={() => { logout(); nav('/'); }}>Logout</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <aside className="md:col-span-3">
            <nav className="rounded-2xl border border-neutral-800 bg-neutral-900/80 shadow-lg p-4 md:p-6 sticky top-4 flex flex-col gap-1 min-h-[420px]">
              <SidebarLink id="overview" label="Overview" />
              <SidebarLink id="appointments" label="Appointments" />
              <SidebarLink id="repairs" label="Repairs & Services" />
              <SidebarLink id="sales" label="Sales" />
              <SidebarLink id="software" label="Software" />
              <SidebarLink id="quotes" label="My Quotes" />
              <SidebarLink id="book" label="Book Appointment" />
              <SidebarLink id="account" label="Account" />
              <button
                className="mt-4 w-full text-left rounded-lg px-3 py-2 font-semibold text-red-400 hover:text-white hover:bg-red-500/80 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-150"
                onClick={() => { logout(); nav('/'); }}
              >
                Logout
              </button>
            </nav>
          </aside>
          <main className="md:col-span-9 space-y-4">
            {active === 'overview' && Overview}
            {active === 'appointments' && Appointments}
            {active === 'repairs' && (
              <div className="rounded border border-neutral-800 bg-neutral-900/60 p-4">
                <h2 className="text-xl font-semibold mb-2">Repairs & Services</h2>
                <p className="text-neutral-300 mb-2">Book a repair or explore services tailored to your device.</p>
                <Link to="/repairs" className="px-3 py-2 rounded bg-brand-600 hover:bg-brand-500 inline-block">Go to Repairs</Link>
              </div>
            )}
            {active === 'sales' && (
              <div className="rounded border border-neutral-800 bg-neutral-900/60 p-4">
                <h2 className="text-xl font-semibold mb-2">Sales</h2>
                <p className="text-neutral-300 mb-2">Browse our curated laptops, new and refurbished.</p>
                <Link to="/sales" className="px-3 py-2 rounded bg-brand-600 hover:bg-brand-500 inline-block">Shop laptops</Link>
              </div>
            )}
            {active === 'software' && (
              <div className="rounded border border-neutral-800 bg-neutral-900/60 p-4">
                <h2 className="text-xl font-semibold mb-2">Software</h2>
                <p className="text-neutral-300 mb-2">Need a website, app, or troubleshooting?</p>
                <Link to="/software" className="px-3 py-2 rounded bg-brand-600 hover:bg-brand-500 inline-block">Explore software</Link>
              </div>
            )}
            {active === 'quotes' && Quotes}
            {active === 'book' && Book}
            {active === 'account' && Account}
          </main>
        </div>
      </div>
    </div>
  );
}
