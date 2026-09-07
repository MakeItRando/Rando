# Rondo

**Find a door, not a feed. Find your next repeat.**

Rondo is an editorial music-discovery and listening prototype. It gives listeners two complementary ways into a catalog: a curated **Discover** destination for serendipity and an intentional **Journey** through a genre, artist, release, and track. Releases become memorable chapters, and the Song Room turns listening into context, revelation, and personal memory.

Rondo is not a Spotify client or wrapper. It owns its account, library, discovery logic, journeys, queue, player, recommendation rules, and brand. Catalog, audio, metadata, artwork, and lyrics enter through replaceable authorized connectors.

## Current release — v0.3.1 full-concept user-test candidate

This candidate expands the prototype around one experience loop:

`anticipation → entrance → listening → revelation → memory`

- a dedicated **Discover** front door with Tonight's Door, new chapters, controlled serendipity, scenes, cross-song signals, and a record of what listening reveals;
- a separate **Journeys** route for genre selection and deliberate artist-by-artist exploration;
- fifteen fictional albums and EPs with distinct artwork, chapter numbers, hooks, liner-style notes, motifs, and optional artifacts;
- release chapter pages that preserve album sequence and invite listening without overexplaining it;
- an artwork-adaptive **Song Room** with Room, Lyrics, Story, Credits, Reveals, and Queue modes;
- a truthful active waveform driven by authorized audio analysis when available, clearly labeled playback motion otherwise, a paused state, and a static Reduced Motion state;
- richer synchronized volume fields with level feedback, percentage readout, mute/unmute, and remembered audible-level restore;
- optional lore and artifacts revealed by listening—core songs are never locked behind engagement;
- saved tracks, releases, artists, moments, private notes, reveal progress, and unlocked artifacts that persist locally;
- six original Rondo demo recordings with real play, pause, seek, repeat, volume, and queue continuity;
- responsive desktop/mobile composition, focus-contained overlays, keyboard-complete controls, 44px touch targets, and Reduced Motion support;
- release-readiness coverage across onboarding, search, Discover, Journeys, release chapters, Song Room, real/fallback audio, persistence, compact layouts, and accessibility.

The included recordings are original 32-second prototype instrumentals by **Rondo Originals**. The artists, releases, stories, and artifacts in this repository are fictional prototype material—not claims about real artists or commercial recordings.

## Preview locally

Requirements: Node 20+ and Chromium.

```bash
npm ci
npm run build:preview
npm run serve
```

Open `http://localhost:4173`.

Run the complete release gate from another terminal while the server is running:

```bash
RONDO_URL=http://127.0.0.1:4173/index.html npm test
npm audit
```

The generated `preview-test.html` is a deterministic self-contained QA artifact. HTTP is preferred for full audio testing because browsers restrict media analysis from `file://` origins.

## Product hierarchy

```text
Rondo account → taste profile
  → Discover → door / chapter / scene / signal
  → Journeys → genre → alphabetical artist → matching or all catalog
  → release chapter → track → Song Room
  → optional revelation → Library memory
```

## Architecture

The prototype separates catalog data, discovery and journey rules, persisted state, views, artwork ambience, Song Room rendering, and provider-neutral audio. UI code consumes normalized Rondo objects; future providers stay behind connector interfaces. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Documentation

- [`docs/PRODUCT.md`](docs/PRODUCT.md) — confirmed behavior and scope
- [`docs/ONBOARDING.md`](docs/ONBOARDING.md) — account and taste setup
- [`docs/DESIGN.md`](docs/DESIGN.md) — interface and interaction system
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — modules and connector boundaries
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — normalized entities and state ownership
- [`docs/BRAND.md`](docs/BRAND.md) — identity and visual principles

## Rights boundary

Production recordings, artwork, metadata, lyrics, biographies, and liner material require authorization through licensed providers, official embeds where permitted, direct artist uploads, Creative Commons/public-domain material, or direct rights agreements. GitHub Pages can host this static prototype; secure accounts, provider credentials, licensed commercial playback, and rights enforcement require a server-capable production deployment.
