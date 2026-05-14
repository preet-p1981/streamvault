'use client';

import { useEffect, useState } from 'react';
import EpisodeCard from './EpisodeCard';
import { Episode, SeasonDetail } from '@/lib/types';
import { fetchJSON, cn } from '@/lib/utils';

interface Props {
  seriesId: number;
  totalSeasons: number;
  currentSeason: number;
  currentEpisode?: number;
}

export default function EpisodeList({ seriesId, totalSeasons, currentSeason, currentEpisode }: Props) {
  const [season, setSeason] = useState(currentSeason);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    fetchJSON<SeasonDetail>(`/api/series/${seriesId}/season/${season}`)
      .then((data) => {
        if (!cancel) setEpisodes(data.episodes || []);
      })
      .catch(() => {
        if (!cancel) setEpisodes([]);
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });
    return () => {
      cancel = true;
    };
  }, [seriesId, season, currentEpisode]);

  return (
    <div className="px-4 md:px-8 mt-6">
      {/* Season tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4">
        {Array.from({ length: totalSeasons }, (_, i) => i + 1).map((s) => (
          <button
            key={s}
            onClick={() => setSeason(s)}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors',
              s === season ? 'bg-[#e50914] text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'
            )}
          >
            Season {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-video bg-[#1a1a1a] rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {episodes.map((e) => (
            <EpisodeCard
              key={`${e.season_number}-${e.episode_number}`}
              seriesId={seriesId}
              episode={e}
              isActive={season === currentSeason && e.episode_number === currentEpisode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
