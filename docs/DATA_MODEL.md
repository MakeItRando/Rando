# Rondo normalized data model

Provider adapters map external payloads into Rondo-owned domain shapes. UI and feature code use these models only.

```ts
type ExternalIds = Record<string, string | undefined>

type SourceProvenance = {
  label: string
  detail: string
  status: 'authorized' | 'demo' | 'unavailable'
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
  externalIds: ExternalIds
  title: string
  releaseId: string
  primaryArtistIds: string[]
  featuredArtists: string[]
  discNumber?: number
  trackNumber?: number
  durationSeconds: number
  playableAsset?: { url: string; durationSeconds?: number; territory?: string[] }
  explicit?: boolean
  genreIds: string[]
  style?: string
  bpm?: number
  key?: string
  version?: string
  writers: string[]
  producers: string[]
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

## Production additions

The real system also needs first-class models for accounts, sessions, consent, provider links, territories, rights windows, playback authorization, attribution, editorial records, recommendations, events, plans, subscriptions, payment-customer references, invoices, entitlements, takedowns, and audit logs.

Payment-provider secrets and sensitive payment instruments never enter Rondo's browser or primary database. Rondo stores provider references and verified entitlement state.

## Identity and matching rules

- Rondo IDs are primary; provider IDs are replaceable references.
- Primary and featured artists remain separate.
- Release editions and recording versions are not silently merged.
- Unknown values remain unknown; production never uses plausible filler.
- Matching mode includes only tracks mapped to the active genre; All retains visible style labels.
- Discovery references must resolve to normalized Rondo track and release IDs.
- Every release identity requires an accessible fallback if artwork or palette cannot load.

## Playback source and signal rules

A playable URL exists only when Rondo may play that recording for the current listener and territory. Signal mode is runtime truth, not catalog metadata. Samples are ephemeral and are never persisted as user data.

## Journey continuity rules

- Store Journey progress independently per genre.
- Playing from Discover must not overwrite the active Journey.
- Changing genre must not erase another genre's state.
- Resume restores context but never autoplays after reload without a new user gesture.
- Temporary UI state is not persistence data.

## Persistence ownership

Rondo owns accounts, taste profiles, preferences, journeys, progress, saves, moments, private notes, and optional editorial-extra state. Licensed provider data remains subject to provider-specific storage, attribution, territory, and retention rules. The static prototype stores personal state only in browser local storage under `rondo-prototype-v2`.
