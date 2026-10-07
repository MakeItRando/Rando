# Rondo handoff index

This folder is the canonical continuity package. It should let another contributor resume without private chat history, while distinguishing known decisions from reconstructed screenshot notes, tested results from untested claims, and prototype from production.

## Current checkpoint (2026-10-07)

Design-first phase. Home desktop approved (rev 3, D-058); Home rev 4 + phone next. The 2026-10-07 morning session was lost before pushing ([SESSION_2026-10-07.md](SESSION_2026-10-07.md)). App candidate PR #5 unchanged with B-001/B-002 open. All owner screenshots up to 2026-10-07 are archived under [snapshots/](snapshots/).

## Reading order

1. [STATE.md](STATE.md): exact current refs, quality gaps, next action.
1b. [CONVERSATION_LOG.md](CONVERSATION_LOG.md): every session and owner quote in order; [REVIEW_2026-10-07.md](REVIEW_2026-10-07.md): latest audit, critique and ideas; [DESIGN_PROGRAM.md](DESIGN_PROGRAM.md): design process and anti-slop rules.
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
