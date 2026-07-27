'use client';

import Link from 'next/link';
import { useState } from 'react';
import { NAV_LINKS } from '@/lib/constants';
import type { Category } from '@/types';

export default function NavDropdown({ categories, light = false }: { categories: Category[]; light?: boolean }) {
  const [moldsOpen, setMoldsOpen] = useState(false);
  const linkColor = light
    ? 'text-white/90 hover:text-white'
    : 'text-neutral-700 hover:text-neutral-900';

  return (
    <nav className="hidden items-center gap-7 md:flex">
      {NAV_LINKS.map((link) =>
        link.label === 'Molds' ? (
          <div
            key={link.href}
            className="relative"
            onMouseEnter={() => setMoldsOpen(true)}
            onMouseLeave={() => setMoldsOpen(false)}
          >
            <Link
              href={link.href}
              className={`whitespace-nowrap text-xs font-semibold uppercase tracking-wide transition-colors ${linkColor}`}
            >
              {link.label}
            </Link>
            {moldsOpen && categories.length > 0 && (
              <>
                {/* Invisible hover bridge: keeps the wrapper's hit area continuous across the visual gap
                    so moving the mouse from the link down to the panel doesn't close it prematurely. */}
                <div className="absolute left-0 top-full h-3 w-64" />
                <div className="absolute left-0 top-[calc(100%+0.75rem)] z-40 w-64 rounded-lg border border-neutral-200 bg-white p-3 shadow-xl">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/molds/${cat.slug}`}
                      className="block rounded px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      {cat.emoji ? `${cat.emoji} ` : ''}
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap text-xs font-semibold uppercase tracking-wide transition-colors ${linkColor}`}
          >
            {link.label}
          </Link>
        )
      )}
    </nav>
  );
}
