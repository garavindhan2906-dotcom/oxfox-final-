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
      <div className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex flex-shrink-0 items-center rounded-lg bg-white/95 px-2 py-1">
          <Image src="/logo.jpeg" alt="OXFOX Studio" width={200} height={170} className="h-9 w-auto" priority />
        </Link>

        {/* Center nav */}
        <div className="flex flex-1 items-center justify-center">
          <NavDropdown categories={categories} light={!solid} />
        </div>

        {/* Right actions */}
        <div className="flex flex-shrink-0 items-center gap-4">
          <div className="hidden md:block">
            <SearchBar light={!solid} />
          </div>
          <Link
            href="/faq"
            className={`hidden text-xs font-semibold uppercase tracking-wide transition-colors lg:inline ${
              solid ? 'text-neutral-600 hover:text-neutral-900' : 'text-white/90 hover:text-white'
            }`}
          >
            FAQ
          </Link>
          <Link
            href="/bulk-orders"
            className={`hidden text-xs font-semibold uppercase tracking-wide transition-colors lg:inline ${
              solid ? 'text-neutral-600 hover:text-neutral-900' : 'text-white/90 hover:text-white'
            }`}
          >
            Bulk Orders
          </Link>
          <Link
            href="/cart"
            className={`relative text-xs font-semibold uppercase tracking-wide transition-colors ${
              solid ? 'text-neutral-800 hover:text-neutral-900' : 'text-white hover:text-white/80'
            }`}
          >
            Cart
            {count > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-normal normal-case text-white">
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
                className="py-1 text-sm font-semibold uppercase tracking-wide text-neutral-800 hover:text-neutral-900"
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
