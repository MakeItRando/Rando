# Rondo product specification

## Product promise

Rondo helps a listener find a song quickly, move across sounds, explore artists at a comfortable pace, and keep music worth returning to.

- **Discover** is a song-first home for search, editorial picks, truthful recommendations, hits, bangers, new music, hidden finds, and sounds.
- **Journeys** is an intentional genre and artist path with saved progress.
- **Song Room** is the focused context and control surface for the active recording.
- **Library** keeps songs, releases, artists, moments, notes, and progress.

The interface should feel human, professional, restrained, artwork-led, and easy to understand—never toy-like, overexplained, excessively animated, or derivative of a competitor.

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
- Genre/artist destinations are route-backed SPA pages with distinct URLs/titles/landmarks, Back/Forward, focus management, and uninterrupted playback.
- Progress is independent per genre.
- Discover playback does not replace active Journey context.
- Changing genres erases no progress and stops no active song.
- Matching genre is the default guided catalog; Artist Journey offers All catalog.
- Rondo asks before crossing an artist boundary.
- Play/Pause/Resume labels reflect actual state and preserve position.
- Rondo is canonical everywhere; existing `Rando` URLs remain only until a safe technical migration.
- Production catalog is broad and provider/source neutral.
- Design for thousands of songs initially and millions without a domain or UX rewrite.
- Owner provides legal/source implementation package before real integration.
- V1 has no payments.

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

The four prototype genres validate behavior only. Production routes derive from an editable taxonomy and stable Rondo IDs/slugs, never duplicated hard-coded pages.

## Discover

Discover answers: **What is worth playing now?**

Required content:

- useful song/artist/release search;
- Continue listening only after meaningful activity;
- Hits today / Rondo editorial picks;
- Made for you only after genuine played-track history exists;
- Bangers;
- Sounds for mood/situation;
- Hidden gems;
- New & rising;
- compact Genre Journey links;
- direct playback into the shared queue and Song Room.

Cold-start rules:

- hide Made for you completely when there is no genuine history;
- do not substitute profile defaults and call them personal;
- keep editorial shelves explicit;
- never claim a live chart without a named source and update time.

After real history exists, recommendation framing states why the subset appears (candidate eyebrow: `From your recent plays`). “Because you liked…” follows the same evidence rule.

The canonical v0.3.2 implementation is `src/ui/discoveryHub.js`. Dormant `renderDiscoverView()` in `src/ui/views.js` contains rejected conceptual framing and is not a fallback. Do not revive it; delete it before production catalog integration.

## Journey entry and Genre pages

Journeys behavior:

- no active Journey → focused picker;
- active Journey → active Genre page;
- Change genre → picker without erased progress;
- dismiss on first use → Discover;
- dismiss from an existing Genre/Artist route → preserve route and return focus.

Picker requirements: direct readable choices, dynamic counts/progress, explicit radio state, primary action naming the genre, keyboard containment, Escape, inert background, contextual close, useful focus return, and 44px targets.

Each Genre page includes identity/atmosphere, progress/next artist, scoped search, Play top mix, Start/Resume, Change genre, songs, releases, artists, optional hidden finds, and Discover return.

Starting/resuming enters:

`Genre page → Artist Journey → release → track → Song Room → completion`

## Artist Journey

- alphabetical artist order;
- supplied identity/origin/years/tags/biography and progress;
- releases newest to oldest and tracks in official sequence;
- matching genre default, All catalog escape hatch;
- truthful artist-level Play/Pause/Resume;
- save artist/release/track;
- queue tied to current artist/catalog mode;
- explicit completion before next artist;
- directory/route changes do not stop playback.

## Releases

Each album/EP uses distinct authorized art, official order, concise context, truthful actions, and optional extras only when valuable. Unknown production metadata remains unknown. Extras never gate music, credits, or navigation.

## Song Room

Modes:

1. **Room** — art, identity, waveform, current lyric, timeline, controls.
2. **About** — short supplied context.
3. **Lyrics** — synchronized authorized/demo words and line seeking.
4. **Credits** — supplied performers/writers/producers/recording details.
5. **Extra** — optional listening-earned material, still a user-test experiment.
6. **Up next** — current queue and position.

The active cover sets a restrained palette/backdrop. Real Web Audio levels are called live only when the analyser is active. Otherwise Rondo says Playback motion. Paused and Reduced Motion states are distinct. Elapsed time, metadata, and remaining time remain non-overlapping at compact widths.

Volume is one persisted value across transport/Song Room. Mute restores the last audible value.

## Personal listening and persistence

Persist meaningful state:

- profile/onboarding;
- saves, plays, moments, notes;
- appearance, volume, accessibility preferences;
- playback context and position;
- active Journey and bounded per-genre progress;
- optional release progress/extras.

Do not persist dialogs/drawers, hover/focus, animation/waveform frames, transient loading/errors, or autoplay intent. Resume restores context but never autoplays after reload.

Malformed persisted arrays/records must normalize safely and be written back so all readers see one valid state contract. Supported repeat modes are `continue`, `track`, and `artist`; legacy `off` migrates to `continue`.

## Catalog-scale experience contract

A large catalog still feels intentional:

- each route initially renders a bounded window;
- shelves return small ranked subsets, not complete collections;
- production search is indexed, debounced, alias-aware, typo-tolerant, filterable, rights-aware, stably sorted, and cursor-paginated;
- genre/artist/release data lazy-loads by stable Rondo ID;
- long lists paginate or virtualize accessibly;
- artwork/audio loads only when needed;
- listener state stores references and progress, never catalog copies;
- unavailable/territory-limited results remain understandable;
- no fixed global catalog count drives layout or logic;
- the browser never receives or flattens the complete catalog;
- all genres use one shared data-driven page/route implementation.

Routes alone do not shrink bundles. Production adds code splitting, bounded APIs/caches, indexed services, CDN media, and background ingestion.

## Motion, accessibility, and truthfulness

- visible keyboard focus and complete keyboard actions;
- semantic headings and one active page landmark outside modal states;
- dialog focus containment/return and Escape behavior;
- 44×44px important targets;
- non-color states;
- Reduced Motion and zoom/reflow;
- no fake charts, unsupported live analysis, generated filler, streaks, autoplay traps, giant banners, or manipulative locks.

## Current phase and scope

Candidate `89fc0d5` passed the full pre-test engineering gate, 18/18 manual visual review, exact portable-preview audit, and targeted credential scan. It is ready for owner testing but remains draft/unmerged.

Prototype excludes real artists/licensed commercial songs, production accounts, source credentials, catalog ingestion/backend, live charts, social feeds, and payment systems. V1 also excludes all payments and any content outside the supplied legal path.
