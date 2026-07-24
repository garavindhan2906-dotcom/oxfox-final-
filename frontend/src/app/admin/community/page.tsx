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
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await apiFetch<{ posts: CommunityPostAdmin[] }>('/api/community/admin/all', {
      withCredentials: true,
    });
    setPosts(res.posts);
  }

  useEffect(() => { load(); }, []);

  function handleFilesChange(chosen: FileList | null) {
    if (!chosen) return;
    const arr = Array.from(chosen);
    setFiles(arr);
    setPreviews(arr.map((f) => URL.createObjectURL(f)));
    setError('');
    setSuccess('');
  }

  function removeFile(index: number) {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    if (newFiles.length === 0 && fileRef.current) fileRef.current.value = '';
  }

  async function handleUpload() {
    if (files.length === 0) return;
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const body = new FormData();
      files.forEach((f) => body.append('images', f));
      await apiFetch('/api/community/admin/bulk', { method: 'POST', body, withCredentials: true });
      setFiles([]);
      setPreviews([]);
      if (fileRef.current) fileRef.current.value = '';
      setSuccess(`${files.length} photo${files.length > 1 ? 's' : ''} uploaded successfully.`);
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
    if (!confirm('Delete this community photo?')) return;
    await apiFetch(`/api/community/admin/${id}`, { method: 'DELETE', withCredentials: true });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Community Photos</h1>
      <p className="mt-1 text-sm text-neutral-500">Upload customer photos for the community showcase page.</p>

      {/* Upload area */}
      <div className="mt-6 max-w-3xl">
        <label className="block cursor-pointer">
          <div
            className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              files.length > 0 ? 'border-brand bg-brand/5' : 'border-neutral-300 hover:border-brand hover:bg-neutral-50'
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-3xl">📷</div>
            {files.length > 0 ? (
              <p className="text-sm font-semibold text-neutral-700">{files.length} photo{files.length > 1 ? 's' : ''} selected</p>
            ) : (
              <>
                <div>
                  <p className="text-sm font-semibold text-neutral-700">Click to select photos</p>
                  <p className="mt-1 text-xs text-neutral-400">JPG, PNG or WEBP · Max 10MB each · Select multiple at once</p>
                </div>
                <span className="rounded-full bg-brand px-5 py-1.5 text-xs font-semibold text-white">Choose Photos</span>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            className="sr-only"
            onChange={(e) => handleFilesChange(e.target.files)}
          />
        </label>

        {/* Selected previews */}
        {previews.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
            {previews.map((src, i) => (
              <div key={i} className="group relative">
                <div className="relative aspect-square overflow-hidden rounded-lg border border-neutral-200">
                  <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-3 text-sm text-green-600">{success}</p>}

        {files.length > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : `Upload ${files.length} Photo${files.length > 1 ? 's' : ''}`}
            </button>
            <button
              onClick={() => { setFiles([]); setPreviews([]); if (fileRef.current) fileRef.current.value = ''; }}
              className="text-xs text-neutral-500 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Existing posts */}
      <div className="mt-10">
        <h2 className="mb-4 text-base font-semibold text-neutral-800">
          Published Photos <span className="ml-1 text-sm font-normal text-neutral-400">({posts.length})</span>
        </h2>
        {posts.length === 0 ? (
          <p className="text-sm text-neutral-400">No community photos yet. Upload some above.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {posts.map((post) => (
              <div key={post.id} className="group relative">
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
