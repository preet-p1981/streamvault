# StreamVault

A Netflix-clone streaming UI built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Framer Motion.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Architecture

- **Frontend ONLY** — all data fetched from `/api/*` routes (backend already provided)
- Never calls TMDB directly
- Images: `https://image.tmdb.org/t/p/{size}{path}`

## Pages

- `/` Homepage with Hero + Carousels
- `/movies` All movies + filters + infinite scroll
- `/series` All series + filters + infinite scroll
- `/search?q=` Search results
- `/trending` Trending
- `/new` New releases
- `/genre/[id]` Genre browsing
- `/movie/[id]` Movie detail
- `/series/[id]` Series detail (with season selector)
- `/watch/movie/[id]` Movie player (multi-source iframe)
- `/watch/series/[id]/[season]/[episode]` Episode player

## Key Components

- `EmbedPlayer` — multi-source iframe player with auto-fallback (8s timeout)
- `Hero` — auto-rotating banner (6s interval)
- `Carousel` — horizontal scroll with drag + arrow nav
- `MovieCard` — hover with backdrop fade + play button
- `ContinueWatching` — localStorage-backed row
- `Navbar` / `MobileNav` — responsive navigation

## LocalStorage Keys

- `streamvault:history` — watch history array
- `streamvault:searches` — recent searches
- `streamvault:lastSource:{tmdb_id}` — preferred player source
