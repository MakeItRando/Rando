# Rondo project handoff report

**As of 2026-09-28:** this is a continuity report, not a release certificate. Read [STATE.md](STATE.md) first for refs and blockers, then verify live GitHub state.

## Immediate verdict for the next contributor

Rondo's experience direction is well specified, but its newest code is **not on `main`**: [draft PR #5](https://github.com/MakeItRando/Rando/pull/5) carries candidate [`cd25bbd`](https://github.com/MakeItRando/Rando/commit/cd25bbda8b4e92671c9a61fd97352b9eaac6fc1d). Latest CI succeeded, while latest exact-published-preview audit and post-change manual 18-image review are not recorded. Owner acceptance is still pending. This documentation round changes no app code. Do not merge or start real artist/song integration based on an old readiness assertion.

## Purpose and point of view

**Rondo, 'Find your next repeat.'** Its advantage is a clearer mental model: **find → play → explore → keep**. Discover answers what to hear now. Journeys goes deep through genres and artists. Song Room brings the active recording and its authorized context together. Library remembers songs, releases, artists, moments and notes. Profile lets listeners shape taste without requiring another streaming app. Optimize for music, clarity, accessible continuity, truth, and tasteful artwork-led craft rather than sheer feature count or competitor imitation.

No oversized filler typography, generic AI art, generated-looking glow/cards, fake popularity claims, strategy-speak UI copy, manipulative streaks, forced autoplay, or locks on core music/credits. Night is default, Light works, motion has a purpose, Reduced Motion is real. Competition is beaten by trust and utility, not fake abundance.

## Evidence lineage, do not confuse heads

- `main` runtime: v0.3.0 baseline [`eaafc4c`](https://github.com/MakeItRando/Rando/commit/eaafc4c3ad5f4151b9b0852d16f6543737c16821), followed by canonical docs.
- Current candidate: [`cd25bbd`](https://github.com/MakeItRando/Rando/commit/cd25bbda8b4e92671c9a61fd97352b9eaac6fc1d), latest [run 34465613545](https://github.com/MakeItRando/Rando/actions/runs/34465613545/job/102833363733), [evidence `513d538`](https://github.com/MakeItRando/Rando/commit/513d538822a3ea2d4b7f50b2c777a5594815fa71), [preview `089bd21`](https://github.com/MakeItRando/Rando/commit/089bd2125ab002b3aa70f8587578e01c2a879a5f), HTML blob `3f09d59b7207a02be3624d044bc06f8d672c0cd9` at 527,599 bytes.
- Automated evidence: 13 browser suites passed; 18 captures generated with no recorded visual-report failures/runtime errors, per [test results](https://github.com/MakeItRando/Rando/blob/513d538822a3ea2d4b7f50b2c777a5594815fa71/latest/test-results.json) and [visual report](https://github.com/MakeItRando/Rando/blob/513d538822a3ea2d4b7f50b2c777a5594815fa71/latest/visual-report.json).
- Missing on this head: a separately documented exact published-blob runtime audit; fresh manual acceptance of all 18 latest images; owner desktop/phone acceptance. Historical `89fc0d5`/`b752cc6` passes and 37-check/18-image manual claims must remain attributed to their own heads.
- PR #5 description still cites older controlling references; it must be corrected before experience handoff. Merge state was last reported dirty. No acceptance was found.

## Recovered previous conversation, with limits

The earlier Notion chat was not retrievable in this record. Four screenshots were previously summarized in [SNAPSHOTS.md](SNAPSHOTS.md); their recovered points were: Discover must be a real song-first home rather than a genre modal; Journeys owns genre choice, dedicated genre pages, guided artist progression and Change genre; playback and meaningful progress persist across navigation; design should be restrained, professional and human, not oversized or overexplained; prior readiness claims were not themselves proof. **These are recovered notes, not a full Notion transcript or the original media.** Do not invent missing decisions or attach unrelated images as if they were the conversation.

## Product and page contract

[PRODUCT_MAP.md](PRODUCT_MAP.md) and [docs/PRODUCT.md](../docs/PRODUCT.md) contain the section-by-section specification. In brief: direct Discover with search, Continue listening/history-gated Made for you, curated shelves, Sounds, genre links and immediate play; Journey first-use picker then route-backed Genre page (identity, progress, songs, releases, artists, scoped search, Change genre); Artist Journey with releases newest-first, official track sequence, matching/all mode, truthful playback and explicit completion; Release with art, context, credits and non-gating extras; Song Room modes Room/About/Lyrics/Credits/Extra/Up next; Library saves/moments/notes; Profile editable taste and future secure-account controls. Every page needs loading, empty, rights-unavailable, error, keyboard, mobile and reflow states in production. Do not imply every specified production behavior already exists in the prototype.

## Technical truth and production migration

Candidate builds on a fictional local catalog: 4 playable genres, 8 fictional artists, 15 releases, 39 tracks, six original demo MP3s; onboarding's broader genre labels are not extra playable catalog genres. Current persistence uses browser localStorage, not secure accounts or synchronized data. `src/ui/discoveryHub.js` is intended canonical Discover/Genre rendering; legacy `renderDiscoverView()` in `src/ui/views.js` must not be revived. Release chapters currently use state; independent deep links need a deliberate route contract.

One physical audio engine/transport, two independently resumable logical Journey and Global sessions. The candidate's `playbackContexts.js`/`journeyStateGuard.js` use event/DOM compatibility glue around a singleton. Before production catalog work, move ownership to store/audio commands with bounded source queues and tested migrations. [PLAYBACK_CONTEXTS.md](PLAYBACK_CONTEXTS.md) and [docs/DATA_MODEL.md](../docs/DATA_MODEL.md) spell out the target.

The production architecture is provider-neutral with stable Rondo IDs, normalized artist/release/recording/track-placement models, rights/provenance per media and territory, bounded paginated APIs, indexed debounced search, lazy assets, idempotent resumable ingestion, backups/observability/privacy controls, and one data-driven Genre renderer. Never ship a full catalog into the browser. The owner supplies implementation-facing contracts/permissions before actual sources. Public accessibility does not imply authorization.

## Delivery sequence

1. **Now:** reconcile canonical docs (this round); complete exact published-preview and manual visual gates, correct PR description, then request owner desktop/phone experience test.
2. **If feedback changes source:** fix on a focused candidate branch and rerun all gates for the new exact head, republish evidence and handoff.
3. **On explicit acceptance:** resolve PR integration/dirty state deliberately, merge accepted code, rerun post-merge checks, update main specs/state.
4. **Then:** naming migration, production foundation, authorized catalog/rights pipeline, real V1 listener system, evaluated editorial/recommendation depth, operational scale. See [ROADMAP.md](ROADMAP.md).
5. **Later V2:** only evidence-driven features; no payments in V1. A future payment model needs a separate owner decision and compliant rights/financial design.

## Open inputs, not guesses

Owner feedback/acceptance; optional listening Extra treatment; first territories and web/native/language/age/explicit policy; legal/source contracts and permissions; production framework/hosting; eventual payment value/model. See [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md). This handoff records what is known, not an invented complete prior-chat transcript.

## Continuity rule

After every substantive action update the relevant canonical page spec, decisions, implementation state, test evidence, screenshots/media index, roadmap, and this report in the same work session. Label **planned, implemented, CI-passed, separately audited, manually reviewed, owner-accepted, merged** independently. Include exact head and next action. Another advanced AI should be able to resume from the repo alone.
