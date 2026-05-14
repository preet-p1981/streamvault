'use client';

import { Check, AlertTriangle } from 'lucide-react';
import { PlayerSource } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  sources: PlayerSource[];
  currentIndex: number;
  failed: number[];
  onSelect: (i: number) => void;
}

export default function SourceTabs({ sources, currentIndex, failed, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 px-4 md:px-8 mt-4">
      {sources.map((s, i) => {
        const isActive = i === currentIndex;
        const isFailed = failed.includes(i);
        const isWorking = s.isWorking && !isFailed;
        return (
          <button
            key={`${s.name}-${i}`}
            onClick={() => onSelect(i)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors',
              isActive
                ? 'bg-[#e50914] text-white'
                : isFailed
                ? 'bg-white/5 text-white/40'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            )}
          >
            <span>{s.name}</span>
            {isFailed ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : isWorking ? (
              <Check className="w-3.5 h-3.5" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
