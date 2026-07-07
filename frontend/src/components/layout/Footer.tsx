import Link from 'next/link';
import { NAV_LINKS, SITE_NAME } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="text-xl font-bold uppercase tracking-tight text-brand">{SITE_NAME}</p>
            <p className="mt-2 max-w-xs text-sm text-neutral-600">
              3D Design + Handcrafted Silicone Molds for creators and brands across India.
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">Explore</p>
            <ul className="space-y-2 text-sm text-neutral-600">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">Support</p>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/faq" className="hover:text-brand">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/bulk-orders" className="hover:text-brand">
                  Bulk Orders
                </Link>
              </li>
              <li>
                <Link href="/custom-order" className="hover:text-brand">
                  Custom Order
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              aria-label="Admin login"
              title="Admin login"
              className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-brand"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </Link>
            <p className="text-xs text-neutral-500">
              &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
