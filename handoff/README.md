# Rondo handoff index

This folder is the canonical continuity package. It should let another contributor resume without private chat history, while distinguishing known decisions from reconstructed screenshot notes, tested results from untested claims, and prototype from production.

## Current checkpoint

Verified 2026-10-03: draft [PR #5](https://github.com/MakeItRando/Rando/pull/5) is open and unmerged at `742abac`, cleanly synchronized with `main`. CI run `37125303981` passed against the portable artifact; evidence `f163d25`, preview `74272e6`. The downloaded published HTML matched the certified Git blob byte-for-byte and passed all 13 browser suites plus 18-state visual capture over HTTP. Manual 18-state review found no blocker. The candidate is ready for owner desktop/phone testing, not merge or production rollout. Read [STATE.md](STATE.md) first.

## Reading order

1. [STATE.md](STATE.md): exact current refs, quality gaps, next action.
2. [HANDOFF_REPORT.md](HANDOFF_REPORT.md): project philosophy, implementation truth, prior-context limits, handover path.
3. [DECISIONS.md](DECISIONS.md), [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md): confirmed vs unresolved owner choices.
4. [PRODUCT_MAP.md](PRODUCT_MAP.md), [PLAYBACK_CONTEXTS.md](PLAYBACK_CONTEXTS.md), [PRODUCT_IDEAS.md](PRODUCT_IDEAS.md): page contracts, dual-session behavior, proposals.
5. [ROADMAP.md](ROADMAP.md), [QUALITY_GATES.md](QUALITY_GATES.md), [SNAPSHOTS.md](SNAPSHOTS.md), [snapshots/README.md](snapshots/README.md): phases, gates, visual/conversation evidence.
6. [AUDIT_2026-10-03.md](AUDIT_2026-10-03.md), [SESSION_2026-10-03.md](SESSION_2026-10-03.md), and [EXPERIENCE_STRATEGY.md](EXPERIENCE_STRATEGY.md): latest comprehensive audit, owner context, and proposed differentiation principles.
7. Root [AGENTS.md](../AGENTS.md), [agent.md](../agent.md), [README.md](../README.md), and canonical [docs/](../docs/).

## Non-negotiable contracts

Discover is song-first, Journeys owns genre selection, Song Room is explicit and restrained, one physical audio engine supports separately resumable Journey/Global logical sessions, non-Journey playback cannot mutate a saved Journey. Rondo owns its provider-neutral experience; production needs authorized sources, stable IDs, bounded/search-indexed APIs and rights. V1 has no payments.

## Same-session update map

Branch/head/check/blocker/next action → `STATE.md`; owner choice/reversal → `DECISIONS.md` and `OPEN_QUESTIONS.md`; page/section/copy/route/persistence → `PRODUCT_MAP.md` and `docs/PRODUCT.md`; playback → `PLAYBACK_CONTEXTS.md`, architecture and data model; UI/accessibility → `docs/DESIGN.md`; service/rights/scale → `docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md`, `docs/PRODUCTION_PLAN.md`; QA/logs/screenshots/videos → `QUALITY_GATES.md`, `SNAPSHOTS.md`; phases/V1/V2/payment → `ROADMAP.md`. Update this index/report when the overall story changes. Link artifacts instead of dumping generated evidence or unlicensed media onto `main`.

## Continuity standard

For every substantive change record what was proposed, implemented, automatically tested, audited as published, visually reviewed, accepted by the owner and merged. Give exact SHA and evidence, current blocker, and the next contributor's first action. Never infer a full previous Notion transcript from four screenshot summaries.
