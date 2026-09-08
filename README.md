# Rondo

**Find your next repeat.**

Rondo is a music-discovery and listening prototype. Discover helps someone choose a sound or browse across genres. Journeys offers a slower artist-by-artist path. Any song can open in the Song Room for focused listening.

Rondo is not a Spotify client or wrapper. It owns its library, discovery flow, journeys, queue, player, and brand. Future catalog providers stay behind replaceable connectors.

## Current release — v0.3.2 user-test candidate

This candidate focuses on a clear, human music experience:

- **Discover opens a chooser** instead of another feed;
- choosing a genre leads to a dedicated playlist with search, a mix action, album art, style, duration, and direct playback;
- **Browse everything** opens Explore with search, Popular now, Hidden gems, and songs grouped by genre;
- Discover and Journeys remain separate so quick listening does not replace artist exploration;
- albums and EPs have distinct artwork rather than generic repeated cards;
- the Song Room uses the active cover, restrained motion, a truthful waveform, clear transport controls, and expressive volume feedback;
- visible Song Room labels use familiar words: About, Lyrics, Credits, Extra, and Up next;
- artist playback says Play, Pause, or Resume truthfully and preserves position;
- desktop, mobile, 320px layouts, keyboard access, focus handling, Light appearance, and Reduced Motion are covered by regression tests;
- the portable preview contains six original Rondo demo recordings and a fictional catalog for prototype testing.

The prototype does not include real artists, licensed songs, production accounts, provider credentials, or backend services yet. Those come after this experience is approved.

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

The build also produces `preview.html`, a self-contained file for user testing.

## Product hierarchy

```text
Discover
  → choose a genre → genre playlist → song
  → Browse everything → Explore → song
Journeys
  → genre → alphabetical artist → release → song
Any song
  → Song Room → About / Lyrics / Credits / Extra / Up next
```

## Architecture

The prototype separates catalog data, journey rules, persisted state, views, artwork ambience, Song Room rendering, and provider-neutral audio. UI code consumes normalized Rondo objects; future providers stay behind connector interfaces. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Documentation

- [`docs/PRODUCT.md`](docs/PRODUCT.md) — confirmed behavior and scope
- [`docs/ONBOARDING.md`](docs/ONBOARDING.md) — account and taste setup
- [`docs/DESIGN.md`](docs/DESIGN.md) — interface and interaction system
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — modules and connector boundaries
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — normalized entities and state ownership
- [`docs/BRAND.md`](docs/BRAND.md) — identity and visual principles

## Rights boundary

Production recordings, artwork, metadata, lyrics, biographies, and liner material require authorization through licensed providers, official embeds where permitted, direct artist uploads, Creative Commons/public-domain material, or direct rights agreements. Secure accounts, provider credentials, licensed playback, and rights enforcement require a server-capable production deployment.
