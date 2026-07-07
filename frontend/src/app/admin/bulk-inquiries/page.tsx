'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface Inquiry {
  id: number;
  name: string;
  company_name: string | null;
  phone: string;
  email: string | null;
  category_interest: string | null;
  estimated_qty: string | null;
  message: string | null;
  status: string;
}

const STATUSES = ['new', 'contacted', 'closed'];

export default function AdminBulkInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  async function load() {
    const res = await apiFetch<{ inquiries: Inquiry[] }>('/api/bulk-orders/admin/all', { withCredentials: true });
    setInquiries(res.inquiries);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, []);

  async function updateStatus(id: number, status: string) {
    await apiFetch(`/api/bulk-orders/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      withCredentials: true,
    });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Bulk Order Inquiries</h1>
      <ul className="mt-6 max-w-2xl space-y-3">
        {inquiries.map((inq) => (
          <li key={inq.id} className="rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-900">
                {inq.name} {inq.company_name && `(${inq.company_name})`}
              </p>
              <select
                value={inq.status}
                onChange={(e) => updateStatus(inq.id, e.target.value)}
                className="rounded-md border border-neutral-300 px-2 py-1 text-xs capitalize"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-sm text-neutral-600">
              {inq.phone} {inq.email && `· ${inq.email}`}
            </p>
            {inq.category_interest && <p className="text-sm text-neutral-600">Interest: {inq.category_interest}</p>}
            {inq.estimated_qty && <p className="text-sm text-neutral-600">Est. quantity: {inq.estimated_qty}</p>}
            {inq.message && <p className="mt-1 text-sm text-neutral-600">{inq.message}</p>}
          </li>
        ))}
        {inquiries.length === 0 && <p className="text-sm text-neutral-500">No bulk order inquiries yet.</p>}
      </ul>
    </div>
  );
}
