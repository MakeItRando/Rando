# Rondo agent operating guide

## Mission
Build a distinctive, calm, accessible music product around **find → play → explore → keep**. Be truthful about what is implemented, authorized, tested, and approved. No generic generated-looking UI, invented metadata, fake charts, manipulative streaks, autoplay traps, or music-gating gimmicks.

## Startup checklist
Read [README.md](README.md), [handoff/STATE.md](handoff/STATE.md), [handoff/HANDOFF_REPORT.md](handoff/HANDOFF_REPORT.md), [handoff/DECISIONS.md](handoff/DECISIONS.md), [handoff/PRODUCT_MAP.md](handoff/PRODUCT_MAP.md), [handoff/PLAYBACK_CONTEXTS.md](handoff/PLAYBACK_CONTEXTS.md), [handoff/QUALITY_GATES.md](handoff/QUALITY_GATES.md), [handoff/ROADMAP.md](handoff/ROADMAP.md), and all applicable [docs/](docs/). Inspect current branch, PR #5, checks, and changes before planning. `agent.md` points here; do not implement from a pointer or screenshot alone.

## Live-state discipline

Audit baseline main `c656489` contains stable v0.3.0 runtime; this round adds docs/archive only. Draft PR #5 candidate `d9bc54f`, CI `37125854133`, evidence `d1635f5` and preview `74272e6` align. Existing suites pass but fresh B-001/B-002 probes block acceptance readiness. Main has a high Playwright advisory. Read [AUDIT_2026-10-04.md](handoff/AUDIT_2026-10-04.md) and recheck live refs before acting. Never infer approval from generic merge delegation or label latest main synchronized after docs-only commits.

Read [DESIGN_RESET_2026-10-04.md](handoff/DESIGN_RESET_2026-10-04.md). PR #9/Living Record is explicitly rejected, closed and unmerged. Preserve original Rondo; no revival/blending/wholesale concept-board redesign. The owner requested no app development in this orientation round; later scope must be explicit.

## Product and UX invariants
- Discover opens directly, song-first. Made for you appears only after genuine history. Journeys owns genre picking, route-backed genre pages, and artist progression.
- Navigation does not interrupt playback or silently replace Journey state. One audio element/clock/volume/analyser, two resumable logical Journey/global sessions and bounded source queues. Explicit play switches context. Song Room expands only on request.
- Artist/release/song identity, credits, provenance, rights, and queue source stay truthful. Unknown means unknown. Play/Pause/Resume reflects actual state.
- Night is default; Light is complete; use artwork and hierarchy over effects. Mobile, 320px, keyboard, focus, dialog semantics, zoom, and Reduced Motion are first-class.
- Persist meaningful bounded references, progress, preferences, saves, moments, and notes, not dialogs, focus, animation samples, source payloads, full catalog snapshots, or autoplay intent.

## Engineering boundaries
- Canonical candidate Discover/Genre renderer: `src/ui/discoveryHub.js`. The older `renderDiscoverView()` in `src/ui/views.js` remains a competing legacy path with a caller; remove after accepted integration and caller verification, before production catalog work. Release chapters are not proven to have standalone hash routes.
- `src/ui/playbackContexts.js` and `src/ui/journeyStateGuard.js` are prototype compatibility glue. Move ownership into first-class store/audio intents before real catalog work; remove DOM interception without regressing dual-session behavior.
- Rondo IDs and provider-neutral entities; source payloads stop at adapters. One shared data-driven Genre renderer; bounded cursor APIs; indexed/debounced/cancellable rights-aware search; lazy assets; auditable resumable ingestion. Never flatten the catalog client-side.
- Credentials and rights decisions stay server-side. The owner supplies legal/source and territory inputs before integration. V1 has **no payments**. Current browser-local profile/notes are not secure account sync.

## Branch and quality policy
Keep stable runtime and canonical docs on `main`; use focused reviewable branches for candidate changes, test previews and evidence off `main`. No force-push or hiding failed checks. Before test request or merge, run the exact-head clean install, audit, build, static/unit and browser gates, inspect screenshots manually, audit exact published preview bytes over HTTP, review accessibility/privacy/rights/secrets, and reconcile source/evidence/preview/docs. Follow [QUALITY_GATES](handoff/QUALITY_GATES.md). A green workflow is not manual visual approval or owner acceptance. No 'perfect', 'no errors', or 'test now' claim while a required gate is unknown.

## Handoff protocol: same work session, every change
Update `handoff/STATE.md` (branch/SHA/CI/what changed/what remains/next action), `handoff/DECISIONS.md` (choice/reversal), `handoff/PRODUCT_MAP.md` and `docs/PRODUCT.md` (pages/flows), `docs/DESIGN.md` (visual/accessibility), `docs/ARCHITECTURE.md` and `docs/DATA_MODEL.md` (architecture/state), `handoff/PLAYBACK_CONTEXTS.md` (sessions), `handoff/QUALITY_GATES.md` and `handoff/SNAPSHOTS.md` (tests/media), and `handoff/ROADMAP.md`/`docs/PRODUCTION_PLAN.md` (phases/rights/payment), as applicable. Record implementation, specification, automated result, manual result, and owner approval separately. Do not invent missing Notion history or media. A session is unfinished until the handoff matches reality. Update the record as work progresses, not only at the end; if work stops unexpectedly, the latest committed checkpoint must still identify the exact head, verified results, blocker, and next action.
