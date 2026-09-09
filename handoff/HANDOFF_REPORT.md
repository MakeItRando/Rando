# Rondo project handoff report

## Executive summary

Rondo is an independent music-discovery and listening product built around a clear sequence: **find → play → explore → keep**. It should combine the immediacy of a useful music home with the depth of artist-by-artist Genre Journeys, while keeping playback, context, and personal memory continuous.

The stable `main` branch contains the v0.3.0 static runtime plus canonical documentation. The active v0.3.2 experience candidate is in `rondo-v031-user-ready` and draft PR #5. It implements the corrected Discover/Journeys separation and expanded UX, but the latest observed QA check failed. It must not be merged or presented as ready until the gate is green and visually inspected.

This handoff was created after a full repository and branch audit. No app code was changed in this documentation session.

## Confirmed product-owner decisions — 2026-09-09

1. **Rondo everywhere.** Rondo is the canonical product, repository, package, infrastructure, domain, and future store name. Keep the existing `MakeItRando/Rando` URL during prototype continuity, then perform a deliberate migration before production-facing naming is finalized.
2. **Broad catalog.** The final product is intended to support artists and genres broadly rather than being limited to one provider, source app, or small genre set.
3. **Large-scale design.** Build for thousands of songs at initial ingestion and millions without replacing the product model. Search, browsing, routes, state, and UI must use bounded results, stable IDs, pagination/lazy loading, and indexed services—not full-catalog client data.
4. **Owner-supplied legal path.** The product owner has a legal acquisition plan and will provide the implementation-facing source, authorization, territory, and playback package before real integration begins. Public availability on Spotify, YouTube, Suno, or another app is not itself treated by Rondo code as permission.
5. **No payments in V1.** Do not add subscriptions, checkout, tips, artist billing, payment entitlements, taxes, refunds, disputes, or payouts to V1. Keep future payment boundaries clean but unimplemented.

## Product mindset

Rondo should feel:

- music-first rather than interface-first;
- clear enough to use without learning product jargon;
- visually distinct through real artwork, hierarchy, sequencing, and restrained atmosphere;
- human-made, calm, and credible—not toy-like, overanimated, or AI-decorated;
- curious without manipulation;
- truthful about playback, charts, recommendations, analysis, rights, and unavailable data;
- independent from any one provider or incumbent product;
- capable of presenting a very large catalog without feeling like an endless database.

The competitive advantage is not more chrome. It is a better mental model: immediate discovery, deep genre/artist progression, song-level context, meaningful memory, and uninterrupted playback.

## Recovered conversation context

The linked previous conversation was inaccessible. Four screenshots supplied by the user established the following sequence:

1. An earlier assistant declared a polished prototype ready for testing and left PR #5 draft/unmerged.
2. The user rejected the Discover-as-popup approach and wanted Discover to behave as a real music page with search, songs, suggestions, hits, bangers, moods, and genre exploration.
3. The user asked for a more professional, human, app-scale visual system and a more compelling but restrained Song Room.
4. The structure was corrected: Discover opens directly; Journeys owns the genre picker and genre subpages; meaningful progress persists; a Change genre action remains available.
5. The user accepted recommendations for Journey progress, Resume Journey, continuous playback, later “Because you liked…” rows, and avoidance of streaks, fake charts, autoplay traps, and excessive unlocks.
6. The user approved route-backed web-app pages as the direction for accessibility and navigation continuity.
7. Real artists, songs, accounts, ingestion, and backend work remain the next major phase after the experience is tested and approved.

See `SNAPSHOTS.md` for the detailed evidence transcript.

## Repository audit

### Repository and permissions

- Repository: `MakeItRando/Rando`
- Default branch: `main`
- Language: JavaScript
- Authenticated contributor had admin/push permissions during the audit.
- No open issues were returned.
- PR #5 is the only open pull request and is a draft.

### Stable `main` structure

