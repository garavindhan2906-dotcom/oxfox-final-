'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cartTotal, effectiveUnitPrice, getCart, removeFromCart, updateQuantity } from '@/lib/cart';
import { getWishlist, toggleWishlist } from '@/lib/wishlist';
import SmartImage from '@/components/SmartImage';
import type { CartItem, Product } from '@/types';


function Stars() {
  return (
    <div className="mt-0.5 flex items-center gap-0.5">
      {[1, 2, 3, 4].map((s) => (
        <svg key={s} className="h-3 w-3 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <svg className="h-3 w-3 text-amber-300" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="ml-1 text-[10px] text-neutral-400">(12)</span>
    </div>
  );
}

export default function CartTable() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [suggested, setSuggested] = useState<Product[]>([]);

  useEffect(() => {
    const cart = getCart();
    setItems(cart);
    setLoaded(true);
    setWishlist(getWishlist());
    const syncCart = () => setItems(getCart());
    const syncWish = () => setWishlist(getWishlist());
    window.addEventListener('oxfox-cart-updated', syncCart);
    window.addEventListener('oxfox-wishlist-updated', syncWish);

    fetch('/api/products?limit=12')
      .then((r) => r.json())
      .then((d) => {
        const cartIds = new Set(cart.map((i) => i.productId));
        setSuggested((d.products ?? []).filter((p: Product) => !cartIds.has(p.id)).slice(0, 8));
      })
      .catch(() => {});

    return () => {
      window.removeEventListener('oxfox-cart-updated', syncCart);
      window.removeEventListener('oxfox-wishlist-updated', syncWish);
    };
  }, []);

  if (!loaded) return null;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <p className="text-neutral-500">Your cart is empty.</p>
        <Link href="/molds" className="mt-4 inline-block rounded-full bg-[#3B2A1C] px-6 py-2.5 text-sm font-semibold text-white">
          Browse Molds
        </Link>
      </div>
    );
  }

  const total = cartTotal(items);

  return (
    <div className="space-y-3">
      {/* Cart items */}
      {items.map((item) => {
        const unitPrice = effectiveUnitPrice(item);
        const lineTotal = unitPrice * item.quantity;
        return (
          <div key={item.productId} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex gap-3">
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                {item.image ? (
                  <Image src={item.image} alt={item.name} width={80} height={80} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-neutral-200" />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{item.name}</p>
                    <p className="text-xs text-neutral-400">Premium Silicone Mold</p>
                    <Stars />
                  </div>
                  <button
                    aria-label={wishlist.has(item.productId) ? 'Remove from wishlist' : 'Add to wishlist'}
                    onClick={() => toggleWishlist(item.productId)}
                    className="flex-shrink-0 transition-transform active:scale-90"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-colors" fill={wishlist.has(item.productId) ? '#ef4444' : 'none'} viewBox="0 0 24 24" stroke={wishlist.has(item.productId) ? '#ef4444' : '#d1d5db'} strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
                    </svg>
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-full border border-neutral-200 px-3 py-1.5">
                    <button onClick={() => { updateQuantity(item.productId, Math.max(1, item.quantity - 1)); setItems(getCart()); }} className="text-lg leading-none text-neutral-500 hover:text-neutral-900">−</button>
                    <span className="w-4 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => { updateQuantity(item.productId, item.quantity + 1); setItems(getCart()); }} className="text-lg leading-none text-neutral-500 hover:text-neutral-900">+</button>
                  </div>
                  <p className="text-base font-bold text-neutral-900">₹{lineTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => { removeFromCart(item.productId); setItems(getCart()); }}
              className="mt-3 flex items-center gap-1 text-xs text-neutral-400 hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
              </svg>
              Remove
            </button>
          </div>
        );
      })}

      {/* 4 trust icons */}
      <div className="grid grid-cols-4 gap-1 rounded-2xl border border-neutral-100 bg-white px-2 py-4">
        {[
          { label: 'Food-safe Silicone', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8 6 5 9 5 13a7 7 0 0 0 14 0c0-4-3-7-7-11Z" /> },
          { label: 'Handmade in India', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M18 11V6l-2-2H8L6 6v5" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 11c0 3.31 2.69 6 6 6s6-2.69 6-6" /></> },
          { label: 'Secure Payment', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
          { label: 'Carefully Packed', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></> },
        ].map(({ label, icon }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {icon}
            </svg>
            <p className="text-[9px] leading-tight text-neutral-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Order summary */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <span className="text-sm text-neutral-600">Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
          <span className="text-sm font-bold text-neutral-900">₹{total.toFixed(2)}</span>
        </div>
        <div className="flex items-start justify-between pt-3">
          <div>
            <p className="text-sm text-neutral-600">Estimated Delivery</p>
            <p className="text-sm font-semibold text-neutral-900">3 – 6 Days</p>
          </div>
          <div className="text-right">
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-auto h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M1 3h13v13H1zM14 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <p className="text-[10px] text-neutral-400">Shipping calculated</p>
            <p className="text-[10px] text-neutral-400">at checkout</p>
          </div>
        </div>
      </div>

      {/* Checkout button */}
      <Link
        href="/checkout"
        className="flex w-full items-center justify-center gap-3 bg-[#2A1F14] py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-[#3B2A1C]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Proceed to Checkout
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      {/* Secure payment */}
      <p className="text-center text-xs text-neutral-400">🔒 100% Secure Payment</p>

      {/* Payment icons */}
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl border border-neutral-100 bg-white px-4 py-3">
        {['VISA', 'Mastercard', 'UPI', 'G Pay', 'PhonePe', 'Paytm', 'Razorpay'].map((method) => (
          <span key={method} className="rounded border border-neutral-200 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">
            {method}
          </span>
        ))}
      </div>

      {/* You may also like */}
      {suggested.length > 0 && (
        <div className="pt-2">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-800">You May Also Like</p>
            <Link href="/molds" className="text-xs font-medium text-neutral-400 hover:text-neutral-700">View all →</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {suggested.map((product) => (
              <div key={product.id} className="relative w-36 flex-shrink-0">
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
                    {product.primary_image ? (
                      <SmartImage
                        src={product.primary_image}
                        alt={product.name}
                        fill
                        sizes="144px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-neutral-200" />
                    )}
                    <button
                      aria-label="Wishlist"
                      onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md transition-transform active:scale-90"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill={wishlist.has(product.id) ? '#ef4444' : 'none'} viewBox="0 0 24 24" stroke={wishlist.has(product.id) ? '#ef4444' : 'currentColor'} strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[11px] font-medium leading-snug text-neutral-800">{product.name}</p>
                  {product.price != null && (
                    <p className="mt-0.5 text-[11px] text-neutral-500">₹{product.price.toLocaleString('en-IN')}</p>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
