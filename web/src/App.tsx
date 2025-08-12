import React from 'react';

// Data contracts
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Section, Card, QuoteForm } from './components/Shared';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaRocket, FaApple, FaWindows, FaAndroid, FaMicrosoft, FaLinux, FaCheckCircle } from 'react-icons/fa';
import { SiDell, SiHp, SiLenovo, SiAsus, SiAcer } from 'react-icons/si';

const Footer: React.FC = () => (
  <footer className="border-t border-neutral-800 py-8 text-center text-neutral-400 text-sm">
    <div className="max-w-6xl mx-auto px-4">
      © {new Date().getFullYear()} Slight Tech — Phone & Laptop Repairs, Sales, and Software Development
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
  <div className="min-h-dvh relative overflow-hidden bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(37,99,235,0.15),transparent)] from-neutral-950 to-neutral-900 text-neutral-100">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 size-[400px] rounded-full bg-brand-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-[400px] rounded-full bg-cyan-500/10 blur-3xl" />

    <Navbar />
  <main>
        {/* Hero */}
        <section className="relative max-w-6xl mx-auto px-4 pt-8 pb-10 md:pt-14 md:pb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.6}}>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Repairs, Sales, and Software that just works.
              </h1>
              <p className="mt-4 text-neutral-300 max-w-xl">
                We fix phones and laptops, sell quality new and refurbished devices, and build modern apps and websites for your business.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link to="/contact" className="btn btn-primary bg-brand-600 border-brand-600 hover:bg-brand-500 hover:border-brand-500 text-white">
                  Get in touch
                </Link>
                <Link to="/about" className="btn btn-outline border-neutral-700 text-neutral-200 hover:border-brand-500 hover:text-brand-200">
                  Learn about us
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-6 text-neutral-300 text-sm">
                <div className="flex items-center gap-2"><FaShieldAlt className="text-brand-400"/> 90‑day repair warranty</div>
                <div className="flex items-center gap-2"><FaRocket className="text-brand-400"/> Fast turnaround</div>
              </div>
            </motion.div>
            {/* Hero collage */}
            <motion.div initial={{opacity:0, scale:0.98}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} transition={{duration:0.7}} className="relative">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1600&auto=format&fit=crop"
                  alt="Laptop repair workspace with tools"
                  className="absolute inset-0 h-full w-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900/60 via-transparent to-neutral-900/20" />
              </div>
              <div className="hidden md:block absolute -bottom-8 -left-8 w-40 aspect-[4/3] rounded-lg overflow-hidden border border-neutral-800 shadow-xl rotate-[-6deg]">
                <img
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
                  alt="Motherboard and electronics"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="hidden md:block absolute -top-6 -right-8 w-44 aspect-[4/3] rounded-lg overflow-hidden border border-neutral-800 shadow-xl rotate-[8deg]">
                <img
                  src="https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=800&auto=format&fit=crop"
                  alt="Programming on a laptop"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section className="max-w-6xl mx-auto px-4 pb-6 md:pb-10">
          <motion.div
            className="grid md:grid-cols-3 gap-5 items-stretch"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
            <div className="relative h-full">
              <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-brand-500/20 blur-xl opacity-100" aria-hidden="true" />
              <Card title="Repairs" subtitle="Sameday fixes and quality parts" className="relative hover:shadow-xl hover:shadow-brand-900/10">
              <div className="mt-2 rounded-md border border-neutral-800 overflow-hidden">
                <img className="w-full aspect-[16/9] object-cover" src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" alt="Phone repair" />
              </div>
              <p className="mt-2 text-sm text-neutral-300">Cracked screens, batteries, water damage, keyboards, and more. 90day warranty.</p>
              <div className="mt-auto pt-3">
                <Link to="/repairs" className="inline-block text-brand-400 underline">Explore Repairs </Link>
              </div>
              </Card>
            </div>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
            <div className="relative h-full">
              <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-cyan-500/20 blur-xl opacity-100" aria-hidden="true" />
              <Card title="Sales" subtitle="New & Refurbished Laptops" className="relative hover:shadow-xl hover:shadow-brand-900/10">
              <div className="mt-2 rounded-md border border-neutral-800 overflow-hidden">
                <img className="w-full aspect-[16/9] object-cover" src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop" alt="Laptops for sale" />
              </div>
              <p className="mt-2 text-sm text-neutral-300">Tested hardware, fair prices, and free basic setup. Warranty options available.</p>
              <div className="mt-auto pt-3 space-x-4">
                <Link to="/sales" className="text-brand-400 underline">Browse Laptops </Link>
                <Link to="/sales#accessories" className="text-cyan-300 underline">Accessories & Spares </Link>
              </div>
              </Card>
            </div>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}>
            <div className="relative h-full">
              <div className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-emerald-500/20 blur-xl opacity-100" aria-hidden="true" />
              <Card title="Software" subtitle="Websites & custom apps" className="relative hover:shadow-xl hover:shadow-brand-900/10">
              <div className="mt-2 rounded-md border border-neutral-800 overflow-hidden">
                <img className="w-full aspect-[16/9] object-cover" src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop" alt="Software development" />
              </div>
              <p className="mt-2 text-sm text-neutral-300">We design, build, and maintain fast, modern software tailored to your needs.</p>
              <div className="mt-auto pt-3">
                <Link to="/software" className="inline-block text-brand-400 underline">See Services </Link>
              </div>
              </Card>
            </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Trusted by / Neon badges marquee */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <div className="relative rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-4 md:p-6 overflow-hidden">
            <div className="fx-sweep pointer-events-none" aria-hidden></div>
            <p className="text-sm text-neutral-400">Trusted by local businesses and professionals</p>
            <div className="marquee mt-4 overflow-hidden">
              <div className="marquee__track items-center pr-8">
                {(() => {
                  const brands = [
                    { label: 'Android', Icon: FaAndroid, cls: 'border-emerald-500/60 text-emerald-200 bg-emerald-500/15 ring-emerald-400/30', neon: 'shadow-[0_0_10px_rgba(16,185,129,0.45),0_0_24px_rgba(16,185,129,0.35)]' },
                    { label: 'Linux', Icon: FaLinux, cls: 'border-violet-500/60 text-violet-200 bg-violet-500/15 ring-violet-400/30', neon: 'shadow-[0_0_10px_rgba(139,92,246,0.45),0_0_24px_rgba(139,92,246,0.35)]' },
                    { label: 'Dell', Icon: SiDell, cls: 'border-blue-500/60 text-blue-200 bg-blue-500/15 ring-blue-400/30', neon: 'shadow-[0_0_10px_rgba(59,130,246,0.45),0_0_24px_rgba(59,130,246,0.35)]' },
                    { label: 'HP', Icon: SiHp, cls: 'border-cyan-500/60 text-cyan-200 bg-cyan-500/15 ring-cyan-400/30', neon: 'shadow-[0_0_10px_rgba(34,211,238,0.45),0_0_24px_rgba(34,211,238,0.35)]' },
                    { label: 'Lenovo', Icon: SiLenovo, cls: 'border-red-500/60 text-red-200 bg-red-500/15 ring-red-400/30', neon: 'shadow-[0_0_10px_rgba(239,68,68,0.45),0_0_24px_rgba(239,68,68,0.35)]' },
                    { label: 'Asus', Icon: SiAsus, cls: 'border-indigo-500/60 text-indigo-200 bg-indigo-500/15 ring-indigo-400/30', neon: 'shadow-[0_0_10px_rgba(99,102,241,0.45),0_0_24px_rgba(99,102,241,0.35)]' },
                    { label: 'Acer', Icon: SiAcer, cls: 'border-lime-500/60 text-lime-200 bg-lime-500/15 ring-lime-400/30', neon: 'shadow-[0_0_10px_rgba(132,204,22,0.45),0_0_24px_rgba(132,204,22,0.35)]' },
                    { label: 'Apple', Icon: FaApple, cls: 'border-neutral-500/60 text-neutral-100 bg-neutral-500/10 ring-neutral-400/20', neon: 'shadow-[0_0_10px_rgba(255,255,255,0.35),0_0_24px_rgba(255,255,255,0.25)]' },
                    { label: 'Microsoft', Icon: FaMicrosoft, cls: 'border-amber-500/60 text-amber-200 bg-amber-500/15 ring-amber-400/30', neon: 'shadow-[0_0_10px_rgba(245,158,11,0.45),0_0_24px_rgba(245,158,11,0.35)]' },
                    { label: 'Windows', Icon: FaWindows, cls: 'border-sky-500/60 text-sky-200 bg-sky-500/15 ring-sky-400/30', neon: 'shadow-[0_0_10px_rgba(56,189,248,0.45),0_0_24px_rgba(56,189,248,0.35)]' },
                  ];
                  const list = [...brands, ...brands];
                  return list.map(({ label, Icon, cls, neon }, i) => (
                    <span
                      key={`${label}-${i}`}
                      className={`inline-flex items-center gap-2 px-5 h-11 rounded-2xl border ring-1 ${cls} backdrop-blur-sm ${neon} mr-4`}
                      title={label}
                    >
                      <Icon className="text-base" />
                      <span className="font-medium">{label}</span>
                    </span>
                  ));
                })()}
              </div>
            </div>
          </div>
        </section>

        {/* Quote CTA */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <motion.div initial={{opacity:0, y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5}}>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-300">Need a quick quote?</h2>
              <p className="mt-2 text-neutral-300">Tell us what you need and we’ll reply fast with options and pricing.</p>
              <ul className="mt-4 space-y-2 text-neutral-300">
                {['Same-day reply','Upfront pricing','No spam — ever'].map((t)=> (
                  <li key={t} className="flex items-center gap-2"><FaCheckCircle className="text-green-400"/> {t}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{opacity:0, scale:0.98}} whileInView={{opacity:1, scale:1}} viewport={{once:true}} transition={{duration:0.5}} className="relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-brand-500/30 to-cyan-500/30 blur-xl" aria-hidden="true" />
              <div className="relative rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur p-4 md:p-6 shadow-2xl">
                <QuoteForm />
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
