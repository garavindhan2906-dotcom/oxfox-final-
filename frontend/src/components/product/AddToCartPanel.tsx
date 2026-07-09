'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addToCart, bestDiscountPercent } from '@/lib/cart';
import type { Product } from '@/types';

export default function AddToCartPanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  const tiers = product.discountTiers ?? [];
  const discountPercent = bestDiscountPercent(tiers, quantity);
  const basePrice = product.price ?? 0;
  const discountedPrice = basePrice * (1 - discountPercent / 100);

  function handleAdd() {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price ?? 0,
      image: product.images?.[0]?.file_path ?? null,
      quantity,
      discountTiers: tiers,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const canOrder = product.price != null && product.in_stock;

  return (
    <div className="mt-6 space-y-4">
      {!canOrder && (
        <p className="text-sm text-amber-700">
          {product.price == null ? 'Price on request — contact us for a quote.' : 'Currently out of stock.'}
        </p>
      )}

      {canOrder && (
        <>
          {tiers.length > 0 && (
            <div className="rounded-md bg-neutral-50 p-3 text-sm text-neutral-700">
              <p className="font-medium text-neutral-900">Bulk discounts</p>
              <ul className="mt-1 space-y-0.5">
                {[...tiers]
                  .sort((a, b) => a.min_qty - b.min_qty)
                  .map((tier) => (
                    <li key={tier.min_qty}>
                      Buy {tier.min_qty}+ units → {tier.discount_percent}% off
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3">
            <label htmlFor="quantity" className="text-sm font-medium text-neutral-700">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-20 rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
            />
          </div>

          {discountPercent > 0 ? (
            <p className="text-sm text-neutral-700">
              <span className="font-semibold text-brand">₹{discountedPrice.toFixed(2)}</span>{' '}
              <span className="text-neutral-400 line-through">₹{basePrice.toFixed(2)}</span> each (
              {discountPercent}% off) — ₹{(discountedPrice * quantity).toFixed(2)} total
            </p>
          ) : (
            <p className="text-sm text-neutral-700">₹{basePrice.toFixed(2)} each</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="rounded-full border border-brand px-6 py-3 text-sm font-semibold text-brand hover:bg-brand hover:text-white"
            >
              {added ? 'Added!' : 'Add to Cart'}
            </button>
            <button
              onClick={() => {
                handleAdd();
                router.push('/cart');
              }}
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
}
