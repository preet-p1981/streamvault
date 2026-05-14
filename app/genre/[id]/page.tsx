'use client';

import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import InfiniteGrid from '@/components/InfiniteGrid';
import { GENRE_MAP, SORT_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function GenrePage() {
  const params = useParams();
  const id = Number(params.id);
  const name = GENRE_MAP[id] || 'Genre';

  const [type, setType] = useState<'movie' | 'tv'>('movie');
  const [sort, setSort] = useState('popularity.desc');

  const buildUrl = useCallback(
    (page: number) => {
      const sp = new URLSearchParams();
      sp.set('genre', String(id));
      sp.set('type', type);
      sp.set('sort', sort);
      sp.set('page', String(page));
      return `/api/discover?${sp.toString()}`;
    },
    [id, type, sort]
  );

  const key = useMemo(() => `${id}-${type}-${sort}`, [id, type, sort]);

  return (
    <div className="pt-24 px-4 md:px-8 max-w-[1600px] mx-auto">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-4">{name}</h1>

      <div className="flex flex-wrap gap-3 items-center mb-6">
        <div className="flex gap-2">
          {(['movie', 'tv'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-semibold transition-colors',
                type === t ? 'bg-[#e50914] text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
              )}
            >
              {t === 'movie' ? 'Movies' : 'Series'}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-[#1a1a1a] border border-white/10 rounded px-3 py-1.5 outline-none text-sm"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Sort: {o.label}
            </option>
          ))}
        </select>
      </div>

      <InfiniteGrid key={key} buildUrl={buildUrl} />
    </div>
  );
}
