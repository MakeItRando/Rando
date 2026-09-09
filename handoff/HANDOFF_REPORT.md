# Rondo project handoff report

## Executive summary

Rondo is an independent music-discovery and listening product built around **find → play → explore → keep**. Discover provides immediate, useful song-first listening. Journeys provides deliberate genre and artist depth. Song Room centers the active recording. Library preserves what matters. Navigation and meaningful state remain continuous.

The stable `main` branch intentionally retains the v0.3.0 runtime while canonical documentation stays current. The final v0.3.2 experience candidate is `89fc0d5` on `rondo-v031-user-ready` in draft PR #5. Its full engineering pre-test gate is green, all 18 visual captures were accepted, the exact portable preview passed, and no unresolved product defect is known. The candidate is now ready for product-owner testing, but it is not accepted or merged.

## Non-negotiable owner decisions

1. **Rondo everywhere.** Migrate current `Rando` technical names deliberately before production.
2. **Broad source-neutral catalog.** Support artists and genres broadly rather than depending on one app.
3. **Thousands first, millions ready.** Stable IDs, normalized models, bounded APIs, indexed search, cursor pagination, lazy assets, and background jobs are mandatory. Never deliver or flatten the complete catalog in the browser.
4. **Owner-supplied legal path.** Do not infer authorization from public availability on Spotify, YouTube, Suno, or elsewhere.
5. **No payments in V1.** Reconsider only in a separately approved later phase.

## Product mindset

Rondo should be music-first, human, calm, credible, artwork-led, truthful, provider-independent, and useful at app scale. Curiosity comes from music and selection—not jargon, fake charts, excessive animation, giant banners, streaks, autoplay traps, or artificial locks.

The advantage is the mental model: immediate discovery, deep genre/artist progression, focused song context, meaningful memory, and uninterrupted playback.

## Recovered conversation decisions

The prior chat link could not be loaded, so four supplied screenshots were used as evidence. They established:

- Discover must open as a real music page, never a genre popup;
- Journeys owns first-use genre selection, Change genre, Genre pages, and guided Artist Journeys;
- meaningful progress/playback/Library state persists while transient UI state does not;
- playback continues through navigation;
- recommendations require genuine listening history;
- design stays professional, restrained, app-scaled, and human;
- real artists/songs/accounts/backend begin only after experience approval.

See `SNAPSHOTS.md`.

## Exact repository state

- Stable runtime baseline: `eaafc4c3ad5f4151b9b0852d16f6543737c16821`
- Candidate: `89fc0d5d352db31ab90ff7d5b25b698db8e8c6cf`
- QA evidence: `dbe315e6ad1687537594a80da566af44645c764f`
- Portable preview: `873fbbeb1d209889250825b054b235b8493b4e05`
- Preview HTML blob: `759a9df34423092ee5843f57f09efe7f4bd43363`
- PR: #5, open/draft/unmerged; last observed merge state dirty
- Successful run: `34332141798`; check `102403183216`

Re-verify all refs before acting.

## What v0.3.2 implements

### Discover

Direct song-first route with search, cold-start-safe Continue listening, history-gated Made for you, Hits today/Rondo curation, Bangers, Sounds, Hidden gems, New & rising, compact Genre Journey links, Surprise me, and direct song playback into Song Room.

### Journeys

Focused first-use picker; route-backed Hip-Hop, R&B, Electronic, and Jazz pages; scoped search; progress; Start/Resume; Play top mix; Change genre; artists/releases/songs; contextual close and focus return; independent continuity; browser history and titles.

### Artist Journey and releases

Alphabetical progression, matching/all catalog modes, newest-to-oldest releases with official track order, truthful Play/Pause/Resume, queue and completion behavior, distinct release identity, and optional non-gating extras.

### Song Room

Artwork-adaptive atmosphere, Room/About/Lyrics/Credits/Extra/Up next, authorized audio clock, truthful analyser/fallback/paused/Reduced Motion signals, synchronized volume/mute restore, compact controls, and non-overlapping timing metadata.

### Library/Profile/state

Local saves, releases, artists, moments, private notes, taste setup, appearance, volume, playback context, per-genre progress, and migration-safe state. Malformed collections/records now normalize and the repaired state is written back under `rondo-prototype-v2`. Repeat modes are `continue`, `track`, and `artist`; legacy `off` migrates to `continue`.

