'use client';

import { useState } from 'react';
import { apiFetch, ApiRequestError } from '@/lib/api';
import Reveal from '@/components/motion/Reveal';

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
    <section className="bg-neutral-50 py-16">
      <Reveal className="mx-auto max-w-3xl rounded-2xl bg-brand px-6 py-10 text-center text-white sm:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">Limited Offer</p>
        <h2 className="mt-3 text-2xl font-bold uppercase tracking-tight sm:text-3xl">
          Get 10% off your first purchase
        </h2>
        <p className="mt-2 text-sm text-white/85">Join the OXFOX list for early access to new mold drops.</p>

        {status === 'done' ? (
          <p className="mt-6 text-sm font-medium">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-sm flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full rounded-full px-4 py-3 text-sm text-neutral-900 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="whitespace-nowrap rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-black disabled:opacity-60"
            >
              {status === 'loading' ? 'Sending...' : 'Claim 10%'}
            </button>
          </form>
        )}
        {status === 'error' && <p className="mt-3 text-xs text-red-100">{message}</p>}
      </Reveal>
    </section>
  );
}
