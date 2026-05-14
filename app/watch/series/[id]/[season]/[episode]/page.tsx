'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { PlayerSource, SeriesDetail, SeasonDetail, Episode } from '@/lib/types';
import { fetchJSON } from '@/lib/utils';
import EmbedPlayer from '@/components/EmbedPlayer';
import EpisodeList from '@/components/EpisodeList';

export default function WatchSeriesPage({
  params,
}: {
  params: { id: string; season: string; episode: string };
}) {
  const seasonNum = parseInt(params.season, 10);
  const epNum = parseInt(params.episode, 10);

  const [sources, setSources] = useState<PlayerSource[] | null>(null);
  const [series, setSeries] = useState<SeriesDetail | null>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    let cancel = false;
    Promise.all([
      fetchJSON<{ sources: PlayerSource[] }>(
        `/api/player/sources?tmdb_id=${params.id}&type=tv&season=${seasonNum}&episode=${epNum}`
      ).catch(() => ({ sources: [] })),
      fetchJSON<SeriesDetail>(`/api/series/${params.id}`).catch(() => null),
      fetchJSON<SeasonDetail>(`/api/series/${params.id}/season/${seasonNum}`).catch(() => null),
    ]).then(([s, sr, sd]) => {
      if (cancel) return;
      setSources(s.sources || []);
      setSeries(sr);
      if (sd) {
        const ep = sd.episodes?.find((e) => e.episode_number === epNum) || null;
        setEpisode(ep);
      }
    });
    return () => {
      cancel = true;
    };
  }, [params.id, seasonNum, epNum]);

  // Show "Next Episode" after 5 min
  useEffect(() => {
    setShowNext(false);
    const t = setTimeout(() => setShowNext(true), 300000);
    return () => clearTimeout(t);
  }, [params.id, seasonNum, epNum]);

  const nextHref = `/watch/series/${params.id}/${seasonNum}/${epNum + 1}`;

  return (
    <div className="pt-20 pb-12">
      <div className="px-4 md:px-8 mb-4 flex items-center gap-3 flex-wrap">
        <Link
          href={`/series/${params.id}`}
          className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
        {series && (
          <h1 className="text-lg md:text-xl font-bold truncate">
            {series.title}{' '}
            <span className="text-white/60 font-normal">
              · S{seasonNum} E{epNum}
              {episode?.name ? ` — ${episode.name}` : ''}
            </span>
          </h1>
        )}
      </div>

      {sources === null ? (
        <div className="aspect-video bg-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#e50914] animate-spin" />
        </div>
      ) : (
        series && (
          <EmbedPlayer
            sources={sources}
            meta={{
              tmdb_id: series.id,
              type: 'tv',
              title: series.title,
              poster_path: series.poster_path || '',
              season: seasonNum,
              episode: epNum,
              episode_title: episode?.name,
            }}
          />
        )
      )}

      {showNext && (
        <div className="px-4 md:px-8 mt-5">
          <Link
            href={nextHref}
            className="inline-flex items-center gap-2 bg-[#e50914] hover:bg-[#f40612] px-5 py-2.5 rounded font-semibold text-sm transition-colors"
          >
            Next Episode <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {series && (
        <div className="mt-10">
          <h2 className="px-4 md:px-8 text-xl md:text-2xl font-bold mb-2">Episodes</h2>
          <EpisodeList
            seriesId={series.id}
            totalSeasons={series.number_of_seasons || 1}
            currentSeason={seasonNum}
            currentEpisode={epNum}
          />
        </div>
      )}
    </div>
  );
}
