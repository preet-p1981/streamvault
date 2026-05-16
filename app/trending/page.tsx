import MovieCard from '@/components/MovieCard';
import { MediaItem } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Trending | StreamVault' };

async function fetchSafe(path: string): Promise<MediaItem[]> {
  try {
    const base = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${base}${path}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []) as MediaItem[];
  } catch {
    return [];
  }
}

export default async function TrendingPage() {
  const items = await fetchSafe('/api/trending');

  return (
    <div className="pt-24 px-4 md:px-8 max-w-[1600px] mx-auto">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-2">Trending Today</h1>
      <p className="text-white/60 text-sm mb-6">What everyone is watching right now.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {items.map((it) => (
          <MovieCard key={`${it.media_type}-${it.id}`} item={it} />
        ))}
      </div>
    </div>
  );
}