'use client';

import { useState } from 'react';
import Link from 'next/link';
import SmartImage from '@/components/SmartImage';
import { addToCart } from '@/lib/cart';
import type { Product } from '@/types';

const BADGE_LABEL: Record<string, string> = {
  new: 'New',
  bestseller: 'Bestseller',
  sale: 'Sale',
  limited: 'Limited',
};

export default function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  const discount =
    product.mrp != null && product.price != null && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

  const badgeLabel =
    product.badge && product.badge !== 'none'
      ? BADGE_LABEL[product.badge]
      : product.is_new
        ? 'New'
        : null;

  function handleAddToCart() {
    if (!product.price) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.primary_image ?? null,
      quantity: 1,
      discountTiers: product.discountTiers,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-neutral-50">
        {product.primary_image ? (
          <SmartImage
            src={product.primary_image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl text-neutral-200">📦</div>
        )}

        {discount != null && (
          <span className="absolute left-2 top-2 rounded bg-green-600 px-1.5 py-0.5 text-xs font-bold text-white">
            {discount}% off
          </span>
        )}
        {!discount && badgeLabel && (
          <span className="absolute left-2 top-2 rounded bg-brand px-1.5 py-0.5 text-xs font-semibold text-white">
            {badgeLabel}
          </span>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="rounded bg-neutral-700 px-3 py-1 text-xs font-semibold text-white">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col p-3">
        <Link href={`/product/${product.slug}`} className="flex-1">
          {product.category_name && (
            <p className="mb-1 text-xs text-neutral-400">{product.category_name}</p>
          )}
          <p className="line-clamp-2 text-sm font-medium leading-snug text-neutral-900 group-hover:text-brand">
            {product.name}
          </p>

          {/* Price row */}
          <div className="mt-2">
            {product.price != null ? (
              <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                <span className="text-base font-bold text-neutral-900">₹{product.price.toLocaleString('en-IN')}</span>
                {product.mrp != null && product.mrp > product.price && (
                  <span className="text-xs text-neutral-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                )}
                {discount != null && (
                  <span className="text-xs font-semibold text-green-600">{discount}% off</span>
                )}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Price on request</p>
            )}
          </div>

          {product.in_stock ? (
            <p className="mt-1 text-xs text-green-600">✓ In Stock</p>
          ) : null}
        </Link>

        {/* Add to Cart button */}
        {product.in_stock && product.price != null ? (
          <button
            onClick={handleAddToCart}
            className={`mt-3 w-full rounded-lg py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-brand text-white hover:bg-brand-dark'
            }`}
          >
            {added ? '✓ Added!' : 'Add to Cart'}
          </button>
        ) : (
          <div className="mt-3 h-8" />
        )}
      </div>
    </div>
  );
}
