# Rondo

**Find your next repeat.**

Rondo is a music-discovery and listening prototype. Discover is the fast, song-first home. Journeys is the slower path through a genre, its artists, releases, and tracks. Any song can open in the Song Room for focused listening.

Rondo is not a Spotify client or wrapper. It owns its discovery flow, journeys, queue, player, and brand. Future catalog providers stay behind replaceable connectors.

## Current release — v0.3.2 user-test candidate

This candidate focuses on a clear, human music experience:

- **Discover opens directly** with search, Continue listening, Hits today, Made for you, Bangers, Sounds, Hidden gems, New & rising, and compact links into Genre Journeys;
- Discover never interrupts someone with a genre chooser;
- **Journeys owns genre choice**: a first-time listener sees a focused picker, while a returning listener resumes the last active genre;
- each genre is a distinct, deep-linkable Journey subpage with progress, scoped search, songs, releases, artists, Play mix, Start/Resume, and Change genre;
- meaningful progress is saved independently for Hip-Hop, R&B, Electronic, and Jazz;
- route-backed page states support browser Back/Forward, page titles, heading focus, one visible main landmark, and stable global playback;
- changing Journey genres does not erase earlier progress, and playing from Discover does not replace the active Journey;
- the Song Room uses the active cover, restrained motion, a truthful waveform, clear transport controls, and expressive volume feedback;
- artist playback says Play, Pause, or Resume truthfully and preserves listening context;
- desktop, mobile, 320px layouts, keyboard access, Light appearance, and Reduced Motion are covered by regression and visual tests;
- the portable preview contains six original Rondo demo recordings and a fictional catalog for prototype testing.

The prototype does not include real artists, licensed songs, production accounts, provider credentials, live charts, or backend services yet. Those come after this experience is approved.

## Preview locally

Requirements: Node 20+ and Chromium.

```bash
npm ci
npm run build:preview
npm run serve
```

Open `http://localhost:4173`.

Run the full release gate from another terminal:

```bash
RONDO_URL=http://127.0.0.1:4173/preview-test.html npm test
npm audit
```

The build also produces `preview.html`, a portable file for user testing.

## Product hierarchy

```text
Discover
  → search / recommendations / sounds → song → Song Room
  → Genre Journeys → Journey genre page
Journeys
  → first visit: genre picker
  → /journeys/<genre> → songs / releases / artists
  → /journeys/<genre>/artist/<artist> → guided artist Journey
Any song
  → Song Room → About / Lyrics / Credits / Extra / Up next
```

## Page architecture

Rondo uses route-backed SPA pages such as `#/discover`, `#/journeys/rnb`, and `#/journeys/rnb/artist/mira-son`. This gives each destination a distinct URL and accessible page state while keeping the active song, queue, position, and Song Room uninterrupted.

Routes do not make the JavaScript bundle smaller by themselves. The current performance gains come from rendering only the active page, removing duplicate hidden content, and lazy-loading artwork. Later code splitting can reduce initial download size when the catalog and feature set grow.

## Architecture

The prototype separates catalog data, journey rules, persisted state, page routing, artwork ambience, Song Room rendering, and provider-neutral audio. UI code consumes normalized Rondo objects; future providers stay behind connector interfaces. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Documentation

- [`docs/PRODUCT.md`](docs/PRODUCT.md) — confirmed behavior and scope
- [`docs/ONBOARDING.md`](docs/ONBOARDING.md) — account and taste setup
- [`docs/DESIGN.md`](docs/DESIGN.md) — interface and interaction system
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — modules and connector boundaries
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — normalized entities and state ownership
- [`docs/BRAND.md`](docs/BRAND.md) — identity and visual principles

## Rights boundary

Production recordings, artwork, metadata, lyrics, biographies, and liner material require authorization through licensed providers, official embeds where permitted, direct artist uploads, Creative Commons/public-domain material, or direct rights agreements. Secure accounts, provider credentials, licensed playback, and rights enforcement require a server-capable production deployment.
