# Rondo architecture

## Goal

Keep product behavior independent from Spotify, a lyrics vendor, or any future provider. UI components consume Rondo domain objects and commands, never raw vendor responses.

## Layers

```text
Presentation
    ↓
Feature controllers and state machines
    ↓
Application services / use cases
    ↓
Domain models and connector ports
    ↓
Provider adapters
    ↓
Spotify, lyrics provider, metadata provider, Rondo database
```

Dependencies point inward. Domain code must not import a provider SDK.

## Suggested repository structure

```text
src/
  app/                  routing, composition, feature flags
  domain/               normalized entities and rules
  features/
    auth/
    discovery/
    artist-journey/
    catalog/
    player/
    lyrics/
    credits/
    library/
    search/
  components/           shared visual primitives
  connectors/           provider-neutral interfaces
  adapters/
    spotify/
    lyrics/
    metadata/
    persistence/
  services/             orchestration, merge, cache, queue
  state/                small feature stores and state machines
server/
  auth/                  OAuth callback and secure sessions
  api/                   backend-for-frontend endpoints
  jobs/                  metadata refresh and reconciliation
  persistence/           database repositories
  observability/         logs, metrics, tracing
```

## Connector ports

### CatalogConnector

```ts
interface CatalogConnector {
  search(query: string, types: EntityType[], cursor?: string): Promise<SearchPage>
  listArtistsByGenre(genreId: string, cursor?: string): Promise<ArtistPage>
  getArtist(artistId: string): Promise<Artist>
  listArtistReleases(artistId: string, cursor?: string): Promise<ReleasePage>
  listReleaseTracks(releaseId: string, cursor?: string): Promise<TrackPage>
}
```

### PlaybackConnector

```ts
interface PlaybackConnector {
  connect(): Promise<PlaybackDevice>
  play(command: PlayCommand): Promise<void>
  pause(): Promise<void>
  seek(positionMs: number): Promise<void>
  setQueue(items: PlayableRef[]): Promise<void>
  subscribe(listener: (state: PlaybackState) => void): Unsubscribe
}
```

### LyricsConnector

```ts
interface LyricsConnector {
  getLyrics(match: RecordingMatch, locale?: string): Promise<LyricsResult>
}
```

The result carries synchronization type, language, rights, attribution, and availability. Lyrics content is never cached or transformed beyond what the provider license permits.

### MetadataConnector

```ts
interface MetadataConnector {
  getArtistContext(artist: ExternalIds): Promise<Sourced<ArtistContext>>
  getGenreTags(entity: ExternalIds): Promise<Sourced<GenreTag>[]>
  getCredits(recording: ExternalIds): Promise<Sourced<Credit>[]>
}
```

### LibraryConnector

```ts
interface LibraryConnector {
  save(entity: EntityRef): Promise<void>
  unsave(entity: EntityRef): Promise<void>
  readProgress(journeyId: string): Promise<JourneyProgress>
  writeProgress(update: ProgressUpdate): Promise<void>
}
```

Rondo persistence and Spotify-library synchronization are separate adapters behind this port.

## Spotify adapter

- Use OAuth Authorization Code with PKCE or a backend authorization-code flow; never use the deprecated implicit flow.
- Keep refresh tokens and server credentials outside the browser bundle.
- Use the Web Playback SDK behind `PlaybackConnector`.
- Treat subscription, browser DRM, device availability, market restrictions, and token expiry as explicit states.
- Do not build discovery around removed or restricted recommendation, related-artist, audio-feature, or top-track endpoints.
- Preserve Spotify attribution and linking requirements.
- Review Spotify's current developer policy before any commercial launch.

## Lyrics adapter

Spotify is not the architectural source of truth for lyrics. Select a licensed lyrics provider separately and isolate it behind `LyricsConnector`. Match recordings using provider IDs plus ISRC, artist, title, duration, and release context. Low-confidence matches must be rejected rather than showing incorrect lyrics.

## Genre and artist index

Alphabetical artist journeys require a Rondo-owned index because a playback catalog alone may not expose a complete, stable list of artists by genre. The index stores sourced classifications, aliases, sort names, eligibility, and cursors. It never claims that genre classification is universal.

## Application services

- `BuildArtistJourney` resolves eligible artists and alphabetical order.
- `BuildArtistCatalog` merges releases, removes duplicates, applies genre matching, and preserves official track order.
- `ResolveRecording` reconciles Spotify, metadata, credit, and lyrics identities.
- `AdvanceArtist` creates the completion summary and waits for user confirmation.
- `SaveEntity` writes Rondo state and optionally delegates a Spotify save.

## State machines

### Authentication

`unknown → signed_out → authorizing → signed_in → refreshing → expired/error`

### Playback

`disconnected → connecting → ready → loading → playing/paused → unavailable/error`

### Artist journey

`idle → loading_artist → browsing → playing → artist_complete → awaiting_confirmation → advancing`

Explicit states prevent scattered booleans and contradictory UI.

## Data and cache rules

- Every external value records provider, external ID, retrieval time, and confidence where applicable.
- Keep provider responses at adapter boundaries.
- Cache metadata separately from user data.
- Do not store copyrighted lyrics outside licensed rules.
- Use idempotency keys for save and progress writes.
- Paginate catalogs and artist indexes.
- Abort stale requests when genre or artist changes.

## Testing

- connector contract tests shared by every adapter;
- unit tests for catalog matching, release sorting, and artist advancement;
- state-machine transition tests;
- mocked-provider integration tests;
- accessibility and keyboard tests;
- visual regression at desktop and mobile sizes;
- end-to-end tests for login, playback, lyrics fallback, saves, and resume.

## Anti-spaghetti rules

1. No API calls inside visual components.
2. No raw Spotify or lyrics-vendor objects outside adapters.
3. No global store containing the whole app.
4. No feature may read another feature's private state directly.
5. No secrets in GitHub Pages or browser JavaScript.
6. No invented metadata when a connector returns unknown.
7. No second implementation of the same queue or playback rule.
8. Architecture decisions are recorded before adding another provider.

## Deployment

GitHub Pages remains suitable for the static design preview. Spotify OAuth, secure sessions, Rondo persistence, and secret-backed metadata or lyrics connectors require a server-capable production host. GitHub remains the source repository regardless of deployment platform.
