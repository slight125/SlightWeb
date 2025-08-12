import React from 'react';
import Navbar from '../components/Navbar';
import { Section, Card } from '../components/Shared';
import { FaSeedling, FaHandshake, FaRocket, FaBalanceScale, FaCogs, FaHeart } from 'react-icons/fa';

export default function About() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100">
      <Navbar />
      <header className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold">About Sight Tech</h1>
        <p className="mt-3 text-neutral-300 max-w-2xl">We’re a small team passionate about reliable devices and modern software. We repair, sell, and build with care.</p>
      </header>

      <Section title="Our story" subtitle="From fixing a friend’s phone to serving hundreds of happy customers.">
        <div className="grid md:grid-cols-3 gap-4 text-sm text-neutral-300">
          <Card title="Humble beginnings" subtitle="Started in a dorm room with a screwdriver and a dream." icon={<FaSeedling className="text-emerald-400"/>} className="border-emerald-900/40 hover:border-emerald-500/60" />
          <Card title="Growing by trust" subtitle="Word of mouth built our reputation for honesty and quality." icon={<FaHandshake className="text-amber-300"/>} className="border-amber-900/40 hover:border-amber-500/60" />
          <Card title="Future ready" subtitle="We constantly learn and adopt better tools for faster, safer service." icon={<FaRocket className="text-cyan-300"/>} className="border-cyan-900/40 hover:border-cyan-500/60" />
        </div>
      </Section>

      <Section title="What we value">
        <ul className="grid md:grid-cols-3 gap-4 text-sm text-neutral-300">
          <li className="rounded-lg border border-cyan-900/40 hover:border-cyan-500/60 bg-neutral-900/60 p-4 transition-colors">
            <div className="flex items-start gap-3"><FaBalanceScale className="text-cyan-300"/><span>Transparency — clear pricing, clear timelines</span></div>
          </li>
          <li className="rounded-lg border border-emerald-900/40 hover:border-emerald-500/60 bg-neutral-900/60 p-4 transition-colors">
            <div className="flex items-start gap-3"><FaCogs className="text-emerald-400"/><span>Quality — we use the right parts and stand behind our work</span></div>
          </li>
          <li className="rounded-lg border border-rose-900/40 hover:border-rose-500/60 bg-neutral-900/60 p-4 transition-colors">
            <div className="flex items-start gap-3"><FaHeart className="text-rose-400"/><span>Care — every device and project gets our full attention</span></div>
          </li>
        </ul>
      </Section>
    </div>
  );
}
