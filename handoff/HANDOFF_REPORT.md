# Rondo project handoff report

**As of 2026-10-03:** this is a continuity report, not a release certificate. Read [STATE.md](STATE.md) first, then [AUDIT_2026-10-03.md](AUDIT_2026-10-03.md), and verify live GitHub state.

## Immediate verdict for the next contributor

Rondo's direction is unusually well documented, but the newest experience is neither accepted nor on `main`. Draft [PR #5](https://github.com/MakeItRando/Rando/pull/5) is at `9046918` and red: Song Room can show `undefined`. The evidence branch records the failure, the published portable preview is stale, and the PR body still describes an older green head. `main` itself passes its build/static/unit/browser suite locally but fails the high-severity dependency audit on its older Playwright version. This orientation round changes documentation only. Do not ask for owner testing, merge the candidate, or start real artist/song/backend integration until the current blockers are fixed and exact-head gates pass.

## Purpose and point of view

**Rondo, 'Find your next repeat.'** Its advantage is a clearer mental model: **find → play → explore → keep**. Discover answers what to hear now. Journeys goes deep through genres and artists. Song Room brings the active recording and its authorized context together. Library remembers songs, releases, artists, moments and notes. Profile lets listeners shape taste without requiring another streaming app. Optimize for music, clarity, accessible continuity, truth, and tasteful artwork-led craft rather than sheer feature count or competitor imitation.

No oversized filler typography, generic AI art, generated-looking glow/cards, fake popularity claims, strategy-speak UI copy, manipulative streaks, forced autoplay, or locks on core music/credits. Night is default, Light works, motion has a purpose, Reduced Motion is real. Competition is beaten by trust and utility, not fake abundance.

## Evidence lineage, do not confuse heads

- `main`: `c0a11fe`; v0.3.0 runtime baseline `eaafc4c`, followed by documentation commits.
- Current candidate: `rondo-v031-user-ready` at `9046918`, open draft PR #5, 206 commits ahead of its merge base and 22 commits behind current `main` at audit time.
- Current candidate automation: CI run `36836698618` failed in `song_room`. Evidence branch `rondo-v032-qa-evidence` at `6f68fda` records 12 successful browser suites, visual capture success, and Song Room failure. It is generated evidence, not a source branch.
- Current candidate local reproduction on 2026-10-03: clean install, zero-vulnerability audit, preview build, static/unit and the first six ordered browser suites passed; `tests/song-room.mjs` then failed with `Desktop Credits: Song Room rendered a placeholder value "undefined"`.
- Portable preview: `rondo-v031-preview` at `089bd21`, built from older `cd25bbd`; it is not evidence for `9046918`.
- `main` local verification on 2026-10-03: preview build, static, unit and all six browser suites passed. `npm audit --audit-level=high` failed on Playwright advisory `GHSA-7mvr-c777-76hp`; treat dependency remediation as required engineering work, not a documentation-only edit.
- Missing: current-head green CI, current-head published preview, exact-preview HTTP audit, current-head 18-capture manual review, accessibility/security/rights sign-off, owner desktop/phone acceptance, and post-merge verification.
- Historical green results for `cd25bbd`, `b752cc6`, or `89fc0d5` stay historical and must never be attached to `9046918`.

## Recovered previous conversation, with limits

The earlier Notion chat was not retrievable in this record. Four screenshots were previously summarized in [SNAPSHOTS.md](SNAPSHOTS.md); their recovered points were: Discover must be a real song-first home rather than a genre modal; Journeys owns genre choice, dedicated genre pages, guided artist progression and Change genre; playback and meaningful progress persist across navigation; design should be restrained, professional and human, not oversized or overexplained; prior readiness claims were not themselves proof. **These are recovered notes, not a full Notion transcript or the original media.** Do not invent missing decisions or attach unrelated images as if they were the conversation.

## Product and page contract

[PRODUCT_MAP.md](PRODUCT_MAP.md) and [docs/PRODUCT.md](../docs/PRODUCT.md) contain the section-by-section specification. In brief: direct Discover with search, Continue listening/history-gated Made for you, curated shelves, Sounds, genre links and immediate play; Journey first-use picker then route-backed Genre page (identity, progress, songs, releases, artists, scoped search, Change genre); Artist Journey with releases newest-first, official track sequence, matching/all mode, truthful playback and explicit completion; Release with art, context, credits and non-gating extras; Song Room modes Room/About/Lyrics/Credits/Extra/Up next; Library saves/moments/notes; Profile editable taste and future secure-account controls. Every page needs loading, empty, rights-unavailable, error, keyboard, mobile and reflow states in production. Do not imply every specified production behavior already exists in the prototype.

## Technical truth and production migration

Candidate builds on a fictional local catalog: 4 playable genres, 8 fictional artists, 15 releases, 39 tracks, six original demo MP3s; onboarding's broader genre labels are not extra playable catalog genres. Current persistence uses browser localStorage, not secure accounts or synchronized data. `src/ui/discoveryHub.js` is intended canonical Discover/Genre rendering; legacy `renderDiscoverView()` in `src/ui/views.js` must not be revived. Release chapters currently use state; independent deep links need a deliberate route contract.

One physical audio engine/transport, two independently resumable logical Journey and Global sessions. The candidate's `playbackContexts.js`/`journeyStateGuard.js` use event/DOM compatibility glue around a singleton. Before production catalog work, move ownership to store/audio commands with bounded source queues and tested migrations. [PLAYBACK_CONTEXTS.md](PLAYBACK_CONTEXTS.md) and [docs/DATA_MODEL.md](../docs/DATA_MODEL.md) spell out the target.

The production architecture is provider-neutral with stable Rondo IDs, normalized artist/release/recording/track-placement models, rights/provenance per media and territory, bounded paginated APIs, indexed debounced search, lazy assets, idempotent resumable ingestion, backups/observability/privacy controls, and one data-driven Genre renderer. Never ship a full catalog into the browser. The owner supplies implementation-facing contracts/permissions before actual sources. Public accessibility does not imply authorization.

## Delivery sequence

1. **Next development round:** fix Song Room at its source-level writer, remove the ineffective runtime guard, deliberately remediate the dependency audit, and rerun the complete exact-head workflow. Then inspect all 18 new captures, audit the exact published preview, reconcile the PR body/handoff, and only then request owner desktop/phone experience testing.
2. **If feedback changes source:** fix on a focused candidate branch and rerun all gates for the new exact head, republish evidence and handoff.
3. **On explicit acceptance:** resolve PR integration/dirty state deliberately, merge accepted code, rerun post-merge checks, update main specs/state.
4. **Then:** naming migration, production foundation, authorized catalog/rights pipeline, real V1 listener system, evaluated editorial/recommendation depth, operational scale. See [ROADMAP.md](ROADMAP.md).
5. **Later V2:** only evidence-driven features; no payments in V1. A future payment model needs a separate owner decision and compliant rights/financial design.

## Open inputs, not guesses

Owner feedback/acceptance; optional listening Extra treatment; first territories and web/native/language/age/explicit policy; legal/source contracts and permissions; production framework/hosting; eventual payment value/model. See [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md). This handoff records what is known, not an invented complete prior-chat transcript.

## Continuity rule

After every substantive action update the relevant canonical page spec, decisions, implementation state, test evidence, screenshots/media index, roadmap, and this report in the same work session. Label **planned, implemented, CI-passed, separately audited, manually reviewed, owner-accepted, merged** independently. Include exact head and next action. Another advanced AI should be able to resume from the repo alone.
