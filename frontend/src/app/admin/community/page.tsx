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
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await apiFetch<{ posts: CommunityPostAdmin[] }>('/api/community/admin/all', {
      withCredentials: true,
    });
    setPosts(res.posts);
  }

  useEffect(() => {
    load();
  }, []);

  function handleFileChange(chosen: File | null) {
    setFile(chosen);
    if (chosen) {
      setPreview(URL.createObjectURL(chosen));
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!file) { setError('Please choose an image.'); return; }
    setSubmitting(true);
    try {
      const body = new FormData();
      body.append('image', file);
      Object.entries(form).forEach(([k, v]) => body.append(k, v));
      await apiFetch('/api/community/admin', { method: 'POST', body, withCredentials: true });
      setForm({ title: '', caption: '', customerName: '' });
      setFile(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = '';
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not create post.');
    } finally {
      setSubmitting(false);
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
      <p className="mt-1 text-sm text-neutral-500">Upload customer photos and community showcase images.</p>

      {/* Upload form */}
      <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4 rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="text-base font-semibold text-neutral-800">Add New Photo</h2>

        {/* Image upload area */}
        <label className="block cursor-pointer">
          <div
            className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
              preview ? 'border-brand bg-brand/5' : 'border-neutral-300 hover:border-brand hover:bg-neutral-50'
            }`}
          >
            {preview ? (
              <>
                <div className="relative h-40 w-40 overflow-hidden rounded-lg">
                  <Image src={preview} alt="Preview" fill className="object-cover" />
                </div>
                <p className="text-xs font-medium text-neutral-600">{file?.name}</p>
                <p className="text-xs text-neutral-400">{file ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : ''}</p>
                <span className="text-xs text-brand underline">Change image</span>
              </>
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-3xl">📷</div>
                <div>
                  <p className="text-sm font-semibold text-neutral-700">Click to upload image</p>
                  <p className="mt-1 text-xs text-neutral-400">JPG, PNG or WEBP · Max 10MB</p>
                </div>
                <span className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white">Choose Photo</span>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />
        </label>

        {preview && (
          <button
            type="button"
            onClick={() => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
            className="text-xs text-red-500 hover:underline"
          >
            Remove image
          </button>
        )}

        {/* Optional fields */}
        <input
          placeholder="Customer name (optional)"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          placeholder="Title (optional)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Caption (optional)"
          rows={2}
          value={form.caption}
          onChange={(e) => setForm({ ...form, caption: e.target.value })}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !file}
          className="w-full rounded-full bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {submitting ? 'Uploading...' : 'Upload Community Photo'}
        </button>
      </form>

      {/* Existing posts */}
      <div className="mt-8">
        <h2 className="mb-4 text-base font-semibold text-neutral-800">
          Published Photos <span className="ml-1 text-sm font-normal text-neutral-400">({posts.length})</span>
        </h2>
        {posts.length === 0 ? (
          <p className="text-sm text-neutral-400">No community photos yet. Upload one above.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {posts.map((post) => (
              <div key={post.id} className="group relative">
                <div className="media-3-4 overflow-hidden rounded-xl">
                  <Image src={post.image_path} alt={post.title ?? ''} fill sizes="150px" className="object-cover" />
                </div>
                {post.customer_name && (
                  <p className="mt-1 truncate text-xs text-neutral-500">{post.customer_name}</p>
                )}
                <button
                  onClick={() => handleDelete(post.id)}
                  className="mt-1 w-full rounded bg-red-50 py-0.5 text-xs font-medium text-red-600 hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
