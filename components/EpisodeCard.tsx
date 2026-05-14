'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Episode } from '@/lib/types';
import { tmdbImage } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface Props {
  seriesId: number;
  episode: Episode;
  isActive?: boolean;
}

export default function EpisodeCard({ seriesId, episode, isActive }: Props) {
  const href = `/watch/series/${seriesId}/${episode.season_number}/${episode.episode_number}`;
  return (
    <Link
      href={href}
      className={cn(
        'group block rounded overflow-hidden bg-[#141414] hover:bg-[#222] transition-colors',
        isActive && 'ring-1 ring-[#e50914] border-l-4 border-[#e50914]'
      )}
    >
      <div className="relative aspect-video bg-[#1a1a1a]">
        {episode.still_path ? (
          <Image
            src={tmdbImage(episode.still_path, 'medium')}
            alt={episode.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30">No preview</div>
        )}
        <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-semibold px-2 py-1 rounded">
          S{episode.season_number}E{episode.episode_number}
        </span>
      </div>
      <div className="p-3">
        <h4 className="text-sm font-semibold line-clamp-1">{episode.name}</h4>
        <p className="text-xs text-white/60 mt-1 line-clamp-2">{episode.overview || 'No description.'}</p>
      </div>
    </Link>
  );
}
