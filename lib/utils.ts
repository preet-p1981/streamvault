export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchJSON<T>(url: string, opts?: RequestInit): Promise<T> {
  // ✅ Always use relative path — never pass full backend URL directly
  const fullUrl = url.startsWith('/') ? `${API_URL}${url}` : url;
  const res = await fetch(fullUrl, { cache: 'no-store', ...opts });
  if (!res.ok) throw new Error(`Failed to fetch ${fullUrl}: ${res.status}`);
  return res.json();
}