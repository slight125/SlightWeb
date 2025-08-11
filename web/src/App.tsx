import React from 'react';

// Data contracts
import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Section, Card } from './components/Shared';

const Footer: React.FC = () => (
  <footer className="border-t border-neutral-800 py-8 text-center text-neutral-400 text-sm">
    <div className="max-w-6xl mx-auto px-4">
      © {new Date().getFullYear()} Sight Tech — Phone & Laptop Repairs, Sales, and Software Development
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100">
      <Navbar />
      <main>
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Repairs, Sales, and Software that just works.</h1>
          <p className="mt-4 text-neutral-300 max-w-2xl">We fix phones and laptops, sell quality new and refurbished devices, and build modern apps and websites for your business.</p>
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            <Card title="Repairs" subtitle="Same‑day fixes and quality parts">
              <p className="text-sm text-neutral-300">Cracked screens, batteries, water damage, keyboards, and more. 90‑day warranty.</p>
              <Link to="/repairs" className="inline-block mt-3 text-brand-400 underline">Explore Repairs →</Link>
            </Card>
            <Card title="Sales" subtitle="New & Refurbished Laptops">
              <p className="text-sm text-neutral-300">Tested hardware, fair prices, and free basic setup. Warranty options available.</p>
              <Link to="/sales" className="inline-block mt-3 text-brand-400 underline">Browse Laptops →</Link>
            </Card>
            <Card title="Software" subtitle="Websites & custom apps">
              <p className="text-sm text-neutral-300">We design, build, and maintain fast, modern software tailored to your needs.</p>
              <Link to="/software" className="inline-block mt-3 text-brand-400 underline">See Services →</Link>
            </Card>
          </div>
          <div className="mt-6">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-brand-600 hover:bg-brand-500 px-4 py-2 font-medium">Contact us</Link>
            <span className="ml-3 text-neutral-400">or learn more <Link to="/about" className="text-brand-400 underline">About us</Link></span>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