```text
.github/workflows/pages.yml   GitHub Pages deployment
README.md                     project overview and status
AGENTS.md                     mandatory operating and continuity guide
agent.md                      compatibility pointer to AGENTS.md
handoff/                      live state, decisions, product map, roadmap, QA, snapshots
index.html                    static semantic application shell
app.js                        module entry point
styles.css                    core responsive visual system
listening.css                 listening, queue, transport, volume
song-room.css                 immersive Song Room
src/app.js                    orchestration and events
src/data/catalog.js           normalized fictional catalog
src/services/journey.js       catalog ordering, lookup, progress
src/services/audio.js         shared HTML audio adapter
src/state/store.js            local persistence
src/ui/views.js               Library/Journeys/Profile rendering
src/ui/ambience.js            genre palettes
src/ui/songRoom.js            Song Room palette and mode rendering
scripts/build-preview.mjs     deterministic portable preview build
scripts/generate-demo-audio.py original demo-audio generator
tests/                        unit and browser regressions
assets/artists/               fictional artist artwork
assets/covers/                release artwork
assets/audio/                 six original prototype MP3 files
```

### Candidate expansion

PR #5 changes roughly 55 files and adds:

- direct and route-backed Discover/Journey architecture;
- additional release cover identities;
- `concept.css`, `experience.css`, and `route-pages.css`;
- per-genre and playback-session continuity;
- updated Discover, release, Song Room, audio, and state behavior;
- expanded tests for routes, experience, full concept, user readiness, release readiness, and 16-state visual capture;
- a branch-specific QA workflow and portable-preview publication.

### Current implementation contracts

- One audio element and one audio engine own playback, seeking, time, errors, and volume.
- One analyser is created lazily when permitted; fallback motion must be labeled honestly.
- Journey ordering and catalog flattening live in `src/services/journey.js`.
- Normalized catalog and editorial references live in `src/data/catalog.js`.
- Browser-local state is under `rondo-prototype-v2` and includes profile, saves, moments, notes, theme, volume, release progress, unlocked extras, and candidate playback/Journey context.
- Global playback is intended to survive navigation; browsing a release or Discover row must not overwrite the active Journey.
- Search, Queue, Song Room, Journey picker, Onboarding, and Completion are modal surfaces with focus containment and return.
- The preview builder bundles JavaScript, inlines CSS and SVG assets, and emits deterministic screen variants for testing.

## Current page model

### Discover

Direct song-first home. It must never open a genre chooser. It includes useful search, Continue listening when relevant, curated/personal rows, mood/sound entry points, and compact links to Genre Journeys. Prototype popularity language must be clearly editorial, not fake internet charts.

### Journeys

First-time entry opens a focused genre picker. Returning entry resumes the active genre page. Each genre is a route-backed page with progress, scoped search, songs, releases, artists, Play mix, Start/Resume, and Change genre. Starting a Journey enters the guided alphabetical artist flow.

The four prototype genres validate the UX contract only. Production must use an editable genre/style graph and data-driven routes/components so many genres do not create duplicated code.

### Artist Journey

One artist at a time, albums/EPs newest to oldest, matching genre by default, All catalog as an escape hatch, truthful Play/Pause/Resume controls, completion confirmation before crossing the artist boundary.

### Song Room

Artwork-adaptive focused player with Room, About, Lyrics, Credits, Extra, and Up next. Motion reflects playback and respects Reduced Motion. Volume is synchronized and persistent. Extras may reward genuine listening but never lock music or required information.

### Library and Profile

Library preserves artists, releases, tracks, moments, notes, and meaningful progress. Profile owns a Rondo account and editable taste setup. Prototype data is local-only; production requires secure services.

The full contract is in `PRODUCT_MAP.md`.

## Large-catalog UX and system contract

The final catalog should feel curated even when it contains millions of tracks:

