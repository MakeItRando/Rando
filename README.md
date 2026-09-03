# Rondo

**Find your next repeat.**

Rondo is an independent artist-by-artist music journey that combines genre discovery, listening, artist context, lyrics, credits, and personal progress.

Rondo is not a Spotify client or wrapper. Other music products may inform familiar interaction patterns, but Rondo owns its account system, library, journeys, recommendation rules, interface, and brand. Catalog, audio, metadata, and lyrics are supplied through replaceable licensed connectors behind the product.

## Current status

The repository contains a responsive visual prototype with fictional sample data. The target behavior and clean production architecture are documented before the interface is rebuilt.

## Preview locally

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Confirmed product direction

- required Rondo account and taste onboarding;
- genre → alphabetical artist → albums and EPs newest-to-oldest → songs in release order;
- matching-genre songs by default, with an all-catalog toggle;
- artist information and catalog progress above the playlist;
- immersive Details, Lyrics, and Credits views;
- Rondo-owned saves, journeys, and listening progress;
- confirmation before continuing to the next artist;
- provider-neutral connectors so vendor code never leaks into the interface.

## Documentation

- [`docs/PRODUCT.md`](docs/PRODUCT.md) — confirmed behavior and feature scope
- [`docs/ONBOARDING.md`](docs/ONBOARDING.md) — account and music-taste setup
- [`docs/DESIGN.md`](docs/DESIGN.md) — screen and interaction direction
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — modules, connector contracts, and guardrails
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — normalized product entities
- [`docs/BRAND.md`](docs/BRAND.md) — identity and visual principles

## Important

The present catalog is fictional design data. A production music service requires licensed catalog, audio, artwork, metadata, and lyrics arrangements. GitHub Pages can host the static prototype; the authenticated production product requires a server-capable deployment.
