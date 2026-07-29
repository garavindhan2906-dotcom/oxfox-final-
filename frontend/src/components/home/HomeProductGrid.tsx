'use client';

import Link from 'next/link';
import SmartImage from '@/components/SmartImage';
import type { Product } from '@/types';

export default function HomeProductGrid({ products }: { products: Product[] }) {
  const display = products.slice(0, 6);
  if (display.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
      {display.map((product) => (
        <Link key={product.id} href={`/product/${product.slug}`} className="group">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
            {product.primary_image ? (
              <SmartImage
                src={product.primary_image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300" />
            )}
            {/* Heart icon */}
            <button
              aria-label="Wishlist"
              onClick={(e) => e.preventDefault()}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
              </svg>
            </button>
          </div>

          {/* Info */}
          <div className="mt-2 flex items-start justify-between gap-1">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-xs font-medium leading-snug text-neutral-900">
                {product.name}
              </p>
              {product.price != null && (
                <p className="mt-0.5 text-xs text-neutral-500">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              )}
            </div>
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
