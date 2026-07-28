'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import NavDropdown from './NavDropdown';
import SearchBar from './SearchBar';
import { NAV_LINKS } from '@/lib/constants';
import { getCart, cartCount } from '@/lib/cart';
import type { Category } from '@/types';

export default function Header({ categories }: { categories: Category[] }) {
  const [count, setCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sync = () => setCount(cartCount(getCart()));
    sync();
    window.addEventListener('oxfox-cart-updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('oxfox-cart-updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const bgClass = 'bg-[#FAF8F5]/95 backdrop-blur border-b border-[#E8E2DA]';

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${bgClass}`}>
      {/* Announcement bar */}
      <div className="w-full bg-[#EDE8E2] py-1 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
        Premium Silicone Molds for Candles, Chocolates, Jars &amp; Décor
      </div>

      {/* ── Mobile nav ── */}
      <div className="flex items-center justify-between px-4 py-2.5 md:hidden">
        {/* Hamburger */}
        <button
          className="text-2xl leading-none text-neutral-700"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>

        {/* Centered logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <Image src="/image.png" alt="OXFOX Studio" width={200} height={170} className="h-9 w-auto" priority />
        </Link>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <Link href="/search" aria-label="Search" className="text-neutral-700 hover:text-neutral-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </Link>
          <Link href="/admin/login" aria-label="Account" className="text-neutral-700 hover:text-neutral-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative text-neutral-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ── Desktop nav ── */}
      <div className="hidden items-center px-6 py-2.5 md:flex lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex flex-shrink-0 items-center">
          <Image src="/image.png" alt="OXFOX Studio" width={200} height={170} className="h-9 w-auto" priority />
        </Link>

        {/* Center nav links */}
        <div className="flex flex-1 items-center justify-center">
          <NavDropdown categories={categories} light={false} />
        </div>

        {/* Right actions */}
        <div className="flex flex-shrink-0 items-center gap-5">
          <SearchBar light={false} />
          <Link href="/search" aria-label="Search" className="text-neutral-600 hover:text-neutral-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </Link>
          <Link href="/admin/login" aria-label="Account" className="text-neutral-600 hover:text-neutral-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </Link>
          <Link href="/faq" className="text-xs font-semibold uppercase tracking-wide text-neutral-600 hover:text-neutral-900">
            FAQ
          </Link>
          <Link href="/bulk-orders" className="text-xs font-semibold uppercase tracking-wide text-neutral-600 hover:text-neutral-900">
            Bulk Orders
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative text-neutral-800 hover:text-neutral-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-normal text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-[#FAF8F5] px-4 py-4 md:hidden">
          <div className="mb-4">
            <SearchBar />
          </div>
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-neutral-100 py-2 text-sm font-semibold uppercase tracking-wide text-neutral-800"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/faq" className="py-2 text-sm text-neutral-600" onClick={() => setMobileOpen(false)}>FAQ</Link>
            <Link href="/bulk-orders" className="py-2 text-sm text-neutral-600" onClick={() => setMobileOpen(false)}>Bulk Orders</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
