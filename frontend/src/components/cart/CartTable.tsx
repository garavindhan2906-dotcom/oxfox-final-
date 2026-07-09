'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cartTotal, effectiveUnitPrice, getCart, removeFromCart, updateQuantity } from '@/lib/cart';
import type { CartItem } from '@/types';

export default function CartTable() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable client-side, after mount
    setItems(getCart());
    setLoaded(true);
    const sync = () => setItems(getCart());
    window.addEventListener('oxfox-cart-updated', sync);
    return () => window.removeEventListener('oxfox-cart-updated', sync);
  }, []);

  if (!loaded) return null;

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-neutral-600">Your cart is empty.</p>
        <Link href="/molds" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
          Browse silicone molds
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-neutral-200">
        {items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 py-4">
            <div className="media-3-4 w-20 flex-shrink-0 rounded-md">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill sizes="80px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                  No image
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900">{item.name}</p>
              {(() => {
                const unitPrice = effectiveUnitPrice(item);
                return unitPrice < item.price ? (
                  <p className="text-sm text-neutral-600">
                    <span className="font-medium text-brand">₹{unitPrice.toFixed(2)}</span>{' '}
                    <span className="text-neutral-400 line-through">₹{item.price}</span> each
                  </p>
                ) : (
                  <p className="text-sm text-neutral-600">₹{item.price} each</p>
                );
              })()}
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => {
                updateQuantity(item.productId, Math.max(1, Number(e.target.value)));
                setItems(getCart());
              }}
              className="w-16 rounded-md border border-neutral-300 px-2 py-1 text-sm"
            />
            <p className="w-20 text-right text-sm font-semibold text-neutral-900">
              ₹{(effectiveUnitPrice(item) * item.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => {
                removeFromCart(item.productId);
                setItems(getCart());
              }}
              aria-label="Remove"
              className="text-sm text-neutral-400 hover:text-red-600"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-neutral-200 pt-6">
        <p className="text-lg font-semibold text-neutral-900">Subtotal: ₹{cartTotal(items).toFixed(2)}</p>
        <Link
          href="/checkout"
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
