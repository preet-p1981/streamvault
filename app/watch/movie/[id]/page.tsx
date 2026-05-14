'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { PlayerSource, MovieDetail } from '@/lib/types';
import { fetchJSON } from '@/lib/utils';
import EmbedPlayer from '@/components/EmbedPlayer';
import Carousel from '@/components/Carousel';
import { Loader2 } from 'lucide-react';

export default function WatchMoviePage({ params }: { params: { id: string } }) {
  const [sources, setSources] = useState<PlayerSource[] | null>(null);
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    Promise.all([
      fetchJSON<{ sources: PlayerSource[] }>(`/api/player/sources?tmdb_id=${params.id}&type=movie`).catch(
        () => ({ sources: [] })
      ),
      fetchJSON<MovieDetail>(`/api/movie/${params.id}`).catch(() => null),
    ])
      .then(([s, m]) => {
        if (cancel) return;
        setSources(s.sources || []);
        setMovie(m);
      })
      .catch((e) => !cancel && setErr(e.message));
    return () => {
      cancel = true;
    };
  }, [params.id]);

  return (
    <div className="pt-20 pb-12">
      <div className="px-4 md:px-8 mb-4 flex items-center gap-3">
        <Link
          href={`/movie/${params.id}`}
          className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
        {movie && <h1 className="text-lg md:text-xl font-bold truncate">{movie.title}</h1>}
      </div>

      {sources === null ? (
        <div className="aspect-video bg-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#e50914] animate-spin" />
        </div>
      ) : err ? (
        <div className="px-8 text-red-400">{err}</div>
      ) : (
        movie && (
          <EmbedPlayer
            sources={sources}
            meta={{
              tmdb_id: movie.id,
              type: 'movie',
              title: movie.title,
              poster_path: movie.poster_path || '',
            }}
          />
        )
      )}

      {movie && movie.similar?.results?.length > 0 && (
        <div className="mt-10">
          <Carousel
            title="You Might Also Like"
            items={movie.similar.results.map((r) => ({ ...r, media_type: r.media_type || 'movie' }))}
          />
        </div>
      )}
    </div>
  );
}
