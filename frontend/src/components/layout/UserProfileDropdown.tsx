'use client';

import { useEffect, useRef, useState } from 'react';

interface Profile { name: string; phone: string }

const KEY = 'oxfox_user_profile';

function getProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export default function UserProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saved, setSaved] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = getProfile();
    if (p) { setProfile(p); setName(p.name); setPhone(p.phone); }
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    const p = { name: name.trim(), phone: phone.trim() };
    localStorage.setItem(KEY, JSON.stringify(p));
    setProfile(p);
    setSaved(true);
    setTimeout(() => { setSaved(false); setOpen(false); }, 1200);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account"
        className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
        {profile && (
          <span className="max-w-[80px] truncate text-xs font-medium text-[#2A1F14]">
            {profile.name.split(' ')[0]}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[60] mt-3 w-72 rounded-2xl border border-neutral-100 bg-white shadow-xl">
          <div className="border-b border-neutral-100 px-5 py-4">
            <p className="text-sm font-semibold text-[#2A1F14]">
              {profile ? 'Your Profile' : 'Save Your Details'}
            </p>
            <p className="mt-0.5 text-xs text-neutral-400">
              {profile ? 'Update your name or phone number.' : 'We\'ll use this to speed up your checkout.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-5">
            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                required
                className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-800 outline-none focus:border-[#2A1F14] focus:ring-1 focus:ring-[#2A1F14]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                required
                className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm text-neutral-800 outline-none focus:border-[#2A1F14] focus:ring-1 focus:ring-[#2A1F14]"
              />
            </div>
            <button
              type="submit"
              className="mt-1 w-full rounded-lg bg-[#2A1F14] py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#3B2A1C]"
            >
              {saved ? '✓ Saved!' : profile ? 'Update' : 'Save'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
