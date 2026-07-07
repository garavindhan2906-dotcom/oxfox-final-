'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiRequestError } from '@/lib/api';

export default function CommentForm({ productId }: { productId: number }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      await apiFetch(`/api/products/${productId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ name, rating, commentText: text }),
      });
      setName('');
      setText('');
      setRating(5);
      setStatus('idle');
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not post your review.');
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-lg border border-neutral-200 p-4">
      <p className="text-sm font-semibold text-neutral-900">Leave a review</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          required
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} star{n > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>
      <textarea
        required
        rows={3}
        placeholder="Share your experience with this mold..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {status === 'loading' ? 'Posting...' : 'Post Review'}
      </button>
    </form>
  );
}
