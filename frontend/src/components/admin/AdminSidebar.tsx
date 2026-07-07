'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/comments', label: 'Comments' },
  { href: '/admin/bulk-inquiries', label: 'Bulk Inquiries' },
  { href: '/admin/custom-orders', label: 'Custom Orders' },
  { href: '/admin/newsletter', label: 'Newsletter' },
  { href: '/admin/community', label: 'Community' },
  { href: '/admin/faq', label: 'FAQ' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await apiFetch('/api/auth/logout', { method: 'POST', withCredentials: true });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="w-56 flex-shrink-0 border-r border-neutral-200 bg-white p-4">
      <p className="mb-6 px-2 text-xl font-bold text-brand">OXFOX Admin</p>
      <nav className="space-y-1">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-md px-3 py-2 text-sm font-medium ${
              pathname === link.href ? 'bg-brand text-white' : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-6 w-full rounded-md px-3 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-100"
      >
        Log out
      </button>
    </aside>
  );
}
