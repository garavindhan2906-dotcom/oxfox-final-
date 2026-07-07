'use client';

import { useRef, useState } from 'react';
import SmartImage from '@/components/SmartImage';
import { apiFetch, ApiRequestError } from '@/lib/api';
import type { ProductImage } from '@/types';

const SLOT_COUNT = 6;

export default function ProductImageUploader({
  productId,
  initialImages,
}: {
  productId: number;
  initialImages: ProductImage[];
}) {
  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => initialImages.find((img) => img.sort_order === i) ?? null);
  const [images, setImages] = useState<(ProductImage | null)[]>(slots);
  const [urlDrafts, setUrlDrafts] = useState<Record<number, string>>({});
  const [busySlot, setBusySlot] = useState<number | null>(null);
  const [error, setError] = useState('');
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  async function refreshFromServer() {
    const { product } = await apiFetch<{ product: { images: ProductImage[] } }>(
      `/api/products/admin/${productId}`,
      { withCredentials: true }
    );
    const next = Array.from({ length: SLOT_COUNT }, (_, i) => product.images.find((img) => img.sort_order === i) ?? null);
    setImages(next);
  }

  async function handleFileSelect(slot: number, file: File | undefined) {
    if (!file) return;
    setError('');
    if (file.size > 10 * 1024 * 1024) {
      setError(`"${file.name}" is larger than 10MB. Please choose a smaller file.`);
      return;
    }
    setBusySlot(slot);
    try {
      const body = new FormData();
      body.append('image', file);
      await apiFetch(`/api/products/${productId}/images/slot/${slot}`, {
        method: 'PUT',
        body,
        withCredentials: true,
      });
      await refreshFromServer();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Upload failed. Please try again.');
    } finally {
      setBusySlot(null);
    }
  }

  async function handleUrlSave(slot: number) {
    const url = urlDrafts[slot]?.trim();
    if (!url) return;
    setError('');
    setBusySlot(slot);
    try {
      const body = new FormData();
      body.append('url', url);
      await apiFetch(`/api/products/${productId}/images/slot/${slot}`, {
        method: 'PUT',
        body,
        withCredentials: true,
      });
      await refreshFromServer();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not save that image URL.');
    } finally {
      setBusySlot(null);
    }
  }

  async function handleClear(slot: number) {
    setBusySlot(slot);
    try {
      await apiFetch(`/api/products/${productId}/images/slot/${slot}`, { method: 'DELETE', withCredentials: true });
      setUrlDrafts((prev) => ({ ...prev, [slot]: '' }));
      await refreshFromServer();
    } finally {
      setBusySlot(null);
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-neutral-700">Images — up to {SLOT_COUNT} (upload or paste URL)</p>

      <div className="mt-3 space-y-2">
        {images.map((img, slot) => (
          <div key={slot} className="flex items-center gap-3">
            {img && (
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200">
                <SmartImage src={img.file_path} alt={`Image ${slot + 1}`} fill sizes="48px" className="object-cover" />
              </div>
            )}
            <input
              type="text"
              placeholder={slot === 0 ? 'Image 1 — primary (URL or pick file)' : `Image ${slot + 1}`}
              value={urlDrafts[slot] ?? img?.file_path ?? ''}
              disabled={busySlot === slot}
              onChange={(e) => setUrlDrafts((prev) => ({ ...prev, [slot]: e.target.value }))}
              onBlur={() => {
                if (urlDrafts[slot] !== undefined && urlDrafts[slot] !== (img?.file_path ?? '')) {
                  handleUrlSave(slot);
                }
              }}
              className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm disabled:opacity-60"
            />
            <button
              type="button"
              disabled={busySlot === slot}
              onClick={() => fileInputRefs.current[slot]?.click()}
              className="text-xs font-semibold uppercase tracking-wide text-brand hover:underline disabled:opacity-60"
            >
              Browse
            </button>
            <input
              ref={(el) => {
                fileInputRefs.current[slot] = el;
              }}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => handleFileSelect(slot, e.target.files?.[0])}
            />
            {img && (
              <button
                type="button"
                disabled={busySlot === slot}
                onClick={() => handleClear(slot)}
                className="text-xs text-red-600 hover:underline disabled:opacity-60"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="mt-2 text-xs text-neutral-500">
        Click <span className="font-semibold">Browse</span> to upload from your computer. Max 10MB per image (smaller
        files load faster).
      </p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
