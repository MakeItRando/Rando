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
  type: 'Album' | 'EP'
  year: number
  primaryArtistIds: string[]
  cover: string
  accent: string
  accent2?: string
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

type ReleaseArtifact = {
  title: string
  eyebrow: string
  body: string
  thresholdSeconds: number
}

type ReleaseLore = {
  chapter: string
  hook: string
  note: string
  motif: string
  artifact: ReleaseArtifact
  revealBody: string
}

type DiscoveryDoor = {
  id: string
  trackId: string
  releaseId: string
  kicker: string
  invitation: string
}

type DiscoveryConnection = {
  fromTrackId: string
  toTrackId: string
  label: string
  note: string
}

type SavedMoment = {
  id: `${string}:${number}`
  trackId: string
  position: number
  createdAt: string
}

type SongNotes = Record<string, string> // Rondo track ID → private note

type ReleaseProgress = Record<string, number> // Rondo release ID → max genuine played seconds

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
  releaseProgress: ReleaseProgress
  unlockedArtifacts: string[] // Rondo release IDs
  theme: 'dark' | 'light'
  volume: number // 0–1
}

type SignalMode = 'audio' | 'motion' | 'paused' | 'reduced'

type ListeningUiState = {
  view: 'discover' | 'library' | 'journeys' | 'profile' | 'release'
  playing: boolean
  position: number
  repeatMode: 'continue' | 'track' | 'artist'
  selectedTrackId: string
  activeReleaseId?: string
  songRoomMode: 'room' | 'lyrics' | 'story' | 'credits' | 'reveals' | 'queue'
  directoryCollapsed: boolean
  queueOpen: boolean
  signalMode: SignalMode
}
```

## Release and discovery ownership

`releaseLore`, `discoveryDoors`, and `discoveryConnections` are Rondo editorial records keyed to normalized release and track IDs. They do not belong in provider payloads. A production editorial system may source and review them separately from catalog ingestion.

A release artifact is optional context, not a playable entitlement. `thresholdSeconds` controls only the artifact state. Track availability follows playback rights and never depends on reveal progress.

## Identity and matching rules

- Rondo IDs are primary; provider IDs are replaceable references.
- Primary and featured artists remain separate.
- Release editions and recording versions are not silently merged.
- Unknown values remain unknown; production never uses plausible filler.
- Matching mode includes only tracks mapped to the active genre; All retains visible style labels.
- Discovery references must resolve to normalized Rondo track and release IDs.
- Every release identity requires an accessible fallback if its artwork or palette cannot load.

## Playback source and signal rules

`previewUrl` is present only when Rondo may play that recording. `previewDurationSeconds` represents the playable asset and may be shorter than catalog duration. Source provenance is always visible. A track without an authorized URL can remain discoverable but uses a clearly labeled simulated timeline in this prototype.

Signal mode is runtime truth, not catalog metadata:

- `audio` means analyser-backed authorized media;
- `motion` means deterministic playback-synchronized fallback;
- `paused` means no active playback;
- `reduced` means nonessential animation is disabled.

Signal samples are ephemeral and are never persisted as user data.

## Reveal progress rules

- Progress accrues from the active release session while its recording advances.
- The stored value is the highest genuine played duration reached for that release.
- Crossing a release's threshold adds its ID to `unlockedArtifacts`.
- Unlock state persists across navigation and browser sessions in the prototype.
- Opening a page, seeking without playback, or playing a different release must not unlock the artifact.
- The release's core tracks, credits, and required information remain available before and after unlock.

## Persistence ownership

Rondo owns accounts, taste profiles, preferences, journeys, progress, saves, moments, private notes, and reveal state. Licensed provider data remains subject to provider-specific storage, attribution, territory, and retention rules. The static prototype stores personal state only in browser local storage under `rondo-prototype-v2`.
