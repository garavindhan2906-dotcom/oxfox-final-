'use client';

import { useRef, useState, useEffect } from 'react';
import SmartImage from '@/components/SmartImage';
import { apiFetch, ApiRequestError } from '@/lib/api';
import type { Category } from '@/types';

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('');
  const [newSubName, setNewSubName] = useState<Record<number, string>>({});
  const [bannerDrafts, setBannerDrafts] = useState<Record<number, string>>({});
  const [busyBanner, setBusyBanner] = useState<number | null>(null);
  const [error, setError] = useState('');
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  async function load() {
    const res = await apiFetch<{ categories: Category[] }>('/api/categories/admin/all', { withCredentials: true });
    setCategories(res.categories);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, []);

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await apiFetch('/api/categories', {
        method: 'POST',
        body: JSON.stringify({ name: newCategoryName, emoji: newCategoryEmoji || undefined }),
        withCredentials: true,
      });
      setNewCategoryName('');
      setNewCategoryEmoji('');
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not create category.');
    }
  }

  async function toggleCategoryActive(cat: Category) {
    await apiFetch(`/api/categories/${cat.id}`, {
      method: 'PUT',
      body: JSON.stringify({ isActive: !cat.is_active }),
      withCredentials: true,
    });
    load();
  }

  async function updateCategoryEmoji(cat: Category, emoji: string) {
    if (emoji === (cat.emoji ?? '')) return;
    await apiFetch(`/api/categories/${cat.id}`, {
      method: 'PUT',
      body: JSON.stringify({ emoji }),
      withCredentials: true,
    });
    load();
  }

  async function handleDeleteCategory(cat: Category) {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await apiFetch(`/api/categories/${cat.id}`, { method: 'DELETE', withCredentials: true });
      load();
    } catch (err) {
      alert(err instanceof ApiRequestError ? err.message : 'Could not delete category.');
    }
  }

  async function handleBannerUrlSave(cat: Category) {
    const url = bannerDrafts[cat.id]?.trim();
    if (!url || url === (cat.banner_image ?? '')) return;
    setError('');
    setBusyBanner(cat.id);
    try {
      const body = new FormData();
      body.append('url', url);
      await apiFetch(`/api/categories/${cat.id}/banner`, { method: 'PUT', body, withCredentials: true });
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not save that banner URL.');
    } finally {
      setBusyBanner(null);
    }
  }

  async function handleBannerFileSelect(cat: Category, file: File | undefined) {
    if (!file) return;
    setError('');
    if (file.size > 10 * 1024 * 1024) {
      setError(`"${file.name}" is larger than 10MB. Please choose a smaller file.`);
      return;
    }
    setBusyBanner(cat.id);
    try {
      const body = new FormData();
      body.append('image', file);
      await apiFetch(`/api/categories/${cat.id}/banner`, { method: 'PUT', body, withCredentials: true });
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Upload failed. Please try again.');
    } finally {
      setBusyBanner(null);
    }
  }

  async function handleAddSubcategory(categoryId: number) {
    const name = newSubName[categoryId];
    if (!name?.trim()) return;
    await apiFetch(`/api/categories/${categoryId}/subcategories`, {
      method: 'POST',
      body: JSON.stringify({ name }),
      withCredentials: true,
    });
    setNewSubName({ ...newSubName, [categoryId]: '' });
    load();
  }

  async function toggleSubActive(subId: number, isActive: boolean) {
    await apiFetch(`/api/subcategories/${subId}`, {
      method: 'PUT',
      body: JSON.stringify({ isActive: !isActive }),
      withCredentials: true,
    });
    load();
  }

  async function handleDeleteSub(subId: number) {
    if (!confirm('Delete this subcategory?')) return;
    await apiFetch(`/api/subcategories/${subId}`, { method: 'DELETE', withCredentials: true });
    load();
  }

  return (
    <div className="max-w-3xl space-y-8">
      <form onSubmit={handleCreateCategory} className="flex gap-3">
        <input
          placeholder="🧵"
          maxLength={8}
          value={newCategoryEmoji}
          onChange={(e) => setNewCategoryEmoji(e.target.value)}
          className="w-16 rounded-md border border-neutral-300 px-3 py-2 text-center text-sm"
        />
        <input
          required
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          Add Category
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  defaultValue={cat.emoji ?? ''}
                  placeholder="🧵"
                  maxLength={8}
                  onBlur={(e) => updateCategoryEmoji(cat, e.target.value)}
                  className="w-12 rounded-md border border-neutral-200 px-2 py-1 text-center text-sm"
                />
                <h3 className="font-semibold text-neutral-900">{cat.name}</h3>
              </div>
              <div className="flex gap-3 text-sm">
                <button
                  onClick={() => toggleCategoryActive(cat)}
                  className={cat.is_active ? 'text-green-700' : 'text-neutral-500'}
                >
                  {cat.is_active ? 'Active' : 'Hidden'}
                </button>
                <button onClick={() => handleDeleteCategory(cat)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>

            {/* Card image upload */}
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">Card Image</p>
              <label className="block cursor-pointer">
                <div className={`relative flex items-center gap-4 overflow-hidden rounded-xl border-2 border-dashed p-3 transition-colors ${busyBanner === cat.id ? 'opacity-60' : 'hover:border-brand hover:bg-neutral-50'} ${cat.banner_image ? 'border-brand/40 bg-brand/5' : 'border-neutral-300'}`}>
                  {cat.banner_image ? (
                    <>
                      <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200">
                        <SmartImage src={cat.banner_image} alt={cat.name} fill sizes="64px" className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-700">Card image set</p>
                        <p className="mt-0.5 text-xs text-brand underline">Click to change image</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-20 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-2xl">🖼️</div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-700">Upload card image</p>
                        <p className="mt-0.5 text-xs text-neutral-400">JPG, PNG or WEBP · Max 10MB</p>
                        <span className="mt-2 inline-block rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">Choose Image</span>
                      </div>
                    </>
                  )}
                  {busyBanner === cat.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                      <p className="text-xs font-semibold text-brand">Uploading…</p>
                    </div>
                  )}
                </div>
                <input
                  ref={(el) => { fileInputRefs.current[cat.id] = el; }}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  disabled={busyBanner === cat.id}
                  onChange={(e) => handleBannerFileSelect(cat, e.target.files?.[0])}
                />
              </label>
            </div>

            <ul className="mt-3 space-y-1">
              {cat.subcategories.map((sub) => (
                <li key={sub.id} className="flex items-center justify-between text-sm text-neutral-600">
                  <span>{sub.name}</span>
                  <span className="flex gap-3">
                    <button onClick={() => toggleSubActive(sub.id, sub.is_active)}>
                      {sub.is_active ? 'Active' : 'Hidden'}
                    </button>
                    <button onClick={() => handleDeleteSub(sub.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex gap-2">
              <input
                placeholder="New subcategory name"
                value={newSubName[cat.id] ?? ''}
                onChange={(e) => setNewSubName({ ...newSubName, [cat.id]: e.target.value })}
                className="flex-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
              />
              <button
                onClick={() => handleAddSubcategory(cat.id)}
                className="rounded-md border border-brand px-3 py-1.5 text-sm text-brand hover:bg-brand hover:text-white"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
