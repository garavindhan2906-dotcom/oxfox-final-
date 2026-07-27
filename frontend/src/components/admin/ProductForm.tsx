'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiRequestError } from '@/lib/api';
import ProductImageUploader, { type ProductImageUploaderHandle } from './ProductImageUploader';
import type { Category, DiscountTier, Product, ProductBadge } from '@/types';

interface ProductFormState {
  name: string;
  categoryIds: string[];
  subcategoryId: string;
  description: string;
  material: string;
  filterTag: string;
  dimensions: string;
  price: string;
  mrp: string;
  badge: ProductBadge;
  emojiIcon: string;
  isNew: boolean;
  isActive: boolean;
  inStock: boolean;
  stockQty: string;
}

const EMPTY_FORM: ProductFormState = {
  name: '',
  categoryIds: [],
  subcategoryId: '',
  description: '',
  material: 'Food-grade Silicone',
  filterTag: '',
  dimensions: '',
  price: '',
  mrp: '',
  badge: 'none',
  emojiIcon: '',
  isNew: true,
  isActive: true,
  inStock: true,
  stockQty: '',
};

const BADGE_OPTIONS: { value: ProductBadge; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'new', label: 'New' },
  { value: 'bestseller', label: 'Bestseller' },
  { value: 'sale', label: 'Sale' },
  { value: 'limited', label: 'Limited Edition' },
];

