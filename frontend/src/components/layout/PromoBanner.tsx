'use client';

import { useState } from 'react';
import Image from 'next/image';
import { apiFetch, ApiRequestError } from '@/lib/api';

export default function PromoBanner() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await apiFetch<{ message: string }>('/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email, source: 'homepage_banner' }),
      });
      setMessage(res.message);
      setStatus('done');
      setEmail('');
    } catch (err) {
      setMessage(err instanceof ApiRequestError ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  return (
    <section className="bg-[#FAF8F5] px-4 py-10 sm:px-6 sm:py-14">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl px-6 py-10 sm:px-10 sm:py-12">
        {/* Background image — using <Image> for reliable mobile rendering */}
        <Image src="/join.jpeg" alt="" fill className="object-cover object-center" sizes="(max-width: 896px) 100vw, 896px" priority />

        {/* Subtle overlay */}
        <div className="pointer-events-none absolute inset-0 bg-white/10" />

        <div className="relative z-10 grid gap-8 sm:grid-cols-2 sm:gap-10">

          {/* ── Left side ── */}
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#8B6340]/30 bg-white/70 px-3 py-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#3B2A1C]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l1.4 4.2H18l-3.6 2.6 1.4 4.2-3.8-2.8-3.8 2.8 1.4-4.2L6 6.2h4.6z" />
              </svg>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2A1F14]">Join the OXFOX Club</span>
            </div>

            {/* Heading */}
            <h2 className="font-display text-4xl font-bold leading-tight text-[#2A1F14] sm:text-5xl">
              Unlock <span className="font-sans">10%</span> OFF
            </h2>
            <p className="font-script mt-1 text-3xl text-[#2A1F14]/70 sm:text-4xl">
              your first order
            </p>

            {/* Description */}
            <p className="mt-3 text-xs leading-relaxed text-neutral-600 sm:text-sm">
              Get early access to new silicone mold collections, festive launches and exclusive member-only offers.
            </p>

            {/* 4 perks */}
            <div className="mt-5 grid grid-cols-4 gap-1 text-center">
              {[
                {
                  label: 'Early\nAccess',
                  icon: <><circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" /><polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" /></>,
                },
                {
                  label: 'New Mold\nReleases',
                  icon: <><path strokeLinecap="round" strokeLinejoin="round" d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" /></>,
                },
                {
                  label: 'Exclusive\nOffers',
                  icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 2H2v10l9.3 9.3a1 1 0 0 0 1.4 0l7.6-7.6a1 1 0 0 0 0-1.4L12 2z" /><circle cx="7" cy="7" r="1.5" fill="currentColor" strokeWidth={0} /></>,
                },
                {
                  label: 'Special\nCollections',
                  icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M20 12v10H4V12" /><path strokeLinecap="round" strokeLinejoin="round" d="M22 7H2v5h20V7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 22V7" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></>,
                },
              ].map(({ label, icon }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8B6340]/25 bg-white/60">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                      {icon}
                    </svg>
                  </div>
                  <p className="whitespace-pre-line text-[9px] font-medium leading-tight text-neutral-600">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right side ── */}
          <div className="flex flex-col gap-3">
            {status === 'done' ? (
              <div className="rounded-2xl bg-white/70 p-6 text-center">
                <p className="font-display text-lg font-bold text-[#2A1F14]">You&apos;re in!</p>
                <p className="mt-1 text-sm text-neutral-500">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* Email input */}
                <div className="flex items-center gap-3 rounded-xl border border-[#C9B49A] bg-white px-4 py-3 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                  </svg>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 bg-transparent text-sm text-neutral-800 placeholder-neutral-400 outline-none"
                  />
                </div>
                {/* CTA button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full rounded-xl bg-[#2A1F14] py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#3B2A1C] disabled:opacity-60"
                >
                  {status === 'loading' ? 'Sending…' : 'Get My 10% OFF'}
                </button>
              </form>
            )}

            {status === 'error' && <p className="text-xs text-red-600">{message}</p>}

            {/* No spam */}
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
              </svg>
              <p className="text-[10px] text-neutral-500">No spam. Just new launches and exclusive offers.</p>
            </div>

            {/* Preview card */}
            <div className="flex items-center gap-3 rounded-xl border border-[#C9B49A]/40 bg-white/50 px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12v10H4V12" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 7H2v5h20V7z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V7" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
              <p className="text-xs leading-relaxed text-neutral-600">
                Plus, receive previews of every new mold before anyone else!
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
