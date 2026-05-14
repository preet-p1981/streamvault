'use client';

import { useEffect, useRef, useState } from 'react';
import { Maximize, Loader2 } from 'lucide-react';
import { PlayerSource, WatchHistoryItem } from '@/lib/types';
import SourceTabs from './SourceTabs';
import { saveToHistory } from '@/lib/watchHistory';
import { useToast } from './ToastProvider';

interface Props {
  sources: PlayerSource[];
  meta: {
    tmdb_id: number;
    type: 'movie' | 'tv';
    title: string;
    poster_path: string;
    season?: number;
    episode?: number;
    episode_title?: string;
  };
}

const LS_KEY = (id: number) => `streamvault:lastSource:${id}`;

export default function EmbedPlayer({ sources, meta }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState<number[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  // Restore last source preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY(meta.tmdb_id));
      if (saved !== null) {
        const idx = parseInt(saved, 10);
        if (!isNaN(idx) && idx >= 0 && idx < sources.length) {
          setCurrentIndex(idx);
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-fallback after 8 seconds if still loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading((stillLoading) => {
        if (stillLoading) {
          setFailed((f) => (f.includes(currentIndex) ? f : [...f, currentIndex]));
          // find next non-failed
          const next = sources.findIndex(
            (_, i) => i > currentIndex && !failed.includes(i)
          );
          if (next !== -1) {
            setCurrentIndex(next);
            toast(`Source timed out — switched to ${sources[next].name}`);
          }
        }
        return stillLoading;
      });
    }, 8000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, sources, failed]);

  // Save watch history every 10 seconds
  useEffect(() => {
    const save = () => {
      const item: WatchHistoryItem = {
        tmdb_id: meta.tmdb_id,
        type: meta.type,
        title: meta.title,
        poster_path: meta.poster_path,
        season: meta.season,
        episode: meta.episode,
        episode_title: meta.episode_title,
        savedAt: Date.now(),
        progressPercent: 0,
      };
      saveToHistory(item);
    };
    save();
    const id = setInterval(save, 10000);
    return () => clearInterval(id);
  }, [meta]);

  const onSelect = (i: number) => {
    setCurrentIndex(i);
    try {
      localStorage.setItem(LS_KEY(meta.tmdb_id), String(i));
    } catch {}
    toast(`Switched to ${sources[i].name} ✓`);
  };

  const onFullscreen = () => {
    iframeRef.current?.requestFullscreen?.();
  };

  if (!sources || sources.length === 0) {
    return (
      <div className="px-4 md:px-8">
        <div className="relative w-full aspect-video bg-black rounded flex items-center justify-center">
          <p className="text-white/60">No playable sources available.</p>
        </div>
      </div>
    );
  }

  const current = sources[currentIndex];

  return (
    <div>
      <div className="px-0 md:px-8">
        <div className="relative w-full aspect-video bg-black md:rounded overflow-hidden">
          <iframe
            ref={iframeRef}
            key={currentIndex}
            src={current.url}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setIsLoading(false)}
          />
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 pointer-events-none">
              <Loader2 className="w-10 h-10 animate-spin text-[#e50914]" />
              <p className="text-white/70 text-sm mt-2">Loading {current.name}…</p>
            </div>
          )}
          <button
            onClick={onFullscreen}
            className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/90 rounded p-2 transition-colors"
            aria-label="Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      <SourceTabs sources={sources} currentIndex={currentIndex} failed={failed} onSelect={onSelect} />

      <p className="px-4 md:px-8 mt-3 text-xs text-white/60">
        If one source doesn&apos;t work, try another ↑
      </p>

      <div className="px-4 md:px-8 mt-5 bg-[#141414] border border-white/5 rounded p-4 md:max-w-3xl">
        <h4 className="font-semibold text-sm mb-1">Not playing?</h4>
        <p className="text-sm text-white/70">
          Try switching to a different source above. <span className="text-white">VidLink</span> and{' '}
          <span className="text-white">2Embed</span> usually have the best backup HD quality.
        </p>
      </div>
    </div>
  );
}
