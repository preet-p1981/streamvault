import { Suspense } from 'react';
import Hero from '@/components/Hero';
import Carousel from '@/components/Carousel';
import ContinueWatching from '@/components/ContinueWatching';
import { SkeletonRow, SkeletonHero } from '@/components/SkeletonCard';
import { MediaItem } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function fetchSafe(path: string): Promise<MediaItem[]> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []) as MediaItem[];
  } catch (error) {
    console.error(`Fetch error for ${path}:`, error);
    return [];
  }
}

export default async function HomePage() {
  const [trending, popularMovies, nowPlaying, popularSeries] = await Promise.all([
    fetchSafe('/api/trending'),
    fetchSafe('/api/movies/popular'),
    fetchSafe('/api/movies/nowplaying'),
    fetchSafe('/api/series/popular'),
  ]);

  const [bollywood, southIndian, hollywoodAction, koreanDrama, anime, topRated, crime] = await Promise.all([
    fetchSafe('/api/discover?lang=hi&type=movie'),
    fetchSafe('/api/discover?lang=ta&type=movie'),
    fetchSafe('/api/discover?genre=28&type=movie'),
    fetchSafe('/api/discover?country=KR&type=tv'),
    fetchSafe('/api/discover?genre=16&type=tv'),
    fetchSafe('/api/discover?sort=vote_average.desc&type=movie'),
    fetchSafe('/api/discover?genre=80&type=movie'),
  ]);

  return (
    <>
      <Suspense fallback={<SkeletonHero />}>
        <Hero items={trending} />
      </Suspense>

      <ContinueWatching />

      <Suspense fallback={<SkeletonRow />}>
        <Carousel title="Trending Today" items={trending} />
      </Suspense>
      <Suspense fallback={<SkeletonRow />}>
        <Carousel title="New Releases" items={nowPlaying} />
      </Suspense>
      <Suspense fallback={<SkeletonRow />}>
        <Carousel title="Popular Series" items={popularSeries} />
      </Suspense>
      <Suspense fallback={<SkeletonRow />}>
        <Carousel title="Popular Movies" items={popularMovies} />
      </Suspense>
      <Suspense fallback={<SkeletonRow />}>
        <Carousel title="Bollywood Hits" items={bollywood} />
      </Suspense>
      <Suspense fallback={<SkeletonRow />}>
        <Carousel title="South Indian" items={southIndian} />
      </Suspense>
      <Suspense fallback={<SkeletonRow />}>
        <Carousel title="Hollywood Action" items={hollywoodAction} />
      </Suspense>
      <Suspense fallback={<SkeletonRow />}>
        <Carousel title="Korean Dramas" items={koreanDrama} />
      </Suspense>
      <Suspense fallback={<SkeletonRow />}>
        <Carousel title="Anime" items={anime} />
      </Suspense>
      <Suspense fallback={<SkeletonRow />}>
        <Carousel title="Top Rated" items={topRated} />
      </Suspense>
      <Suspense fallback={<SkeletonRow />}>
        <Carousel title="Crime Thrillers" items={crime} />
      </Suspense>
    </>
  );
}