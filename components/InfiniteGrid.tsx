'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import MovieCard from './MovieCard';
import SkeletonCard from './SkeletonCard';
import { MediaItem } from '@/lib/types';
import { fetchJSON } from '@/lib/utils';

interface Props {
  buildUrl: (page: number) => string;
  initialItems?: MediaItem[];
}

export default function InfiniteGrid({ buildUrl, initialItems = [] }: Props) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset when buildUrl changes
  useEffect(() => {
    setItems([]);
    setPage(1);
    setDone(false);
  }, [buildUrl]);

  const loadMore = useCallback(async () => {
    if (loading || done) return;
    setLoading(true);
    try {
      const data = await fetchJSON<{ results: MediaItem[]; total_pages: number }>(buildUrl(page));
      setItems((prev) => {
        const seen = new Set(prev.map((p) => `${p.media_type}-${p.id}`));
        const newOnes = (data.results || []).filter((r) => !seen.has(`${r.media_type}-${r.id}`));
        return [...prev, ...newOnes];
      });
      if (!data.results || data.results.length === 0 || (data.total_pages && page >= data.total_pages)) {
        setDone(true);
      }
      setPage((p) => p + 1);
    } catch {
      setDone(true);
    } finally {
      setLoading(false);
    }
  }, [buildUrl, page, loading, done]);

  // Initial load
  useEffect(() => {
    if (items.length === 0 && !done) loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: '300px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {items.map((it) => (
          <MovieCard key={`${it.media_type}-${it.id}`} item={it} />
        ))}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`s-${i}`} />)}
      </div>
      <div ref={sentinelRef} className="h-12" />
      {done && items.length === 0 && (
        <p className="text-center text-white/50 py-12">No results found.</p>
      )}
      {done && items.length > 0 && (
        <p className="text-center text-white/40 text-sm py-6">You&apos;ve reached the end.</p>
      )}
    </>
  );
}
