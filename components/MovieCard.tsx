'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Play, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MediaItem } from '@/lib/types';
import { tmdbImage, BLUR_DATA_URL } from '@/lib/constants';
import { findHistory } from '@/lib/watchHistory';
import { getYear } from '@/lib/utils';

interface Props {
  item: MediaItem;
  progressPercent?: number;
}

export default function MovieCard({ item, progressPercent }: Props) {
  const router = useRouter();
  const [progress, setProgress] = useState<number | undefined>(progressPercent);
  const isSeries = item.media_type === 'tv';
  const detailHref = isSeries ? `/series/${item.id}` : `/movie/${item.id}`;
  const watchHref = isSeries ? `/watch/series/${item.id}/1/1` : `/watch/movie/${item.id}`;

  useEffect(() => {
    if (progress === undefined) {
      const h = findHistory(item.id, item.media_type);
      if (h) setProgress(h.progressPercent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, item.media_type]);

  return (
    <Link href={detailHref} className="block">
      <div className="group relative overflow-hidden rounded card-hover cursor-pointer">
        <div className="relative aspect-[2/3] w-full bg-[#1a1a1a]">
          <Image
            src={tmdbImage(item.poster_path, 'card')}
            alt={item.title}
            fill
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
            className="object-cover"
          />

          {/* Backdrop fade-in on hover */}
          {item.backdrop_path && (
            <Image
              src={tmdbImage(item.backdrop_path, 'medium')}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            <h3 className="text-sm font-bold line-clamp-2">{item.title}</h3>
            <div className="flex items-center gap-2 text-xs text-white/70 mt-1">
              <span className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                {item.vote_average?.toFixed(1) ?? '—'}
              </span>
              <span>{getYear(item.release_date)}</span>
              <span className="bg-white/15 rounded px-1.5 py-0.5 text-[10px] font-semibold">HD</span>
            </div>
          </div>

          {/* Play button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(watchHref);
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#e50914] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#f40612]"
            aria-label="Play"
          >
            <Play className="w-5 h-5 ml-0.5" fill="white" />
          </button>

          {/* Progress bar */}
          {progress !== undefined && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20">
              <div className="h-full bg-[#e50914]" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
