'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import MovieCard from '@/components/MovieCard';
import SkeletonCard from '@/components/SkeletonCard';
import { MediaItem } from '@/lib/types';
import { fetchJSON, cn } from '@/lib/utils';
import { addRecentSearch, clearRecentSearches, getRecentSearches } from '@/lib/watchHistory';

type Filter = 'all' | 'movie' | 'tv' | 'anime';

function SearchInner() {
  const params = useSearchParams();
  const q = (params.get('q') || '').trim();
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetchJSON<{ results: MediaItem[] }>(`/api/search?q=${encodeURIComponent(q)}`)
      .then((d) => setResults(d.results || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
    addRecentSearch(q);
    setRecent(getRecentSearches());
  }, [q]);

  const filtered = results.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'movie') return r.media_type === 'movie';
    if (filter === 'tv') return r.media_type === 'tv';
    if (filter === 'anime') return r.genre_ids?.includes(16);
    return true;
  });

  return (
    <div className="pt-24 px-4 md:px-8 max-w-[1400px] mx-auto">
      <SearchBar />

      <div className="mt-6 flex flex-wrap gap-2">
        {(['all', 'movie', 'tv', 'anime'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-semibold transition-colors capitalize',
              filter === f ? 'bg-[#e50914] text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
            )}
          >
            {f === 'tv' ? 'Series' : f}
          </button>
        ))}
      </div>

      {!q && recent.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent searches</h3>
            <button
              onClick={() => {
                clearRecentSearches();
                setRecent([]);
              }}
              className="text-xs text-white/60 hover:text-white"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <a
                key={r}
                href={`/search?q=${encodeURIComponent(r)}`}
                className="bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 text-sm flex items-center gap-1"
              >
                {r}
              </a>
            ))}
          </div>
        </div>
      )}

      {!q && (
        <p className="mt-12 text-center text-white/50">
          Try searching for <span className="text-white">Inception</span>,{' '}
          <span className="text-white">Breaking Bad</span>, <span className="text-white">Squid Game</span>...
        </p>
      )}

      {q && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">
            {loading ? 'Searching…' : `Results for "${q}"`}{' '}
            <span className="text-white/50 font-normal text-sm">({filtered.length})</span>
          </h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-white/50 text-center py-12">No results found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filtered.map((it) => (
                <MovieCard key={`${it.media_type}-${it.id}`} item={it} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-24 px-8">Loading…</div>}>
      <SearchInner />
    </Suspense>
  );
}
