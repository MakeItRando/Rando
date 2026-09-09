# Rondo architecture

## Goal and dependency direction

Rondo owns identity/profile, behavior, Library, editorial discovery, personalization, Journeys, release context, logical playback sessions, queue, playback UX, and preferences. Catalog/audio/metadata/artwork/lyrics sources are replaceable authorized infrastructure.

The system begins with thousands of songs and scales to millions without changing the UI/domain contract.

```text
Presentation
  → feature orchestration
    → application/domain services
      → Rondo API ports
        → authorized source adapters and infrastructure
```

UI consumes normalized Rondo objects and never raw provider payloads.

## Current prototype modules

```text
index.html                         app shell, overlays, Song Room, transport
styles.css / listening.css         core and playback responsive system
song-room.css                      artwork-adaptive Song Room
concept.css / experience.css       candidate Discover and polish
route-pages.css                    candidate routes/pages
src/app.js                         legacy singleton orchestration/events
src/data/catalog.js                normalized fictional catalog/editorial refs
src/services/journey.js            ordering, lookup, progress, queue rules
src/services/audio.js              one shared media adapter/analyser
src/state/store.js                 migration-safe persistence/runtime state
src/ui/discoveryHub.js             canonical Discover/Genre route renderer
src/ui/productPolicy.js            recommendation/picker/accessibility policy
src/ui/playbackContexts.js         prototype dual-session compatibility controller
src/ui/playbackContextLayout.js    prototype desktop global-player placement
src/ui/views.js                    other pages; dormant legacy Discover renderer
tests/playback-contexts.mjs        Journey/global isolation regression
```

Candidate-only runtime files remain on `rondo-v031-user-ready` until acceptance.

## Canonical renderer policy

`src/ui/discoveryHub.js` is the sole canonical Discover/Genre renderer. Dormant `renderDiscoverView()` in `src/ui/views.js` is not a rollback path. Delete it before production catalog integration after accepted integration confirms no caller remains.

## Routes and rendering

Primary routes are Discover, Library, Journeys, and Profile. Release is an internal destination. Genre/Artist routes use stable Rondo IDs/slugs, never offsets.

The active renderer owns title, landmark, and focus. Browsing never implicitly changes track, queue, playback context, or Journey. Lists are bounded and load incrementally; a route is never permission to fetch the full catalog.

## State ownership

Persisted listener state contains bounded references/progress only:

- profile/onboarding/consent preferences;
- saved entity IDs and bounded recent plays;
- private moments/notes;
- appearance, volume, accessibility;
- active playback-context name;
- independent Journey and global playback session references;
- per-genre continuity and optional release progress.

It never contains complete catalogs, search results, taxonomy copies, provider payloads, artwork blobs, or secrets.

Runtime state contains active route, browsed entity, active session, queue page, playing/open modal/focus/analyser/animation/loading/error state. Modal, hover, waveform, and autoplay intent remain transient.

## Playback contexts and one audio engine

Rondo has exactly one physical audio element/adapter, media clock, volume state, and analyser. Above it, the application stores two logical resumable sessions:

- **Journey:** genre, artist, track, queue/index, position, repeat, route, progress.
- **Global:** source surface/context, track, bounded source queue/index, position, repeat.

Navigation never switches playback context. A play intent activates the session that owns its source and first persists the other session unchanged. Previous/Next, Up Next, transport, and Song Room always target the active session.

The current candidate's DOM interception is prototype compatibility glue around `src/app.js`; it is acceptable only for owner testing. Production moves transitions into `src/state/store.js` and an audio orchestration service, then deletes the interception and separate layout override. See `handoff/PLAYBACK_CONTEXTS.md`.

## Playback and signal

The one adapter owns source loading, clock, seek, pause/stop/ended/error, volume, and Media Session integration. One transition maps the active logical session into that adapter. No second queue/player clock and no overlapping audio.

Production playback receives short-lived backend authorization after user/territory/asset/window/source-policy checks. Permanent credentials never reach the client. Availability changes preserve routes and saves.

One lazily-created `AudioContext`/media source/analyser may drive live levels. Analysis failure keeps playback functional with honest fallback. Samples are ephemeral.

## Overlay and focus

Queue, Search, Song Room, Journey picker, Onboarding, and Completion are explicit modal surfaces. Opening stores the invoker; closing returns focus. Tab stays in the topmost dialog; Escape closes it; background becomes inert.

## Authorized adapter boundary

Owner supplies the legal/source package before real integration. Public availability does not permit copying/storage/playback. A backend-for-frontend owns credentials, quotas, retries, caching, territory, authorization, normalization, provenance, attribution, corrections, deletion, and partial-failure policy.

Rondo IDs stay primary; external IDs stay references. Separate adapters may serve catalog, playback, lyrics, artwork, metadata, and editorial content. Every adapter has pagination/retry/quota/provenance/rights/correction/takedown contract tests.

## Catalog-scale contract

Every list/search endpoint has an explicit bounded limit, opaque cursor, stable ordering, narrow list fields, rights/availability summary, and cache/version metadata. No unbounded `all` option or complete-catalog client delivery.

Production search is indexed, debounced, typo/alias/edition aware, cancellable, rights/territory/explicit aware, and cursor-paginated. Stale responses cannot replace newer queries.

One shared data-driven Genre route consumes taxonomy/configuration and bounded APIs. Adding a genre is data/configuration plus editorial/rights validation, not a new component.

Ingestion is idempotent/resumable with backpressure, retries, dead letters, audit, draft/validated/published/unavailable/removed states, and merge/split/correction workflows.

## Payment boundary

V1 has no payments. Checkout, subscriptions, tips, billing, entitlements, taxes, refunds, disputes, and payouts stay outside critical schemas and paths.

## Testing

- unit: ordering, matching, completion, migrations, references, thresholds;
- playback context: Journey/global switching, independent queues/positions, source fallbacks, reload, malformed state, no cross-progress;
- browser: onboarding, search, Discover, routes/history, picker/focus, Genre/Artist/Release, queue/Song Room, personal state;
- audio: source/media time/duration/analyser/fallback/pause/volume and exactly one engine;
- responsive/accessibility: desktop/390/320/Light/Reduced Motion, keyboard, landmarks, targets, overflow;
- adapters/ingestion/search: contracts, cursors, cancellation, rights, corrections/takedowns;
- performance: bounded payload/DOM budgets and realistic-volume load tests.

## Anti-spaghetti rules

1. No API calls in visual components.
2. No raw source objects outside adapters.
3. No secrets/licensing decisions in browser JS.
4. No duplicate audio engine, queue rules, progress rules, or Genre renderer.
5. No navigation-driven playback-context changes.
6. No global play mutating Journey state.
7. No revival of dormant `renderDiscoverView()`.
8. No invented metadata, popularity, stories, or rights.
9. No feature without loading/empty/error/accessibility/mobile states.
10. No unbounded query/full-catalog client state.
11. No payments in V1.

## Deployment

GitHub Pages is suitable only for the static prototype. Secure accounts, credentials, territorial rights, authorized playback/lyrics, moderation, ingestion/search, editorial workflows, observability, and recovery require a server-capable production platform.
