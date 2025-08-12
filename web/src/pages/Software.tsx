import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import BackgroundFX from '../components/BackgroundFX';
import { Section } from '../components/Shared';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMobileAlt, FaGlobe, FaServer, FaAndroid, FaApple, FaWindows, FaLinux, FaCheckCircle, FaTools } from 'react-icons/fa';
import { SiLenovo, SiAsus, SiAcer, SiDell, SiHp } from 'react-icons/si';

export default function Software() {
  const [open, setOpen] = useState<null | 'mobile' | 'web' | 'os'>(null);

  return (
    <div className="min-h-dvh relative bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(37,99,235,0.12),transparent)] from-neutral-950 to-neutral-900 text-neutral-100">
      <Navbar />
      <BackgroundFX />
      <section className="max-w-6xl mx-auto px-4 pt-2 pb-6 md:py-6">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <motion.div initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5}}>
            <h1 className="text-3xl md:text-5xl font-extrabold">Mobile Apps, Full‑Stack Websites, and OS & Software Installations</h1>
            <p className="mt-3 text-neutral-300 max-w-xl">We craft dynamic mobile apps, build scalable full‑stack websites, and professionally install operating systems and essential software on computers.</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="badge badge-outline border-brand-500/50 text-brand-300 bg-brand-600/10"><FaMobileAlt className="mr-1"/> Mobile Apps</span>
              <span className="badge badge-outline border-cyan-500/50 text-cyan-300 bg-cyan-600/10"><FaGlobe className="mr-1"/> Full‑stack Web</span>
              <span className="badge badge-outline border-emerald-500/50 text-emerald-300 bg-emerald-600/10"><FaTools className="mr-1"/> OS & Software</span>
            </div>
          </motion.div>
          <div className="relative">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop" alt="Coding on laptop" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="hidden md:block absolute -top-6 -right-6 w-44 aspect-[4/3] rounded-lg overflow-hidden border border-neutral-800 shadow-xl rotate-[6deg]">
              <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop" alt="UI design" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted brands section */}
      <section className="max-w-6xl mx-auto px-4 pb-2">
        <div className="relative rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-4 md:p-6 overflow-hidden">
          <div className="fx-sweep pointer-events-none" aria-hidden></div>
          <p className="text-sm md:text-base text-neutral-300 mb-3 md:mb-4">Trusted by local businesses and professionals</p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            className="flex flex-wrap gap-3 md:gap-4"
          >
            {[
              { label: 'Android', Icon: FaAndroid, cls: 'border-emerald-500/60 text-emerald-200 bg-emerald-500/15 ring-emerald-400/30 hover:bg-emerald-500/25', neon: 'shadow-[0_0_10px_rgba(16,185,129,0.45),0_0_24px_rgba(16,185,129,0.35)] hover:shadow-[0_0_16px_rgba(16,185,129,0.7),0_0_36px_rgba(16,185,129,0.5)]' },
              { label: 'Linux', Icon: FaLinux, cls: 'border-violet-500/60 text-violet-200 bg-violet-500/15 ring-violet-400/30 hover:bg-violet-500/25', neon: 'shadow-[0_0_10px_rgba(139,92,246,0.45),0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_16px_rgba(139,92,246,0.7),0_0_36px_rgba(139,92,246,0.5)]' },
              { label: 'Dell', Icon: SiDell, cls: 'border-blue-500/60 text-blue-200 bg-blue-500/15 ring-blue-400/30 hover:bg-blue-500/25', neon: 'shadow-[0_0_10px_rgba(59,130,246,0.45),0_0_24px_rgba(59,130,246,0.35)] hover:shadow-[0_0_16px_rgba(59,130,246,0.7),0_0_36px_rgba(59,130,246,0.5)]' },
              { label: 'HP', Icon: SiHp, cls: 'border-cyan-500/60 text-cyan-200 bg-cyan-500/15 ring-cyan-400/30 hover:bg-cyan-500/25', neon: 'shadow-[0_0_10px_rgba(34,211,238,0.45),0_0_24px_rgba(34,211,238,0.35)] hover:shadow-[0_0_16px_rgba(34,211,238,0.7),0_0_36px_rgba(34,211,238,0.5)]' },
              { label: 'Lenovo', Icon: SiLenovo, cls: 'border-red-500/60 text-red-200 bg-red-500/15 ring-red-400/30 hover:bg-red-500/25', neon: 'shadow-[0_0_10px_rgba(239,68,68,0.45),0_0_24px_rgba(239,68,68,0.35)] hover:shadow-[0_0_16px_rgba(239,68,68,0.7),0_0_36px_rgba(239,68,68,0.5)]' },
              { label: 'Asus', Icon: SiAsus, cls: 'border-indigo-500/60 text-indigo-200 bg-indigo-500/15 ring-indigo-400/30 hover:bg-indigo-500/25', neon: 'shadow-[0_0_10px_rgba(99,102,241,0.45),0_0_24px_rgba(99,102,241,0.35)] hover:shadow-[0_0_16px_rgba(99,102,241,0.7),0_0_36px_rgba(99,102,241,0.5)]' },
              { label: 'Acer', Icon: SiAcer, cls: 'border-lime-500/60 text-lime-200 bg-lime-500/15 ring-lime-400/30 hover:bg-lime-500/25', neon: 'shadow-[0_0_10px_rgba(132,204,22,0.45),0_0_24px_rgba(132,204,22,0.35)] hover:shadow-[0_0_16px_rgba(132,204,22,0.7),0_0_36px_rgba(132,204,22,0.5)]' },
              { label: 'Apple', Icon: FaApple, cls: 'border-neutral-500/60 text-neutral-100 bg-neutral-500/10 ring-neutral-400/20 hover:bg-neutral-500/20', neon: 'shadow-[0_0_10px_rgba(255,255,255,0.35),0_0_24px_rgba(255,255,255,0.25)] hover:shadow-[0_0_16px_rgba(255,255,255,0.55),0_0_36px_rgba(255,255,255,0.4)]' },
              { label: 'Microsoft', Icon: FaWindows, cls: 'border-amber-500/60 text-amber-200 bg-amber-500/15 ring-amber-400/30 hover:bg-amber-500/25', neon: 'shadow-[0_0_10px_rgba(245,158,11,0.45),0_0_24px_rgba(245,158,11,0.35)] hover:shadow-[0_0_16px_rgba(245,158,11,0.7),0_0_36px_rgba(245,158,11,0.5)]' },
              { label: 'Windows', Icon: FaWindows, cls: 'border-sky-500/60 text-sky-200 bg-sky-500/15 ring-sky-400/30 hover:bg-sky-500/25', neon: 'shadow-[0_0_10px_rgba(56,189,248,0.45),0_0_24px_rgba(56,189,248,0.35)] hover:shadow-[0_0_16px_rgba(56,189,248,0.7),0_0_36px_rgba(56,189,248,0.5)]' },
            ].map(({ label, Icon, cls, neon }) => (
              <motion.span
                key={label}
                variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
                className={`inline-flex items-center gap-2 px-4 h-10 rounded-xl border ring-1 ${cls} backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 ${neon}`}
                title={label}
              >
                <Icon className="text-base" />
                <span className="font-medium">{label}</span>
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>
      <Section title="What we offer" className="py-6">
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}>
          {/* Mobile Apps */}
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
            <div
              onClick={() => setOpen(open === 'mobile' ? null : 'mobile')}
              className="group h-full cursor-pointer rounded-2xl border border-brand-700/40 bg-gradient-to-br from-brand-600/10 to-cyan-600/10 p-5 hover:border-brand-500/60 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="inline-grid place-items-center w-10 h-10 rounded-xl bg-brand-600/15 text-brand-300 ring-1 ring-brand-500/20">
                  <FaMobileAlt />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Dynamic Mobile Applications</h3>
                  <p className="text-sm text-neutral-300">Android and iOS apps with real‑time features, offline support, and beautiful UI.</p>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-neutral-300">
                {['Push notifications','Auth & secure APIs','Payments & subscriptions'].map((t) => (
                  <li key={t} className="flex items-center gap-2"><FaCheckCircle className="text-emerald-400"/> {t}</li>
                ))}
              </ul>
              <AnimatePresence>
                {open === 'mobile' && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mt-3 text-sm text-neutral-300">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="badge badge-outline border-emerald-500/50 text-emerald-300 bg-emerald-600/10"><FaAndroid className="mr-1"/> Android</span>
                      <span className="badge badge-outline border-neutral-500/50 text-neutral-200 bg-neutral-600/10"><FaApple className="mr-1"/> iOS</span>
                      <span className="badge badge-outline border-cyan-500/50 text-cyan-300 bg-cyan-600/10">React Native</span>
                      <span className="badge badge-outline border-pink-500/50 text-pink-300 bg-pink-600/10">Expo</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="mt-4">
                <a href="/contact" className="btn btn-sm bg-brand-600 border-brand-600 text-white hover:bg-brand-500 hover:border-brand-500">Start a mobile app</a>
              </div>
            </div>
          </motion.div>

          {/* Full‑stack Websites */}
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
            <div
              onClick={() => setOpen(open === 'web' ? null : 'web')}
              className="group h-full cursor-pointer rounded-2xl border border-cyan-700/40 bg-gradient-to-br from-cyan-600/10 to-emerald-600/10 p-5 hover:border-cyan-500/60 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="inline-grid place-items-center w-10 h-10 rounded-xl bg-cyan-600/15 text-cyan-300 ring-1 ring-cyan-500/20">
                  <FaGlobe />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Full‑stack Website Development</h3>
                  <p className="text-sm text-neutral-300">Fast frontends with robust backends, SEO‑friendly, secure, and scalable.</p>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-neutral-300">
                {['E‑commerce & dashboards','CMS & blog','APIs & integrations'].map((t) => (
                  <li key={t} className="flex items-center gap-2"><FaCheckCircle className="text-emerald-400"/> {t}</li>
                ))}
              </ul>
              <AnimatePresence>
                {open === 'web' && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mt-3 text-sm text-neutral-300">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="badge badge-outline border-neutral-500/50 text-neutral-200 bg-neutral-600/10"><FaServer className="mr-1"/> Node.js</span>
                      <span className="badge badge-outline border-brand-500/50 text-brand-300 bg-brand-600/10">React</span>
                      <span className="badge badge-outline border-amber-500/50 text-amber-300 bg-amber-600/10">Vite/Tailwind</span>
                      <span className="badge badge-outline border-emerald-500/50 text-emerald-300 bg-emerald-600/10">PostgreSQL</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="mt-4">
                <a href="/contact" className="btn btn-sm bg-cyan-600 border-cyan-600 text-white hover:bg-cyan-500 hover:border-cyan-500">Build my website</a>
              </div>
            </div>
          </motion.div>

          {/* OS & Software Installations */}
          <motion.div variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}>
            <div
              onClick={() => setOpen(open === 'os' ? null : 'os')}
              className="group h-full cursor-pointer rounded-2xl border border-emerald-700/40 bg-gradient-to-br from-emerald-600/10 to-brand-600/10 p-5 hover:border-emerald-500/60 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="inline-grid place-items-center w-10 h-10 rounded-xl bg-emerald-600/15 text-emerald-300 ring-1 ring-emerald-500/20">
                  <FaTools />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">OS & Software Installations</h3>
                  <p className="text-sm text-neutral-300">Fresh installs, upgrades, and setup of operating systems and essential software.</p>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-neutral-300">
                {['Windows, macOS, Linux','Data safety & backups','Drivers & office suites'].map((t) => (
                  <li key={t} className="flex items-center gap-2"><FaCheckCircle className="text-emerald-400"/> {t}</li>
                ))}
              </ul>
              <AnimatePresence>
                {open === 'os' && (
                  <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="mt-3 text-sm text-neutral-300">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="badge badge-outline border-sky-500/50 text-sky-300 bg-sky-600/10"><FaWindows className="mr-1"/> Windows</span>
                      <span className="badge badge-outline border-neutral-500/50 text-neutral-200 bg-neutral-600/10"><FaApple className="mr-1"/> macOS</span>
                      <span className="badge badge-outline border-green-500/50 text-green-300 bg-green-600/10"><FaLinux className="mr-1"/> Linux</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="mt-4">
                <a href="/contact" className="btn btn-sm bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-500 hover:border-emerald-500">Install or upgrade</a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Section>
      <Section title="Our stack" className="py-6">
        <div className="grid md:grid-cols-3 gap-4 text-sm text-neutral-300">
          <div className="rounded-xl border border-neutral-800 p-4 bg-neutral-900/60">
            <div className="flex items-center gap-2 text-neutral-200"><FaGlobe className="text-brand-300"/> Frontend</div>
            <p className="mt-2">React,NextJS ,Vite, TailwindCSS, Framer Motion</p>
          </div>
          <div className="rounded-xl border border-neutral-800 p-4 bg-neutral-900/60">
            <div className="flex items-center gap-2 text-neutral-200"><FaServer className="text-cyan-300"/> Backend</div>
            <p className="mt-2">Node.js,Python,C# .Net, Express, PostgreSQL, REST APIs</p>
          </div>
          <div className="rounded-xl border border-neutral-800 p-4 bg-neutral-900/60">
            <div className="flex items-center gap-2 text-neutral-200"><FaTools className="text-emerald-300"/> Delivery</div>
            <p className="mt-2">CI/CD, Monitoring, Analytics, SEO best practices</p>
          </div>
        </div>
      </Section>
    </div>
  );
}
