# Rondo

**Find your next repeat.** Rondo is an independent, music-first discovery and listening product built around **find → play → explore → keep**. Discover answers what to play now; Journeys explores genres and artists; Song Room centers the active recording; Library keeps meaningful listening history.

## Read this before working

1. [AGENTS.md](AGENTS.md) and [agent.md](agent.md)
2. [handoff/STATE.md](handoff/STATE.md), [handoff/CONVERSATION_LOG.md](handoff/CONVERSATION_LOG.md) and [handoff/HANDOFF_REPORT.md](handoff/HANDOFF_REPORT.md)
3. [handoff/DECISIONS.md](handoff/DECISIONS.md), [handoff/PRODUCT_MAP.md](handoff/PRODUCT_MAP.md), [handoff/PLAYBACK_CONTEXTS.md](handoff/PLAYBACK_CONTEXTS.md)
4. [handoff/QUALITY_GATES.md](handoff/QUALITY_GATES.md), [handoff/SNAPSHOTS.md](handoff/SNAPSHOTS.md), [handoff/ROADMAP.md](handoff/ROADMAP.md), and [docs/](docs/)

Recheck live refs, CI, and PR status; this README is a dated checkpoint, not a substitute for GitHub. Every meaningful product, code, decision, test, design, or branch change must update relevant docs and the handoff in the same session.

## Checkpoint (2026-10-07)

**Phase: design-first.** Home desktop is approved (study E rev 3, D-058) — [try it](https://makeitrando.github.io/Rando/design/studies/2026-10-05-home-e/home.html). Next: Home rev 4 (phone layout, clean scrubber, Dig), then Now Playing and Journeys. The 2026-10-07 morning session's work was lost before pushing; see [handoff/SESSION_2026-10-07.md](handoff/SESSION_2026-10-07.md). Full chat history: [handoff/CONVERSATION_LOG.md](handoff/CONVERSATION_LOG.md).

App runtime on `main` is still v0.3.0. Candidate PR #5 (v0.3.2) is draft with open playback bugs B-001/B-002; main has a Playwright advisory (B-003). These get fixed when the app is rebuilt on the approved design. [PR #9](https://github.com/MakeItRando/Rando/pull/9) (Living Record) is rejected — never revive it.

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
