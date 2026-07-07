'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface AdminComment {
  id: number;
  name: string;
  rating: number | null;
  comment_text: string;
  product_name: string;
  created_at: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await apiFetch<{ comments: AdminComment[] }>('/api/admin/comments', { withCredentials: true });
    setComments(res.comments);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm('Delete this comment?')) return;
    await apiFetch(`/api/admin/comments/${id}`, { method: 'DELETE', withCredentials: true });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Comments</h1>
      {loading ? (
        <p className="mt-6 text-sm text-neutral-500">Loading...</p>
      ) : comments.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500">No comments yet.</p>
      ) : (
        <ul className="mt-6 max-w-2xl space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="rounded-lg border border-neutral-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-900">
                  {c.name} on <span className="text-brand">{c.product_name}</span>
                </p>
                <button onClick={() => handleDelete(c.id)} className="text-sm text-red-600 hover:underline">
                  Delete
                </button>
              </div>
              {c.rating && <p className="text-sm text-amber-500">{'★'.repeat(c.rating)}</p>}
              <p className="mt-1 text-sm text-neutral-600">{c.comment_text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
