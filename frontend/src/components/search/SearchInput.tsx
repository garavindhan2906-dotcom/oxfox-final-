'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export default function SearchInput({ defaultValue = '' }: { defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  function handleClear() {
    setValue('');
    router.push('/search');
    inputRef.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search molds…"
        className="flex-1 bg-transparent text-sm text-neutral-800 placeholder-neutral-400 outline-none"
        autoFocus
      />
      {value && (
        <button type="button" onClick={handleClear} className="flex-shrink-0 text-neutral-400 hover:text-neutral-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </form>
  );
}
