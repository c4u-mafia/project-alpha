import Constants from 'expo-constants';
import { authClient } from './auth-client';

const apiUrl = Constants.expoConfig?.extra?.apiUrl ?? 'http://10.0.2.2:3000';

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
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }

  // Handle 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
