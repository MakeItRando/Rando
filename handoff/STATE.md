# Current project state

**Last updated:** 2026-09-09 — playback-context correction fully gated  
**Repository:** [MakeItRando/Rando](https://github.com/MakeItRando/Rando)  
**Canonical product name:** Rondo everywhere  
**Current phase:** corrected v0.3.2 experience candidate ready for product-owner retest; PR #5 remains draft and unmerged

## Controlling checkpoint

The product owner found a serious context bug in the prior candidate: choosing a song on Discover reused the Journey player path and could change the active Journey artist, track, queue, and progress. The corrected candidate now maintains **two logical playback sessions over one physical audio engine**:

- **Journey session:** active genre, artist, track, queue, route, position, and progress.
- **Global session:** Discover/Search/Library/Release source, selected track, source-derived queue, queue position, and playback position.

Journey audio continues while the listener navigates. Selecting any non-Journey song switches active playback to the global session without changing the saved Journey. Returning to Journeys restores the saved Journey; explicit Journey playback switches active context back to Journey without deleting the global session.

## Branch matrix

| Branch | Exact reference | Purpose | State |
| --- | --- | --- | --- |
| `main` | current HEAD; runtime baseline `eaafc4c` | Stable runtime plus canonical specifications and handoff | Documentation-only updates after runtime baseline |
| `rondo-v031-user-ready` | `b752cc6d2d141c453fc9ba66441ccc568516bf8e` | Corrected v0.3.2 experience candidate | Draft PR #5; green; unmerged |
| `rondo-v032-qa-evidence` | `7f9ddf7cce41b4334981cf5f835c552297cfe459` | Exact-head QA logs, screenshots, and reports | Current for `b752cc6` |
| `rondo-v031-preview` | `904374d578c14b5dbd1201f55ad947aa7ee29d17` | Portable corrected test preview | Test-only; exact HTML blob `4c587e1a3affaf07a6dd183fcecf2cd5d3f0b0fc` |

Always verify live heads before changing code. `main` intentionally avoids a self-referential exact SHA.

## Corrected experience behavior

1. Start or resume a Kairo Vale Journey and play a Journey track.
2. Navigate to Discover; that Journey audio continues in the bottom transport.
3. Select a Discover song; Rondo switches to the global session.
4. Desktop shows a Discover side player and persistent bottom transport. Mobile retains the bottom transport. Song Room opens only when the listener explicitly expands it.
5. Global Previous/Next and Up Next use the initiating source shelf/results rather than the Journey queue.
6. Return to Journeys; the saved Journey genre, artist, track, route, and progress remain intact.
7. Explicitly resume/play within the Journey to switch active playback back to its session.

The same global contract applies to Discover shelves/search, Sounds, global Search, Library, and Release playback. Missing source containers now degrade to a bounded page queue rather than throwing.

## Controlling QA evidence

- **Candidate:** [`b752cc6`](https://github.com/MakeItRando/Rando/commit/b752cc6d2d141c453fc9ba66441ccc568516bf8e)
- **Successful workflow:** [run `34387982105`, job `102588986970`](https://github.com/MakeItRando/Rando/actions/runs/34387982105/job/102588986970)
- **Completed:** `2026-09-09T18:18:56Z`
- **Evidence:** [`7f9ddf7`](https://github.com/MakeItRando/Rando/commit/7f9ddf7cce41b4334981cf5f835c552297cfe459)
- **Published preview:** [`904374d`](https://github.com/MakeItRando/Rando/commit/904374d578c14b5dbd1201f55ad947aa7ee29d17)
- **Preview Git blob:** `4c587e1a3affaf07a6dd183fcecf2cd5d3f0b0fc`
- **Preview size:** `517222` bytes
- **Preview SHA-1:** `51e5d1035ca9c004896a84cadb18656b36ab7881`

All enforced steps passed: smoke, interface quality, Discover/Journey routes, playback-context isolation, product policy, listening, Song Room, audio, personal surfaces, user-ready, experience, full concept, release readiness, and visual capture.

The exact published HTML was independently extracted and rerun over local HTTP against `tests/playback-contexts.mjs`; it passed. The workflow visual report contains 18 captures, no runtime errors, no failures, no horizontal overflow, no broken rendered images, no undersized required targets, and exactly one visible main in normal page states.

## Failure history retained honestly

- `160be0f8` failed because package metadata was inconsistent with the lockfile.
- `1ffadd1e` reached the complete gate; every new and existing suite passed except smoke. Smoke exposed an orphan playback surface where queue derivation attempted `querySelectorAll` on `null`.
- `b752cc6` added Release/page fallback queue roots and source labels. The exact-head run passed completely.

Only `b752cc6` and its evidence/preview are controlling.

## Current implementation status

The candidate uses `src/ui/playbackContexts.js` plus a small layout override as a **prototype compatibility controller** around the existing singleton app. It persists bounded IDs under `rondo-playback-context-v1`, suppresses Discover's old automatic Song Room expansion, protects Journey state during the old internal bridge, and supplies a global queue/side player.

This is acceptable for owner testing, not the production architecture. Before real catalog integration, migrate context ownership into the store/audio controller and remove DOM event interception. Preserve one physical audio engine.

See [`PLAYBACK_CONTEXTS.md`](PLAYBACK_CONTEXTS.md) for the durable contract and production migration.

## Product and production boundaries

- Fictional artists and original prototype audio only.
- Real artists, authorized songs, production accounts, ingestion, backend services, source adapters, and large-scale search begin only after experience approval and receipt of the owner's implementation-facing legal/source package.
- Provider-neutral catalog; thousands first, millions ready.
- Public presence on another service is not authorization.
- V1 has no payments.

## Immediate next action

The product owner should retest the exact published preview on desktop and phone using:

**Kairo Vale Journey → play → Discover continuity → select Discover song → inspect global side player/queue → manually expand Song Room → return to restored Kairo Vale Journey.**

Record feedback without merging PR #5. Merge only after explicit owner acceptance and a final post-acceptance exact-head gate.

## Current risks

- Experience acceptance is still pending; green engineering evidence is not approval.
- PR #5 remains dirty and has long diagnostic history; clean integration history only after acceptance.
- The compatibility controller must not become the production playback architecture.
- Prototype local storage is not secure account sync.
- Existing `Rando` technical URLs still need a deliberate Rondo migration.
- Legal/source package, launch territory, and production platform mix remain future inputs.
