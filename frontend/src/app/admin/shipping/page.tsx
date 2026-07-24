'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { apiFetch, ApiRequestError } from '@/lib/api';

interface ShippingImage {
  id: number;
  image_url: string;
}

interface ShippingInfo {
  id: number;
  title: string | null;
  description: string | null;
}

export default function AdminShippingPage() {
  const [info, setInfo] = useState<ShippingInfo | null>(null);
  const [images, setImages] = useState<ShippingImage[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await apiFetch<{ shipping: ShippingInfo | null; images: ShippingImage[] }>('/api/shipping');
    setInfo(res.shipping);
    setImages(res.images ?? []);
    setTitle(res.shipping?.title ?? '');
    setDescription(res.shipping?.description ?? '');
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
    const nf = files.filter((_, i) => i !== index);
    const np = previews.filter((_, i) => i !== index);
    setFiles(nf);
    setPreviews(np);
    if (nf.length === 0 && fileRef.current) fileRef.current.value = '';
  }

  async function handleUpload() {
    if (files.length === 0) return;
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const body = new FormData();
      files.forEach((f) => body.append('images', f));
      await apiFetch('/api/shipping/images', { method: 'POST', body, withCredentials: true });
      setFiles([]);
      setPreviews([]);
      if (fileRef.current) fileRef.current.value = '';
      setSuccess(`${files.length} image${files.length > 1 ? 's' : ''} uploaded.`);
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this shipping image?')) return;
    await apiFetch(`/api/shipping/images/${id}`, { method: 'DELETE', withCredentials: true });
    load();
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
        Upload shipping charts, zone maps, or delivery tables. Customers see these on the Shipping page.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-4 text-sm text-green-600">{success}</p>}

      {/* Upload area */}
      <div className="mt-6 max-w-3xl">
        <label className="block cursor-pointer">
          <div
            className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              files.length > 0 ? 'border-brand bg-brand/5' : 'border-neutral-300 hover:border-brand hover:bg-neutral-50'
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-3xl">🚚</div>
            {files.length > 0 ? (
              <p className="text-sm font-semibold text-neutral-700">{files.length} image{files.length > 1 ? 's' : ''} selected</p>
            ) : (
              <>
                <div>
                  <p className="text-sm font-semibold text-neutral-700">Click to select shipping images</p>
                  <p className="mt-1 text-xs text-neutral-400">JPG, PNG or WEBP · Max 10MB each · Select multiple at once</p>
                  <p className="mt-1 text-xs text-neutral-400">Tip: shipping zones chart, delivery table, rate card</p>
                </div>
                <span className="rounded-full bg-brand px-5 py-1.5 text-xs font-semibold text-white">Choose Images</span>
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

        {/* Previews */}
        {previews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {previews.map((src, i) => (
              <div key={i} className="group relative">
                <div className="relative aspect-square overflow-hidden rounded-lg border border-neutral-200">
                  <Image src={src} alt={`Preview ${i + 1}`} fill className="object-contain bg-neutral-50" />
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

        {files.length > 0 && (
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : `Upload ${files.length} Image${files.length > 1 ? 's' : ''}`}
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

      {/* Uploaded images */}
      <div className="mt-10">
        <h2 className="mb-4 text-base font-semibold text-neutral-800">
          Uploaded Images <span className="ml-1 text-sm font-normal text-neutral-400">({images.length})</span>
        </h2>
        {images.length === 0 ? (
          <p className="text-sm text-neutral-400">No shipping images yet. Upload some above.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img) => (
              <div key={img.id} className="group relative">
                <div className="relative aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                  <Image src={img.image_url} alt="Shipping info" fill sizes="220px" className="object-contain" />
                </div>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="mt-1 w-full rounded bg-red-50 py-0.5 text-xs font-medium text-red-600 hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Text fields */}
      <form onSubmit={handleSaveText} className="mt-10 max-w-2xl space-y-4 rounded-xl border border-neutral-200 bg-white p-6">
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
            placeholder="e.g. We deliver across India via Blue Dart and DTDC..."
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