export default function ProductForm({ productId }: { productId?: number }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [product, setProduct] = useState<Product | null>(null);
  const [tiers, setTiers] = useState<DiscountTier[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoError, setVideoError] = useState('');
  const videoRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const imageUploaderRef = useRef<ProductImageUploaderHandle>(null);

  useEffect(() => {
    apiFetch<{ categories: Category[] }>('/api/categories/admin/all', { withCredentials: true }).then((res) =>
      setCategories(res.categories)
    );
  }, []);

  useEffect(() => {
    if (!productId) return;
    apiFetch<{ product: Product }>(`/api/products/admin/${productId}`, { withCredentials: true }).then((res) => {
      setProduct(res.product);
      setTiers(res.product.discountTiers ?? []);
      setVideoUrl(res.product.video_url ?? null);
      setForm({
        name: res.product.name,
        categoryIds: res.product.categoryIds?.map(String) ?? [String(res.product.category_id)],
        subcategoryId: res.product.subcategory_id ? String(res.product.subcategory_id) : '',
        description: res.product.description ?? '',
        material: res.product.material ?? '',
        filterTag: res.product.filter_tag ?? '',
        dimensions: res.product.dimensions ?? '',
        price: res.product.price != null ? String(res.product.price) : '',
        mrp: res.product.mrp != null ? String(res.product.mrp) : '',
        badge: res.product.badge ?? 'none',
        emojiIcon: res.product.emoji_icon ?? '',
        isNew: res.product.is_new,
        isActive: res.product.is_active,
        inStock: res.product.in_stock,
        stockQty: res.product.stock_qty != null ? String(res.product.stock_qty) : '',
      });
    });
  }, [productId]);

  const selectedCategory = categories.find((c) => String(c.id) === (form.categoryIds[0] ?? ''));

  function addTier() {
    setTiers([...tiers, { min_qty: 2, discount_percent: 10 }]);
  }

  function updateTier(index: number, patch: Partial<DiscountTier>) {
    setTiers(tiers.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  }

  function removeTier(index: number) {
    setTiers(tiers.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError('');

    if (form.categoryIds.length === 0) {
      setError('Please select at least one category.');
      setStatus('error');
      return;
    }

    const payload = {
      name: form.name,
      categoryId: Number(form.categoryIds[0]),
      categoryIds: form.categoryIds.map(Number),
      subcategoryId: form.subcategoryId ? Number(form.subcategoryId) : null,
      description: form.description || undefined,
      material: form.material || undefined,
      filterTag: form.filterTag || null,
      dimensions: form.dimensions || undefined,
      price: form.price ? Number(form.price) : null,
      mrp: form.mrp ? Number(form.mrp) : null,
      badge: form.badge,
      emojiIcon: form.emojiIcon || null,
      isNew: form.isNew,
      isActive: form.isActive,
      inStock: form.inStock,
      stockQty: form.stockQty ? Number(form.stockQty) : null,
    };

    try {
      let targetId = productId;
      if (productId) {
        await apiFetch(`/api/products/${productId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
          withCredentials: true,
        });
      } else {
        const { id } = await apiFetch<{ id: number }>('/api/products', {
          method: 'POST',
          body: JSON.stringify(payload),
          withCredentials: true,
        });
        targetId = id;
        await imageUploaderRef.current?.uploadPending(id);
      }

      await apiFetch(`/api/products/${targetId}/discount-tiers`, {
        method: 'PUT',
        body: JSON.stringify({ tiers: tiers.map((t) => ({ minQty: t.min_qty, discountPercent: t.discount_percent })) }),
        withCredentials: true,
      });

      if (productId) {
        router.push('/admin/products');
        router.refresh();
      } else {
        router.push(`/admin/products/${targetId}/edit`);
      }
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not save product.');
      setStatus('error');
    }
  }

  async function handleVideoUpload() {
    if (!videoFile || !productId) return;
    setVideoUploading(true);
    setVideoError('');
    try {
      const body = new FormData();
      body.append('video', videoFile);
      const res = await apiFetch<{ videoUrl: string }>(`/api/products/${productId}/video`, {
        method: 'POST',
        body,
        withCredentials: true,
      });
      setVideoUrl(res.videoUrl);
      setVideoFile(null);
      if (videoRef.current) videoRef.current.value = '';
    } catch (err) {
      setVideoError(err instanceof ApiRequestError ? err.message : 'Upload failed.');
    } finally {
      setVideoUploading(false);
    }
  }

  async function handleVideoDelete() {
    if (!productId || !confirm('Delete this product video?')) return;
    setVideoUploading(true);
    setVideoError('');
    try {
      await apiFetch(`/api/products/${productId}/video`, { method: 'DELETE', withCredentials: true });
      setVideoUrl(null);
    } catch (err) {
      setVideoError(err instanceof ApiRequestError ? err.message : 'Delete failed.');
    } finally {
      setVideoUploading(false);
    }
  }

  const inputClass = 'w-full rounded-md border border-neutral-300 px-3 py-2 text-sm';
  const labelClass = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500';

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>
            Product Name <span className="text-brand">*</span>
          </label>
          <input
            required
            placeholder="e.g. Rose Candle Mold"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            Categories <span className="text-brand">*</span>
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            {categories.map((c) => {
              const checked = form.categoryIds.includes(String(c.id));
              return (
                <label
                  key={c.id}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${checked ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 text-neutral-700 hover:border-neutral-500'}`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => {
                      const id = String(c.id);
                      const next = e.target.checked
                        ? [...form.categoryIds, id]
                        : form.categoryIds.filter((x) => x !== id);
                      setForm({ ...form, categoryIds: next, subcategoryId: '' });
                    }}
                  />
                  {c.emoji ? `${c.emoji} ` : ''}{c.name}
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {selectedCategory && selectedCategory.subcategories.length > 0 && (
        <div>
          <label className={labelClass}>Subcategory</label>
          <select
            value={form.subcategoryId}
            onChange={(e) => setForm({ ...form, subcategoryId: e.target.value })}
            className={`${inputClass} sm:w-1/2`}
          >
            <option value="">No subcategory</option>
            {selectedCategory.subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Material</label>
          <input
            value={form.material}
            onChange={(e) => setForm({ ...form, material: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Filter Tag</label>
          <input
            placeholder="e.g. Floral"
            value={form.filterTag}
            onChange={(e) => setForm({ ...form, filterTag: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>
            Price (₹) <span className="text-brand">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="799"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>MRP (₹)</label>
          <input
            type="number"
            step="0.01"
            placeholder="999"
            value={form.mrp}
            onChange={(e) => setForm({ ...form, mrp: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Badge</label>
          <select
            value={form.badge}
            onChange={(e) => setForm({ ...form, badge: e.target.value as ProductBadge })}
            className={inputClass}
          >
            {BADGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Emoji Icon</label>
          <input
            placeholder="🛍️"
            maxLength={8}
            value={form.emojiIcon}
            onChange={(e) => setForm({ ...form, emojiIcon: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Dimensions</label>
          <input
            value={form.dimensions}
            onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Stock Quantity</label>
          <input
            type="number"
            placeholder="Optional"
            value={form.stockQty}
            onChange={(e) => setForm({ ...form, stockQty: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 text-sm text-neutral-700">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} />
          Mark as new
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Active (visible on site)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.inStock}
            onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
          />
          In stock
        </label>
      </div>

      <div>
        <label className={labelClass}>Quantity-Based Discount Tiers</label>

        {tiers.length > 0 && (
          <div className="mt-2 space-y-2">
            {tiers.map((tier, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-neutral-500">Min</span>
                <input
                  type="number"
                  min={1}
                  value={tier.min_qty}
                  onChange={(e) => updateTier(i, { min_qty: Number(e.target.value) })}
                  className="w-20 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
                />
                <span className="text-sm text-neutral-500">units →</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={tier.discount_percent}
                  onChange={(e) => updateTier(i, { discount_percent: Number(e.target.value) })}
                  className="w-20 rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
                />
                <span className="text-sm text-neutral-500">% off</span>
                <button type="button" onClick={() => removeTier(i)} className="text-xs text-red-600 hover:underline">
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={addTier}
            className="text-xs font-semibold uppercase tracking-wide text-brand hover:underline"
          >
            + Add Tier
          </button>
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          e.g. Min 2 units → 20% off. Customer buying that many of this product gets the discount automatically.
        </p>
      </div>

      <div className="border-t border-neutral-200 pt-6">
        <ProductImageUploader ref={imageUploaderRef} productId={productId} initialImages={product?.images ?? []} />
      </div>

      {productId && (
        <div className="border-t border-neutral-200 pt-6">
          <label className={labelClass}>Product Video (optional)</label>
          <p className="mb-3 text-xs text-neutral-500">MP4, MOV, or WEBM · Max 200MB · Shows on product page</p>

          {videoUrl ? (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <video
                src={videoUrl}
                controls
                className="mb-3 max-h-48 w-full rounded-lg object-contain"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleVideoDelete}
                  disabled={videoUploading}
                  className="rounded-full border border-red-300 px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {videoUploading ? 'Deleting...' : 'Delete Video'}
                </button>
                <label className="cursor-pointer text-xs text-brand underline">
                  Replace
                  <input
                    ref={videoRef}
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm"
                    className="sr-only"
                    onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            </div>
          ) : (
            <label className="block cursor-pointer">
              <div className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${videoFile ? 'border-brand bg-brand/5' : 'border-neutral-300 hover:border-brand hover:bg-neutral-50'}`}>
                <div className="text-3xl">🎬</div>
                {videoFile ? (
                  <>
                    <p className="text-sm font-semibold text-neutral-700">{videoFile.name}</p>
                    <p className="text-xs text-neutral-400">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-neutral-700">Click to choose video</p>
                    <p className="text-xs text-neutral-400">MP4, MOV, WEBM · Max 200MB</p>
                  </>
                )}
              </div>
              <input
                ref={videoRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                className="sr-only"
                onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
              />
            </label>
          )}

          {videoFile && !videoUrl && (
            <button
              type="button"
              onClick={handleVideoUpload}
              disabled={videoUploading}
              className="mt-3 rounded-full bg-brand px-5 py-2 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
            >
              {videoUploading ? 'Uploading...' : 'Upload Video'}
            </button>
          )}

          {videoError && <p className="mt-2 text-xs text-red-600">{videoError}</p>}
        </div>
      )}

      <div>
        <label className={labelClass}>
          Description <span className="text-brand">*</span>
        </label>
        <textarea
          required
          rows={5}
          placeholder="Describe the product — size, use case, material details..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-black disabled:opacity-60"
        >
          {status === 'loading' ? 'Saving...' : 'Save Product'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-neutral-700 hover:bg-neutral-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
