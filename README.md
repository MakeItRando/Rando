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
| `main` | `c0a11fe`; stable v0.3.0 runtime remains `eaafc4c`, followed by canonical documentation commits |
| [Draft PR #5](https://github.com/MakeItRando/Rando/pull/5) | Open/unmerged; `rondo-v031-user-ready` at `9046918`; 206 commits ahead of its merge base and 22 commits behind current `main`; mergeability returned `unknown` during this audit and was previously reported dirty |
| Candidate CI | [Run 36836698618](https://github.com/MakeItRando/Rando/actions/runs/36836698618/job/110285723482) failed in Song Room because visible metadata contains `undefined` |
| Candidate evidence | `rondo-v032-qa-evidence` at `6f68fda`; generated evidence only, never a source branch or merge target |
| Portable preview | `rondo-v031-preview` at `089bd21`; stale, built from older green candidate `cd25bbd`, not current head |
| Local recheck | On 2026-10-03, `main` build/static/unit/6 browser suites passed; its dependency audit failed on high-severity advisory `GHSA-7mvr-c777-76hp`. Candidate clean install/audit/build/static/unit and the first six browser suites passed, then Song Room reproduced the `undefined` failure |

**Do not conflate these gates.** The current candidate is red, the preview is stale, owner acceptance has not happened, and the evidence branch is not product code. Do not ask the owner to test, merge PR #5, or begin real artist/song integration yet. The next development round must fix the source-level Song Room writer, remove the ineffective runtime guard, update dependencies deliberately, rerun the exact-head workflow, manually inspect all new captures, and audit the exact published preview.

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
