# Rondo normalized data model

**Status:** production target, not current backend schema. Source adapters translate external payloads to stable Rondo-owned entities; UI never depends on a provider's objects. Prototype browser storage is described separately below. See [handoff/PLAYBACK_CONTEXTS.md](../handoff/PLAYBACK_CONTEXTS.md) for the confirmed two-session behavior.

```ts
type RondoId = string;
type Cursor = string;
type Page<T> = { items: T[]; nextCursor?: Cursor; appliedLimit: number };
type SourceProvenance = {
  sourceId: string; label: string;
  status: 'authorized' | 'demo' | 'unavailable' | 'removed';
  receivedAt?: string; attribution?: string;
};
type Artist = {
  id: RondoId; canonicalName: string; sortName: string;
  aliasIds: RondoId[]; genreIds: RondoId[]; externalIds: Record<string, string | undefined>;
};
type Release = {
  id: RondoId; title: string; type: 'Album' | 'EP' | 'Single';
  releaseDate?: string; primaryArtistIds: RondoId[]; coverAssetId?: RondoId;
  externalIds: Record<string, string | undefined>;
};
type TrackPlacement = {
  id: RondoId; recordingId: RondoId; releaseId: RondoId;
  discNumber?: number; trackNumber?: number; title: string; durationSeconds?: number;
  primaryArtistIds: RondoId[]; featuredArtistIds: RondoId[];
  genreIds: RondoId[]; styleIds: RondoId[]; explicit?: boolean;
  source: SourceProvenance;
};
type PlayableAuthorization = {
  authorizationRef: string; mode: 'preview' | 'full'; expiresAt: string;
};
type SavedMoment = { id: RondoId; trackId: RondoId; position: number; createdAt: string };
type JourneyProgress = {
  genreId: RondoId; artistId: RondoId; trackId?: RondoId; position: number;
  recentPlayedTrackIds: RondoId[]; completedArtistIds: RondoId[];
  updatedAt: string; version: number;
};
type PlaybackSession = {
  contextId: RondoId; sourceSurface: string; sourceLabel: string;
  selectedTrackId?: RondoId; queueTrackIds: RondoId[]; queueIndex: number;
  position: number; repeatMode: 'continue' | 'track' | 'artist';
};
type JourneySession = PlaybackSession & {
  genreId?: RondoId; artistId?: RondoId; lastJourneyRoute?: string;
};
type GlobalSession = PlaybackSession & {
  sourceSurface: 'discover' | 'search' | 'sound' | 'library' | 'release' | string;
};
type PlaybackState = {
  version: number; activeContext: 'journey' | 'global';
  journeySession?: JourneySession; globalSession?: GlobalSession;
};
type SignalMode = 'audio' | 'motion' | 'paused' | 'reduced';
```

This is a target shape, not a claim that all prototype session fields already persist. One physical audio engine reads only the active session; two logical queues remain independently resumable. Journey route/progress is separate from Global source playback. `PlayableAuthorization` is opaque, short-lived, checked server-side at request time; a public URL or external ID never proves rights.

## Catalog and rights entities

Production needs artists, aliases/name history/memberships; releases, editions, labels and territorial dates; recordings versus release-specific track placements/versions; people/organizations and sourced role credits; genres/styles/hierarchy/aliases/editorial mappings; source records/import batches/conflicts/provenance; per-asset rights grants/windows/territories; artwork/audio/lyrics/biographies/credits/editorial assets with independent permissions; availability/playback authorization/attribution/corrections/takedowns/audit; search documents, collections and evaluated recommendation signals. Unknown fields stay unknown. Primary vs featured contributors stay distinct. Reviewed matching/merge/split retains redirects and audit history.

Owner supplies the implementation-facing legal/source plan before connectors. Each grant must capture source, territory, time, storage/use/playback mode, attribution/reporting, responsible party, correction and removal. Catalog visibility never implies playback permission. V1 has no plans, subscriptions, invoices, payment entitlements, taxes, refunds, disputes or payouts.

## Scale and API contracts

All list/search responses use bounded `Page<T>` with enforced maximum limit, opaque cursor, stable sort with ID tie-breaker; detail loads separately. No endpoint returns full catalog or recursively expanded artist trees. Search indexes names/aliases/identifiers/genres/styles/credits/territory/availability; queries include locale, territory, explicit setting and filters, debounced/cancelled client requests and rights-aware results. Search documents are rebuildable, media in authorized object/CDN storage. Import batches idempotent/resumable/auditable with staging, backpressure, retries, conflict handling and takedown. Listener state stores bounded IDs/progress/preferences/private content, not catalog objects, provider payloads, complete search pages or full event history. High-volume events partition/retain separately.

## Prototype storage and migration, not production identity

Current candidate uses browser `localStorage`: `rondo-prototype-v2` for profile/saves/plays/moments/private notes/release progress/theme/volume/current singleton state, `rondo-route-state-v1` for Journey routes/progress, and `rondo-playback-context-v1` for bounded Journey/Global context references. These layers are compatibility artifacts and do not imply secure accounts or server sync. Validate/migrate shape and version, clamp volume, default theme, normalize arrays/records, map legacy repeat `off` to `continue`, repair and write back malformed state. Do not persist dialog/focus/animation/autoplay intent or complete catalog objects. Production migration must consolidate first-class versioned two-session ownership into store/audio controller and test isolation, both positions, old-state repair, unavailable tracks and rights changes.

Listener domain additionally needs secure accounts/sessions, consent, taste, devices, Library, Journey progress, moments, notes, privacy requests and support/moderation. Data export/deletion and source-specific retention/attribution are part of V1's production design, not implemented by current browser storage.
