'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface Inquiry {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  description: string;
  reference_image: string | null;
  status: string;
}

const STATUSES = ['new', 'in_discussion', 'quoted', 'closed'];

export default function AdminCustomOrdersPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  async function load() {
    const res = await apiFetch<{ inquiries: Inquiry[] }>('/api/custom-orders/admin/all', { withCredentials: true });
    setInquiries(res.inquiries);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data load on mount
    load();
  }, []);

  async function updateStatus(id: number, status: string) {
    await apiFetch(`/api/custom-orders/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      withCredentials: true,
    });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Custom Order Inquiries</h1>
      <ul className="mt-6 max-w-2xl space-y-3">
        {inquiries.map((inq) => (
          <li key={inq.id} className="rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-900">{inq.name}</p>
              <select
                value={inq.status}
                onChange={(e) => updateStatus(inq.id, e.target.value)}
                className="rounded-md border border-neutral-300 px-2 py-1 text-xs capitalize"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-sm text-neutral-600">
              {inq.phone} {inq.email && `· ${inq.email}`}
            </p>
            <p className="mt-1 text-sm text-neutral-600">{inq.description}</p>
            {inq.reference_image && (
              <div className="relative mt-2 h-32 w-24 overflow-hidden rounded-md">
                <Image src={inq.reference_image} alt="Reference" fill sizes="96px" />
              </div>
            )}
          </li>
        ))}
        {inquiries.length === 0 && <p className="text-sm text-neutral-500">No custom order inquiries yet.</p>}
      </ul>
    </div>
  );
}
