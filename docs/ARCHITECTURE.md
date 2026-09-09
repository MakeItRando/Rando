# Rondo architecture

## Goal and dependency direction

Rondo owns accounts, behavior, library, editorial discovery, personalization, journeys, release chapters, reveal progress, queue, playback UX, and preferences. Catalog, audio, metadata, artwork, and lyrics sources are replaceable infrastructure.

The production architecture must support a broad artist and genre catalog, starting with thousands of songs and scaling to millions without changing the UI/domain contract.

```text
Presentation → feature orchestration → application services → connector ports → authorized source adapters
```

UI consumes normalized Rondo domain objects and never raw source payloads.

## Current prototype modules

```text
index.html                    semantic app, overlays, Song Room, transport
styles.css                    core editorial system and responsive layout
listening.css                 journey ambience, queue, transport, volume
song-room.css                 artwork-adaptive Song Room and personal notes
concept.css                   candidate Discover/release styling
experience.css                candidate experience polish
route-pages.css               candidate route-backed Discover/Journey pages
src/app.js                    orchestration, state transitions, routing, signal loop, events
src/data/catalog.js           fictional catalog, authorized demos, release and discovery records
src/services/journey.js       ordering, lookup, progress, queue rules
src/services/audio.js         provider-neutral media adapter and safe analyser
src/state/store.js            persisted library/preferences/session/reveals plus runtime state
src/ui/views.js               Discover, release, Library, Journeys, and Profile rendering
src/ui/ambience.js            genre palette mapping
src/ui/songRoom.js            release palettes and Song Room mode rendering
scripts/build-preview.mjs     deterministic self-contained QA preview
tests/                        unit, interaction, quality, audio, full-concept, release readiness
assets/audio/                 original Rondo demo recordings and provenance
assets/covers/                fictional release artwork
```

The three candidate-only CSS layers and expanded route/test files are on `rondo-v031-user-ready`, not the stable `main` runtime.

## Route and rendering contract

Primary routes are Discover, Library, Journeys, and Profile. Release is an internal detail route reached from Discover, Search, Library, or Song Room.

The active-surface renderer owns page selection. Discover and release pages are rendered from normalized catalog context plus Rondo editorial records. Journeys remains the only surface that exposes genre and artist navigation. Opening a release does not implicitly change the active track or playback state.

A browsed release receives a locally scoped palette. The shared transport and Song Room palette remains derived from the active recording, preventing unrelated browsing from recoloring playback controls.

Production genre, artist, release, and search routes must use stable Rondo IDs/slugs, not array offsets or hard-coded four-genre switches.

## State ownership

Persisted state includes onboarding/profile, saves, played tracks, moments, song notes, appearance, volume, playback context, per-genre Journey continuity, per-release listening progress, and unlocked extras. Runtime state includes the active route, browsed release, playback state, open overlays, focus return target, analyser state, and animation state.

Profile, note, volume, session, release-progress, and artifact fields require migration-safe defaults. Open modals, hover, focus, and animation phases remain transient.

Production sync stores references and bounded windows—not complete catalog copies—in listener state.

## Playback contract

`setPlaying` is the single playback transition. The audio adapter owns the media element, source loading, media clock, seek, pause, stop, ended, errors, and volume. The orchestrator maps that state into one shared Rondo position; it must not create a second queue or player state.

Authorized recordings use real media time. A missing or failed source falls back to a clearly labeled simulated demo timeline in the prototype. Track changes pause the old source before loading the next. Repeat and completion follow the active artist-chapter rules.

Production playback receives short-lived authorization from the backend and never exposes permanent source credentials. Availability changes must not break navigation or saved context.

## Signal contract

`src/services/audio.js` lazily creates one `AudioContext`, one `MediaElementAudioSourceNode`, and one `AnalyserNode` for the shared media element. It never reconnects the same element to multiple source nodes. Analysis failure sets a safe unavailable flag without breaking playback.

When analysis is unavailable, deterministic playback motion uses track identity and media time. The UI labels it **Playback motion**, never **Live signal**.

## Volume contract

One persisted `volume` value feeds the audio adapter, main transport, and Song Room controls. Mute preserves a runtime `lastAudibleVolume` and restores it when unmuted.

