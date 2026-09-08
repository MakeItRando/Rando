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
concept.css                   Discover, release chapters, reveals, waveform, sound fields
src/app.js                    orchestration, state transitions, signal loop, event binding
src/data/catalog.js           fictional catalog, authorized demos, release lore, discovery records
src/services/journey.js       ordering, lookup, progress, queue rules
src/services/audio.js         provider-neutral media adapter and safe analyser
src/state/store.js            persisted library/preferences/reveals plus runtime state
src/ui/views.js               Discover, release, Library, Journeys, and Profile rendering
src/ui/ambience.js            genre palette mapping
src/ui/songRoom.js            release palettes and Song Room mode rendering
scripts/build-preview.mjs     deterministic self-contained QA preview
tests/                        unit, interaction, quality, audio, full-concept, release readiness
assets/audio/                 original Rondo demo recordings and provenance
assets/covers/                fictional release artwork
```

## Route and rendering contract

Primary routes are Discover, Library, Journeys, and Profile. Release is an internal detail route reached from Discover, Search, Library, or Song Room.

`renderActiveSurface` owns page selection. Discover and release chapters are rendered from normalized catalog context plus Rondo editorial records. Journeys remains the only surface that exposes the genre/artist directory. Opening a release does not implicitly change the active track or playback state.

A release page receives a locally scoped palette from the browsed release. The shared transport and Song Room palette remains derived from the active recording, preventing unrelated browsing from recoloring playback controls.

## State ownership

Persisted state includes onboarding/profile, saves, played tracks, moments, song notes, appearance, volume, per-release listening progress, and unlocked artifact IDs. Runtime state includes the active view, genre, artist, browsed release, catalog mode, selected track, position, playback state, repeat mode, Song Room mode, queue state, signal mode, and open overlays.

Profile, note, volume, release-progress, and artifact fields are migrated with safe defaults. Journey collapse and Song Room mode remain transient so a new session begins navigably.

## Playback contract

`setPlaying` remains the single playback transition. The audio adapter owns the media element, source loading, media clock, seek, pause, stop, ended, errors, and volume. The orchestrator maps that state into one shared Rondo position; it does not create a second queue or player state.

Authorized recordings use real media time. A missing or failed source falls back to a labeled simulated demo timeline. Track changes pause the old source before loading the next. Repeat and completion continue through the existing artist-chapter rules.

## Signal contract

`src/services/audio.js` lazily creates one `AudioContext`, one `MediaElementAudioSourceNode`, and one `AnalyserNode` for the shared media element. It never reconnects the same element to multiple source nodes. Analysis failure sets a safe unavailable flag without breaking playback.

`getLevels(count)` returns normalized analyser samples only when authorized media and browser policy permit it. `getSignalMode()` exposes runtime truth. `src/app.js` uses one animation frame loop to synchronize:

- the 28-bar Song Room waveform;
- context micro-spectrum;
- compact level bars;
- playback-progress highlighting;
- paused settling and Reduced Motion state.

When analysis is unavailable, deterministic playback motion uses track identity and media time. The UI labels it **Playback motion**, never **Live signal**.

## Volume contract

One persisted `volume` value feeds the audio adapter, main transport, and Song Room controls. `syncVolumeUI` updates range inputs, numeric output, accessible mute labels, circular level ring, and segmented meters. `lastAudibleVolume` is runtime-only and restores the listener's previous level after mute.

## Release progress and reveals

`recordReleaseProgress` only credits an active release session while playback advances. It stores the maximum elapsed listening value by release ID. Crossing the release artifact threshold persists the release ID in `unlockedArtifacts` and re-renders relevant surfaces.

The rule is deliberately one-way: playback can unlock optional context, but reveal state never changes track availability, queue membership, credits, or core navigation.

## Song Room and personal data

`src/ui/songRoom.js` is a pure rendering/palette layer. `src/app.js` supplies normalized context, saves private notes, tracks reveal progress, and binds seeking/queue actions. Saved moments reference a Rondo track ID and second offset; song notes are keyed by Rondo track ID. Library resolves those IDs back to normalized catalog context.

## Overlay and focus contract

Queue, Search, Song Room, Onboarding, and Completion are explicit modal surfaces. Opening stores the actual invoking element; closing returns focus. Tab/Shift+Tab remain inside the topmost open modal. Escape closes the topmost surface first. Modal layers are mutually exclusive.

## Connector boundaries

A production backend-for-frontend owns credentials, rate limits, caching, territory checks, authorization, and normalization. Catalog, playback, lyrics, metadata, artwork, and editorial content may come from separate authorized providers or Rondo's own CMS. Provider IDs stay in `externalIds`; Rondo IDs remain primary.

Production Web Audio must respect provider policy and cross-origin headers. If analysis is disallowed, playback remains functional and the honest fallback state is required.

## Testing

- unit coverage for ordering, matching, completion, catalog references, lore completeness, and reveal thresholds;
- smoke coverage for onboarding, search, saves, navigation, and focus return;
- quality audit for layout, touch targets, first-run behavior, contrast, focus, and browser errors;
- listening/Song Room coverage for themes, palettes, queue, journeys, modes, and moments;
- real-audio coverage for source loading, media time, duration, analyser/fallback behavior, pause, and volume;
- personal regression for notes, Library deep links, volume persistence, and focus containment;
- full-concept regression for Discover, release chapters, controlled surprise, honest signal modes, synchronized volume, reveal persistence, compact headers, and Reduced Motion;
- inspected visual states at 1440px, 390px, 375px, 320px, and Reduced Motion.

## Anti-spaghetti rules

1. No API calls inside visual components.
2. No raw provider objects outside adapters.
3. No vendor secrets in browser JavaScript.
4. No duplicated playback, queue, sorting, save, palette, or reveal rules.
5. No invented production metadata, stories, or rights claims.
6. No new provider without contract tests and explicit provenance.
7. No feature ships without loading, empty, error, accessibility, and mobile states.
8. No progression mechanic may lock core music or required information.
9. No visualizer may claim live audio analysis unless the analyser is actually active.

## Deployment

GitHub Pages is suitable for this static prototype. Secure accounts, provider credentials, regional rights enforcement, licensed commercial playback/lyrics, and production editorial workflows require a server-capable production host.
