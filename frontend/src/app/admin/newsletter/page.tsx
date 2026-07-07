'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface Signup {
  id: number;
  email: string;
  phone: string | null;
  source: string;
  created_at: string;
}

export default function AdminNewsletterPage() {
  const [signups, setSignups] = useState<Signup[]>([]);

  useEffect(() => {
    apiFetch<{ signups: Signup[] }>('/api/newsletter/admin/all', { withCredentials: true }).then((res) =>
      setSignups(res.signups)
    );
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Newsletter Signups</h1>
      <table className="mt-6 max-w-xl w-full text-left text-sm">
        <thead className="border-b border-neutral-200 text-neutral-500">
          <tr>
            <th className="py-2">Email</th>
            <th className="py-2">Phone</th>
            <th className="py-2">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {signups.map((s) => (
            <tr key={s.id}>
              <td className="py-2 text-neutral-900">{s.email}</td>
              <td className="py-2 text-neutral-600">{s.phone ?? '—'}</td>
              <td className="py-2 text-neutral-500">{new Date(s.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {signups.length === 0 && <p className="mt-4 text-sm text-neutral-500">No signups yet.</p>}
    </div>
  );
}
