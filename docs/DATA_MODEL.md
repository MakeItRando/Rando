# Rondo normalized data model

Provider adapters map external payloads into these domain shapes. UI and feature code use these models only.

```ts
type ProviderName = 'rondo' | 'spotify' | 'lyrics' | 'metadata'

type ExternalIds = {
  spotify?: string
  isrc?: string
  musicbrainz?: string
  [provider: string]: string | undefined
}

type Provenance = {
  provider: ProviderName
  sourceUrl?: string
  retrievedAt: string
  confidence?: number
}

type Sourced<T> = {
  value: T
  provenance: Provenance
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
  type: 'album' | 'ep' | 'single' | 'compilation'
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

type Credit = {
  personOrGroup: string
  roles: string[]
  provenance: Provenance
}

type ArtistJourney = {
  id: string
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

- A track recording is reconciled primarily by stable provider ID and ISRC, then by normalized artist/title/duration when necessary.
- A release edition is not automatically the same as another edition with a similar title.
- Primary and featured artists remain separate.
- `sortName` supports alphabetical navigation and may omit leading articles while preserving the display name.
- Unknown values remain unknown; they are never filled with plausible-looking sample data in production.

## Catalog matching

`matching` mode includes a track only when a sourced genre/style mapping meets the active genre rule. `all` mode includes the full eligible catalog while preserving visible tags. Matching decisions carry provenance and can be recomputed when taxonomy changes.

## Persistence ownership

Rondo owns journeys, progress, UI preferences, and Rondo-specific saves. Provider-library state is synchronized through a connector and is never treated as the only copy of Rondo progress.
