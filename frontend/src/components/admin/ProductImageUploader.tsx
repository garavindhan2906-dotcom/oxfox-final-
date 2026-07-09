'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import SmartImage from '@/components/SmartImage';
import { apiFetch, ApiRequestError } from '@/lib/api';
import type { ProductImage } from '@/types';

const SLOT_COUNT = 6;

type PendingSlot = { type: 'file'; file: File; previewUrl: string } | { type: 'url'; url: string };

export interface ProductImageUploaderHandle {
  /** Uploads any images picked before the product existed. Call right after the product is created. */
  uploadPending: (newProductId: number) => Promise<void>;
}

interface Props {
  /** Omit while creating a new product — picked images are staged locally until `uploadPending` is called. */
  productId?: number;
  initialImages: ProductImage[];
}

const ProductImageUploader = forwardRef<ProductImageUploaderHandle, Props>(function ProductImageUploader(
  { productId, initialImages },
  ref
) {
  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => initialImages.find((img) => img.sort_order === i) ?? null);
  const [images, setImages] = useState<(ProductImage | null)[]>(slots);
  const [pending, setPending] = useState<Record<number, PendingSlot | undefined>>({});
  const [urlDrafts, setUrlDrafts] = useState<Record<number, string>>({});
  const [busySlot, setBusySlot] = useState<number | null>(null);
  const [error, setError] = useState('');
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  async function refreshFromServer(id: number) {
    const { product } = await apiFetch<{ product: { images: ProductImage[] } }>(`/api/products/admin/${id}`, {
      withCredentials: true,
    });
    const next = Array.from({ length: SLOT_COUNT }, (_, i) => product.images.find((img) => img.sort_order === i) ?? null);
    setImages(next);
  }

  async function uploadSlotToServer(id: number, slot: number, source: PendingSlot) {
    const body = new FormData();
    if (source.type === 'file') body.append('image', source.file);
    else body.append('url', source.url);
    await apiFetch(`/api/products/${id}/images/slot/${slot}`, { method: 'PUT', body, withCredentials: true });
  }

  useImperativeHandle(ref, () => ({
    async uploadPending(newProductId: number) {
      const entries = Object.entries(pending) as unknown as [string, PendingSlot][];
      for (const [slotStr, source] of entries) {
        await uploadSlotToServer(newProductId, Number(slotStr), source);
      }
      if (entries.length > 0) {
        await refreshFromServer(newProductId);
      }
    },
  }));

  async function handleFileSelect(slot: number, file: File | undefined) {
    if (!file) return;
    setError('');
    if (file.size > 10 * 1024 * 1024) {
      setError(`"${file.name}" is larger than 10MB. Please choose a smaller file.`);
      return;
    }

    if (!productId) {
      setPending((prev) => ({ ...prev, [slot]: { type: 'file', file, previewUrl: URL.createObjectURL(file) } }));
      return;
    }

    setBusySlot(slot);
    try {
      await uploadSlotToServer(productId, slot, { type: 'file', file, previewUrl: '' });
      await refreshFromServer(productId);
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

    if (!productId) {
      setPending((prev) => ({ ...prev, [slot]: { type: 'url', url } }));
      return;
    }

    setBusySlot(slot);
    try {
      await uploadSlotToServer(productId, slot, { type: 'url', url });
      await refreshFromServer(productId);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not save that image URL.');
    } finally {
      setBusySlot(null);
    }
  }

  async function handleClear(slot: number) {
    setUrlDrafts((prev) => ({ ...prev, [slot]: '' }));

    if (!productId) {
      setPending((prev) => {
        const next = { ...prev };
        delete next[slot];
        return next;
      });
      return;
    }

    setBusySlot(slot);
    try {
      await apiFetch(`/api/products/${productId}/images/slot/${slot}`, { method: 'DELETE', withCredentials: true });
      await refreshFromServer(productId);
    } finally {
      setBusySlot(null);
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-neutral-700">Images — up to {SLOT_COUNT} (upload or paste URL)</p>
      {!productId && (
        <p className="mt-1 text-xs text-neutral-500">
          Pick your images now — they&apos;ll upload automatically once you save the product.
        </p>
      )}

      <div className="mt-3 space-y-2">
        {images.map((img, slot) => {
          const pendingSlot = pending[slot];
          const previewSrc =
            img?.file_path ?? (pendingSlot?.type === 'file' ? pendingSlot.previewUrl : pendingSlot?.type === 'url' ? pendingSlot.url : null);
          const isPendingFile = pendingSlot?.type === 'file';

          return (
            <div key={slot} className="flex items-center gap-3">
              {previewSrc && (
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200">
                  {img ? (
                    <SmartImage src={previewSrc} alt={`Image ${slot + 1}`} fill sizes="48px" className="object-cover" />
                  ) : (
                    // Local file preview via blob: URL — next/image can't optimize those.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewSrc} alt={`Image ${slot + 1}`} className="h-full w-full object-cover" />
                  )}
                </div>
              )}
              <input
                type="text"
                placeholder={slot === 0 ? 'Image 1 — primary (URL or pick file)' : `Image ${slot + 1}`}
                value={isPendingFile ? pendingSlot.file.name : urlDrafts[slot] ?? img?.file_path ?? (pendingSlot?.type === 'url' ? pendingSlot.url : '')}
                disabled={busySlot === slot || isPendingFile}
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
              {(img || pendingSlot) && (
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
          );
        })}
      </div>

      <p className="mt-2 text-xs text-neutral-500">
        Click <span className="font-semibold">Browse</span> to upload from your computer. Max 10MB per image (smaller
        files load faster).
      </p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
});

export default ProductImageUploader;
