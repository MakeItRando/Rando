# Rondo handoff index

This folder is the canonical continuity package. It should let another contributor resume without private chat history, while distinguishing known decisions from reconstructed screenshot notes, tested results from untested claims, and prototype from production.

## Current checkpoint

As reviewed 2026-09-28, draft [PR #5](https://github.com/MakeItRando/Rando/pull/5) candidate [`cd25bbd`](https://github.com/MakeItRando/Rando/commit/cd25bbda8b4e92671c9a61fd97352b9eaac6fc1d) remains unmerged. [CI run 34465613545](https://github.com/MakeItRando/Rando/actions/runs/34465613545/job/102833363733) and [13-suite evidence `513d538`](https://github.com/MakeItRando/Rando/commit/513d538822a3ea2d4b7f50b2c777a5594815fa71) succeeded; [preview `089bd21`](https://github.com/MakeItRando/Rando/commit/089bd2125ab002b3aa70f8587578e01c2a879a5f) exists. Latest exact published-preview audit, manual 18-capture sign-off, and owner acceptance are not evidenced. The previous `b752cc6` checkpoint is historical. Recheck live GitHub status.

## Reading order

1. [STATE.md](STATE.md): exact current refs, quality gaps, next action.
2. [HANDOFF_REPORT.md](HANDOFF_REPORT.md): project philosophy, implementation truth, prior-context limits, handover path.
3. [DECISIONS.md](DECISIONS.md), [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md): confirmed vs unresolved owner choices.
4. [PRODUCT_MAP.md](PRODUCT_MAP.md), [PLAYBACK_CONTEXTS.md](PLAYBACK_CONTEXTS.md), [PRODUCT_IDEAS.md](PRODUCT_IDEAS.md): page contracts, dual-session behavior, proposals.
5. [ROADMAP.md](ROADMAP.md), [QUALITY_GATES.md](QUALITY_GATES.md), [SNAPSHOTS.md](SNAPSHOTS.md), [snapshots/README.md](snapshots/README.md): phases, gates, visual/conversation evidence.
6. Root [AGENTS.md](../AGENTS.md), [agent.md](../agent.md), [README.md](../README.md), and canonical [docs/](../docs/).

## Non-negotiable contracts

Discover is song-first, Journeys owns genre selection, Song Room is explicit and restrained, one physical audio engine supports separately resumable Journey/Global logical sessions, non-Journey playback cannot mutate a saved Journey. Rondo owns its provider-neutral experience; production needs authorized sources, stable IDs, bounded/search-indexed APIs and rights. V1 has no payments.

## Same-session update map

Branch/head/check/blocker/next action → `STATE.md`; owner choice/reversal → `DECISIONS.md` and `OPEN_QUESTIONS.md`; page/section/copy/route/persistence → `PRODUCT_MAP.md` and `docs/PRODUCT.md`; playback → `PLAYBACK_CONTEXTS.md`, architecture and data model; UI/accessibility → `docs/DESIGN.md`; service/rights/scale → `docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md`, `docs/PRODUCTION_PLAN.md`; QA/logs/screenshots/videos → `QUALITY_GATES.md`, `SNAPSHOTS.md`; phases/V1/V2/payment → `ROADMAP.md`. Update this index/report when the overall story changes. Link artifacts instead of dumping generated evidence or unlicensed media onto `main`.

## Continuity standard

For every substantive change record what was proposed, implemented, automatically tested, audited as published, visually reviewed, accepted by the owner and merged. Give exact SHA and evidence, current blocker, and the next contributor's first action. Never infer a full previous Notion transcript from four screenshot summaries.
