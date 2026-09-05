# Rondo normalized data model

Provider adapters map external payloads into Rondo-owned domain shapes. UI and feature code use these models only.

```ts
type ExternalIds = Record<string, string | undefined>

type SourceProvenance = {
  label: string
  detail: string
  status: 'authorized' | 'demo' | 'unavailable'
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
  previewUrl?: string
  previewDurationSeconds?: number
  explicit?: boolean
  genreIds: string[]
  style: string
  bpm?: number
  key?: string
  version?: string
  story?: { headline: string; body: string }
  soundPalette?: string[]
  writers: string[]
  producers: string[]
  source: SourceProvenance
}

type SavedMoment = {
  id: `${string}:${number}`
  trackId: string
  position: number
  createdAt: string
}

type SongNotes = Record<string, string> // Rondo track ID → private note

type JourneyProgress = {
  genreId: string
  artistId: string
  trackId?: string
  position: number
  playedTrackIds: string[]
  completedArtistIds: string[]
}

type PersistedState = {
  onboardingComplete: boolean
  profile: UserProfile
  savedTracks: string[]
  savedReleases: string[]
  savedArtists: string[]
  playedTracks: string[]
  savedMoments: SavedMoment[]
  songNotes: SongNotes
  theme: 'dark' | 'light'
  volume: number // 0–1
}

type ListeningUiState = {
  playing: boolean
  position: number
  repeatMode: 'continue' | 'track' | 'artist'
  selectedTrackId: string
  songRoomMode: 'room' | 'lyrics' | 'story' | 'credits' | 'queue'
  directoryCollapsed: boolean
  queueOpen: boolean
}
```

## Identity and matching rules

- Rondo IDs are primary; provider IDs are replaceable references.
- Primary and featured artists remain separate.
- Release editions and recording versions are not silently merged.
- Unknown values remain unknown; production never uses plausible filler.
- Matching mode includes only tracks mapped to the active genre; All retains visible style labels.

## Playback source rules

`previewUrl` is present only when Rondo may play that recording. `previewDurationSeconds` represents the playable asset and may be shorter than catalog duration. Source provenance is always visible. A track without an authorized URL can remain discoverable but uses a clearly labeled simulated timeline in this prototype.

## Persistence ownership

Rondo owns accounts, taste profiles, preferences, journeys, progress, saves, moments, and private notes. Licensed provider data remains subject to provider-specific storage, attribution, territory, and retention rules. The static prototype stores personal state only in browser local storage.
