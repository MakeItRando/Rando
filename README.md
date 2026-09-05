# Rondo

**Find your next repeat.**

Rondo is an independent artist-by-artist music journey: choose a genre, move through artists alphabetically, explore albums and EPs, and keep the music worth returning to.

Rondo is not a Spotify client or wrapper. It owns its account, library, journeys, genre system, queue, player, recommendation rules, and brand. Catalog, audio, metadata, artwork, and lyrics enter through replaceable authorized connectors.

## Current release — v0.3.0

This release makes the song the emotional center of Rondo:

- cinematic, artwork-adaptive **Song Room** with Room, Lyrics, Story, Credits, and Up Next modes;
- exact style, album/EP, featured roles, tempo/key, version, credits, and source provenance;
- synchronized demo lyrics and timestamp seeking;
- saved moments and private song notes surfaced in Library;
- persistent, accessible volume control and focus-contained overlays;
- six original Rondo demo recordings with real play, pause, seek, repeat, and queue continuity;
- honest simulated fallback for catalog tracks without an authorized recording;
- responsive desktop/mobile composition and Reduced Motion support.

The included recordings are original 32-second prototype instrumentals by **Rondo Originals**. They are not copies or reconstructions of commercial music.

## Preview locally

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

To build the deterministic QA preview and run the complete gate:

```bash
npm install
npm run build:preview
RONDO_URL=file:///absolute/path/to/Rando/preview-test.html npm test
```

## Product hierarchy

`Rondo account → taste profile → genre → alphabetical artist → Artist Focus → matching/all catalog → album or EP → track → Song Room → Room/Lyrics/Story/Credits/Up Next → completion confirmation`

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

Production recordings, artwork, metadata, and lyrics require authorization through licensed providers, official embeds where permitted, direct artist uploads, Creative Commons/public-domain material, or direct rights agreements. GitHub Pages can host this static prototype; secure accounts, provider credentials, and licensed commercial playback require a server-capable production deployment.
