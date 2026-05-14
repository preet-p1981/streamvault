'use client';

import { useMemo, useState, useCallback } from 'react';
import GenreFilter from '@/components/GenreFilter';
import InfiniteGrid from '@/components/InfiniteGrid';
import { SORT_OPTIONS, YEAR_OPTIONS, LANG_OPTIONS } from '@/lib/constants';

export default function MoviesPage() {
  const [genre, setGenre] = useState<number | null>(null);
  const [sort, setSort] = useState<string>('popularity.desc');
  const [year, setYear] = useState<string>('');
  const [lang, setLang] = useState<string>('');

  const buildUrl = useCallback(
    (page: number) => {
      const sp = new URLSearchParams();
      sp.set('type', 'movie');
      sp.set('page', String(page));
      if (genre) sp.set('genre', String(genre));
      if (sort) sp.set('sort', sort);
      if (year) sp.set('year', year);
      if (lang) sp.set('lang', lang);
      return `/api/discover?${sp.toString()}`;
    },
    [genre, sort, year, lang]
  );

  // Force re-mount when filters change to reset infinite grid
  const key = useMemo(() => `${genre}-${sort}-${year}-${lang}`, [genre, sort, year, lang]);

  return (
    <div className="pt-24 px-4 md:px-8 max-w-[1600px] mx-auto">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-4">Movies</h1>

      <div className="space-y-3">
        <GenreFilter active={genre} onChange={setGenre} />

        <div className="flex flex-wrap gap-3 text-sm">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 rounded px-3 py-1.5 outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                Sort: {o.label}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 rounded px-3 py-1.5 outline-none"
          >
            <option value="">Year: Any</option>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y === 'Older' ? '' : y}>
                {y}
              </option>
            ))}
          </select>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-[#1a1a1a] border border-white/10 rounded px-3 py-1.5 outline-none"
          >
            <option value="">Language: Any</option>
            {LANG_OPTIONS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <InfiniteGrid key={key} buildUrl={buildUrl} />
      </div>
    </div>
  );
}
