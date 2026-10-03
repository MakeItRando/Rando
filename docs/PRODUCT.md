# Rondo product specification

## Product promise

Rondo helps a listener find a song quickly, move across sounds, explore artists at a comfortable pace, and keep music worth returning to.

- **Discover** is a song-first home for search, editorial picks, truthful recommendations, hits, bangers, new music, hidden finds, and sounds.
- **Journeys** is an intentional genre and artist path with saved progress.
- **Song Room** is the focused context and control surface for the active recording.
- **Library** keeps songs, releases, artists, moments, notes, and progress.

The interface should feel human, professional, restrained, artwork-led, and easy to understand, never toy-like, overexplained, excessively animated, or derivative of a competitor.

## Core flow

`find → play → explore → keep`

1. **Find:** open Discover, search, choose a sound, or scan a short shelf.
2. **Play:** start a song without losing the page or active Journey underneath.
3. **Explore:** enter a Genre Journey and move through artists/releases/songs.
4. **Keep:** save music, exact moments, private notes, and Journey progress.

## Confirmed decisions

- Primary navigation: Discover, Library, Journeys, Profile.
- Discover opens directly and never launches a genre chooser.
- Journeys owns first-use genre selection, Change genre, Genre pages, and guided Artist Journeys.
- Genre/artist destinations are route-backed SPA pages with distinct URLs/titles/landmarks, Back/Forward, focus management, and uninterrupted playback. Release chapters in the candidate are state-backed; a standalone deep link is not yet demonstrated.
- Progress is independent per genre.
- One physical audio engine and transport supports two independently resumable **logical Journey and Global sessions/queues**. Navigation never switches context. Playing from Discover, Search, Sounds, Library or Release must not overwrite a saved Journey. Explicit Journey play resumes its session without deleting Global.
- Changing genres erases no progress and stops no active song.
- Matching genre is the default guided catalog; Artist Journey offers All catalog.
- Rondo asks before crossing an artist boundary.
- Play/Pause/Resume labels reflect actual state and preserve position.
- Rondo is canonical everywhere; existing `Rando` URLs remain only until a safe technical migration.
- Production catalog is broad and provider/source neutral. Design for thousands of songs initially and millions without a domain or UX rewrite.
- Owner provides legal/source implementation package before real integration. V1 has no payments.

## Routes

```text
#/discover
#/library
#/profile
#/journeys
#/journeys/hiphop
#/journeys/rnb
#/journeys/electronic
#/journeys/jazz
#/journeys/<genre>/artist/<artist-id>
```

The four playable prototype genres validate behavior only. Production routes derive from an editable taxonomy and stable Rondo IDs/slugs, never duplicated hard-coded pages. Other labels selectable during prototype onboarding are not additional playable Genre pages.

## Discover

Discover answers: **What is worth playing now?**

- Useful song/artist/release search; Continue listening only after meaningful activity.
- Hits today / Rondo editorial picks; Bangers; Sounds for mood/situation; Hidden gems; New & rising; compact Genre Journey links.
- Made for you only after genuine played-track history; hide completely at cold start, never substitute profile defaults and call them personal. History-backed framing can say `From your recent plays`.
- Direct song playback activates the source-labeled Global session and source-derived bounded queue; Journey continues unmodified. Song Room expands only when the listener requests it.
- A production live chart requires a named source and update time. Keep editorial curation clearly identified and shelves finite, not an endless feed.

The candidate's canonical renderer is `src/ui/discoveryHub.js`. Dormant `renderDiscoverView()` in `src/ui/views.js` contains rejected conceptual framing and is not a fallback; remove it after accepted integration and caller verification, before production catalog work.

## Journey entry and Genre pages

No active Journey → focused picker; active Journey → active Genre page; Change genre → picker without erased progress. First-use dismissal returns to Discover; contextual dismissal preserves route and focus. Picker requires readable choices, accurate dynamic counts/progress, explicit selected state, primary action naming the genre, keyboard containment, Escape, inert background, contextual close, focus return and 44px targets.

