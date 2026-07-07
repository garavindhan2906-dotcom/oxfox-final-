'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import AdminAuthGuard from './AdminAuthGuard';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-6">{children}</div>
      </div>
    </AdminAuthGuard>
  );
}
