'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import type { Customer } from '@/types';

export default function CustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiFetch<{ customers: Customer[] }>('/api/customers/admin/all', { withCredentials: true })
      .then((res) => setCustomers(res.customers))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-neutral-500">Loading customers...</p>;
  if (customers.length === 0) return <p className="text-sm text-neutral-500">No customers yet.</p>;

  const query = search.trim().toLowerCase();
  const filtered = query
    ? customers.filter((c) => c.name.toLowerCase().includes(query) || c.phone.includes(query))
    : customers;

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-sm rounded-md border border-neutral-300 px-3 py-2 text-sm"
      />

      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 text-neutral-500">
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Phone</th>
            <th className="py-2">Email</th>
            <th className="py-2">Orders</th>
            <th className="py-2">Total Spent</th>
            <th className="py-2">Last Order</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {filtered.map((c) => (
            <tr key={c.phone}>
              <td className="py-2 font-medium text-neutral-900">{c.name}</td>
              <td className="py-2 text-neutral-700">{c.phone}</td>
              <td className="py-2 text-neutral-700">{c.email ?? '—'}</td>
              <td className="py-2 text-neutral-700">{c.total_orders}</td>
              <td className="py-2 text-neutral-700">₹{Number(c.total_spent).toFixed(2)}</td>
              <td className="py-2 text-neutral-500">{new Date(c.last_order_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && <p className="mt-4 text-sm text-neutral-500">No customers match &quot;{search}&quot;.</p>}
    </div>
  );
}
