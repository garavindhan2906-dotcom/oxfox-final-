'use client';

import { useState } from 'react';
import { apiFetch, ApiRequestError } from '@/lib/api';

export default function CustomOrderInquiryForm() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', description: '' });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      if (file) body.append('referenceImage', file);

      await apiFetch('/api/custom-orders', { method: 'POST', body });
      setStatus('done');
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-800">
        Thanks! Your custom mold request has been received. Our team will reach out shortly with next steps.
      </div>
    );
  }

  const isVideo = file && file.type.startsWith('video/');
  const isImage = file && file.type.startsWith('image/');

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-neutral-200 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          required
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>
      <input
        type="email"
        placeholder="Email (optional)"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
      />
      <textarea
        required
        rows={4}
        placeholder="Describe your shape, size, and material..."
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
      />

      {/* File upload */}
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Upload a sketch, photo or video (optional)
        </label>
        <p className="mt-0.5 text-xs text-neutral-400">
          Accepted: JPG, PNG, WEBP images · MP4, MOV, WEBM videos · Max 100MB
        </p>

        <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 px-4 py-6 text-center transition-colors hover:border-brand hover:bg-brand/5">
          <span className="text-2xl">{file ? (isVideo ? '🎥' : '🖼️') : '📎'}</span>
          <span className="text-sm font-medium text-neutral-700">
            {file ? file.name : 'Click to choose a file'}
          </span>
          {file && (
            <span className="text-xs text-neutral-400">
              {(file.size / 1024 / 1024).toFixed(1)} MB · {isVideo ? 'Video' : 'Image'}
            </span>
          )}
          {!file && (
            <span className="text-xs text-neutral-400">Photo, sketch, or reference video</span>
          )}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,video/mp4,video/quicktime,video/webm,video/x-msvideo"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="sr-only"
          />
        </label>

        {file && (
          <button
            type="button"
            onClick={() => setFile(null)}
            className="mt-1 text-xs text-red-500 hover:underline"
          >
            Remove file
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {status === 'loading' ? 'Submitting...' : 'Submit Custom Order Request'}
      </button>
    </form>
  );
}
