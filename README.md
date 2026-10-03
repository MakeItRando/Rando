# Rondo

**Find your next repeat.** Rondo is an independent, music-first discovery and listening product built around **find → play → explore → keep**. Discover answers what to play now; Journeys explores genres and artists; Song Room centers the active recording; Library keeps meaningful listening history.

## Read this before working

1. [AGENTS.md](AGENTS.md) and [agent.md](agent.md)
2. [handoff/STATE.md](handoff/STATE.md) and [handoff/HANDOFF_REPORT.md](handoff/HANDOFF_REPORT.md)
3. [handoff/DECISIONS.md](handoff/DECISIONS.md), [handoff/PRODUCT_MAP.md](handoff/PRODUCT_MAP.md), [handoff/PLAYBACK_CONTEXTS.md](handoff/PLAYBACK_CONTEXTS.md)
4. [handoff/QUALITY_GATES.md](handoff/QUALITY_GATES.md), [handoff/SNAPSHOTS.md](handoff/SNAPSHOTS.md), [handoff/ROADMAP.md](handoff/ROADMAP.md), and [docs/](docs/)

Recheck live refs, CI, and PR status; this README is a dated checkpoint, not a substitute for GitHub. Every meaningful product, code, decision, test, design, or branch change must update relevant docs and the handoff in the same session.

## Checkpoint (2026-10-03)

| Surface | Verified state |
| --- | --- |
| `main` | `947f1a8`; stable v0.3.0 runtime remains `eaafc4c`, followed by canonical documentation commits |
| [Draft PR #5](https://github.com/MakeItRando/Rando/pull/5) | Open, unmerged, and cleanly synchronized with `main`; candidate `742abac` |
| Candidate CI | [Run 37125303981](https://github.com/MakeItRando/Rando/actions/runs/37125303981/job/111209288795) passed clean install, zero-vulnerability audit, portable build, static/unit/migration checks, 13 browser suites, and visual capture against `preview.html` |
| QA archive | `rondo-v032-qa-evidence` at `f163d25`; all 13 browser results status `0`, 18 captures, zero automated findings/runtime errors |
| Portable preview | `rondo-v031-preview` at `74272e6`; HTML Git blob `0405bc5a0ba00a03b492dd29af83c38d39019e95`, 532,629 bytes, SHA-256 `39db95b35f3a2421631e2178417a08e4af9d8bda0774e4cb4f3be68fd1ef38b5` |
| Independent audit | Downloaded published HTML was byte-identical to the locally certified artifact; all 13 browser suites and 18-state visual capture passed over HTTP with published media |
| Manual visual review | 18/18 evidence contact-sheet states reviewed; critical Song Room, Light, 320px, and Reduced Motion states spot-checked full-size; no blocking visual defect found |

The candidate is ready for product-owner desktop/phone testing, but it is **not merged or released**. Merge only after explicit owner acceptance; if feedback changes source, rerun every exact-head gate and republish aligned evidence/preview.

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

For stable `main`: `npm ci`, `npm run build:preview`, `npm run serve`; from another shell use `RONDO_URL=http://127.0.0.1:4173/preview.html npm test`. For candidate checks, use the candidate's package/workflow and [QUALITY_GATES](handoff/QUALITY_GATES.md), never infer its status from `main` tests.
