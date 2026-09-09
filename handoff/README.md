# Rondo handoff index

This folder is the canonical continuity package for Rondo. A new contributor should be able to reconstruct product direction, implementation state, branch status, quality evidence, owner decisions, and next actions without private chat history.

## Current checkpoint

v0.3.2 candidate `89fc0d5` is green and ready for product-owner testing. QA evidence is `dbe315e`, portable preview is `873fbbe`, and run `34332141798` succeeded. PR #5 remains open, draft, and unmerged; acceptance is still pending. `STATE.md` is the controlling live record.

## Required reading order

1. [`STATE.md`](STATE.md) — live branch, QA, blocker, owner-decision, and next-action status
2. [`HANDOFF_REPORT.md`](HANDOFF_REPORT.md) — complete context and audit
3. [`DECISIONS.md`](DECISIONS.md) — confirmed, working, superseded, and open decisions
4. [`PRODUCT_MAP.md`](PRODUCT_MAP.md) — page/system behavior specification
5. [`ROADMAP.md`](ROADMAP.md) — experience approval through scalable V1/V2
6. [`QUALITY_GATES.md`](QUALITY_GATES.md) — automated, visual, UX, accessibility, rights, security, and release gates
7. [`SNAPSHOTS.md`](SNAPSHOTS.md) — recovered conversation and final repository evidence
8. [`OPEN_QUESTIONS.md`](OPEN_QUESTIONS.md) — resolved owner answers and remaining production inputs
9. [`snapshots/README.md`](snapshots/README.md) — naming/retention rules for future evidence

Also read root [`AGENTS.md`](../AGENTS.md) and canonical [`docs/`](../docs/).

## Non-negotiable owner decisions

- Rondo is canonical everywhere; migrate `Rando` technical names deliberately.
- Catalog is broad across artists/genres and provider/source neutral.
- Build for thousands of songs initially and millions without a domain/UX rewrite.
- Owner supplies legal acquisition/source package before real integration.
- V1 has no payments.

## Canonical implementation warning

For v0.3.2, `src/ui/discoveryHub.js` is the canonical Discover/Journey-route implementation. Dormant `renderDiscoverView()` in `src/ui/views.js` contains superseded conceptual framing. Do not revive or adapt it. Delete it before production catalog integration after accepted integration confirms no caller remains.

## Mandatory maintenance

Update continuity in the same work session.

| Change | Update |
| --- | --- |
| Branch, commit, PR, check, blocker, test request | `STATE.md` |
| Product decision or reversal | `DECISIONS.md` |
| Page, section, interaction, route, copy, persistence | `PRODUCT_MAP.md` and `docs/PRODUCT.md` |
| Architecture, service, source, scale, security, hosting | `docs/ARCHITECTURE.md` and `docs/PRODUCTION_PLAN.md` |
| Entity, field, identity, migration, analytics | `docs/DATA_MODEL.md` |
| Responsive, visual, motion, accessibility | `docs/DESIGN.md` |
| Test plan/result/screenshot/video | `QUALITY_GATES.md` and `SNAPSHOTS.md` |
| Future phase, V1/V2, real system, payment | `ROADMAP.md` |

A handoff is incomplete unless it distinguishes implemented, specified, passed, failed, unverified, owner-approved, and next-action state.
