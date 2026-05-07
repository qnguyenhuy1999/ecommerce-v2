const API_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_URL ?? 'http://localhost:4001';

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = (await res.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(error.message ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
