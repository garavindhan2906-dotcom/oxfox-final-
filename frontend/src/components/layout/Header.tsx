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
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled || mobileOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? 'border-b border-neutral-200 bg-white/95 backdrop-blur' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center rounded-xl bg-white/95 p-1 shadow-sm">
          <Image src="/logo.png" alt="OXFOX Studio" width={200} height={170} className="h-12 w-auto sm:h-14" priority />
        </Link>

        <NavDropdown categories={categories} light={!solid} />

        <div className="hidden md:block">
          <SearchBar light={!solid} />
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/faq"
            className={`hidden text-xs font-semibold uppercase tracking-wide transition-colors hover:text-brand lg:inline ${
              solid ? 'text-neutral-600' : 'text-white/90'
            }`}
          >
            FAQ
          </Link>
          <Link
            href="/bulk-orders"
            className={`hidden text-xs font-semibold uppercase tracking-wide transition-colors hover:text-brand lg:inline ${
              solid ? 'text-neutral-600' : 'text-white/90'
            }`}
          >
            Bulk Orders
          </Link>
          <Link
            href="/cart"
            className={`relative text-xs font-semibold uppercase tracking-wide transition-colors hover:text-brand ${
              solid ? 'text-neutral-800' : 'text-white'
            }`}
          >
            Cart
            {count > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[11px] font-normal normal-case text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            className={`md:hidden ${solid ? 'text-neutral-800' : 'text-white'}`}
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white px-4 py-3 md:hidden">
          <div className="mb-3">
            <SearchBar />
          </div>
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-1 text-sm font-semibold uppercase tracking-wide text-neutral-800 hover:text-brand"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/faq" className="py-1 text-sm text-neutral-600" onClick={() => setMobileOpen(false)}>
              FAQ
            </Link>
            <Link href="/bulk-orders" className="py-1 text-sm text-neutral-600" onClick={() => setMobileOpen(false)}>
              Bulk Orders
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
