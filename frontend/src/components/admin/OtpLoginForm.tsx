'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiRequestError } from '@/lib/api';

export default function OtpLoginForm() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const router = useRouter();

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await apiFetch('/api/auth/otp/request', {
        method: 'POST',
        body: JSON.stringify({ phone }),
        withCredentials: true,
      });
      setStep('otp');
      setStatus('idle');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Could not send OTP.');
      setStatus('error');
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await apiFetch('/api/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ phone, code }),
        withCredentials: true,
      });
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Invalid OTP.');
      setStatus('error');
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-xl border border-neutral-200 p-8">
      <p className="text-center text-3xl font-bold text-brand">OXFOX</p>
      <h1 className="mt-4 text-center text-lg font-semibold text-neutral-900">Admin Login</h1>

      {step === 'phone' ? (
        <form onSubmit={requestOtp} className="mt-6 space-y-4">
          <input
            required
            placeholder="Admin phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {status === 'loading' ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="mt-6 space-y-4">
          <input
            required
            placeholder="Enter OTP"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-center text-lg tracking-widest"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {status === 'loading' ? 'Verifying...' : 'Verify & Login'}
          </button>
          <button
            type="button"
            onClick={() => setStep('phone')}
            className="w-full text-center text-xs text-neutral-500 hover:underline"
          >
            Use a different phone number
          </button>
        </form>
      )}
    </div>
  );
}
