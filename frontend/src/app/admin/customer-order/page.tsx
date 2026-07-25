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
  sort_order: number;
}

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<CommunityPostAdmin[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Single add form
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await apiFetch<{ posts: CommunityPostAdmin[] }>('/api/community/admin/all', { withCredentials: true });
    setPosts(res.posts);
  }

  useEffect(() => { load(); }, []);

  function handleFileChange(chosen: File | null) {
    setFile(chosen);
    setPreview(chosen ? URL.createObjectURL(chosen) : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setError('Please choose an image.'); return; }
    setUploading(true);
    setError('');
    try {
      const body = new FormData();
      body.append('image', file);
      if (customerName) body.append('customerName', customerName);
      if (caption) body.append('caption', caption);
      await apiFetch('/api/community/admin', { method: 'POST', body, withCredentials: true });
      setFile(null);
      setPreview(null);
      setCustomerName('');
      setCaption('');
      if (fileRef.current) fileRef.current.value = '';
      setSuccess('Photo added successfully.');
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleOrderChange(id: number, sortOrder: number) {
    await apiFetch(`/api/community/admin/${id}/order`, {
      method: 'PATCH',
      body: JSON.stringify({ sortOrder }),
      withCredentials: true,
    });
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this photo?')) return;
    await apiFetch(`/api/community/admin/${id}`, { method: 'DELETE', withCredentials: true });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Custom Order Images</h1>
          <p className="mt-1 text-sm text-neutral-500">Photos shown on the Customer Order page.</p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setError(''); setSuccess(''); }}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          {showForm ? '✕ Cancel' : '+ Add Photo'}
        </button>
      </div>

      {success && <p className="mt-3 text-sm text-green-600">{success}</p>}

      {/* Add photo form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-5 max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-neutral-800">Add New Photo</h2>

          {/* Image picker */}
          <label className="block cursor-pointer">
            <div className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${preview ? 'border-brand bg-brand/5' : 'border-neutral-300 hover:border-brand hover:bg-neutral-50'}`}>
              {preview ? (
                <>
                  <div className="relative h-36 w-36 overflow-hidden rounded-lg">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                  </div>
                  <p className="text-xs font-medium text-neutral-600">{file?.name}</p>
                  <span className="text-xs text-brand underline">Change photo</span>
                </>
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-3xl">📷</div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-700">Click to choose a photo</p>
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

          <div className="mt-4 space-y-3">
            <input
              placeholder="Customer name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Caption (optional)"
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={uploading || !file}
            className="mt-4 w-full rounded-full bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>
      )}

      {/* Existing photos */}
      <div className="mt-8">
        <h2 className="mb-4 text-base font-semibold text-neutral-800">
          All Photos <span className="ml-1 text-sm font-normal text-neutral-400">({posts.length})</span>
        </h2>

        {posts.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-neutral-200 py-12 text-center">
            <p className="text-sm text-neutral-400">No photos yet.</p>
            <button onClick={() => setShowForm(true)} className="mt-2 text-sm font-semibold text-brand hover:underline">
              Add your first photo →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {posts.map((post) => (
              <div key={post.id}>
                <div className="relative aspect-square overflow-hidden rounded-xl border border-neutral-200">
                  <Image src={post.image_path} alt={post.title ?? ''} fill sizes="160px" className="object-cover" />
                </div>
                {post.customer_name && (
                  <p className="mt-1 truncate text-xs text-neutral-500">{post.customer_name}</p>
                )}
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-xs text-neutral-400">Order</span>
                  <input
                    type="number"
                    min={1}
                    defaultValue={post.sort_order === 0 ? '' : post.sort_order}
                    placeholder="#"
                    className="w-12 rounded border border-neutral-300 px-1 py-0.5 text-center text-xs"
                    onBlur={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) handleOrderChange(post.id, val);
                    }}
                  />
                </div>
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
