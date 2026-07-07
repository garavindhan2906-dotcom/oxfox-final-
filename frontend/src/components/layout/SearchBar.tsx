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
    <form onSubmit={handleSubmit} className="flex w-full max-w-xs items-center">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search silicone molds..."
        aria-label="Search"
        className={`w-full rounded-l-full border px-4 py-2 text-sm focus:outline-none ${
          light
            ? 'border-white/30 bg-white/10 text-white placeholder:text-white/60 focus:border-white'
            : 'border-neutral-300 focus:border-brand'
        }`}
      />
      <button
        type="submit"
        className="rounded-r-full border border-l-0 border-brand bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
      >
        Search
      </button>
    </form>
  );
}
