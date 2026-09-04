# Rondo architecture

## Goal

Rondo owns accounts, product behavior, library, personalization, journeys, queue, playback UX, and preferences. Catalog, audio, metadata, artwork, and lyrics providers are replaceable infrastructure—not the product identity.

UI code consumes normalized Rondo domain objects and commands, never raw provider payloads.

## Dependency direction

```text
Presentation → feature orchestration → application services → domain/connector ports → provider adapters
```

Dependencies point inward. Domain and feature code never import a vendor SDK.

## Current prototype modules

```text
index.html                    semantic application and dialog surfaces
styles.css                    core editorial system and responsive layout
listening.css                 appearance, ambience, queue, and player layer
app.js                        browser entrypoint
src/app.js                    orchestration and event binding
src/data/catalog.js           fictional normalized catalog fixture
src/services/journey.js       ordering, lookup, progress, and queue rules
src/state/store.js            persisted preferences/library plus runtime state
src/ui/views.js               Library, Journeys, and Profile rendering
src/ui/ambience.js            pure genre-palette mapping and CSS token sync
scripts/build-preview.mjs     self-contained deterministic QA previews
tests/                        unit, smoke, quality, and listening regressions
```

The listening layer is separate from core styles so appearance can evolve without scattering genre conditions through components. `src/ui/ambience.js` owns the palette map; `src/app.js` only chooses which genre is active.

## State ownership

Persisted state:

- onboarding completion and profile;
- saved tracks, releases, and artists;
- played tracks and journey progress;
- `theme`, normalized to `dark` or `light`.

Transient interface state:

- active view, genre, artist, catalog mode, and selected track;
- playing, position, repeat mode, and inspector tab;
- `directoryCollapsed`, queue visibility, and open overlays.

The profile is deep-merged with defaults during migration so a partial older record cannot erase newly introduced fields. Journey collapse is deliberately not persisted: a fresh session opens in a navigable state, then responds to playback.

## Playback and ambience contract

`setPlaying` is the single transition for playback UI. Starting playback marks the selected track played, closes the mobile journey, and collapses the desktop directory. Pausing restores the normal journey state. A manual toggle can reopen the journey without mutating playback.

Ambient visuals consume only playback state and normalized genre. They do not access microphone, media samples, FFT data, or provider internals. Product copy describes them as playback-driven simulated motion.

## Overlay and focus contract

Queue, Search, Full Player, Onboarding, and Completion are explicit overlays. Opening stores the invoking element; closing returns focus synchronously when that element still exists. Escape closes the topmost open surface. Queue selection keeps the queue open and updates current state.

## Connector ports

```ts
interface CatalogConnector {
  search(query: string, types: EntityType[], cursor?: string): Promise<SearchPage>
  listArtistsByGenre(genreId: string, cursor?: string): Promise<ArtistPage>
  getArtist(artistId: string): Promise<Artist>
  listArtistReleases(artistId: string, types: ('album' | 'ep')[], cursor?: string): Promise<ReleasePage>
  listReleaseTracks(releaseId: string, cursor?: string): Promise<TrackPage>
}

interface PlaybackConnector {
  connect(session: RondoSession): Promise<PlaybackDevice>
  play(command: PlayCommand): Promise<void>
  pause(): Promise<void>
  seek(positionMs: number): Promise<void>
  setQueue(items: PlayableRef[]): Promise<void>
  subscribe(listener: (state: PlaybackState) => void): Unsubscribe
}

interface LyricsConnector {
  getLyrics(match: RecordingMatch, locale?: string): Promise<LyricsResult>
}

interface LibraryConnector {
  save(entity: EntityRef): Promise<void>
  unsave(entity: EntityRef): Promise<void>
  readProgress(journeyId: string): Promise<JourneyProgress>
  writeProgress(update: ProgressUpdate): Promise<void>
}
```

Provider IDs live in `externalIds`; they never become Rondo primary IDs. A backend-for-frontend owns credentials, rate limits, caching, reconciliation, and response normalization. Catalog, playback, lyrics, and metadata may come from separate authorized providers.

## Testing

- unit tests for ordering, matching, completion, and normalized counts;
- interaction smoke tests for onboarding, search, navigation, saves, and focus;
- quality audits for responsive layout, target sizes, contrast indicators, and browser errors;
- immersive listening tests for theme persistence, genre tokens, queue behavior, journey collapse, mobile stacking, and playback preservation;
- visual inspection at desktop, 390px, 320px, all genre palettes, Light, queue, player, and reduced-motion states.

## Anti-spaghetti rules

1. No API calls inside visual components.
2. No raw provider objects outside adapters.
3. No vendor secrets in browser JavaScript.
4. No duplicated queue, sorting, save, ambience, or playback rules.
5. No feature reads another feature's private state directly.
6. No invented production metadata when a connector returns unknown.
7. No new provider without a contract test.
8. No feature ships without loading, empty, error, accessibility, and mobile states.
9. No hidden access broadening or cross-service save side effects.
10. Record architecture decisions before changing core boundaries.

## Deployment

GitHub Pages is suitable for the static prototype. Rondo accounts, secure sessions, persistence, provider credentials, and licensed playback/lyrics require a server-capable production host.
