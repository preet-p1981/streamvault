'use client';

import Image from 'next/image';
import { CastMember } from '@/lib/types';
import { tmdbImage } from '@/lib/constants';

interface Props {
  cast: CastMember[];
}

export default function CastRow({ cast }: Props) {
  if (!cast || cast.length === 0) return null;
  return (
    <section className="mt-8">
      <h3 className="text-lg md:text-xl font-bold mb-3">Cast</h3>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {cast.slice(0, 20).map((c) => (
          <div key={c.id} className="flex-shrink-0 w-24 text-center">
            <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden bg-[#1a1a1a]">
              {c.profile_path ? (
                <Image
                  src={tmdbImage(c.profile_path, 'card')}
                  alt={c.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40 text-xs">
                  {c.name.charAt(0)}
                </div>
              )}
            </div>
            <p className="text-sm font-medium mt-2 line-clamp-1">{c.name}</p>
            <p className="text-xs text-white/60 line-clamp-1">{c.character}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
