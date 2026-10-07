# Rondo agent operating guide

## Mission
Build a distinctive, calm, accessible music product around **find → play → explore → keep**. Be truthful about what is implemented, authorized, tested, and approved. No generic generated-looking UI, invented metadata, fake charts, manipulative streaks, autoplay traps, or music-gating gimmicks.

## Start here (every session, any model)

1. Read [handoff/STATE.md](handoff/STATE.md) (where we are, next action), then [handoff/CONVERSATION_LOG.md](handoff/CONVERSATION_LOG.md) (everything the owner said, in order), [handoff/HANDOFF_REPORT.md](handoff/HANDOFF_REPORT.md), [handoff/DECISIONS.md](handoff/DECISIONS.md), [handoff/OPEN_QUESTIONS.md](handoff/OPEN_QUESTIONS.md).
2. Design work: [handoff/DESIGN_PROGRAM.md](handoff/DESIGN_PROGRAM.md) (process + **binding anti-slop rules**) and [docs/specs/](docs/specs/README.md). Never implement an unapproved study.
3. App/code work: [handoff/PRODUCT_MAP.md](handoff/PRODUCT_MAP.md), [handoff/PLAYBACK_CONTEXTS.md](handoff/PLAYBACK_CONTEXTS.md), [handoff/QUALITY_GATES.md](handoff/QUALITY_GATES.md), [docs/](docs/), and the latest audit.
4. Check live GitHub (branches, PR #5, checks) — docs can lag.

## Current phase (2026-10-07)

Design-first (D-048). Home desktop approved (rev 3, D-058). Next: Home rev 4 (phone layout, clean scrubber, Dig) once the owner answers OPEN_QUESTIONS Q11–Q15, then Now Playing, then Journeys. App code is frozen at v0.3.0 on `main`; PR #5 (v0.3.2 candidate) has open bugs B-001/B-002 and will be rebuilt on the approved design. PR #9 / Living Record is rejected forever (D-042). No AI features (D-050). No payments in V1 (D-032).

## Mindset the owner expects

- Professional, creative, advanced — never "AI slop" or "vibe-coded". Teen audience, phone-first. Fun, fast, no confusion, worth coming back to and later worth paying for.
- Think and research before building; propose with reasons; give honest feedback, including when the owner's idea or our own work is weak.
- Plain wording in the UI. No greetings/chatty copy, no glow/gradients, no fake data claims.
- Ask the owner only for real decisions; otherwise proceed. The owner delegates merges to `main`.
- Show work: renders/screenshots + a working preview link (GitHub Pages: `https://makeitrando.github.io/Rando/<path>`).

## Continuity rules (hard)

- **Push checkpoints to `main` after every major step (D-059).** The 2026-10-07 morning session lost all its work by pushing only at the end.
- Same session, same commit: update STATE, CONVERSATION_LOG (owner quotes + what you did), DECISIONS, the affected spec, and the study README.
- Archive every owner screenshot with `python3 scripts/archive-screenshot.py <dir> "slug|note|path" …` under `handoff/snapshots/<date>-owner-context/`.
- Use real dates from `date` / commit timestamps, not assumptions.
- Pushing without git credentials: GitHub MCP `push_files`; for big payloads write the arguments JSON to a file and pass `arguments_file_path`; split commits under ~1 MB.

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

## Handoff protocol: same work session, every change (detail)
Update `handoff/STATE.md` (branch/SHA/CI/what changed/what remains/next action), `handoff/DECISIONS.md` (choice/reversal), `handoff/PRODUCT_MAP.md` and `docs/PRODUCT.md` (pages/flows), `docs/DESIGN.md` (visual/accessibility), `docs/ARCHITECTURE.md` and `docs/DATA_MODEL.md` (architecture/state), `handoff/PLAYBACK_CONTEXTS.md` (sessions), `handoff/QUALITY_GATES.md` and `handoff/SNAPSHOTS.md` (tests/media), and `handoff/ROADMAP.md`/`docs/PRODUCTION_PLAN.md` (phases/rights/payment), as applicable. Record implementation, specification, automated result, manual result, and owner approval separately. Do not invent missing Notion history or media. A session is unfinished until the handoff matches reality. Update the record as work progresses, not only at the end; if work stops unexpectedly, the latest committed checkpoint must still identify the exact head, verified results, blocker, and next action.
