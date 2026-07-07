'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cartTotal, clearCart, getCart } from '@/lib/cart';
import { apiFetch, ApiRequestError } from '@/lib/api';
import type { CartItem } from '@/types';

export default function CheckoutForm() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingAddress: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable client-side, after mount
    setItems(getCart());
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setStatus('loading');
    try {
      const { orderNumber } = await apiFetch<{ orderNumber: string }>('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      clearCart();
      router.push(`/order-confirmation/${orderNumber}`);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  if (items.length === 0) {
    return <p className="text-neutral-600">Your cart is empty. Add some products before checking out.</p>;
  }

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            required
            placeholder="Full name"
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Phone number"
            value={form.customerPhone}
            onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <input
          type="email"
          placeholder="Email (optional)"
          value={form.customerEmail}
          onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <textarea
          required
          rows={2}
          placeholder="Shipping address"
          value={form.shippingAddress}
          onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <input
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <input
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <textarea
          rows={2}
          placeholder="Order notes (optional)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <p className="text-xs text-neutral-500">
          We don&apos;t process online payment yet — after placing your order, our team will contact you to confirm
          payment via COD, UPI, or bank transfer.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {status === 'loading' ? 'Placing order...' : 'Place Order'}
        </button>
      </form>

      <div className="rounded-xl border border-neutral-200 p-5">
        <h2 className="font-semibold text-neutral-900">Order Summary</h2>
        <ul className="mt-3 space-y-2 text-sm text-neutral-600">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 font-semibold text-neutral-900">
          <span>Subtotal</span>
          <span>₹{cartTotal(items).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
