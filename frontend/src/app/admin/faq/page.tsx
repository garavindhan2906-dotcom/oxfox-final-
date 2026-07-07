'use client';

import { useEffect, useState } from 'react';
import { apiFetch, ApiRequestError } from '@/lib/api';

interface FaqAdminItem {
  id: number;
  question: string;
  answer: string;
  is_active: boolean;
}

export default function AdminFaqPage() {
  const [items, setItems] = useState<FaqAdminItem[]>([]);
  const [form, setForm] = useState({ question: '', answer: '' });
  const [error, setError] = useState('');

  async function load() {
    const res = await apiFetch<{ items: FaqAdminItem[] }>('/api/faq/admin/all', { withCredentials: true });
    setItems(res.items);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await apiFetch('/api/faq/admin', { method: 'POST', body: JSON.stringify(form), withCredentials: true });
      setForm({ question: '', answer: '' });
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not create FAQ item.');
    }
  }

  async function toggleActive(item: FaqAdminItem) {
    await apiFetch(`/api/faq/admin/${item.id}`, {
      method: 'PUT',
      body: JSON.stringify({ isActive: !item.is_active }),
      withCredentials: true,
    });
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this FAQ item?')) return;
    await apiFetch(`/api/faq/admin/${id}`, { method: 'DELETE', withCredentials: true });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">FAQ</h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-3 rounded-xl border border-neutral-200 p-4">
        <input
          required
          placeholder="Question"
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <textarea
          required
          rows={3}
          placeholder="Answer"
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          Add FAQ Item
        </button>
      </form>

      <ul className="mt-6 max-w-xl space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-900">{item.question}</p>
              <div className="flex gap-3 text-xs">
                <button onClick={() => toggleActive(item)} className={item.is_active ? 'text-green-700' : 'text-neutral-500'}>
                  {item.is_active ? 'Active' : 'Hidden'}
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-neutral-600">{item.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
