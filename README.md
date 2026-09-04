# Rondo

**Find your next repeat.**

Rondo is an independent artist-by-artist music journey: choose a genre, move through artists alphabetically, explore albums and EPs, and keep the music worth returning to.

Rondo is not a Spotify client or wrapper. Familiar interaction patterns may inspire usability, but Rondo owns its account, library, journeys, genre system, queue, player, recommendation rules, and brand. Catalog, audio, metadata, artwork, and lyrics enter through replaceable licensed connectors.

## Current release — v0.2.2

The repository contains a responsive, interactive design prototype with fictional catalog data. This release adds the immersive listening system:

- Night appearance by default, with a persistent Light/Night switch;
- genre-reactive ambience for Hip-Hop, R&B, Electronic, and Jazz;
- automatic Genre Journey collapse when playback starts;
- manual journey reopening without interrupting playback;
- playback-driven signal motion with reduced-motion support;
- an Up Next artist-chapter drawer;
- a redesigned full-screen player with lyrics, metadata, queue, and journey actions;
- a fixed off-canvas journey on mobile with no blank layout region;
- regression coverage for appearance, ambience, queue, focus, and mobile stacking.

Motion is a product visualization driven by playback state. It is not represented as live audio analysis.

## Preview locally

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173`.

To build self-contained QA previews and run the complete gate:

```bash
npm install
npm run build:preview
RONDO_URL=file:///absolute/path/to/Rando/preview-test.html npm test
```

## Product hierarchy

`Rondo account → taste profile → genre → alphabetical artist → Artist Focus → matching/all catalog → album or EP → track → Details/Lyrics/Credits → artist-completion confirmation`

## Architecture

The prototype is split into catalog data, journey rules, state, views, ambience, and orchestration modules. UI code consumes normalized Rondo objects; future provider code belongs behind connector interfaces. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Documentation

- [`docs/PRODUCT.md`](docs/PRODUCT.md) — confirmed behavior and feature scope
- [`docs/ONBOARDING.md`](docs/ONBOARDING.md) — account and music-taste setup
- [`docs/DESIGN.md`](docs/DESIGN.md) — interface and interaction system
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — modules, connector boundaries, and guardrails
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — normalized product entities and state ownership
- [`docs/BRAND.md`](docs/BRAND.md) — identity and visual principles

## Rights boundary

The current catalog and lyrics are fictional design data. A production release must use recordings, artwork, metadata, and lyrics for which Rondo has authorization: licensed providers, official embeds where permitted, direct artist uploads, Creative Commons/public-domain material, or direct rights agreements. GitHub Pages hosts the static prototype; accounts, secure sessions, provider credentials, and licensed playback require a server-capable production deployment.
