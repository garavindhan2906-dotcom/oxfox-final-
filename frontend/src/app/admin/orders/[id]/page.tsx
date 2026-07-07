'use client';

import { useEffect, useState, use } from 'react';
import { apiFetch } from '@/lib/api';

interface OrderItem {
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

interface AdminOrderDetail {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  city: string | null;
  state: string | null;
  pincode: string | null;
  notes: string | null;
  subtotal: number;
  status: string;
  payment_method: string;
  admin_notes: string | null;
  items: OrderItem[];
}

const STATUSES = ['pending_payment', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_METHODS = ['unassigned', 'cod', 'upi', 'bank_transfer'];

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await apiFetch<{ order: AdminOrderDetail }>(`/api/orders/admin/${id}`, { withCredentials: true });
    setOrder(res.order);
    setAdminNotes(res.order.admin_notes ?? '');
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function updateField(field: 'status' | 'paymentMethod', value: string) {
    setSaving(true);
    await apiFetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ [field]: value }),
      withCredentials: true,
    });
    await load();
    setSaving(false);
  }

  async function saveNotes() {
    setSaving(true);
    await apiFetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ adminNotes }),
      withCredentials: true,
    });
    setSaving(false);
  }

  if (!order) return <p className="text-sm text-neutral-500">Loading order...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-neutral-900">Order {order.order_number}</h1>

      <div className="mt-4 grid gap-1 text-sm text-neutral-700">
        <p>
          <span className="font-medium">Customer:</span> {order.customer_name} ({order.customer_phone})
        </p>
        {order.customer_email && (
          <p>
            <span className="font-medium">Email:</span> {order.customer_email}
          </p>
        )}
        <p>
          <span className="font-medium">Address:</span> {order.shipping_address}, {order.city}, {order.state}{' '}
          {order.pincode}
        </p>
        {order.notes && (
          <p>
            <span className="font-medium">Customer notes:</span> {order.notes}
          </p>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-neutral-200 p-4">
        <ul className="space-y-1 text-sm text-neutral-600">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between">
              <span>
                {item.product_name} × {item.quantity}
              </span>
              <span>₹{Number(item.line_total).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-neutral-200 pt-3 font-semibold text-neutral-900">
          <span>Subtotal</span>
          <span>₹{Number(order.subtotal).toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-700">Status</label>
          <select
            value={order.status}
            disabled={saving}
            onChange={(e) => updateField('status', e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm capitalize"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">Payment Method</label>
          <select
            value={order.payment_method}
            disabled={saving}
            onChange={(e) => updateField('paymentMethod', e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm capitalize"
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-neutral-700">Admin Notes</label>
        <textarea
          rows={3}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <button
          onClick={saveNotes}
          disabled={saving}
          className="mt-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          Save Notes
        </button>
      </div>
    </div>
  );
}