- the browser receives bounded shelves and paginated search results, never the whole catalog;
- artist/release/genre routes use stable Rondo IDs and lazy-load deeper data;
- search is indexed, typo-tolerant, alias-aware, filterable, and cursor-paginated;
- long lists use pagination or accessible virtualization;
- artwork/audio load on demand through authorized delivery;
- ingestion is idempotent, resumable, validated, auditable, and safe to retry;
- duplicate artists, aliases, release editions, recording versions, credits, source conflicts, corrections, and takedowns are first-class operations;
- rights and availability are checked independently from catalog presence;
- editorial/recommendation systems select useful subsets rather than exposing scale as clutter.

See `docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md`, and `docs/PRODUCTION_PLAN.md`.

## Quality and release posture

The candidate has broad automated coverage and a visual-capture script. However, latest evidence outranks old summaries: the check run on `305e9a3` failed. Previous “ready for your test” language is stale.

Do not fix this by deleting coverage, adding broad waits, ignoring browser errors, or changing expectations to match broken behavior. Reproduce the failure, identify the product or test-contract cause, repair it at the correct layer, and rerun the full gate.

A candidate repeat-state mismatch was also found during audit: persisted validation accepts `continue`, `artist`, and obsolete `off`, while player logic uses `continue`, `track`, and `artist`. Verify and fix this in the development round rather than silently changing it in this documentation session.

## Real-system boundary

Not started:

- secure accounts and synchronized user state;
- real artist, release, track, credits, and artwork ingestion;
- authorized playback and territorial authorization;
- production indexed search and recommendation systems;
- authorized source adapters and a backend-for-frontend;
- editorial tooling, moderation, corrections, and takedowns;
- large-scale jobs, deduplication, search indexes, media delivery, load testing, and recovery;
- analytics, observability, support, and privacy operations.

V1 explicitly excludes payment and payout systems. A future payment phase requires a new owner decision.

## Important risks

1. **QA discrepancy:** old successful evidence and new failed evidence coexist.
2. **Branch history:** the candidate contains many diagnostic and temporary-workflow commits. Preserve the result, but clean the accepted integration history later.
3. **Naming migration:** Rondo everywhere is confirmed, but current `Rando` URLs must be migrated deliberately to avoid breaking history and automation.
4. **Scope pressure:** adding real content before experience approval would mix product validation with infrastructure risk.
5. **Rights integration:** the owner has a legal plan, but its concrete adapter/territory/permission requirements must be received before implementation; never infer permission from public availability.
6. **Prototype persistence:** local storage is not an account system and must not be treated as secure or synchronized.
7. **Catalog scale:** hard-coded genre arrays, full client catalogs, offset-only pagination, or duplicated page implementations would fail at the intended scale.
8. **Visual overreach:** release lore/reveals are experiments; the user explicitly prefers simplicity and may reject anything that feels overexplained.
9. **Documentation drift:** main runtime and candidate behavior differ until approval; status labels must stay explicit.

## Restart instructions for the next agent

1. Read `AGENTS.md` and this handoff package.
2. Verify current main/candidate heads and PR/check state; update `STATE.md` if they changed.
3. Read the full candidate diff, not only PR prose.
4. Preserve the confirmed Discover/Journeys separation and global playback continuity.
5. Diagnose the red gate, verify the repeat-state mismatch, run clean automated checks, and inspect required visual states.
6. Ensure fixes remain data-driven and compatible with future bounded/paginated catalog APIs; do not start real-source integration yet.
7. Update handoff evidence with exact commands, results, commit, and screenshots.
8. Ask the user to test only after all gates pass.
9. Merge only after explicit acceptance; then update version/status documents and remove test-only material from the integration.
10. After approval, begin production foundations from the confirmed owner decisions: Rondo naming migration, source-neutral scale, owner-supplied legal integration, and no V1 payments.

## Session completion statement

The repository now has a durable operating guide, canonical handoff, page specifications, future plan, large-catalog architecture, and quality policy on `main`. Application work intentionally did not occur in this session, and PR #5 remains unmerged.
