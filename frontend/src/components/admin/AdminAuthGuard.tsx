'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    apiFetch('/api/auth/me', { withCredentials: true })
      .then(() => setChecked(true))
      .catch(() => router.replace('/admin/login'));
  }, [router]);

  if (!checked) return null;
  return <>{children}</>;
}
