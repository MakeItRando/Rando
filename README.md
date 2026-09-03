# Rondo

**Find your next repeat.**

Rondo is an artist-by-artist music journey that combines genre discovery with full playback, artist context, lyrics, credits, and personal listening progress.

## Current status

The repository currently contains a responsive visual prototype with fictional sample data. The agreed production direction is now documented before the interface is rebuilt around Spotify authentication and artist chapters.

## Preview locally

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Confirmed product direction

- Spotify-first playback with sign-in required;
- genre → alphabetical artist → albums newest-to-oldest → songs in album order;
- matching-genre songs by default, with an all-catalog toggle;
- artist information and catalog progress above the playlist;
- Details, Lyrics, and Credits in Now Playing;
- saved songs, albums, artists, journeys, and listening progress;
- confirmation before continuing to the next artist;
- typed connector boundaries so provider code never leaks into the UI.

## Documentation

- [`docs/PRODUCT.md`](docs/PRODUCT.md) — confirmed behavior and feature scope
- [`docs/DESIGN.md`](docs/DESIGN.md) — screen and interaction direction
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — modules, connector contracts, and guardrails
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — normalized product entities
- [`docs/BRAND.md`](docs/BRAND.md) — identity and visual principles

## Important

The present catalog is fictional design data. Production playback, artwork, metadata, and lyrics require licensed providers. GitHub Pages can host the static prototype; authenticated production integrations require a server-capable deployment.
