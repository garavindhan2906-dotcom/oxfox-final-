'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { apiFetch, ApiRequestError } from '@/lib/api';

interface HeroImage {
  id: number;
  image_url: string;
  sort_order: number;
}

export default function AdminHeroImagesPage() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await apiFetch<{ images: HeroImage[] }>('/api/hero-images/admin/all', { withCredentials: true });
    setImages(res.images);
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
      await apiFetch('/api/hero-images/admin', { method: 'POST', body, withCredentials: true });
      setFile(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = '';
      setSuccess('Image added.');
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleOrderChange(id: number, sortOrder: number) {
    await apiFetch(`/api/hero-images/admin/${id}/order`, {
      method: 'PATCH',
      body: JSON.stringify({ sortOrder }),
      withCredentials: true,
    });
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this image?')) return;
    await apiFetch(`/api/hero-images/admin/${id}`, { method: 'DELETE', withCredentials: true });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Hero Images</h1>
          <p className="mt-1 text-sm text-neutral-500">Slideshow images shown on the homepage hero.</p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setError(''); setSuccess(''); }}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          {showForm ? '✕ Cancel' : '+ Add Image'}
        </button>
      </div>

      {success && <p className="mt-3 text-sm text-green-600">{success}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-5 max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-neutral-800">Add Hero Image</h2>
          <label className="block cursor-pointer">
            <div className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${preview ? 'border-brand bg-brand/5' : 'border-neutral-300 hover:border-brand hover:bg-neutral-50'}`}>
              {preview ? (
                <>
                  <div className="relative h-40 w-full overflow-hidden rounded-lg">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                  </div>
                  <p className="text-xs font-medium text-neutral-600">{file?.name}</p>
                  <span className="text-xs text-brand underline">Change image</span>
                </>
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-3xl">🖼️</div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-700">Click to choose an image</p>
                    <p className="mt-1 text-xs text-neutral-400">JPG, PNG or WEBP · Best at 1920×1080 or wider</p>
                  </div>
                  <span className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white">Choose Image</span>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)} />
          </label>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={uploading || !file}
            className="mt-4 w-full rounded-full bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      )}

      <div className="mt-8">
        <h2 className="mb-4 text-base font-semibold text-neutral-800">
          All Images <span className="ml-1 text-sm font-normal text-neutral-400">({images.length})</span>
        </h2>

        {images.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-neutral-200 py-12 text-center">
            <p className="text-sm text-neutral-400">No hero images yet.</p>
            <button onClick={() => setShowForm(true)} className="mt-2 text-sm font-semibold text-brand hover:underline">
              Add your first image →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {images.map((img) => (
              <div key={img.id}>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-neutral-200">
                  <Image src={img.image_url} alt="" fill sizes="400px" className="object-cover" />
                </div>
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-xs text-neutral-400">Order</span>
                  <input
                    type="number" min={1}
                    defaultValue={img.sort_order === 0 ? '' : img.sort_order}
                    placeholder="#"
                    className="w-12 rounded border border-neutral-300 px-1 py-0.5 text-center text-xs"
                    onBlur={(e) => { const v = parseInt(e.target.value, 10); if (!isNaN(v)) handleOrderChange(img.id, v); }}
                  />
                </div>
                <button onClick={() => handleDelete(img.id)}
                  className="mt-1 w-full rounded bg-red-50 py-0.5 text-xs font-medium text-red-600 hover:bg-red-100">
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
