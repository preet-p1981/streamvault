import MovieCard from '@/components/MovieCard';
import { MediaItem } from '@/lib/types';
import { API_URL } from '@/lib/utils';

async function fetchSafe(path: string): Promise<MediaItem[]> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const d = await res.json();
    return d.results || [];
  } catch {
    return [];
  }
}

export default async function NewPage() {
  const [movies, series] = await Promise.all([
    fetchSafe('/api/movies/nowplaying'),
    fetchSafe('/api/series/popular'),
  ]);

  return (
    <div className="pt-24 px-4 md:px-8 max-w-[1600px] mx-auto">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6">New Releases</h1>

      {movies.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg md:text-xl font-bold mb-3">New Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {movies.map((it) => (
              <MovieCard key={`m-${it.id}`} item={{ ...it, media_type: 'movie' }} />
            ))}
          </div>
        </section>
      )}

      {series.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg md:text-xl font-bold mb-3">New Series</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {series.map((it) => (
              <MovieCard key={`s-${it.id}`} item={{ ...it, media_type: 'tv' }} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export const metadata = { title: 'New Releases | StreamVault' };