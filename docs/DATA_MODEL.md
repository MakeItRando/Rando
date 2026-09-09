# Rondo normalized data model

Provider/source adapters map authorized external payloads into Rondo-owned domain shapes. UI and feature code use these models only.

```ts
type ExternalIds = Record<string, string | undefined>

type SourceProvenance = {
  sourceId: string
  label: string
  detail: string
  status: 'authorized' | 'demo' | 'unavailable' | 'removed'
  receivedAt?: string
}

type Release = {
  id: string
  title: string
  type: 'Album' | 'EP' | 'Single'
  year: number
  primaryArtistIds: string[]
  cover?: string
  accent?: string
  externalIds: ExternalIds
}

type Track = {
  id: string
  recordingId?: string
  externalIds: ExternalIds
  title: string
  releaseId: string
  primaryArtistIds: string[]
  featuredArtists: string[]
  discNumber?: number
  trackNumber?: number
  durationSeconds: number
  playableAsset?: { authorizationRef: string; durationSeconds?: number }
  explicit?: boolean
  genreIds: string[]
  styleIds?: string[]
  bpm?: number
  key?: string
  version?: string
  writerCreditIds: string[]
  producerCreditIds: string[]
  source: SourceProvenance
}

type SavedMoment = {
  id: string
  trackId: string
  position: number
  createdAt: string
}

type SongNotes = Record<string, string>

type ReleaseProgress = Record<string, number>

type JourneyProgress = {
  genreId: string
  artistId: string
  trackId?: string
  position: number
  playedTrackIds: string[]
  completedArtistIds: string[]
  updatedAt: string
}

type PersistedPrototypeState = {
  onboardingComplete: boolean
  profile: UserProfile
  savedTracks: string[]
  savedReleases: string[]
  savedArtists: string[]
  playedTracks: string[]
  savedMoments: SavedMoment[]
  songNotes: SongNotes
  releaseProgress: ReleaseProgress
  unlockedArtifacts: string[]
  activeGenreId?: string
  journeyProgressByGenre: Record<string, JourneyProgress>
  playbackContext?: PlaybackContext
  theme: 'dark' | 'light'
  volume: number
}

type SignalMode = 'audio' | 'motion' | 'paused' | 'reduced'
```

`playableAsset.authorizationRef` is an opaque, short-lived reference resolved by the backend. Production must not persist a permanent public media URL as proof of permission.

## Production catalog entities

The large catalog needs first-class, separately identifiable entities for:

- artists, aliases, verified profiles, memberships, and name histories;
- releases, editions, territories, labels/imprints, and release dates;
- recordings versus release-track placements and alternate versions;
- people/organizations, role-based credits, and credit sources;
- genres, styles, parent/child relationships, aliases, and editorial mappings;
- source records, external IDs, import batches, conflicts, and provenance;
- rights grants/windows by asset type and territory;
- artwork, audio, lyrics, biographies, credits, and editorial assets with independent permissions;
- availability, playback authorization, attribution, corrections, takedowns, and audit logs;
- search documents, editorial collections, recommendations, and events.

The real listener system also needs accounts, sessions, consent, taste profiles, devices, library records, Journey progress, moments, notes, preferences, privacy requests, and moderation/support records.

V1 explicitly does **not** require plans, subscriptions, payment customers, invoices, payment entitlements, refunds, disputes, taxes, or payouts. Keep those outside the V1 schema; add them only after a separate payment decision.

## Identity and matching rules

- Rondo IDs are primary; source IDs are replaceable references.
- One source record may map to an existing Rondo entity after reviewed or high-confidence matching.
- Primary and featured artists remain separate.
- Artist aliases do not create duplicate artist identities.
- Release editions, recordings, and track placements are not silently merged.
- Merge and split operations retain redirects and full audit history.
- Unknown values remain unknown; production never uses plausible filler.
- Matching mode includes only tracks mapped to the active genre; All retains visible style labels.
- Discovery references must resolve to normalized Rondo track and release IDs.
- Every release identity requires an accessible fallback if artwork or palette cannot load.

## Rights and source rules

The product owner will supply the legal/source integration plan before implementation. Public availability in Spotify, YouTube, Suno, or another app is not represented as authorization by default.

Each independently licensed asset type records source, allowed territories, start/end window, storage permission, playback/use mode, attribution, reporting, owner/contact, and removal state. Playback is authorized at request time; catalog metadata alone never grants access.

## Catalog scale and query rules

- Design identifiers and relations for millions of tracks and many source records per entity.
- Index normalized names, aliases, external IDs, release dates, genres/styles, territories, and availability.
- Use cursor pagination and stable sort keys; never return a full catalog collection.
- Keep large artwork/audio blobs in authorized object/CDN storage, not relational rows or Git.
- Use immutable import-batch records and idempotency keys for replayable ingestion.
- Track draft, validating, published, unavailable, and removed states.
- Keep search documents denormalized and rebuildable from canonical records.
- Apply source updates incrementally and record conflicts rather than silently overwriting trusted fields.
- Partition/archive high-volume events independently from canonical catalog data.

## Playback source and signal rules

A playable authorization exists only when Rondo may play that recording for the current listener and territory. Signal mode is runtime truth, not catalog metadata. Audio samples are ephemeral and are never persisted as user data.

## Journey continuity rules

- Store Journey progress independently per genre.
- Playing from Discover must not overwrite the active Journey.
- Changing genre must not erase another genre's state.
- Resume restores context but never autoplays after reload without a new user gesture.
- Temporary UI state is not persistence data.
- Journey records reference stable genre/artist/track IDs and survive catalog pagination.

## Persistence ownership

Rondo owns accounts, taste profiles, preferences, journeys, progress, saves, moments, private notes, and optional editorial-extra state. Authorized source data remains subject to source-specific storage, attribution, territory, and retention rules. The static prototype stores personal state only in browser local storage under `rondo-prototype-v2`.
