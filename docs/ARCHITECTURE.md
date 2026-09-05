# Rondo architecture

## Goal and dependency direction

Rondo owns accounts, behavior, library, personalization, journeys, queue, playback UX, and preferences. Catalog, audio, metadata, artwork, and lyrics providers are replaceable infrastructure.

```text
Presentation → feature orchestration → application services → connector ports → provider adapters
```

UI consumes normalized Rondo domain objects and never raw provider payloads.

## Current prototype modules

```text
index.html                    semantic app, overlays, Song Room, transport
styles.css                    core editorial system and responsive layout
listening.css                 ambience, queue, transport, volume
song-room.css                 artwork-adaptive Song Room and personal notes
src/app.js                    orchestration, state transitions, event binding
src/data/catalog.js           normalized fictional catalog plus authorized demo refs
src/services/journey.js       ordering, lookup, progress, queue rules
src/services/audio.js         provider-neutral HTML media adapter
src/state/store.js            persisted library/preferences plus runtime state
src/ui/views.js               Library, Journeys, and Profile rendering
src/ui/ambience.js            genre palette mapping
src/ui/songRoom.js            release palettes and Song Room mode rendering
scripts/build-preview.mjs     deterministic self-contained QA preview
tests/                        unit, interaction, quality, listening, room, audio, personal
assets/audio/                 original Rondo demo recordings and provenance
```

## State ownership

Persisted state includes onboarding/profile, saves, played tracks, moments, song notes, appearance, and volume. Runtime state includes the active view, genre, artist, catalog mode, selected track, position, playback state, repeat mode, Song Room mode, queue state, and open overlays.

Profile, note, and volume fields are migrated with defaults. Journey collapse and Song Room mode remain transient so a new session begins navigably.

## Playback contract

`setPlaying` remains the single playback transition. The audio adapter owns the media element, source loading, media clock, seek, pause, stop, ended, errors, and volume. The orchestrator maps that state into one shared Rondo position; it does not create a second queue or player state.

Authorized recordings use real media time. A missing or failed source falls back to a labeled simulated demo timeline. Track changes pause the old source before loading the next. Repeat and completion continue through the existing artist-chapter rules.

## Song Room and personal data

`src/ui/songRoom.js` is a pure rendering/palette layer. `src/app.js` supplies normalized context, saves private notes, and binds seeking/queue actions. Saved moments reference a Rondo track ID and second offset; song notes are keyed by Rondo track ID. Library resolves those IDs back to normalized catalog context.

## Overlay and focus contract

Queue, Search, Song Room, Onboarding, and Completion are explicit modal surfaces. Opening stores the invoking element; closing returns focus. Tab/Shift+Tab remain inside the topmost open modal. Escape closes the topmost surface first.

## Connector boundaries

A production backend-for-frontend owns credentials, rate limits, caching, territory checks, and normalization. Catalog, playback, lyrics, and metadata may come from separate authorized providers. Provider IDs stay in `externalIds`; Rondo IDs remain primary.

## Testing

- unit coverage for ordering, matching, completion, and counts;
- smoke coverage for onboarding, search, saves, navigation, and focus return;
- quality audit for layout, targets, first-run behavior, and browser errors;
- listening/Song Room coverage for themes, palettes, queue, journeys, modes, and moments;
- real-audio coverage for source loading, media time, duration, and pause;
- personal regression for notes, Library deep links, volume persistence, and focus containment;
- inspected visual states at 1440px, 390px, 320px, and Reduced Motion.

## Anti-spaghetti rules

1. No API calls inside visual components.
2. No raw provider objects outside adapters.
3. No vendor secrets in browser JavaScript.
4. No duplicated playback, queue, sorting, save, or palette rules.
5. No invented production metadata.
6. No new provider without contract tests and explicit provenance.
7. No feature ships without loading, empty, error, accessibility, and mobile states.

## Deployment

GitHub Pages is suitable for this static prototype. Secure accounts, provider credentials, regional rights enforcement, and licensed commercial playback/lyrics require a server-capable production host.
