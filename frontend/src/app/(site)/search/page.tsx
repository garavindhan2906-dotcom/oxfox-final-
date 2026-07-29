import type { Metadata } from 'next';
import Link from 'next/link';
import SearchInput from '@/components/search/SearchInput';
import HomeProductGrid from '@/components/home/HomeProductGrid';
import { apiFetch } from '@/lib/api';
import type { Product } from '@/types';

export const metadata: Metadata = { title: 'Search | OXFOX' };

interface SearchResults {
  products: Product[];
  categories: { id: number; name: string; slug: string }[];
}

async function search(q: string): Promise<SearchResults> {
  try {
    return await apiFetch<SearchResults>(`/api/search?q=${encodeURIComponent(q)}`);
  } catch {
    return { products: [], categories: [] };
  }
}

const suggestions = [
  { label: 'Candle Molds', href: '/search?q=candle', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4M12 6a6 6 0 0 1 6 6v8H6v-8a6 6 0 0 1 6-6ZM9 20h6" /> },
  { label: 'Chocolate Molds', href: '/search?q=chocolate', icon: <><rect x="3" y="8" width="18" height="13" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 8v13M7.5 8v13M16.5 8v13" /></> },
  { label: 'Jar Molds', href: '/search?q=jar', icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6l1 5H8L9 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 8v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8" /></> },
  { label: 'Décor Molds', href: '/search?q=decor', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8 6 5 9 5 13a7 7 0 0 0 14 0c0-4-3-7-7-11Z" /> },
];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';
  const results = query ? await search(query) : { products: [], categories: [] };
  const hasResults = results.products.length > 0;

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-4 pb-16 pt-24 sm:px-6">
      <div className="mx-auto max-w-lg">

        {/* Heading */}
        {query ? (
          <div className="mb-5">
            <p className="text-sm text-neutral-500">Search results for</p>
            <h1 className="font-display text-3xl font-bold text-[#2A1F14]">&apos;{query}&apos;</h1>
          </div>
        ) : (
          <h1 className="mb-5 font-display text-3xl font-bold text-[#2A1F14]">Search OXFOX</h1>
        )}

        {/* Search input */}
        <SearchInput defaultValue={query} />

        {/* Results */}
        {query && (
          <div className="mt-6">
            {hasResults ? (
              <>
                <p className="mb-4 text-sm text-neutral-500">{results.products.length} result{results.products.length !== 1 ? 's' : ''} found</p>
                <HomeProductGrid products={results.products} />
              </>
            ) : (
              <>
                {/* Zero results */}
                <p className="mt-2 text-sm font-semibold text-neutral-800">0 results found</p>
                <p className="text-sm text-neutral-400">We couldn&apos;t find any products matching your search.</p>

                {/* Illustration */}
                <div className="my-8 flex justify-center">
                  <div className="relative flex h-40 w-56 items-center justify-center rounded-2xl bg-neutral-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <div className="absolute bottom-4 right-4 h-8 w-8 rounded-full bg-neutral-200 opacity-60" />
                    <div className="absolute left-4 top-4 h-6 w-6 rounded-full bg-neutral-200 opacity-40" />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Try searching for */}
        {(!hasResults) && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-neutral-700">Try searching for</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 shadow-sm hover:border-[#3B2A1C] hover:text-[#3B2A1C]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    {icon}
                  </svg>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Contact card */}
        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FAF8F5]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-neutral-800">Still can&apos;t find what you&apos;re looking for?</p>
            <p className="text-xs text-neutral-400">We&apos;re here to help you find the perfect mold.</p>
          </div>
          <Link
            href="/custom-order"
            className="flex-shrink-0 rounded-full bg-[#2A1F14] px-3 py-2 text-xs font-semibold text-white hover:bg-[#3B2A1C]"
          >
            Contact Us
          </Link>
        </div>

        {/* Bottom trust strip */}
        <div className="mt-6 grid grid-cols-3 divide-x divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
          {[
            { icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></>, label: 'Secure Packaging', sub: 'Safe & sturdy' },
            { icon: null, emoji: '🇮🇳', label: 'Made in India', sub: 'Proudly crafted' },
            { icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" /></>, label: '100% Secure', sub: 'Shop with confidence' },
          ].map(({ icon, emoji, label, sub }) => (
            <div key={label} className="flex flex-col items-center px-2 py-4 text-center">
              {emoji ? (
                <span className="text-2xl">{emoji}</span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#3B2A1C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                  {icon}
                </svg>
              )}
              <p className="mt-1.5 text-[10px] font-bold text-neutral-800">{label}</p>
              <p className="text-[9px] text-neutral-400">{sub}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
