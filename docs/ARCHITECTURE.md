# Rondo architecture

## Goal

Rondo owns the account, product behavior, library, personalization, journeys, and user experience. Catalog, audio, metadata, artwork, and lyrics providers are replaceable infrastructure—not the product identity.

UI components consume Rondo domain objects and commands, never raw provider responses.

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
Licensed catalog, playback, lyrics, metadata, and Rondo persistence
```

Dependencies point inward. Domain code must not import a provider SDK.

## Suggested structure

```text
src/
  app/                  routing, composition, feature flags
  domain/               normalized entities and rules
  features/
    account/
    onboarding/
    discovery/
    artist-journey/
    catalog/
    player/
    lyrics/
    credits/
    library/
    profile/
    search/
  components/           shared visual primitives
  connectors/           provider-neutral interfaces
  adapters/
    account/
    catalog/
    playback/
    lyrics/
    metadata/
    persistence/
  services/             orchestration, merge, cache, queue, taste
  state/                small feature stores and state machines
server/
  auth/                  Rondo sessions and account security
  api/                   backend-for-frontend endpoints
  jobs/                  metadata refresh and reconciliation
  persistence/           database repositories
  observability/         logs, metrics, tracing
```

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

interface MetadataConnector {
  getArtistContext(artist: ExternalIds): Promise<Sourced<ArtistContext>>
  getGenreTags(entity: ExternalIds): Promise<Sourced<GenreTag>[]>
  getCredits(recording: ExternalIds): Promise<Sourced<Credit>[]>
}

interface LibraryConnector {
  save(entity: EntityRef): Promise<void>
  unsave(entity: EntityRef): Promise<void>
  readProgress(journeyId: string): Promise<JourneyProgress>
  writeProgress(update: ProgressUpdate): Promise<void>
}
```

## Provider independence

- No external music account is required by the product contract.
- Provider IDs live in an `externalIds` map and never become Rondo primary IDs.
- Authentication is Rondo authentication.
- A backend-for-frontend controls provider credentials, rate limits, caching, and response normalization.
- A provider can be replaced without rewriting screens, journeys, saves, or profiles.
- Catalog and playback may come from different licensed systems.

## Licensing boundary

The architecture does not imply a right to stream commercial recordings or display lyrics. Production only enables content for which Rondo has a valid licensed provider or direct rights agreement. Lyrics content follows the selected provider's storage, transformation, attribution, and territory rules.

## Application services

- `CompleteOnboarding` validates and versions a taste profile.
- `BuildArtistJourney` resolves eligible artists and alphabetical order.
- `BuildArtistCatalog` merges albums/EPs, removes duplicate editions, applies genre matching, and preserves official track order.
- `ResolveRecording` reconciles catalog, metadata, credit, and lyrics identities.
- `AdvanceArtist` creates the completion summary and waits for confirmation.
- `SaveEntity` writes Rondo library state.
- `UpdateTasteProfile` combines explicit preferences with transparent listening signals.

## State machines

- **Authentication:** `unknown → signed_out → registering/signing_in → onboarding → ready → expired/error`
- **Playback:** `disconnected → connecting → ready → loading → playing/paused → unavailable/error`
- **Artist journey:** `idle → loading_artist → browsing → playing → artist_complete → awaiting_confirmation → advancing`
- **Lyrics:** `idle → matching → synced/plain/unavailable → error`

Explicit states prevent scattered booleans and contradictory UI.

## Data and cache rules

- Every external value records provider, external ID, retrieval time, and confidence where applicable.
- Provider responses stop at adapter boundaries.
- User data and licensed content use separate storage policies.
- Copyrighted lyrics are never stored or transformed outside license rules.
- Saves and progress writes use idempotency keys.
- Catalogs and artist indexes are paginated.
- Stale requests are aborted when genre or artist changes.

## Testing

- connector contract tests shared by every adapter;
- unit tests for catalog matching, release sorting, onboarding, and artist advancement;
- state-machine transition tests;
- mocked-provider integration tests;
- accessibility and keyboard tests;
- visual regression at desktop and mobile sizes;
- end-to-end tests for account creation, onboarding, playback, lyrics fallback, saves, and resume.

## Anti-spaghetti rules

1. No API calls inside visual components.
2. No raw provider objects outside adapters.
3. No global store containing the entire app.
4. No feature reads another feature's private state directly.
5. No provider secrets in browser JavaScript.
6. No invented metadata when a connector returns unknown.
7. No duplicate queue, sorting, save, or playback rules.
8. No new provider without a contract test.
9. No feature enters implementation without loading, empty, error, and accessibility states.
10. Record architecture decisions before changing core boundaries.

## Deployment

GitHub Pages remains suitable for the static design preview. Rondo accounts, secure sessions, persistence, provider credentials, and licensed lyrics require a server-capable production host. GitHub remains the source repository regardless of deployment platform.
