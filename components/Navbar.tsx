'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/movies', label: 'Movies' },
  { href: '/series', label: 'Series' },
  { href: '/trending', label: 'Trending' },
  { href: '/new', label: 'New' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-black/95 backdrop-blur-sm' : 'bg-gradient-to-b from-black/80 to-transparent'
      )}
    >
      <nav className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-[#e50914] font-extrabold text-2xl tracking-tight">
            StreamVault
          </Link>
          <ul className="hidden md:flex items-center gap-6 text-sm">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    'transition-colors hover:text-white',
                    pathname === l.href ? 'text-white font-semibold' : 'text-white/70'
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <form onSubmit={submit} className="flex items-center bg-black/80 border border-white/20 rounded px-2">
              <Search className="w-4 h-4 text-white/60" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles..."
                className="bg-transparent px-2 py-1 text-sm w-40 md:w-64 outline-none text-white placeholder:text-white/40"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setQuery('');
                }}
                aria-label="Close search"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:text-[#e50914] transition-colors"
              aria-label="Open search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
