'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { apiFetch, ApiRequestError } from '@/lib/api';

interface CommunityPostAdmin {
  id: number;
  title: string | null;
  image_path: string;
  caption: string | null;
  customer_name: string | null;
}

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<CommunityPostAdmin[]>([]);
  const [form, setForm] = useState({ title: '', caption: '', customerName: '' });
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await apiFetch<{ posts: CommunityPostAdmin[] }>('/api/community/admin/all', {
      withCredentials: true,
    });
    setPosts(res.posts);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError('Please choose an image.');
      return;
    }
    try {
      const body = new FormData();
      body.append('image', file);
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      await apiFetch('/api/community/admin', { method: 'POST', body, withCredentials: true });
      setForm({ title: '', caption: '', customerName: '' });
      if (fileRef.current) fileRef.current.value = '';
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not create post.');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this community post?')) return;
    await apiFetch(`/api/community/admin/${id}`, { method: 'DELETE', withCredentials: true });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Community Posts</h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-3 rounded-xl border border-neutral-200 p-4">
        <input type="file" ref={fileRef} accept="image/png,image/jpeg,image/webp" />
        <input
          placeholder="Title (optional)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Customer name (optional)"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Caption (optional)"
          value={form.caption}
          onChange={(e) => setForm({ ...form, caption: e.target.value })}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          Add Post
        </button>
      </form>

      <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4">
        {posts.map((post) => (
          <div key={post.id}>
            <div className="media-3-4 rounded-md">
              <Image src={post.image_path} alt={post.title ?? ''} fill sizes="120px" />
            </div>
            <button onClick={() => handleDelete(post.id)} className="mt-1 w-full text-xs text-red-600 hover:underline">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
