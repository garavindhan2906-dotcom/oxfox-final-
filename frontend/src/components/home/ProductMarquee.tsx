'use client';

import Link from 'next/link';
import SmartImage from '@/components/SmartImage';
import type { Product } from '@/types';

export default function ProductMarquee({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  const items = [...products, ...products];

  return (
    <div className="overflow-hidden py-2">
      <div
        className="flex gap-4"
        style={{ animation: 'oxfox-marquee 15s linear infinite' }}
      >
        {items.map((product, i) => (
          <Link
            key={`${product.id}-${i}`}
            href={`/product/${product.slug}`}
            className="group w-44 flex-shrink-0 sm:w-52"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100">
              {product.primary_image ? (
                <SmartImage
                  src={product.primary_image}
                  alt={product.name}
                  fill
                  sizes="208px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
              )}
              {product.badge && product.badge !== 'none' && (
                <span className="absolute left-2 top-2 rounded-full bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  {product.badge}
                </span>
              )}
            </div>
            <div className="mt-2">
              <p className="truncate text-sm font-semibold text-neutral-900">{product.name}</p>
              {product.price != null && (
                <p className="text-xs text-neutral-500">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
