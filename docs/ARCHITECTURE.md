# Rondo architecture

## Goal and dependency direction

Rondo owns identity/profile, behavior, Library, editorial discovery, personalization, Journeys, release context, queue, playback UX, and preferences. Catalog/audio/metadata/artwork/lyrics sources are replaceable authorized infrastructure.

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
index.html                    app shell, overlays, Song Room, transport
styles.css                    core responsive system
listening.css                 Journey, queue, transport, volume
song-room.css                 artwork-adaptive Song Room
concept.css                   candidate Discover/release styles
experience.css                candidate experience polish
route-pages.css               candidate routes/pages
src/app.js                    orchestration and events
src/data/catalog.js           normalized fictional catalog/editorial references
src/services/journey.js       ordering, lookup, progress, queue rules
src/services/audio.js         shared media adapter and analyser
src/state/store.js            migration-safe persistence/runtime state
src/ui/discoveryHub.js        canonical v0.3.2 Discover/Genre route renderer
src/ui/productPolicy.js       recommendation/picker/accessibility policy layer
src/ui/views.js               release, Library, Journeys, Profile; contains dormant legacy Discover renderer
src/ui/ambience.js            genre palettes
src/ui/songRoom.js            palette and mode rendering
scripts/build-preview.mjs     deterministic portable QA preview
tests/                        unit/browser/policy/visual gates
```

Candidate-only files remain on `rondo-v031-user-ready` until acceptance.

## Canonical renderer policy

`src/ui/discoveryHub.js` is the sole canonical v0.3.2 Discover/Genre-route implementation. `renderDiscoverView()` in `src/ui/views.js` is dormant legacy code with superseded conceptual framing. It is not a rollback path and must never be wired back in or adapted into a second product contract.

After the accepted candidate is integrated and callers are confirmed absent, delete the legacy function before production catalog integration. Production must have one Discover renderer and one shared data-driven Genre renderer.

## Routes and rendering

Primary: Discover, Library, Journeys, Profile. Release is an internal detail destination. Genre/Artist routes use stable Rondo IDs/slugs, never array offsets.

The active renderer owns page selection/title/landmark/focus. Browsing does not implicitly change track, queue, or Journey. A browsed release may have a local palette; transport/Song Room remain tied to the active recording.

Initial route rendering is bounded. Deeper shelves, artists, releases, and search pages load incrementally. A route is not permission to fetch or flatten the full catalog.

## State ownership

Persisted listener state contains bounded references/progress only:

- profile/onboarding/consent preferences;
- saved entity IDs and bounded recent-play references;
- moments/notes owned by the listener;
- appearance, volume, accessibility;
- playback context/position;
- active Journey and per-genre continuity;
- optional release progress/extras.

It must never contain complete artist catalogs, search results, taxonomy copies, or provider payloads.

Runtime state contains active route, browsed entity, playing/open modal/focus/analyser/animation/loading/error state. Modals, hover, focus, waveform samples, and autoplay intent remain transient.

Prototype migration normalizes malformed arrays/records, clamps values, migrates repeat `off` to `continue`, and writes the repaired snapshot back. Production state is schema-versioned and migration-tested.

## Playback and signal

One audio element/adapter owns source loading, media clock, seek, pause/stop/ended/error, and volume. One orchestration transition maps it into shared state. No second queue/player clock.

Production playback receives short-lived backend authorization after user/territory/asset/window/source-policy checks. Permanent source credentials never reach the client. Availability changes preserve navigation and saves.

One lazily-created `AudioContext`/media source/analyser may drive live levels. Analysis failure keeps playback functional and switches to honest Playback motion. Paused and Reduced Motion are separate modes. Audio samples are ephemeral and never persisted.

## Overlay and focus

Queue, Search, Song Room, Journey picker, Onboarding, and Completion are explicit modal surfaces. Opening stores the actual invoker; closing returns focus. Tab stays in the topmost dialog; Escape closes it; background becomes inert; layers cannot remain simultaneously active by accident.

## Authorized adapter boundary

Owner supplies the legal/source package before real integration. Public availability does not permit copying/storage/playback. A backend-for-frontend owns credentials, quotas, retries, caching, territory, authorization, normalization, provenance, attribution, corrections, deletion, and partial-failure policy.

External IDs stay references. Rondo IDs remain primary. Separate adapters may serve catalog, playback, lyrics, artwork, metadata, and editorial content. Every adapter has pagination/retry/quota/provenance/rights/correction/takedown contract tests. Source-specific policy never leaks into components.

## Catalog-scale contract

### API envelopes

Every list/search endpoint has:

- explicit `limit` with conservative default and hard maximum;
- opaque cursor, stable deterministic ordering, and `nextCursor`;
- narrow fields for list cards and separate detail requests;
- rights/availability summary appropriate to the listener;
- cache/version metadata where needed;
- no offset-only deep pagination or unbounded `all` option.

### Search

Production search is server-indexed, debounced client-side, alias/edition aware, typo-tolerant, filterable/faceted, territory/explicit/rights aware, and cursor-paginated. Requests are cancellable; stale responses cannot replace newer queries. UI never downloads catalog data to perform global filtering.

### Genre and catalog rendering

One shared data-driven Genre route consumes taxonomy/configuration and bounded APIs. No duplicated per-genre components, route switches, or fixed global counts. Adding a genre is data/configuration plus editorial/rights validation.

Never:

- ship the catalog in JS/HTML/local storage;
- return it in one response;
- recursively fetch all cursors;
- flatten all artist/release/track pages client-side;
- cache complete provider payloads in listener state;
- use DOM size as a catalog index.

Lazy-load art/detail lists; paginate or virtualize long lists accessibly. Use CDN-backed authorized media. Incrementally update indexes/caches. Ingestion is idempotent/resumable with backpressure, retries, dead letters, audit, draft/validated/published/unavailable/removed states, and merge/split/correction workflows.

Measure API/search latency, relevance, cache hit, job lag, conflicts, authorization errors, unavailable actions, client payload/DOM size, and playback startup. Load-test realistic catalog/concurrency volumes.

## Payment boundary

V1 has no payments. Checkout/subscription/tips/artist billing/payment entitlements/taxes/refunds/disputes/payouts stay outside schemas and critical paths. Preserve only a clean future extension boundary.

## Testing

- unit: ordering, matching, completion, migrations, references, thresholds;
- browser: onboarding, search, direct Discover, gating, routes/history, picker/focus, Genre/Artist/Release, playback/queue/Song Room, personal state;
- audio: source/media time/duration/analyser/fallback/pause/volume;
- policy: no fake personalization, malformed-state repair, rights/truthful labels;
- responsive/accessibility: desktop/390/320/Light/Reduced Motion, keyboard, landmarks, targets, overflow;
- adapters/ingestion/search: contracts, replay/idempotency, cursors, cancellation, rights, corrections/takedowns;
- performance: bounded payload/DOM budgets and target-volume load tests.

## Anti-spaghetti rules

1. No API calls in visual components.
2. No raw source objects outside adapters.
3. No secrets/licensing decisions in browser JS.
4. No duplicate playback, queue, save, palette, route, progress, recommendation, or Genre-page rules.
5. No revival of dormant `renderDiscoverView()`.
6. No invented metadata/popularity/stories/rights.
7. No feature without loading/empty/error/accessibility/mobile states.
8. No progression that locks music or required information.
9. No live-analysis claim without active analyser.
10. No unbounded query/full-catalog client state/complete-catalog flattening.
11. No payments in V1.

## Deployment

GitHub Pages is suitable only for the static prototype. Secure accounts, credentials, territorial rights, authorized playback/lyrics, moderation, catalog ingestion/search, editorial workflows, observability, and recovery require a server-capable production platform.
