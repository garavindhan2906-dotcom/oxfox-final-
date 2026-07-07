'use client';

import { useState } from 'react';
import { apiFetch, ApiRequestError } from '@/lib/api';

export default function BulkOrderForm() {
  const [form, setForm] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    categoryInterest: '',
    estimatedQty: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      await apiFetch('/api/bulk-orders', { method: 'POST', body: JSON.stringify(form) });
      setStatus('done');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-800">
        Thanks for reaching out! Our team will contact you shortly to discuss bulk pricing.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-neutral-200 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Company name (optional)"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Category of interest"
          value={form.categoryInterest}
          onChange={(e) => setForm({ ...form, categoryInterest: e.target.value })}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Estimated quantity"
          value={form.estimatedQty}
          onChange={(e) => setForm({ ...form, estimatedQty: e.target.value })}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <textarea
        rows={4}
        placeholder="Tell us more about your bulk order needs..."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {status === 'loading' ? 'Submitting...' : 'Request Bulk Pricing'}
      </button>
    </form>
  );
}
