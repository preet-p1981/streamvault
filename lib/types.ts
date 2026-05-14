export interface MediaItem {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
  media_type: 'movie' | 'tv';
  genre_ids: number[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface MovieDetail extends MediaItem {
  runtime: number;
  tagline: string;
  genres: { id: number; name: string }[];
  credits: { cast: CastMember[] };
  similar: { results: MediaItem[] };
  recommendations: { results: MediaItem[] };
  videos: { results: Video[] };
}

export interface Season {
  season_number: number;
  episode_count: number;
  name: string;
  poster_path: string | null;
}

export interface SeriesDetail extends MediaItem {
  number_of_seasons: number;
  episode_run_time: number[];
  genres: { id: number; name: string }[];
  credits: { cast: CastMember[] };
  similar: { results: MediaItem[] };
  seasons: Season[];
}

export interface Episode {
  episode_number: number;
  season_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime: number;
}

export interface SeasonDetail {
  season_number: number;
  name: string;
  episodes: Episode[];
}

export interface PlayerSource {
  name: string;
  url: string;
  priority: number;
  isWorking: boolean;
}

export interface WatchHistoryItem {
  tmdb_id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string;
  season?: number;
  episode?: number;
  episode_title?: string;
  savedAt: number;
  progressPercent: number;
}
