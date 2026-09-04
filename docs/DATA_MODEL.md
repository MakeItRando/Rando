# Rondo normalized data model

Provider adapters map external payloads into Rondo-owned domain shapes. UI and feature code use these models only.

```ts
type ExternalIds = Record<string, string | undefined>

type Sourced<T> = {
  value: T
  provenance: {
    provider: string
    sourceUrl?: string
    retrievedAt: string
    confidence?: number
  }
}

type UserProfile = {
  id: string
  displayName: string
  region: string
  interfaceLanguage: string
  lyricLanguages: string[]
  onboardingCompletedAt?: string
  accessibility: AccessibilityPreferences
}

type TasteProfile = {
  id: string
  userId: string
  version: number
  genreWeights: Record<string, number>
  seedArtistIds: string[]
  discoveryLevel: number
  popularityBias: number
  albumFocus: number
  allowExplicit: boolean
  updatedAt: string
}

type AppearancePreference = {
  theme: 'dark' | 'light'
  reduceMotion?: boolean
  highContrast?: boolean
  largerText?: boolean
}

type GenreTag = {
  id: string
  name: string
  parentId?: string
  kind: 'main' | 'subgenre' | 'style' | 'scene'
}

type Artist = {
  id: string
  externalIds: ExternalIds
  name: string
  sortName: string
  aliases: string[]
  images: ImageAsset[]
  origin?: Sourced<string>
  activeYears?: Sourced<string>
  biography?: Sourced<string>
  genres: Sourced<GenreTag>[]
}

type Release = {
  id: string
  externalIds: ExternalIds
  title: string
  type: 'album' | 'ep'
  releaseDate?: string
  artwork: ImageAsset[]
  primaryArtists: EntityRef[]
}

type Track = {
  id: string
  externalIds: ExternalIds
  title: string
  release: EntityRef
  primaryArtists: EntityRef[]
  featuredArtists: EntityRef[]
  discNumber?: number
  trackNumber?: number
  durationMs: number
  explicit?: boolean
  genres: Sourced<GenreTag>[]
  availability: Availability
}

type ArtistJourney = {
  id: string
  userId: string
  genre: EntityRef
  artistIds: string[]
  activeArtistIndex: number
  catalogMode: 'matching' | 'all'
  status: 'active' | 'awaiting_confirmation' | 'complete'
}

type JourneyProgress = {
  journeyId: string
  artistId: string
  releaseId?: string
  trackId?: string
  positionMs: number
  playedTrackIds: string[]
  completedReleaseIds: string[]
  completedArtistIds: string[]
  updatedAt: string
}

type ListeningUiState = {
  playing: boolean
  positionMs: number
  repeatMode: 'continue' | 'track' | 'artist'
  selectedTrackId: string
  inspectorTab: 'details' | 'lyrics' | 'credits'
  directoryCollapsed: boolean // transient; never persisted
  queueOpen: boolean
}
```

## Identity and matching rules

- Rondo IDs are primary; provider IDs are replaceable references.
- Primary and featured artists remain separate.
- `sortName` supports A–Z navigation while preserving display name.
- Release editions with similar titles are not silently merged.
- Unknown values remain unknown; production never uses plausible-looking filler.
- `matching` includes a track only when a sourced mapping meets the active genre rule.
- `all` includes the complete eligible album/EP catalog while preserving visible tags.

## Appearance and ambience

Theme is a persisted user preference. Genre ambience is derived from the active normalized genre and therefore is not stored as independent state. Playback-driven motion is presentation state; it does not imply an audio-analysis data source.

## Persistence ownership

Rondo owns accounts, taste profiles, appearance preferences, journeys, progress, and saves. Licensed provider data remains subject to provider-specific storage, attribution, territory, and retention rules.
