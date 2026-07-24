'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { apiFetch, ApiRequestError } from '@/lib/api';

interface ShippingInfo {
  id: number;
  image_url: string | null;
  title: string | null;
  description: string | null;
}

export default function AdminShippingPage() {
  const [info, setInfo] = useState<ShippingInfo | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await apiFetch<{ shipping: ShippingInfo | null }>('/api/shipping');
    setInfo(res.shipping);
    setTitle(res.shipping?.title ?? '');
    setDescription(res.shipping?.description ?? '');
  }

  useEffect(() => { load(); }, []);

  function handleFileChange(chosen: File | null) {
    setFile(chosen);
    setPreview(chosen ? URL.createObjectURL(chosen) : null);
  }

  async function handleImageUpload() {
    if (!file) return;
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const body = new FormData();
      body.append('image', file);
      await apiFetch('/api/shipping/image', { method: 'POST', body, withCredentials: true });
      setFile(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = '';
      setSuccess('Image uploaded successfully.');
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleImageDelete() {
    if (!confirm('Delete the current shipping image?')) return;
    setUploading(true);
    setError('');
    try {
      await apiFetch('/api/shipping/image', { method: 'DELETE', withCredentials: true });
      setSuccess('Image deleted.');
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Delete failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveText(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await apiFetch('/api/shipping', {
        method: 'PUT',
        body: JSON.stringify({ title: title || undefined, description: description || undefined }),
        withCredentials: true,
      });
      setSuccess('Shipping info saved.');
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Shipping Info</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Upload a shipping chart or info image that customers see on the Shipping page.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-4 text-sm text-green-600">{success}</p>}

      {/* Current image */}
      <div className="mt-6 max-w-2xl">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-600">Shipping Image</h2>

        {info?.image_url ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: 'auto' }}>
              <Image
                src={info.image_url}
                alt="Shipping info"
                width={800}
                height={600}
                className="h-auto w-full object-contain"
              />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={handleImageDelete}
                disabled={uploading}
                className="rounded-full border border-red-300 px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {uploading ? 'Deleting...' : 'Delete Image'}
              </button>
              <label className="cursor-pointer text-xs text-brand underline">
                Replace image
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </div>
        ) : (
          <label className="block cursor-pointer">
            <div
              className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors ${
                preview ? 'border-brand bg-brand/5' : 'border-neutral-300 hover:border-brand hover:bg-neutral-50'
              }`}
            >
              {preview ? (
                <>
                  <div className="relative h-48 w-full overflow-hidden rounded-lg">
                    <Image src={preview} alt="Preview" fill className="object-contain" />
                  </div>
                  <p className="text-xs font-medium text-neutral-600">{file?.name}</p>
                  <p className="text-xs text-neutral-400">{file ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : ''}</p>
                  <span className="text-xs text-brand underline">Change image</span>
                </>
              ) : (
                <>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-3xl">🚚</div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-700">Click to upload shipping image</p>
                    <p className="mt-1 text-xs text-neutral-400">JPG, PNG or WEBP · Max 10MB</p>
                    <p className="mt-1 text-xs text-neutral-400">Tip: Upload a shipping zones chart or pricing table</p>
                  </div>
                  <span className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white">Choose Image</span>
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
        )}

        {file && (
          <button
            onClick={handleImageUpload}
            disabled={uploading}
            className="mt-3 rounded-full bg-brand px-5 py-2 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        )}
      </div>

      {/* Text fields */}
      <form onSubmit={handleSaveText} className="mt-8 max-w-2xl space-y-4 rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">Page Text (optional)</h2>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">Page Title</label>
          <input
            placeholder="e.g. Shipping & Delivery"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500">Description</label>
          <textarea
            rows={3}
            placeholder="e.g. We deliver across India via Blue Dart and DTDC. Orders are dispatched within 2–3 business days."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-black disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Text'}
        </button>
      </form>
    </div>
  );
}
