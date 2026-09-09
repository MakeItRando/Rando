# Rondo normalized data model

Authorized source adapters map external payloads into Rondo-owned domain shapes. UI and feature code use these models only.

```ts
type RondoId = string
type Cursor = string

type Page<T> = {
  items: T[]
  nextCursor?: Cursor
  appliedLimit: number
}

type ExternalIds = Record<string, string | undefined>

type SourceProvenance = {
  sourceId: string
  label: string
  status: 'authorized' | 'demo' | 'unavailable' | 'removed'
  receivedAt?: string
  attribution?: string
}

type Artist = {
  id: RondoId
  canonicalName: string
  sortName: string
  aliasIds: RondoId[]
  genreIds: RondoId[]
  externalIds: ExternalIds
}

type Release = {
  id: RondoId
  title: string
  type: 'Album' | 'EP' | 'Single'
  releaseDate?: string
  primaryArtistIds: RondoId[]
  coverAssetId?: RondoId
  externalIds: ExternalIds
}

type TrackPlacement = {
  id: RondoId
  recordingId: RondoId
  releaseId: RondoId
  discNumber?: number
  trackNumber?: number
  title: string
  durationSeconds?: number
  primaryArtistIds: RondoId[]
  featuredArtistIds: RondoId[]
  genreIds: RondoId[]
  styleIds: RondoId[]
  explicit?: boolean
  source: SourceProvenance
}

type PlayableAuthorization = {
  authorizationRef: string
  mode: 'preview' | 'full'
  expiresAt: string
}

type SavedMoment = {
  id: RondoId
  trackId: RondoId
  position: number
  createdAt: string
}

type JourneyProgress = {
  genreId: RondoId
  artistId: RondoId
  trackId?: RondoId
  position: number
  recentPlayedTrackIds: RondoId[]
  completedArtistIds: RondoId[]
  updatedAt: string
  version: number
}

type PlaybackContext = {
  trackId?: RondoId
  releaseId?: RondoId
  artistId?: RondoId
  genreId?: RondoId
  queueContextId?: RondoId
  catalogMode: 'matching' | 'all'
  repeatMode: 'continue' | 'track' | 'artist'
  position: number
}

type PersistedPrototypeState = {
  onboardingComplete: boolean
  profile: UserProfile
  savedTracks: RondoId[]
  savedReleases: RondoId[]
  savedArtists: RondoId[]
  playedTracks: RondoId[]
  savedMoments: SavedMoment[]
  songNotes: Record<RondoId, string>
  releaseProgress: Record<RondoId, number>
  unlockedArtifacts: RondoId[]
  playbackContext?: PlaybackContext
  theme: 'dark' | 'light'
  volume: number
}

type SignalMode = 'audio' | 'motion' | 'paused' | 'reduced'
```

Playable authorization is opaque and short-lived. A public media URL or external catalog ID is never proof of permission.

## Catalog entities

Production needs first-class artists/aliases/name history/memberships; releases/editions/territories/labels/dates; recordings versus track placements/versions; people/organizations and sourced role credits; genres/styles/hierarchy/aliases/editorial mappings; source records/import batches/conflicts/provenance; rights grants/windows per asset/territory; artwork/audio/lyrics/biographies/credits/editorial assets with independent permission; availability/playback authorization/attribution/corrections/takedowns/audit; search documents/editorial collections/recommendations/events.

Listener domain: accounts, sessions, consent, taste, devices, library records, Journey progress, moments, private notes, preferences, privacy requests, and support/moderation records.

V1 excludes plans, subscriptions, customers, invoices, entitlements, refunds, disputes, taxes, and payouts.

## Identity and matching

- Rondo IDs are primary and stable; source IDs are replaceable.
- Source records may map to existing entities only through reviewed or high-confidence matching.
- Primary/featured artists remain separate.
- Aliases do not create duplicate artists.
- Release editions, recordings, and track placements are not silently merged.
- Merge/split retains redirects and audit history.
- Unknown stays unknown; no plausible filler.
- Discovery/editorial references resolve to Rondo IDs.
- Artwork/palette has accessible fallback.

## Rights and source

Owner supplies the legal/source plan before implementation. Public availability is not authorization.

Each asset permission records source, territories, time window, storage permission, use/playback mode, attribution, reporting, owner/contact, and removal state. Playback is authorized at request time. Catalog presence never grants playback.

## Scale and query rules

- Design identifiers/relations/indexes for millions of tracks and multiple source records.
- Index normalized names, aliases, external IDs, dates, genres/styles, credits, territory, and availability.
- Every list/search returns `Page<T>` with enforced maximum limit and opaque cursor.
- Stable cursor ordering includes a deterministic tie-breaker ID.
- No endpoint returns a complete catalog or recursively-expanded artist/release tree.
- List models are narrow; details are requested separately.
- Search documents are denormalized/rebuildable from canonical records.
- Large media lives in authorized object/CDN storage, not relational rows/Git.
- Import batches are immutable; writes use idempotency keys.
- Draft/validating/published/unavailable/removed are explicit.
- Updates are incremental; conflicts do not silently overwrite trusted fields.
- High-volume events partition/archive independently.
- Fixed prototype counts are not production schema facts.

## Bounded listener state

Listener records store IDs, progress, timestamps, user content, preferences, and bounded recent windows. They do not embed complete Track/Release/Artist objects, search result pages, taxonomy copies, source payloads, or full play history in one row/document.

Large play/event history belongs in an append/event store with retention/partitioning. Recommendation features read evaluated bounded features, not client-side catalog flattening.

## Search request contract

A request includes query, filters, locale, territory, explicit setting, cursor, and bounded limit. Client debounce/cancellation prevents stale results. A response includes narrow typed items, playability/rights summary, stable ordering, and next cursor. Search never requires downloading catalog JSON to the browser.

## Journey continuity

- independent per genre;
- Discover playback does not overwrite Journey;
- changing genre erases nothing;
- resume restores context without autoplay;
- records use stable IDs and survive pagination;
- `recentPlayedTrackIds` and completed IDs are bounded/paginated or normalized when large;
- transient UI state is excluded.

## Prototype migration

Storage key: `rondo-prototype-v2`. Read-time normalization validates array/record/profile/session/value shapes, clamps volume, defaults theme, accepts repeat `continue|track|artist`, migrates legacy `off` to `continue`, and writes the repaired snapshot back so direct readers cannot encounter the malformed raw value again.

## Persistence ownership

Rondo owns accounts, taste, preferences, journeys, progress, saves, moments, private notes, and optional editorial-extra state. Authorized source data obeys source-specific storage, attribution, territory, and retention rules. Prototype local storage is neither secure nor synchronized.