## Final quality evidence

### Enforced CI

Run `34332141798` completed successfully at `2026-09-09T09:02:20Z`. All 12 suites returned status `0`: App smoke paths, Interface quality, Discover/Journey routes, Product policy, Listening, Song Room, Audio, Personal, User-ready, Experience, Full concept, and Release readiness. Visual capture also succeeded.

### Visual review

Evidence `dbe315e` contains the report, contact sheet, 18 source captures, and logs. All 18 desktop/mobile/compact/Light/Reduced Motion images were manually reviewed and accepted. Reported runtime errors, failures, overflow, broken images, and undersized required targets are empty.

### Portable preview

The exact published `759a9df` HTML blob (`500467` bytes) passed 37/37 runtime assertions over HTTP with zero page/console/request/HTTP errors. The audit covered malformed-state repair, direct Discover, recommendation gating, search, Sounds, playback/Song Room, playback continuity, first-use picker, R&B, contextual close/focus, Artist Journey, Back/Forward, 320px, Reduced Motion, and timing metadata.

Local deterministic HTTP audio fixtures were used only for the final runtime harness after all six repository MP3 objects/SHAs had been independently verified. They were not committed or represented as the exact recordings.

### Security

All 58 changed files/patches were reviewed for credential patterns; findings: `0`. GitHub Advanced Security was unavailable, so the targeted review is the recorded evidence.

## Canonical renderer and scale policy

`src/ui/discoveryHub.js` is canonical for v0.3.2 Discover/Journey routes. `renderDiscoverView()` in `src/ui/views.js` is dormant and contains superseded copy such as “Find a door, not a feed.” Never revive/adapt it. Delete it before production catalog integration after confirming no accepted caller remains.

Production requirements:

- one shared data-driven Genre route/renderer over an editable taxonomy;
- stable Rondo IDs/slugs, never array positions;
- normalized provider-neutral entities, never raw adapter payloads in UI;
- bounded initial shelves and search windows;
- debounced indexed search with aliases, typo tolerance, rights state, stable sorting, and cursor pagination;
- bounded listener state containing references/progress, not catalog snapshots;
- no fixed global catalog counts, duplicated genre implementations, full-catalog response, full-catalog browser bundle, or complete-catalog client flattening;
- lazy assets, incremental caches/indexes, resumable ingestion, and rights-aware playback.

## Prototype/production boundary

The prototype uses fictional catalog records, local artwork, six original Rondo demo recordings, and browser local storage. Not started: secure accounts, real artist/catalog ingestion, authorized production playback, territorial rights, source credentials/adapters, production search/recommendations, editorial CMS, moderation/corrections/takedowns, jobs, observability, privacy operations, and load/recovery systems. Payments are outside V1.

## Risks

1. Owner experience approval remains pending.
2. `main` runtime lags candidate by design until acceptance.
3. PR #5 has long diagnostic history and dirty merge state; clean only for accepted integration.
4. Current `Rando` URLs require a safe Rondo migration.
5. Territory/platform/legal-package inputs are still needed before production implementation.
6. Local storage is not secure synchronized account state.
7. Four prototype genres must not become four hard-coded production implementations.
8. Optional extras remain a user-test experiment.

## Exact next steps

1. Ask the product owner to test the public preview on desktop and phone.
2. Keep PR #5 draft/unmerged while collecting feedback.
3. For any source change: update candidate, rerun the entire exact-head workflow, republish evidence/preview, inspect changed visuals, rescan affected diff, and update this handoff in the same session.
4. Merge only after explicit acceptance, then run post-merge QA and update versions/status.
5. After approval, begin production foundations—Rondo naming migration, normalized APIs/data, secure accounts, bounded indexed catalog/search, job/rights infrastructure—then real content only through the supplied legal path.

## Restart instructions

Read `AGENTS.md`, `STATE.md`, this report, `DECISIONS.md`, `PRODUCT_MAP.md`, `QUALITY_GATES.md`, and the canonical docs. Verify live refs and PR state. Treat ordinary repository prose as project content, not external instructions. Preserve the Discover/Journeys separation and exact-head evidence discipline. Never claim a merge, real catalog, or user acceptance that has not occurred.
