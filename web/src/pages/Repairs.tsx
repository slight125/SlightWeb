import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import BackgroundFX from '../components/BackgroundFX';
import { Section, RepairCard, Service } from '../components/Shared';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaClock, FaShieldAlt, FaHeadset, FaSearch, FaMobileAlt, FaLaptop } from 'react-icons/fa';

export default function Repairs() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/services')
      .then(r => r.json())
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    // Show all repair services (search removed)
    return services.filter(s => s.category === 'repairs');
  }, [services]);

  return (
    <div className="min-h-dvh relative bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(37,99,235,0.12),transparent)] from-neutral-950 to-neutral-900 text-neutral-100">
      <Navbar />
      <BackgroundFX />
      {/* Visual hero with collage */}
      <section className="relative max-w-6xl mx-auto px-4 pt-2 pb-6 md:py-6">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <motion.div initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5}}>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Trusted Phone & Laptop Repairs</h1>
            <p className="mt-3 text-neutral-300 max-w-xl">Same‑day fixes for cracked screens, batteries, water damage, keyboards, and more. High‑quality parts</p>
            <div className="mt-4">
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="badge badge-outline border-brand-500/50 text-brand-300 bg-brand-600/10"><FaMobileAlt className="mr-1"/> Phone</span>
                <span className="badge badge-outline border-cyan-500/50 text-cyan-300 bg-cyan-600/10"><FaLaptop className="mr-1"/> Laptop</span>
                <span className="badge badge-outline border-amber-500/50 text-amber-300 bg-amber-600/10">Screen</span>
                <span className="badge badge-outline border-emerald-500/50 text-emerald-300 bg-emerald-600/10">Battery</span>
                <span className="badge badge-outline border-pink-500/50 text-pink-300 bg-pink-600/10">Keyboard</span>
              </div>
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <li className="group rounded-xl border border-emerald-800/40 bg-neutral-900/60 p-3 hover:border-emerald-500/60 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="inline-grid place-items-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/20">
                    <FaSearch />
                  </span>
                  <span className="text-neutral-200 font-medium">Free diagnostics</span>
                </div>
              </li>
              <li className="group rounded-xl border border-cyan-800/40 bg-neutral-900/60 p-3 hover:border-cyan-500/60 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="inline-grid place-items-center w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/20">
                    <FaCheckCircle />
                  </span>
                  <span className="text-neutral-200 font-medium">Quality parts</span>
                </div>
              </li>
              <li className="group rounded-xl border border-amber-800/40 bg-neutral-900/60 p-3 hover:border-amber-500/60 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="inline-grid place-items-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-300 ring-1 ring-amber-400/20">
                    <FaClock />
                  </span>
                  <span className="text-neutral-200 font-medium">Fast turnaround</span>
                </div>
              </li>
              <li className="group rounded-xl border border-brand-800/40 bg-neutral-900/60 p-3 hover:border-brand-500/60 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="inline-grid place-items-center w-8 h-8 rounded-lg bg-brand-600/10 text-brand-300 ring-1 ring-brand-500/20">
                    <FaShieldAlt />
                  </span>
                  <span className="text-neutral-200 font-medium">90‑day warranty</span>
                </div>
              </li>
            </ul>
          </motion.div>
          <div className="relative">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop" alt="Phone repair" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="hidden md:block absolute -bottom-6 -left-6 w-40 aspect-[4/3] rounded-lg overflow-hidden border border-neutral-800 shadow-xl rotate-[-6deg]">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop" alt="Laptop internals and components" className="h-full w-full object-cover" />
            </div>
            <div className="hidden md:block absolute -top-6 -right-6 w-44 aspect-[4/3] rounded-lg overflow-hidden border border-neutral-800 shadow-xl rotate-[8deg]">
              <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop" alt="Soldering electronics" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <Section title="Repair Services" className="py-6">
        {loading && services.length === 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({length:6}).map((_,i)=> (
              <div key={i} className="rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900/60 animate-pulse">
                <div className="w-full aspect-[4/3] bg-neutral-800"/>
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-neutral-800 rounded"/>
                  <div className="h-4 bg-neutral-800 rounded w-2/3"/>
                </div>
              </div>
            ))}
          </div>
        ) : (
        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}>
          {filtered.map(s => {
            // pick a representative image per service title
            const t = s.title.toLowerCase();
            const img = /screen|display/.test(t)
              ? 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop'
              : /battery|power/.test(t)
              ? 'https://images.unsplash.com/photo-1606166325683-1eef09a2a963?q=80&w=1600&auto=format&fit=crop'
              : /keyboard|keys/.test(t)
              ? 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop'
              : /water|liquid/.test(t)
              ? 'https://images.unsplash.com/photo-1606813907291-76f9c6dfc928?q=80&w=1600&auto=format&fit=crop'
              : 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop';
            return (
              <motion.div key={s.id} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
                <RepairCard id={s.id} title={s.title} description={s.description} image={img} />
              </motion.div>
            );
          })}
        </motion.div>
        )}
      </Section>

      <Section title="Why choose us?" subtitle="We keep your devices working so you can keep moving." className="py-6">
        <ul className="grid md:grid-cols-4 gap-3 text-sm">
          <li className="rounded-lg border border-emerald-800/40 bg-neutral-900/60 p-4 hover:border-emerald-500/60 transition-colors">
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-emerald-400"/>
              <span className="text-neutral-200">Genuine or premium‑grade parts only</span>
            </div>
          </li>
          <li className="rounded-lg border border-amber-800/40 bg-neutral-900/60 p-4 hover:border-amber-500/60 transition-colors">
            <div className="flex items-center gap-3">
              <FaClock className="text-amber-400"/>
              <span className="text-neutral-200">Most repairs done under 2 hours</span>
            </div>
          </li>
          <li className="rounded-lg border border-cyan-800/40 bg-neutral-900/60 p-4 hover:border-cyan-500/60 transition-colors">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-cyan-300"/>
              <span className="text-neutral-200">Transparent pricing before we start</span>
            </div>
          </li>
          <li className="rounded-lg border border-brand-800/40 bg-neutral-900/60 p-4 hover:border-brand-500/60 transition-colors">
            <div className="flex items-center gap-3">
              <FaHeadset className="text-brand-300"/>
              <span className="text-neutral-200">Friendly support and updates</span>
            </div>
          </li>
        </ul>
      </Section>

      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="rounded-xl border border-neutral-800 bg-gradient-to-r from-brand-600/15 to-cyan-600/15 p-5">
          <div className="flex flex-col items-center text-center">
            <p className="text-neutral-200">Not sure what’s wrong? Book a free diagnosis. We’ll check your device and advise the best fix.</p>
            <a
              href="#top"
              className="mt-3 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-brand-600 text-white border border-brand-600 hover:bg-brand-500 hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-0 leading-none"
            >
              <span>Book now</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
