'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar({ light = false }: { light?: boolean }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        aria-label="Search"
        className={`w-36 rounded-l-full border px-3 py-1.5 text-xs focus:outline-none focus:w-44 transition-all duration-200 ${
          light
            ? 'border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:border-white'
            : 'border-neutral-300 bg-white text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-500'
        }`}
      />
      <button
        type="submit"
        aria-label="Submit search"
        className={`rounded-r-full border border-l-0 px-2.5 py-1.5 transition-colors ${
          light
            ? 'border-white/30 bg-white/10 text-white hover:bg-white/20'
            : 'border-neutral-300 bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </button>
    </form>
  );
}
