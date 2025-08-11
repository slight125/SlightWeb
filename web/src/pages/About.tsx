import React from 'react';
import Navbar from '../components/Navbar';
import { Section, Card } from '../components/Shared';

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
          <Card title="Humble beginnings" subtitle="Started in a dorm room with a screwdriver and a dream." />
          <Card title="Growing by trust" subtitle="Word of mouth built our reputation for honesty and quality." />
          <Card title="Future ready" subtitle="We constantly learn and adopt better tools for faster, safer service." />
        </div>
      </Section>

      <Section title="What we value">
        <ul className="grid md:grid-cols-3 gap-4 text-sm text-neutral-300">
          <li className="rounded border border-neutral-800 p-4">Transparency — clear pricing, clear timelines</li>
          <li className="rounded border border-neutral-800 p-4">Quality — we use the right parts and stand behind our work</li>
          <li className="rounded border border-neutral-800 p-4">Care — every device and project gets our full attention</li>
        </ul>
      </Section>
    </div>
  );
}