## Release progress and extras

Listening progress may unlock optional context, but it never changes track availability, queue membership, credits, or core navigation. Production analytics and any future entitlement systems remain separate from optional editorial extras.

## Overlay and focus contract

Queue, Search, Song Room, Journey picker, Onboarding, and Completion are explicit modal surfaces. Opening stores the actual invoker; closing returns focus. Tab and Shift+Tab stay inside the topmost modal. Escape closes the topmost surface first. Modal layers are mutually exclusive.

## Authorized connector boundary

The product owner will provide the legal/source integration package before real-catalog implementation. Rondo adapters then implement those authorized paths. Product code must not assume that public availability on Spotify, YouTube, Suno, or another app permits copying, storage, or playback.

A production backend-for-frontend owns credentials, rate limits, caching, territory checks, authorization, normalization, and source policy. Catalog, playback, lyrics, metadata, artwork, and editorial content may come from separate authorized sources or Rondo's own CMS. External IDs stay in `externalIds`; Rondo IDs remain primary.

Every adapter requires contract tests for pagination, retries, quotas, provenance, availability, attribution, corrections, deletions, and partial failure. Source-specific policy never leaks into visual components.

Production Web Audio must respect source policy and cross-origin headers. If analysis is disallowed, playback remains functional and the honest fallback state is required.

## Catalog scale contract

- Never ship the full catalog in client JavaScript, HTML, local storage, or a single API response.
- Use indexed server-side search, cursor pagination, bounded limits, facets, and stable sorting.
- Lazy-load artwork and deeper artist/release lists; virtualize only when needed and preserve keyboard/screen-reader behavior.
- Run ingestion in idempotent, resumable background jobs with retries, backpressure, dead-letter queues, and audit records.
- Separate draft, validated, published, unavailable, and removed catalog states.
- Support aliasing, deduplication, recording/release editions, merge/split, correction, and source conflict resolution.
- Update search indexes and caches incrementally; avoid full rebuilds for ordinary changes.
- Put large media in authorized object/CDN delivery, never the primary relational row or repository.
- Measure query latency, search relevance, cache hit rate, job lag, catalog conflicts, authorization errors, and unavailable results.
- Load-test at target catalog and concurrency volumes before launch and before major scale increases.

## V1 payment boundary

V1 has no payments. Do not place payment services, checkout, subscription state, artist billing, or payment entitlements in the V1 critical path. Preserve a clean future service boundary only; add real payment architecture after a separate product decision.

## Testing

- unit coverage for ordering, matching, completion, catalog references, editorial-reference completeness, and thresholds;
- smoke coverage for onboarding, search, saves, navigation, and focus return;
- quality audit for layout, touch targets, first-run behavior, contrast, focus, and browser errors;
- listening/Song Room coverage for themes, palettes, queue, journeys, modes, and moments;
- audio coverage for source loading, media time, duration, analyser/fallback behavior, pause, and volume;
- personal regression for notes, Library deep links, persistence, and focus containment;
- route regression for Discover, Journey picker, genre pages, independent progress, Back/Forward, titles, and stable playback;
- source-adapter contract, ingestion replay/idempotency, search pagination, rights, correction, and takedown tests;
- load tests for catalog/search/API/playback authorization at realistic data volume;
- inspected visual states at desktop, 390px, 320px, Light, Night, and Reduced Motion.

## Anti-spaghetti rules

1. No API calls inside visual components.
2. No raw source objects outside adapters.
3. No source secrets in browser JavaScript.
4. No duplicated playback, queue, sorting, save, palette, route, progress, or reveal rules.
5. No invented production metadata, stories, popularity, or rights claims.
6. No source adapter without contract tests and explicit provenance.
7. No feature ships without loading, empty, error, accessibility, and mobile states.
8. No progression mechanic may lock core music or required information.
9. No visualizer may claim live analysis unless the analyser is active.
10. No unbounded catalog query or full-catalog client state.
11. No payment implementation in V1.

## Deployment

GitHub Pages is suitable for the static prototype. Secure accounts, source credentials, regional rights enforcement, authorized playback/lyrics, moderation, large-catalog ingestion/search, and production editorial workflows require a server-capable host. See `docs/PRODUCTION_PLAN.md`.