Each Genre page includes identity/atmosphere, progress/next artist, scoped search, Play top mix, Start/Resume, Change genre, songs, releases, artists, optional hidden finds and Discover return. Starting/resuming enters `Genre page → Artist Journey → release → track → Song Room → completion`. Production uses one shared data-driven Genre renderer.

## Artist Journey and releases

Artist Journey: alphabetical artist order; supplied identity/origin/years/tags/biography; releases newest-to-oldest and tracks in official sequence; matching genre by default with All catalog escape; truthful Play/Pause/Resume; save artist/release/track; source-correct queue; explicit completion before next artist; route changes do not stop playback.

Release: distinct authorized art, official order, concise supplied context, truthful actions, credits/provenance and optional non-gating extras. Unknown metadata remains unknown. The candidate's release chapter changes view state rather than proving a stable hash deep link. Define and test a route if deep linking is required before claiming it exists.

## Song Room

1. **Room:** art, identity, waveform, current lyric, timeline and controls.
2. **About:** short supplied context.
3. **Lyrics:** synchronized authorized/demo words and line seeking.
4. **Credits:** supplied performers/writers/producers/recording details.
5. **Extra:** optional listening-earned material, still an owner-test experiment.
6. **Up next:** active session's truthful queue and source/position.

Active cover sets a restrained accessible palette. Real Web Audio levels are called live only when analyser data is active; otherwise the UI says Playback motion. Paused and Reduced Motion states are distinct. Elapsed time, metadata and remaining time cannot overlap at compact widths. One volume value syncs transport/Song Room; mute restores the last audible value. Global playback never auto-opens Song Room.

## Personal listening and persistence

Persist profile/onboarding, saves, plays, moments, private notes, appearance, volume, accessibility preferences, bounded Journey/Global session references and positions, active Journey and independent per-genre progress, optional release progress/extras. Do not persist dialogs/drawers, hover/focus, animation/waveform frames, transient loading/errors, provider payloads or autoplay intent. Resume restores context without autoplay after reload. Malformed arrays/records normalize and write back; repeat supports `continue`, `track`, `artist`, with old `off` migrating to `continue`. Prototype browser storage is not a secure synchronized account; see [DATA_MODEL.md](DATA_MODEL.md) and [playback context contract](../handoff/PLAYBACK_CONTEXTS.md).

## Catalog-scale experience contract

Every route/shelf/search starts with a bounded window, not an entire collection. Production search is indexed, debounced/cancellable, alias-aware, typo-tolerant, filterable, rights-aware, stably sorted and cursor-paginated. Detail data lazy-loads by stable Rondo ID; long lists paginate or virtualize accessibly; artwork/audio loads only when needed; unavailable/territory-limited results explain their state. No fixed global catalog count drives UI, and the browser never receives, caches or flattens a complete catalog. Routes alone do not shrink bundles: add code splitting, bounded APIs/caches, indexed services, CDN media and background ingestion.

## Motion, accessibility, and truthfulness

Visible keyboard focus and complete keyboard actions; semantic headings and one active page landmark outside modal states; dialog focus containment/return and Escape; 44×44px important targets; non-color states; Reduced Motion, zoom and reflow. No fake charts, unsupported live analysis, generated filler, streaks, autoplay traps, giant banners or manipulative locks. Production pages require loading, empty, unavailable, partial, offline, rights-blocked, rate-limited and retry paths.

## Current phase and scope (reviewed 2026-10-03)

The newest candidate is `9046918` in draft, unmerged PR #5. Its latest CI and local reproduction fail because Song Room Credits renders `undefined`. Evidence `6f68fda` is diagnostic failure evidence; preview `089bd21` is stale at older `cd25bbd`. `main` remains stable v0.3.0 runtime plus canonical docs; its local runtime suite passes, but its older Playwright dependency fails a high-severity audit. No current-head visual, exact-preview, owner-acceptance, or merge gate is complete. The next work is quality correction—not real catalog/backend implementation.

The prototype excludes real artists/licensed commercial songs, production accounts, source credentials, catalog ingestion/backend, live charts, social feeds and payment systems. V1 also excludes payments and content outside the supplied legal path. Keep this spec and the handoff updated whenever behavior, sections or scope change.
