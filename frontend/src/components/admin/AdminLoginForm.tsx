'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiRequestError } from '@/lib/api';

export default function AdminLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        withCredentials: true,
      });
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Login failed.');
      setStatus('error');
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-xl border border-neutral-200 p-8">
      <p className="text-center text-3xl font-bold text-brand">OXFOX</p>
      <h1 className="mt-4 text-center text-lg font-semibold text-neutral-900">Admin Login</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          required
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {status === 'loading' ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
