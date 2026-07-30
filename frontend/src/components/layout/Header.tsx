'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import NavDropdown from './NavDropdown';
import SearchBar from './SearchBar';
import SmartImage from '@/components/SmartImage';
import { WHATSAPP_NUMBER, INSTAGRAM_URL } from '@/lib/constants';
import { getCart, cartCount } from '@/lib/cart';
import type { Category } from '@/types';

export default function Header({ categories }: { categories: Category[] }) {
  const [count, setCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moldsOpen, setMoldsOpen] = useState(false);

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

  const close = () => { setMobileOpen(false); setMoldsOpen(false); };
  const bgClass = 'bg-[#FAF8F5]/95 backdrop-blur border-b border-[#E8E2DA]';

  const navItems = [
    {
      label: 'Home', href: '/',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11 2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6" />,
    },
    {
      label: 'New Arrivals', href: '/new',
      icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 0 0-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 0 0-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 0 0-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69l1.519-4.674z" /></>,
    },
    {
      label: 'Custom Order', href: '/custom-order',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />,
    },
    {
      label: 'Community', href: '/community',
      icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" /></>,
    },
    {
      label: 'Shipping', href: '/shipping',
      icon: <><rect x="1" y="3" width="15" height="13" strokeLinecap="round" strokeLinejoin="round" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>,
    },
    {
      label: 'About Us', href: '/about-us',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z" />,
    },
  ];

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${bgClass}`}>
        {/* Announcement bar */}
        <div className="w-full overflow-hidden bg-[#EDE8E2] py-0.5 text-center text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-500 whitespace-nowrap">
          Premium Silicone Molds for Candles, Chocolates, Jars &amp; Décor
        </div>

        {/* ── Mobile top bar ── */}
        <div className="flex items-center justify-between px-4 py-3.5 md:hidden">
          <button
            className="flex h-8 w-8 items-center justify-center text-neutral-700"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2" onClick={close}>
            <Image src="/image.png" alt="OXFOX Studio" width={200} height={170} className="h-7 w-auto" priority />
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/search" aria-label="Search" className="text-neutral-700" onClick={close}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </Link>
            <Link href="/admin/login" aria-label="Account" className="text-neutral-700" onClick={close}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </Link>
            <Link href="/cart" aria-label="Cart" className="relative text-neutral-700" onClick={close}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] text-white">{count}</span>
              )}
            </Link>
          </div>
        </div>

        {/* ── Desktop nav ── */}
        <div className="hidden items-center px-6 py-3.5 md:flex lg:px-8">
          <Link href="/" className="flex flex-shrink-0 items-center">
            <Image src="/image.png" alt="OXFOX Studio" width={200} height={170} className="h-7 w-auto" priority />
          </Link>
          <div className="flex flex-1 items-center justify-center">
            <NavDropdown categories={categories} light={false} />
          </div>
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
            <Link href="/faq" className="text-xs font-semibold uppercase tracking-wide text-neutral-600 hover:text-neutral-900">FAQ</Link>
            <Link href="/bulk-orders" className="text-xs font-semibold uppercase tracking-wide text-neutral-600 hover:text-neutral-900">Bulk Orders</Link>
            <Link href="/cart" aria-label="Cart" className="relative text-neutral-800 hover:text-neutral-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-normal text-white">{count}</span>
              )}
            </Link>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <div className="fixed inset-0 top-[calc(var(--header-h,72px))] z-40 flex flex-col bg-[#F5EDE4] md:hidden overflow-y-auto pb-32">

            {/* Search */}
            <div className="px-4 pt-4 pb-3">
              <Link
                href="/search"
                onClick={close}
                className="flex items-center gap-3 rounded-full border border-[#D9CDBF] bg-white px-4 py-3 text-sm text-neutral-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                Search for molds, décor &amp; more...
              </Link>
            </div>

            {/* Nav items */}
            <nav className="flex flex-col px-4">

              {/* HOME */}
              <Link href="/" onClick={close} className="flex items-center justify-between border-b border-[#E5D9CC] py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9CDBF] bg-white/70">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#2A1F14]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11 2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wide text-[#2A1F14]">Home</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
              </Link>

              {/* NEW ARRIVALS */}
              <Link href="/new" onClick={close} className="flex items-center justify-between border-b border-[#E5D9CC] py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9CDBF] bg-white/70">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#2A1F14]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 0 0 .95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 0 0-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 0 0-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 0 0-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 0 0 .951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wide text-[#2A1F14]">New Arrivals</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
              </Link>

              {/* MOLDS — expandable */}
              <div className="border-b border-[#E5D9CC]">
                <button
                  className="flex w-full items-center justify-between py-4"
                  onClick={() => setMoldsOpen((o) => !o)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9CDBF] bg-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#2A1F14]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                        <rect x="3" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="14" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="3" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
                        <rect x="14" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wide text-[#2A1F14]">Molds</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-neutral-400 transition-transform ${moldsOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {moldsOpen && (
                  <div className="mb-3 ml-12 flex flex-col gap-0 rounded-2xl bg-white/40">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/molds/${cat.slug}`}
                        onClick={close}
                        className="flex items-center justify-between border-b border-[#E5D9CC]/60 px-3 py-3 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-neutral-200">
                            {cat.banner_image ? (
                              <SmartImage src={cat.banner_image} alt={cat.name} width={36} height={36} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-400">🧁</div>
                            )}
                          </div>
                          <span className="text-sm text-[#2A1F14]">{cat.name}</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                        </svg>
                      </Link>
                    ))}
                    <Link
                      href="/molds"
                      onClick={close}
                      className="flex items-center justify-between px-3 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-[#2A1F14]">View All Molds</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>

              {/* CUSTOM ORDER */}
              <Link href="/custom-order" onClick={close} className="flex items-center justify-between border-b border-[#E5D9CC] py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9CDBF] bg-white/70">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#2A1F14]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wide text-[#2A1F14]">Custom Order</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
              </Link>

              {/* COMMUNITY */}
              <Link href="/community" onClick={close} className="flex items-center justify-between border-b border-[#E5D9CC] py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9CDBF] bg-white/70">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#2A1F14]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wide text-[#2A1F14]">Community</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
              </Link>

              {/* SHIPPING */}
              <Link href="/shipping" onClick={close} className="flex items-center justify-between border-b border-[#E5D9CC] py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9CDBF] bg-white/70">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#2A1F14]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <rect x="1" y="3" width="15" height="13" strokeLinecap="round" strokeLinejoin="round" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 8h4l3 3v5h-7V8z" />
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wide text-[#2A1F14]">Shipping</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
              </Link>

              {/* ABOUT US */}
              <Link href="/about-us" onClick={close} className="flex items-center justify-between border-b border-[#E5D9CC] py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9CDBF] bg-white/70">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#2A1F14]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wide text-[#2A1F14]">About Us</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
              </Link>

              {/* FAQ & Bulk Orders */}
              <Link href="/faq" onClick={close} className="flex items-center gap-3 border-b border-[#E5D9CC] py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9CDBF] bg-white/70">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#2A1F14]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
                  </svg>
                </div>
                <span className="text-sm font-bold uppercase tracking-wide text-[#2A1F14]">FAQ</span>
              </Link>
              <Link href="/bulk-orders" onClick={close} className="flex items-center gap-3 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D9CDBF] bg-white/70">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#2A1F14]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  </svg>
                </div>
                <span className="text-sm font-bold uppercase tracking-wide text-[#2A1F14]">Bulk Orders</span>
              </Link>
            </nav>

            {/* Trust strip */}
            <div className="mx-4 mt-4 grid grid-cols-4 divide-x divide-[#D9CDBF] rounded-2xl border border-[#D9CDBF] bg-white/60 py-3 text-center">
              {[
                { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V12M12 12C9 9 6 5 7 2c3 1 6 4 5 10zM12 12c3-3 6-7 5-10-3 1-6 4-5 10z" />, label: 'Premium\nQuality' },
                { icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" /></>, label: 'Secure\nCheckout' },
                { icon: <><rect x="1" y="3" width="15" height="13" strokeLinecap="round" strokeLinejoin="round" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>, label: 'Pan India\nShipping' },
                { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />, label: 'Made for\nCreators' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 px-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>{icon}</svg>
                  <p className="whitespace-pre-line text-[8px] font-medium leading-tight text-neutral-600">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Floating social buttons */}
      <div className="fixed bottom-5 right-4 z-50 flex flex-col gap-3 md:bottom-8 md:right-6">
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
          className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg"
          style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
          </svg>
        </a>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </>
  );
}
