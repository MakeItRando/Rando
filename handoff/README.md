# Rondo handoff index

This folder is the canonical continuity package for Rondo. A new contributor should be able to reconstruct the product direction, implementation state, branch status, quality bar, owner decisions, and next actions without relying on a private chat history.

## Required reading order

1. [`STATE.md`](STATE.md) — live branch, QA, blocker, owner-decision, and next-action status
2. [`HANDOFF_REPORT.md`](HANDOFF_REPORT.md) — complete project context and repository audit
3. [`DECISIONS.md`](DECISIONS.md) — confirmed, working, superseded, and unresolved decisions
4. [`PRODUCT_MAP.md`](PRODUCT_MAP.md) — page-by-page and system behavior specification
5. [`ROADMAP.md`](ROADMAP.md) — prototype through scalable V1/V2 and deferred payments
6. [`QUALITY_GATES.md`](QUALITY_GATES.md) — automated, visual, UX, accessibility, rights, and release gates
7. [`SNAPSHOTS.md`](SNAPSHOTS.md) — recovered conversation state and evidence index
8. [`OPEN_QUESTIONS.md`](OPEN_QUESTIONS.md) — resolved owner answers and remaining future inputs
9. [`snapshots/README.md`](snapshots/README.md) — naming and retention rules for future images/videos

Also read the root [`AGENTS.md`](../AGENTS.md) and canonical specifications in [`docs/`](../docs/).

## Current owner decisions

- Rondo is the canonical name everywhere; migrate current `Rando` technical names deliberately.
- The final catalog is broad across artists and genres and source/provider neutral.
- Architect for thousands of songs initially and millions without a domain/UX rewrite.
- The product owner supplies the legal acquisition/source package before real integration.
- V1 has no payments.

## Mandatory maintenance rule

Update the handoff in the same session as the work. Do not postpone continuity cleanup.

| Change | Update |
| --- | --- |
| Branch, commit, PR, check, blocker, test request | `STATE.md` |
| Product decision or reversal | `DECISIONS.md` |
| Page, section, interaction, route, copy, persistence | `PRODUCT_MAP.md` and `docs/PRODUCT.md` |
| Architecture, service, source, scale, security, hosting | `docs/ARCHITECTURE.md` and `docs/PRODUCTION_PLAN.md` |
| Entity, field, identity, migration, analytics | `docs/DATA_MODEL.md` |
| Responsive, visual, motion, accessibility | `docs/DESIGN.md` |
| Test plan, result, screenshot, video | `QUALITY_GATES.md` and `SNAPSHOTS.md` |
| Future phase, V1/V2, real system, payment | `ROADMAP.md` |

A handoff is incomplete if it does not say what is implemented, what is only specified, what failed, what the user has approved, and what the next agent should do first.
