'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Category, Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  async function load() {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      apiFetch<{ products: Product[] }>('/api/products/admin/all', { withCredentials: true }),
      apiFetch<{ categories: Category[] }>('/api/categories/admin/all', { withCredentials: true }),
    ]);
    setProducts(productsRes.products);
    setCategories(categoriesRes.categories);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, []);

  async function toggleActive(product: Product) {
    await apiFetch(`/api/products/${product.id}/active`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive: !product.is_active }),
      withCredentials: true,
    });
    load();
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    await apiFetch(`/api/products/${product.id}`, { method: 'DELETE', withCredentials: true });
    load();
  }

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.trim().toLowerCase());
      const matchesCategory = !categoryFilter || String(p.category_id) === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-600">
            🔒 Admin
          </span>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-neutral-600 hover:text-brand"
          >
            🔗 View Store
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji ? `${c.emoji} ` : ''}
              {c.name}
            </option>
          ))}
        </select>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white hover:bg-black"
        >
          + Add Product
        </Link>
        <a
          href="/api/products/admin/export"
          className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-neutral-700 hover:bg-neutral-100"
        >
          ⬇ Export
        </a>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-neutral-500">Loading products...</p>
      ) : (
        <table className="mt-6 w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Category</th>
              <th className="py-2">Price</th>
              <th className="py-2">Badge</th>
              <th className="py-2">Status</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td className="py-2 font-medium text-neutral-900">
                  {p.emoji_icon && <span className="mr-1">{p.emoji_icon}</span>}
                  {p.name}
                </td>
                <td className="py-2 text-neutral-600">{p.category_name}</td>
                <td className="py-2 text-neutral-600">{p.price != null ? `₹${p.price}` : 'On request'}</td>
                <td className="py-2 text-neutral-600 capitalize">{p.badge !== 'none' ? p.badge : '—'}</td>
                <td className="py-2">
                  <button
                    onClick={() => toggleActive(p)}
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.is_active ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {p.is_active ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td className="space-x-3 py-2 text-right">
                  <Link href={`/admin/products/${p.id}/edit`} className="text-brand hover:underline">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(p)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-sm text-neutral-500">
                  No products match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
