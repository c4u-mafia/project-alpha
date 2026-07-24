import Constants from 'expo-constants';
import { authClient } from './auth-client';

const apiUrl = Constants.expoConfig?.extra?.apiUrl ?? 'http://10.0.2.2:3000';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Try again.') {
  return error instanceof Error && error.message ? error.message : fallback;
}

/**
 * Authenticated fetch wrapper.
 * Automatically injects the Bearer token from better-auth's current session.
 */
export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const session = await authClient.getSession();
  const jwt = (session?.data as any)?.session?.token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (jwt) {
    headers['Authorization'] = `Bearer ${jwt}`;
  }

  const url = `${apiUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const rawMessage =
      body && typeof body === 'object' && 'message' in body
        ? (body as { message?: unknown }).message
        : undefined;
    const message = Array.isArray(rawMessage)
      ? rawMessage.join('\n')
      : typeof rawMessage === 'string'
        ? rawMessage
        : `Request failed (${res.status})`;
    throw new ApiError(message, res.status, body);
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
