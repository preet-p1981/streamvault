import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, Calendar, Tv } from 'lucide-react';
import { Metadata } from 'next';
import { SeriesDetail } from '@/lib/types';
import { tmdbImage } from '@/lib/constants';
import { getYear, API_URL } from '@/lib/utils';
import CastRow from '@/components/CastRow';
import Carousel from '@/components/Carousel';
import EpisodeList from '@/components/EpisodeList';

async function getSeries(id: string): Promise<SeriesDetail | null> {
  try {
    const res = await fetch(`${API_URL}/api/series/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const s = await getSeries(params.id);
  if (!s) return { title: 'Series | StreamVault' };
  const year = getYear(s.release_date);
  return {
    title: `${s.title} (${year}) | StreamVault`,
    description: s.overview,
    openGraph: {
      title: `${s.title} (${year})`,
      description: s.overview,
      images: s.backdrop_path ? [tmdbImage(s.backdrop_path, 'backdrop')] : [],
    },
  };
}

export default async function SeriesPage({ params }: { params: { id: string } }) {
  const series = await getSeries(params.id);
  if (!series) {
    return <div className="pt-32 px-8 text-center text-white/60">Series not found.</div>;
  }

  return (
    <article className="relative">
      <div className="absolute inset-x-0 top-0 h-[70vh] -z-10">
        {series.backdrop_path && (
          <Image
            src={tmdbImage(series.backdrop_path, 'backdrop')}
            alt={series.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
      </div>

      <div className="pt-32 md:pt-40 px-4 md:px-8 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="w-2/3 max-w-[240px] md:w-1/4 md:max-w-none flex-shrink-0">
            <div className="relative aspect-[2/3] rounded-md overflow-hidden shadow-2xl bg-[#1a1a1a]">
              <Image
                src={tmdbImage(series.poster_path, 'poster')}
                alt={series.title}
                fill
                sizes="(max-width: 768px) 60vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-extrabold">{series.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {getYear(series.release_date)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Tv className="w-4 h-4" /> {series.number_of_seasons} season
                {series.number_of_seasons === 1 ? '' : 's'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                {series.vote_average?.toFixed(1)}
              </span>
              <span className="bg-white/15 rounded px-2 py-0.5 text-xs uppercase">HD</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {series.genres?.map((g) => (
                <Link
                  href={`/genre/${g.id}`}
                  key={g.id}
                  className="bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 text-sm transition-colors"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            <p className="mt-5 text-white/85 leading-relaxed max-w-3xl">{series.overview}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/watch/series/${series.id}/1/1`}
                className="bg-[#e50914] hover:bg-[#f40612] px-8 py-3 rounded font-semibold flex items-center gap-2 transition-colors"
              >
                <Play className="w-5 h-5" fill="white" /> Play Now
              </Link>
            </div>

            <CastRow cast={series.credits?.cast || []} />
          </div>
        </div>

        <div className="mt-12 -mx-4 md:-mx-8">
          <h2 className="px-4 md:px-8 text-xl md:text-2xl font-bold mb-3">Episodes</h2>
          <EpisodeList
            seriesId={series.id}
            totalSeasons={series.number_of_seasons || 1}
            currentSeason={1}
          />
        </div>

        <div className="mt-12 -mx-4 md:-mx-8">
          {series.similar?.results?.length > 0 && (
            <Carousel
              title="Similar Series"
              items={series.similar.results.map((r) => ({ ...r, media_type: r.media_type || 'tv' }))}
            />
          )}
        </div>
      </div>
    </article>
  );
}