'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Play, Info, Star } from 'lucide-react';
import { MediaItem } from '@/lib/types';
import { tmdbImage } from '@/lib/constants';
import { getYear, cn } from '@/lib/utils';

interface Props {
  items: MediaItem[];
}

export default function Hero({ items }: Props) {
  const slides = items.slice(0, 5);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full h-[70vh] min-h-[480px] overflow-hidden">
      {slides.map((item, i) => {
        const isSeries = item.media_type === 'tv';
        const detailHref = isSeries ? `/series/${item.id}` : `/movie/${item.id}`;
        const watchHref = isSeries ? `/watch/series/${item.id}/1/1` : `/watch/movie/${item.id}`;
        return (
          <div
            key={item.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-700',
              i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
          >
            <Image
              src={tmdbImage(item.backdrop_path || item.poster_path, 'backdrop')}
              alt={item.title}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 hero-gradient" />
            <div className="absolute inset-0 hero-side-gradient" />

            <div className="absolute bottom-16 md:bottom-24 left-4 md:left-12 max-w-[640px] z-10">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold drop-shadow-lg">
                {item.title}
              </h1>
              <div className="flex items-center gap-3 text-sm md:text-base text-white/80 mt-3">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  {item.vote_average?.toFixed(1) ?? '—'}
                </span>
                <span>•</span>
                <span>{getYear(item.release_date)}</span>
                <span>•</span>
                <span className="uppercase tracking-wide text-xs bg-white/15 px-2 py-0.5 rounded">
                  {isSeries ? 'Series' : 'Movie'}
                </span>
              </div>
              <p className="mt-3 text-sm md:text-base text-white/85 line-clamp-3 max-w-[560px]">
                {item.overview}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={watchHref}
                  className="bg-[#e50914] hover:bg-[#f40612] text-white px-6 md:px-8 py-3 rounded font-semibold flex items-center gap-2 transition-colors"
                >
                  <Play className="w-5 h-5" fill="white" /> Play Now
                </Link>
                <Link
                  href={detailHref}
                  className="bg-white/20 backdrop-blur hover:bg-white/30 text-white px-6 md:px-8 py-3 rounded font-semibold flex items-center gap-2 transition-colors"
                >
                  <Info className="w-5 h-5" /> More Info
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              'h-1.5 rounded-full transition-all',
              i === index ? 'bg-[#e50914] w-8' : 'bg-white/40 w-3 hover:bg-white/70'
            )}
          />
        ))}
      </div>
    </section>
  );
}
