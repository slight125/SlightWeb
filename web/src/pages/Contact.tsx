import React from 'react';
import Navbar from '../components/Navbar';
import { Section, Card, QuoteForm } from '../components/Shared';
import { LOCATION_URL, MAP_EMBED_URL, CONTACT } from '../config';

export default function Contact() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-neutral-950 to-neutral-900 text-neutral-100">
      <Navbar />
      <header className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold">Get in Touch</h1>
        <p className="mt-3 text-neutral-300 max-w-2xl">Questions, quotes, or support? We’re here to help on WhatsApp, phone, email, or Facebook. Visit us at our shop too.</p>
      </header>
      {/* Contact details first */}
      <Section title="Contact Details" subtitle="Reach us directly — we typically reply within minutes during business hours.">
        <div className="grid md:grid-cols-2 gap-4">
          <Card title="Talk to us">
            <div className="space-y-3 text-base">
              <a href={`tel:${CONTACT.phone}`} className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/60 px-4 py-3 hover:border-brand-500">
                <span className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 text-emerald-400 fill-current" aria-hidden="true"><path d="M164.9 24.6c10.7-5.2 23.5-3.5 32.2 4.6l65 60.1c8.7 8.1 11.3 20.7 6.6 31.4l-30 69.9c-4.2 9.9-1.4 21.5 6.9 28.3l49.9 41.5c34.9 29 78.2 49 123.8 57.6c10.8 2 21.9-2.3 28.2-11.3l43.1-61.2c6.3-9 17.4-13.4 28.2-11.3l77.2 14.3c12.3 2.3 21.6 12.1 23.4 24.5c8.4 58.8-12.7 118-55.9 161.2C496.6 497.2 433.1 520 366.6 520C211.7 520 76.6 416.3 29.6 268.7c-7-22.1-10.6-45-10.6-68.2c0-39.3 10.8-77.8 31.2-111.2c6.3-10.3 17.7-15.6 29.3-14.2l77.7 9.7c11.4 1.4 21 9.2 24.4 20.2l12.5 40.9z"/></svg>
                  <span className="font-medium">Phone</span>
                </span>
                <span className="text-brand-400 text-lg">{CONTACT.phone}</span>
              </a>

              <a href={`mailto:${CONTACT.email}`} className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/60 px-4 py-3 hover:border-brand-500">
                <span className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 text-amber-400 fill-current" aria-hidden="true"><path d="M502.3 190.8 327.4 338.3c-21.1 17.9-52.6 17.9-73.7 0L9.7 190.8C3.9 185.9 0 178.5 0 170.6V96c0-35.3 28.7-64 64-64h384c35.3 0 64 28.7 64 64v74.6c0 7.9-3.9 15.3-9.7 20.2zM480 208v160c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V208l175.2 148.4c38.5 32.7 95.1 32.7 133.6 0L480 208z"/></svg>
                  <span className="font-medium">Email</span>
                </span>
                <span className="text-brand-400 text-lg">{CONTACT.email}</span>
              </a>

              <div className="flex flex-wrap gap-3 pt-1">
                <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-green-600 hover:bg-green-500 px-4 py-2 text-sm font-medium text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32 103.5 32 6.6 128.9 6.6 249.3c0 43.6 11.4 86.3 33.1 123.7L0 480l110.6-39.1c35.5 19.4 75.3 29.6 116.6 29.6h.1c120.4 0 217.3-96.9 217.3-217.3 0-59.3-23.1-115.1-64.1-156.1zM223.9 438.6c-36.7 0-72.7-9.9-104-28.6l-7.4-4.4-65.6 23.2 22-67.5-4.8-7.8c-20.6-33-31.5-71.2-31.5-110.2 0-114.6 93.2-207.8 207.9-207.8 55.5 0 107.7 21.6 147 60.9 39.3 39.3 61 91.6 60.9 147.1 0 114.6-93.2 207.1-207.9 207.1zm115.1-155.7c-6.3-3.1-37.3-18.4-43-20.5-5.8-2.1-10-3.1-14.3 3.1-4.2 6.3-16.4 20.5-20.1 24.8-3.7 4.2-7.4 4.7-13.7 1.6-6.3-3.1-26.6-9.8-50.6-31.3-18.7-16.6-31.3-37.2-35-43.5-3.7-6.3-.4-9.7 2.7-12.8 2.8-2.8 6.3-7.4 9.5-11.1 3.1-3.7 4.2-6.3 6.3-10.5 2.1-4.2 1.1-7.9-.5-11-1.6-3.1-14.3-34.4-19.6-47.2-5.2-12.5-10.5-10.8-14.3-11-3.7-.2-7.9-.2-12-.2s-11 1.6-16.9 7.9c-5.8 6.3-22 21.5-22 52.4s22.5 60.8 25.6 65.1c3.1 4.2 44.4 67.7 107.6 95 15 6.5 26.7 10.4 35.8 13.3 15 4.8 28.7 4.1 39.5 2.5 12-1.8 37.3-15.2 42.6-29.8 5.2-14.6 5.2-27.1 3.7-29.8-1.6-2.6-5.8-4.2-12.1-7.3z"/></svg>
                  WhatsApp
                </a>
                <a href={CONTACT.facebookUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-medium text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M279.14 288l14.22-92.66h-88.91V127.08c0-25.35 12.42-50.06 52.24-50.06H296V6.26S259.5 0 225.36 0c-73.14 0-121 44.38-121 124.72V195.3H22.89V288h81.47v224h100.2V288z"/></svg>
                  Facebook
                </a>
              </div>
            </div>
          </Card>
          <Card title="Get a Quote">
            <QuoteForm />
          </Card>
        </div>
      </Section>

      {/* Map and directions below */}
      <Section title="Visit Us" subtitle="We’re easy to find. Tap for directions.">
        <Card title="Location">
          <a className="inline-flex items-center gap-2 mt-2 text-brand-400 underline" href={LOCATION_URL} target="_blank" rel="noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-4 h-4 fill-current text-red-500" aria-hidden="true"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
            View on Google Maps
          </a>
          <div className="mt-3 rounded overflow-hidden border border-neutral-800">
            <iframe title="Slight Tech Computers Location" src={MAP_EMBED_URL} width="100%" height="360" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </Card>
      </Section>
    </div>
  );
}
