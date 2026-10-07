# Rondo project handoff report

**As of 2026-10-07:** this is a continuity report, not a release certificate. Read [STATE.md](STATE.md) first, then [AUDIT_2026-10-04.md](AUDIT_2026-10-04.md), and verify live GitHub state.

## Immediate verdict for the next contributor (2026-10-07)

**We are designing, not building.** The owner approved Home desktop (study E rev 3, D-058) after five study rounds (A → E). The next job is Home rev 4 — phone layout, clean scrubber, Dig, livelier placeholders — after the owner answers [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) Q11–Q15, then Now Playing and Journeys. Read [CONVERSATION_LOG.md](CONVERSATION_LOG.md) to absorb the owner's taste: every verdict is quoted there. Read [REVIEW_2026-10-07.md](REVIEW_2026-10-07.md) for the current honest critique and ranked ideas.

The 2026-10-07 morning session built a clean scrubber and Dig but died before pushing — nothing survived ([SESSION_2026-10-07.md](SESSION_2026-10-07.md)). Push checkpoints (D-059).

The older app candidate (PR #5, v0.3.2) is unchanged: existing suites pass, but B-001/B-002 block acceptance; main has B-003. It will be rebuilt on the approved design; the playback contracts below still apply. The Living Record direction (PR #9) is rejected forever.

## Purpose and point of view

**Rondo, 'Find your next repeat.'** Its advantage is a clearer mental model: **find → play → explore → keep**. Discover answers what to hear now. Journeys goes deep through genres and artists. Song Room brings the active recording and its authorized context together. Library remembers songs, releases, artists, moments and notes. Profile lets listeners shape taste without requiring another streaming app. Optimize for music, clarity, accessible continuity, truth, and tasteful artwork-led craft rather than sheer feature count or competitor imitation.

No oversized filler typography, generic AI art, generated-looking glow/cards, fake popularity claims, strategy-speak UI copy, manipulative streaks, forced autoplay, or locks on core music/credits. Night is default, Light works, motion has a purpose, Reduced Motion is real. Competition is beaten by trust and utility, not fake abundance.

## Evidence lineage, do not confuse heads

- Audited main baseline: `c656489`; latest main has additional docs/archive commits; stable v0.3.0 runtime baseline `eaafc4c`, followed by canonical docs.
- Current candidate: `rondo-v031-user-ready` at `d9bc54f`, open draft PR #5, based on audited `main` at `c656489`.
- Current automation: run `37125854133` passed clean install, zero-vulnerability audit, portable build, static/unit/migration checks, 13 browser suites, and visual capture against `preview.html`.
- Current evidence: `rondo-v032-qa-evidence` at `d1635f5`; 13/13 status `0`, 18 captures, zero automated findings/runtime errors.
- Current portable preview: `rondo-v031-preview` at `74272e6`; HTML Git blob `0405bc5a0ba00a03b492dd29af83c38d39019e95`, 532,629 bytes, SHA-256 `39db95b35f3a2421631e2178417a08e4af9d8bda0774e4cb4f3be68fd1ef38b5`.
- Prior independent deployed-HTTP audit (2026-10-03): downloaded HTML was byte-identical to the locally certified artifact; with the preview branch's referenced demo audio, all 13 browser suites and 18-state visual capture passed over HTTP.
- Prior manual visual review (2026-10-03): complete evidence contact sheet reviewed; critical Song Room, Light, compact, and Reduced Motion states checked full-size; no visual blocker recorded then; this is not clearance of newly reproduced behavior defects.
- Missing: owner desktop/phone acceptance, merge, post-merge QA, and every production-system gate. Historical red `9046918` and green `cd25bbd` results remain attributed to their own heads.

## Recovered previous conversation, with limits

The earlier Notion chat was not retrievable in this record. Four screenshots were previously summarized in [SNAPSHOTS.md](SNAPSHOTS.md); their recovered points were: Discover must be a real song-first home rather than a genre modal; Journeys owns genre choice, dedicated genre pages, guided artist progression and Change genre; playback and meaningful progress persist across navigation; design should be restrained, professional and human, not oversized or overexplained; prior readiness claims were not themselves proof. **These are recovered notes, not a full Notion transcript or the original media.** Do not invent missing decisions or attach unrelated images as if they were the conversation.

Five new owner-supplied screenshots from this orientation request are now archived losslessly under [snapshots/2026-10-04-owner-context/](snapshots/2026-10-04-owner-context/). They record later onboarding/design criticism and final rejection of Living Record. These original payloads are separate from the older four recovery summaries above. The full prior transcript and original concept packages/videos remain unavailable.

## Product and page contract

[PRODUCT_MAP.md](PRODUCT_MAP.md) and [docs/PRODUCT.md](../docs/PRODUCT.md) contain the section-by-section specification. In brief: direct Discover with search, Continue listening/history-gated Made for you, curated shelves, Sounds, genre links and immediate play; Journey first-use picker then route-backed Genre page (identity, progress, songs, releases, artists, scoped search, Change genre); Artist Journey with releases newest-first, official track sequence, matching/all mode, truthful playback and explicit completion; Release with art, context, credits and non-gating extras; Song Room modes Room/About/Lyrics/Credits/Extra/Up next; Library saves/moments/notes; Profile editable taste and future secure-account controls. Every page needs loading, empty, rights-unavailable, error, keyboard, mobile and reflow states in production. Do not imply every specified production behavior already exists in the prototype.

## Technical truth and production migration

Candidate builds on a fictional local catalog: 4 playable genres, 8 fictional artists, 15 releases, 39 tracks, six original demo MP3s; onboarding's broader genre labels are not extra playable catalog genres. Current persistence uses browser localStorage, not secure accounts or synchronized data. `src/ui/discoveryHub.js` is intended canonical Discover/Genre rendering; legacy `renderDiscoverView()` in `src/ui/views.js` must not be revived. Release chapters currently use state; independent deep links need a deliberate route contract.

Target: one physical audio engine/transport with two independently resumable logical Journey and Global sessions. The prototype meets some interaction paths but fails the newly tested natural-end/source-boundary paths; independent persistence remains migration debt. The candidate's `playbackContexts.js`/`journeyStateGuard.js` use event/DOM compatibility glue around a singleton. Before production catalog work, move ownership to store/audio commands with bounded source queues and tested migrations. [PLAYBACK_CONTEXTS.md](PLAYBACK_CONTEXTS.md) and [docs/DATA_MODEL.md](../docs/DATA_MODEL.md) spell out the target.

The production architecture is provider-neutral with stable Rondo IDs, normalized artist/release/recording/track-placement models, rights/provenance per media and territory, bounded paginated APIs, indexed debounced search, lazy assets, idempotent resumable ingestion, backups/observability/privacy controls, and one data-driven Genre renderer. Never ship a full catalog into the browser. The owner supplies implementation-facing contracts/permissions before actual sources. Public accessibility does not imply authorization.

## Delivery sequence

1. Read STATE, [SESSION_2026-10-04.md](SESSION_2026-10-04.md), current audit and design reset; verify live main/PR/check/evidence refs.
2. In the next authorized development round, reproduce and fix B-001/B-002 at source; cover natural ends, media actions, single-source queues and independent restoration. Deliberately address dependency and main/post-merge CI gating.
3. Clarify first-listen/onboarding and artist-follow meaning before dependent changes. Improve only observed components within original Rondo identity; capture before/after and preserve rollback.
4. Reconcile main docs into candidate; rerun install/audit/build/static/unit/expanded-browser/visual/exact-published/manual gates. Existing green checks do not cover the new defects.
5. Then ask owner to test desktop and phone. Explicit acceptance permits integration; run full post-merge QA before authorized real-catalog/backend work.
6. Later V1 excludes payments. Rights/source/territory and platform inputs precede dependent production implementation; see ROADMAP.

## Open inputs, not guesses

Owner feedback/acceptance; optional listening Extra treatment; first territories and web/native/language/age/explicit policy; legal/source contracts and permissions; production framework/hosting; eventual payment value/model. See [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md). This handoff records what is known, not an invented complete prior-chat transcript.

## Continuity rule

After every substantive action update the relevant canonical page spec, decisions, implementation state, test evidence, screenshots/media index, roadmap, and this report in the same work session. Label **planned, implemented, CI-passed, separately audited, manually reviewed, owner-accepted, merged** independently. Include exact head and next action. Another advanced AI should be able to resume from the repo alone.
