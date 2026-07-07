const SERVER_API_URL = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export class ApiRequestError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface ApiOptions extends RequestInit {
  /** Forward the browser's cookies (used for admin-authenticated client requests). */
  withCredentials?: boolean;
}

function resolveUrl(path: string): string {
  // In the browser, use a relative URL so requests hit the Next.js server (same origin),
  // which rewrites /api/* to the backend — this keeps the admin auth cookie first-party.
  // On the server, there's no implicit host, so an absolute backend URL is required.
  if (typeof window !== 'undefined') return path;
  return `${SERVER_API_URL}${path}`;
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { withCredentials, headers, ...rest } = options;

  const res = await fetch(resolveUrl(path), {
    ...rest,
    headers: {
      ...(rest.body && !(rest.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    credentials: withCredentials ? 'include' : rest.credentials,
    cache: 'no-store',
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiRequestError(res.status, data.error ?? 'Something went wrong. Please try again.');
  }

  return data as T;
}
