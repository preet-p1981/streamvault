export const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const IMAGE_SIZES = {
  card: 'w185',
  poster: 'w500',
  medium: 'w780',
  backdrop: 'w1280',
  original: 'original',
} as const;

export function tmdbImage(path: string | null, size: keyof typeof IMAGE_SIZES = 'poster') {
  if (!path) return '/placeholder.svg';
  return `${IMAGE_BASE}/${IMAGE_SIZES[size]}${path}`;
}

export const BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg==';

export const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};

export const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popularity.desc' },
  { label: 'Rating', value: 'vote_average.desc' },
  { label: 'Newest', value: 'release_date.desc' },
  { label: 'Oldest', value: 'release_date.asc' },
];

export const YEAR_OPTIONS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', 'Older'];

export const LANG_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Korean', value: 'ko' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Spanish', value: 'es' },
  { label: 'Tamil', value: 'ta' },
];
