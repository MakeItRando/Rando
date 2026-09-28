# Rondo

**Find your next repeat.** Rondo is an independent, music-first discovery and listening product built around **find → play → explore → keep**. Discover answers what to play now; Journeys explores genres and artists; Song Room centers the active recording; Library keeps meaningful listening history.

## Read this before working

1. [AGENTS.md](AGENTS.md) and [agent.md](agent.md)
2. [handoff/STATE.md](handoff/STATE.md) and [handoff/HANDOFF_REPORT.md](handoff/HANDOFF_REPORT.md)
3. [handoff/DECISIONS.md](handoff/DECISIONS.md), [handoff/PRODUCT_MAP.md](handoff/PRODUCT_MAP.md), [handoff/PLAYBACK_CONTEXTS.md](handoff/PLAYBACK_CONTEXTS.md)
4. [handoff/QUALITY_GATES.md](handoff/QUALITY_GATES.md), [handoff/SNAPSHOTS.md](handoff/SNAPSHOTS.md), [handoff/ROADMAP.md](handoff/ROADMAP.md), and [docs/](docs/)

Recheck live refs, CI, and PR status; this README is a dated checkpoint, not a substitute for GitHub. Every meaningful product, code, decision, test, design, or branch change must update relevant docs and the handoff in the same session.

## Checkpoint (2026-09-28)

| Surface | State |
| --- | --- |
| `main` | Stable v0.3.0 runtime baseline `eaafc4c`; subsequent commits are canonical documentation, not the candidate runtime |
| [Draft PR #5](https://github.com/MakeItRando/Rando/pull/5) | Open/unmerged; candidate branch `rondo-v031-user-ready` at [`cd25bbd`](https://github.com/MakeItRando/Rando/commit/cd25bbda8b4e92671c9a61fd97352b9eaac6fc1d); merge state last reported dirty |
| Candidate CI | [Run 34465613545](https://github.com/MakeItRando/Rando/actions/runs/34465613545/job/102833363733) succeeded; 13 browser suites plus visual capture, per [evidence](https://github.com/MakeItRando/Rando/blob/513d538822a3ea2d4b7f50b2c777a5594815fa71/latest/run-summary.txt) |
| QA archive | [`513d538`](https://github.com/MakeItRando/Rando/commit/513d538822a3ea2d4b7f50b2c777a5594815fa71); 18 automated captures, no recorded visual-report failures |
| Portable preview | [`089bd21`](https://github.com/MakeItRando/Rando/commit/089bd2125ab002b3aa70f8587578e01c2a879a5f); HTML blob `3f09d59b7207a02be3624d044bc06f8d672c0cd9` (527,599 bytes) |

**Do not conflate these gates.** Latest local-preview CI passed, but a separate audit against that exact published blob and a fresh manual review of all 18 latest captures are not evidenced in the handoff. The older 37-check published-preview audit and 18/18 manual review apply to earlier heads, not `cd25bbd`. Owner experience acceptance is pending. Do not call it perfect, ask the owner to test as a completed quality gate, or merge based on older evidence.

## Product map

- **Discover:** direct song-first home, search, finite editorial shelves, Sounds, truthful history-gated recommendations, and links into Journeys.
- **Journeys:** first-use genre picker, route-backed genre pages, guided Artist Journey, independent progress and continuity.
- **Release:** art, official sequence, credits, context, and optional non-gating extras. Prototype chapter state is not proven to be independently deep-linkable.
- **Song Room:** Room, About, Lyrics, Credits, Extra, Up next, with truthful playback signals and restrained art-driven atmosphere.
- **Library/Profile:** browser-local saves, moments, private notes, taste and appearance; secure accounts/sync are future work.
- **Playback:** one physical audio engine, two resumable logical Journey/global sessions; navigation alone never switches sessions.

Detailed requirements and implementation-vs-future labels are in [PRODUCT_MAP](handoff/PRODUCT_MAP.md), [PRODUCT](docs/PRODUCT.md), [DESIGN](docs/DESIGN.md), [ARCHITECTURE](docs/ARCHITECTURE.md), [DATA_MODEL](docs/DATA_MODEL.md), and [PRODUCTION_PLAN](docs/PRODUCTION_PLAN.md).

## Prototype and production boundary

The current app uses fictional artists and browser-local data, original demo recordings, and local artwork. No real catalog, secure account, production provider authorization, backend, payments, or large-scale search is implemented. Rondo owns its experience and normalized IDs; authorized, replaceable connectors must supply production media/metadata. Public presence on Spotify, YouTube, Suno, or elsewhere is not permission. The owner will supply the implementation-facing legal/source package. V1 excludes payments.

For stable `main`: `npm ci`, `npm run build:preview`, `npm run serve`; from another shell use `RONDO_URL=http://127.0.0.1:4173/preview-test.html npm test`. For candidate checks, use the candidate's package/workflow and [QUALITY_GATES](handoff/QUALITY_GATES.md), never infer its status from `main` tests.
