# Rondo architecture

## Goal and dependency direction

Rondo owns accounts, behavior, library, editorial discovery, personalization, journeys, release chapters, reveal progress, queue, playback UX, and preferences. Catalog, audio, metadata, artwork, and lyrics providers are replaceable infrastructure.

```text
Presentation → feature orchestration → application services → connector ports → provider adapters
```

UI consumes normalized Rondo domain objects and never raw provider payloads.

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

## State ownership

Persisted state includes onboarding/profile, saves, played tracks, moments, song notes, appearance, volume, playback context, per-genre Journey continuity, per-release listening progress, and unlocked extras. Runtime state includes the active route, browsed release, playback state, open overlays, focus return target, analyser state, and animation state.

Profile, note, volume, session, release-progress, and artifact fields require migration-safe defaults. Open modals, hover, focus, and animation phases remain transient.

## Playback contract

`setPlaying` is the single playback transition. The audio adapter owns the media element, source loading, media clock, seek, pause, stop, ended, errors, and volume. The orchestrator maps that state into one shared Rondo position; it must not create a second queue or player state.

Authorized recordings use real media time. A missing or failed source falls back to a clearly labeled simulated demo timeline in the prototype. Track changes pause the old source before loading the next. Repeat and completion follow the active artist-chapter rules.

## Signal contract

`src/services/audio.js` lazily creates one `AudioContext`, one `MediaElementAudioSourceNode`, and one `AnalyserNode` for the shared media element. It never reconnects the same element to multiple source nodes. Analysis failure sets a safe unavailable flag without breaking playback.

When analysis is unavailable, deterministic playback motion uses track identity and media time. The UI labels it **Playback motion**, never **Live signal**.

## Volume contract

One persisted `volume` value feeds the audio adapter, main transport, and Song Room controls. Mute preserves a runtime `lastAudibleVolume` and restores it when unmuted.

## Release progress and extras

Listening progress may unlock optional context, but it never changes track availability, queue membership, credits, or core navigation. Production analytics and entitlement systems must remain separate from optional editorial extras.

## Overlay and focus contract

Queue, Search, Song Room, Journey picker, Onboarding, and Completion are explicit modal surfaces. Opening stores the actual invoker; closing returns focus. Tab and Shift+Tab stay inside the topmost modal. Escape closes the topmost surface first. Modal layers are mutually exclusive.

## Connector boundaries

A production backend-for-frontend owns credentials, rate limits, caching, territory checks, authorization, normalization, payments, and entitlement verification. Catalog, playback, lyrics, metadata, artwork, and editorial content may come from separate authorized providers or Rondo's own CMS. Provider IDs stay in `externalIds`; Rondo IDs remain primary.

Production Web Audio must respect provider policy and cross-origin headers. If analysis is disallowed, playback remains functional and the honest fallback state is required.

## Testing

- unit coverage for ordering, matching, completion, catalog references, editorial-reference completeness, and thresholds;
- smoke coverage for onboarding, search, saves, navigation, and focus return;
- quality audit for layout, touch targets, first-run behavior, contrast, focus, and browser errors;
- listening/Song Room coverage for themes, palettes, queue, journeys, modes, and moments;
- audio coverage for source loading, media time, duration, analyser/fallback behavior, pause, and volume;
- personal regression for notes, Library deep links, persistence, and focus containment;
- route regression for Discover, Journey picker, genre pages, independent progress, Back/Forward, titles, and stable playback;
- inspected visual states at desktop, 390px, 320px, Light, Night, and Reduced Motion.

## Anti-spaghetti rules

1. No API calls inside visual components.
2. No raw provider objects outside adapters.
3. No vendor secrets in browser JavaScript.
4. No duplicated playback, queue, sorting, save, palette, route, progress, or reveal rules.
5. No invented production metadata, stories, popularity, or rights claims.
6. No provider without contract tests and explicit provenance.
7. No feature ships without loading, empty, error, accessibility, and mobile states.
8. No progression mechanic may lock core music or required information.
9. No visualizer may claim live analysis unless the analyser is active.

## Deployment

GitHub Pages is suitable for the static prototype. Secure accounts, provider credentials, regional rights enforcement, licensed playback/lyrics, payments, moderation, and production editorial workflows require a server-capable host. See `docs/PRODUCTION_PLAN.md`.
