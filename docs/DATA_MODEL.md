# Rondo normalized data model

Provider adapters map external payloads into these domain shapes. UI and feature code use these models only.

```ts
type ExternalIds = Record<string, string | undefined>

type Provenance = {
  provider: string
  sourceUrl?: string
  retrievedAt: string
  confidence?: number
}

type Sourced<T> = {
  value: T
  provenance: Provenance
}

type UserProfile = {
  id: string
  displayName: string
  avatar?: ImageAsset
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
  preferredDecades: string[]
  discoveryLevel: number
  popularityBias: number
  vocalPreference?: number
  albumFocus: number
  allowExplicit: boolean
  updatedAt: string
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
  trackCount?: number
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

type Lyrics = {
  track: EntityRef
  language?: string
  synchronization: 'line' | 'word' | 'none'
  lines: LyricLine[]
  attribution: string
  rights?: string
}

type ArtistJourney = {
  id: string
  userId: string
  genre: EntityRef
  artistIds: string[]
  artistCursor?: string
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
```

## Identity rules

- Rondo IDs are primary; provider IDs are replaceable references.
- A recording is reconciled by stable provider IDs and ISRC, then normalized artist/title/duration when necessary.
- Release editions with similar titles are not automatically merged.
- Primary and featured artists remain separate.
- `sortName` supports A–Z navigation while preserving the display name.
- Unknown values remain unknown; production never uses plausible-looking filler.

## Catalog matching

`matching` mode includes a track only when a sourced mapping meets the active genre rule. `all` mode includes the complete eligible album/EP catalog while preserving visible tags. Matching decisions carry provenance and can be recomputed when taxonomy changes.

## Persistence ownership

Rondo owns accounts, taste profiles, journeys, progress, preferences, and saves. Licensed provider data remains subject to provider-specific storage and retention rules.
