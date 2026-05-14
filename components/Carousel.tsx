'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { MediaItem } from '@/lib/types';

interface Props {
  title: string;
  items: MediaItem[];
}

export default function Carousel({ title, items }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  // Drag-to-scroll for desktop
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });

  const update = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 5);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    update();
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [items]);

  const scroll = (dir: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    dragState.current = {
      isDown: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el || !dragState.current.isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = x - dragState.current.startX;
    if (Math.abs(walk) > 4) dragState.current.moved = true;
    el.scrollLeft = dragState.current.scrollLeft - walk;
  };
  const onMouseUp = () => {
    dragState.current.isDown = false;
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="px-4 md:px-8 my-8 group/row">
      <h2 className="text-xl md:text-2xl font-bold mb-3">{title}</h2>
      <div className="relative">
        {canLeft && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 rounded-full w-10 h-10 items-center justify-center transition-opacity opacity-0 group-hover/row:opacity-100"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {canRight && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 rounded-full w-10 h-10 items-center justify-center transition-opacity opacity-0 group-hover/row:opacity-100"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        <div
          ref={containerRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2 select-none"
        >
          {items.map((item) => (
            <div
              key={`${item.media_type}-${item.id}`}
              className="flex-shrink-0 w-[44%] sm:w-[31%] md:w-[23%] lg:w-[19%] xl:w-[13.5%]"
              onClickCapture={(e) => {
                if (dragState.current.moved) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <MovieCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
