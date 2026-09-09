# Rondo handoff index

This folder is the canonical continuity package for Rondo. A new contributor should reconstruct product direction, implementation state, branch status, quality evidence, owner decisions, and next actions without private chat history.

## Current checkpoint

Corrected v0.3.2 candidate `b752cc6` has separate Journey/global logical sessions and passed the complete exact-head gate. QA evidence is `7f9ddf7`; portable preview is `904374d`; run `34387982105` succeeded. PR #5 remains open, draft, dirty, and unmerged until product-owner acceptance. `STATE.md` is controlling.

## Required reading order

1. [`STATE.md`](STATE.md) — live branch, QA, blocker, owner-decision, and next-action status
2. [`HANDOFF_REPORT.md`](HANDOFF_REPORT.md) — complete earlier context and audit
3. [`PLAYBACK_CONTEXTS.md`](PLAYBACK_CONTEXTS.md) — owner-corrected dual-session contract and production migration
4. [`DECISIONS.md`](DECISIONS.md) — confirmed, working, superseded, and open decisions
5. [`PRODUCT_MAP.md`](PRODUCT_MAP.md) — page/system behavior specification
6. [`PRODUCT_IDEAS.md`](PRODUCT_IDEAS.md) — ranked differentiation ideas; proposals, not shipped claims
7. [`ROADMAP.md`](ROADMAP.md) — experience approval through scalable V1/V2
8. [`QUALITY_GATES.md`](QUALITY_GATES.md) — automated, visual, UX, accessibility, rights, security, and release gates
9. [`SNAPSHOTS.md`](SNAPSHOTS.md) — recovered conversation and repository evidence
10. [`OPEN_QUESTIONS.md`](OPEN_QUESTIONS.md) — resolved owner answers and remaining production inputs
11. [`snapshots/README.md`](snapshots/README.md) — evidence retention rules

Also read root [`AGENTS.md`](../AGENTS.md) and canonical [`docs/`](../docs/).

## Non-negotiable owner decisions

- Rondo is canonical everywhere; migrate `Rando` technical names deliberately.
- Journey and global/free listening have independent resumable sessions and queues over one physical audio engine.
- A non-Journey play action never mutates the saved Journey.
- Discover opens song-first; Journeys owns genre selection and progression.
- Catalog is broad, provider/source neutral, thousands-first, and millions-ready.
- Owner supplies the legal/source package before real integration.
- V1 has no payments.

## Canonical implementation warning

`src/ui/discoveryHub.js` is the canonical Discover/Journey renderer. Dormant `renderDiscoverView()` in `src/ui/views.js` must not be revived. The candidate's `src/ui/playbackContexts.js` is testable prototype compatibility glue, not the production store architecture; see `PLAYBACK_CONTEXTS.md`.

## Mandatory maintenance

Update continuity in the same work session.

| Change | Update |
| --- | --- |
| Branch, commit, PR, check, blocker, test request | `STATE.md` |
| Product decision or reversal | `DECISIONS.md` |
| Playback context/queue/switching | `PLAYBACK_CONTEXTS.md`, `docs/ARCHITECTURE.md`, and data model |
| Page, section, interaction, route, copy, persistence | `PRODUCT_MAP.md` and `docs/PRODUCT.md` |
| Architecture, service, source, scale, security, hosting | `docs/ARCHITECTURE.md` and `docs/PRODUCTION_PLAN.md` |
| Entity, field, identity, migration, analytics | `docs/DATA_MODEL.md` |
| Responsive, visual, motion, accessibility | `docs/DESIGN.md` |
| Test plan/result/screenshot/video | `QUALITY_GATES.md` and `SNAPSHOTS.md` |
| Future phase, V1/V2, real system, payment | `ROADMAP.md` |

A handoff is incomplete unless it distinguishes implemented, specified, passed, failed, unverified, owner-approved, and next-action state.
