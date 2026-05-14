'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Play } from 'lucide-react';
import { WatchHistoryItem } from '@/lib/types';
import { tmdbImage } from '@/lib/constants';
import { getHistory, removeFromHistory } from '@/lib/watchHistory';
import { useToast } from './ToastProvider';

export default function ContinueWatching() {
  const [items, setItems] = useState<WatchHistoryItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setItems(getHistory());
  }, []);

  const onRemove = (it: WatchHistoryItem) => {
    removeFromHistory(it.tmdb_id, it.type, it.season, it.episode);
    setItems(getHistory());
    toast('Removed from history');
  };

  if (items.length === 0) return null;

  return (
    <section className="px-4 md:px-8 my-8">
      <h2 className="text-xl md:text-2xl font-bold mb-3">Continue Watching</h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {items.map((it) => {
          const href =
            it.type === 'tv'
              ? `/watch/series/${it.tmdb_id}/${it.season ?? 1}/${it.episode ?? 1}`
              : `/watch/movie/${it.tmdb_id}`;
          return (
            <div
              key={`${it.type}-${it.tmdb_id}-${it.season}-${it.episode}`}
              className="group relative flex-shrink-0 w-[44%] sm:w-[31%] md:w-[23%] lg:w-[19%] xl:w-[13.5%]"
            >
              <Link href={href} className="block">
                <div className="relative aspect-[2/3] rounded overflow-hidden bg-[#1a1a1a] card-hover">
                  <Image
                    src={tmdbImage(it.poster_path, 'card')}
                    alt={it.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 16vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-sm font-bold line-clamp-2">{it.title}</p>
                    {it.episode_title && (
                      <p className="text-xs text-white/70 mt-0.5">
                        S{it.season}·E{it.episode} {it.episode_title}
                      </p>
                    )}
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#e50914] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-5 h-5 ml-0.5" fill="white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20">
                    <div className="h-full bg-[#e50914]" style={{ width: `${it.progressPercent || 0}%` }} />
                  </div>
                </div>
              </Link>
              <button
                onClick={() => onRemove(it)}
                className="absolute top-2 right-2 w-7 h-7 bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                aria-label="Remove from history"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
