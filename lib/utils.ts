import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYear(dateStr?: string) {
  if (!dateStr) return '';
  return dateStr.slice(0, 4);
}

export function formatRuntime(min?: number) {
  if (!min) return '';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchJSON<T>(url: string, opts?: RequestInit): Promise<T> {
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
  const res = await fetch(fullUrl, { cache: 'no-store', ...opts });
  if (!res.ok) throw new Error(`Failed to fetch ${fullUrl}: ${res.status}`);
  return res.json();
}

export function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}