import { WatchHistoryItem } from './types';

const KEY = 'streamvault:history';
const MAX_ITEMS = 30;

export function getHistory(): WatchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WatchHistoryItem[];
  } catch {
    return [];
  }
}

export function saveToHistory(item: WatchHistoryItem) {
  if (typeof window === 'undefined') return;
  const list = getHistory().filter(
    (i) =>
      !(
        i.tmdb_id === item.tmdb_id &&
        i.type === item.type &&
        i.season === item.season &&
        i.episode === item.episode
      )
  );
  list.unshift(item);
  const trimmed = list.slice(0, MAX_ITEMS);
  localStorage.setItem(KEY, JSON.stringify(trimmed));
}

export function removeFromHistory(tmdb_id: number, type: 'movie' | 'tv', season?: number, episode?: number) {
  if (typeof window === 'undefined') return;
  const list = getHistory().filter(
    (i) =>
      !(
        i.tmdb_id === tmdb_id &&
        i.type === type &&
        i.season === season &&
        i.episode === episode
      )
  );
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function findHistory(tmdb_id: number, type: 'movie' | 'tv'): WatchHistoryItem | undefined {
  return getHistory().find((i) => i.tmdb_id === tmdb_id && i.type === type);
}

const SEARCH_KEY = 'streamvault:searches';

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(SEARCH_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addRecentSearch(q: string) {
  if (typeof window === 'undefined' || !q.trim()) return;
  const list = getRecentSearches().filter((s) => s !== q);
  list.unshift(q);
  localStorage.setItem(SEARCH_KEY, JSON.stringify(list.slice(0, 8)));
}

export function clearRecentSearches() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SEARCH_KEY);
}
