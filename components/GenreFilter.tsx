'use client';

import { GENRE_MAP } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface Props {
  active?: number | null;
  onChange: (id: number | null) => void;
  ids?: number[];
}

export default function GenreFilter({ active, onChange, ids }: Props) {
  const list = ids || Object.keys(GENRE_MAP).map(Number);
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      <button
        onClick={() => onChange(null)}
        className={cn(
          'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors',
          active === null || active === undefined
            ? 'bg-[#e50914] text-white'
            : 'bg-white/10 text-white/80 hover:bg-white/20'
        )}
      >
        All
      </button>
      {list.map((id) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors',
            active === id ? 'bg-[#e50914] text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
          )}
        >
          {GENRE_MAP[id]}
        </button>
      ))}
    </div>
  );
}
