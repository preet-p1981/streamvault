'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Tv, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/', label: 'Home', Icon: Home },
  { href: '/movies', label: 'Movies', Icon: Film },
  { href: '/series', label: 'Series', Icon: Tv },
  { href: '/search', label: 'Search', Icon: Search },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-black/95 border-t border-white/10 backdrop-blur">
      <ul className="flex justify-around py-2">
        {ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-1 text-[10px]',
                  active ? 'text-[#e50914]' : 'text-white/70'
                )}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
