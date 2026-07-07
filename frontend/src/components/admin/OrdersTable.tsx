'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface AdminOrder {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  subtotal: number;
  status: string;
  created_at: string;
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ orders: AdminOrder[] }>('/api/orders', { withCredentials: true })
      .then((res) => setOrders(res.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-neutral-500">Loading orders...</p>;
  if (orders.length === 0) return <p className="text-sm text-neutral-500">No orders yet.</p>;

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-neutral-200 text-neutral-500">
        <tr>
          <th className="py-2">Order #</th>
          <th className="py-2">Customer</th>
          <th className="py-2">Subtotal</th>
          <th className="py-2">Status</th>
          <th className="py-2">Placed</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100">
        {orders.map((o) => (
          <tr key={o.id}>
            <td className="py-2">
              <Link href={`/admin/orders/${o.id}`} className="font-medium text-brand hover:underline">
                {o.order_number}
              </Link>
            </td>
            <td className="py-2 text-neutral-700">
              {o.customer_name} ({o.customer_phone})
            </td>
            <td className="py-2 text-neutral-700">₹{Number(o.subtotal).toFixed(2)}</td>
            <td className="py-2 text-neutral-700 capitalize">{o.status.replace('_', ' ')}</td>
            <td className="py-2 text-neutral-500">{new Date(o.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
