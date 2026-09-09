# Current project state

**Last updated:** 2026-09-09 — final pre-test audit  
**Repository:** [MakeItRando/Rando](https://github.com/MakeItRando/Rando)  
**Canonical product name:** Rondo everywhere  
**Current phase:** v0.3.2 experience candidate ready for product-owner testing; no merge or real-catalog work yet

## Branch matrix

| Branch | Exact reference | Purpose | State |
| --- | --- | --- | --- |
| `main` | current HEAD; runtime baseline `eaafc4c` | Stable v0.3.0 runtime plus canonical specifications and handoff | Default branch; documentation changes only after the runtime baseline |
| `rondo-v031-user-ready` | `89fc0d5d352db31ab90ff7d5b25b698db8e8c6cf` | v0.3.2 experience candidate | Draft PR #5; green; unmerged |
| `rondo-v032-qa-evidence` | `dbe315e6ad1687537594a80da566af44645c764f` | Exact-head QA logs, reports, screenshots, and contact sheet | Current for `89fc0d5` |
| `rondo-v031-preview` | `873fbbeb1d209889250825b054b235b8493b4e05` | Portable v0.3.2 test preview | Test-only; exact HTML blob `759a9df34423092ee5843f57f09efe7f4bd43363` |
| `rondo-v23-song-room` | `a5e4905` | Historical v0.3 Song Room work | Merged through PR #3 |
| `rondo-v22-immersive` | `ea05c73` | Historical immersive-listening work | Merged through PR #2 |

Always re-verify live heads before new work. This file intentionally avoids a self-referential exact `main` SHA because updating it creates another `main` commit.

## Release split

- **Stable `main`:** v0.3.0 runtime, fictional catalog, six original Rondo demo recordings, local saves/moments/notes, queue, playback, volume, responsive states, and canonical documentation.
- **v0.3.2 candidate:** direct song-first Discover, recommendation gating, Journey-owned genre picker, route-backed Genre Journey pages, independent continuity, revised Song Room, stronger accessibility/mobile behavior, malformed-state recovery, and expanded QA.
- **Production system:** not started. Real artists, authorized songs, production accounts, source adapters, ingestion, backend services, large-scale search, and operations begin only after experience approval and receipt of the owner's legal/source package.
- **Payments:** excluded from V1.

## Final pre-test evidence

### Enforced workflow

- Candidate: [`89fc0d5`](https://github.com/MakeItRando/Rando/commit/89fc0d5d352db31ab90ff7d5b25b698db8e8c6cf)
- Run: [`34332141798`](https://github.com/MakeItRando/Rando/actions/runs/34332141798/job/102403183216)
- Check: `102403183216`
- Completed: `2026-09-09T09:02:20Z`
- Conclusion: **success**
- Enforced suites: smoke, interface quality, Discover/Journey routes, product policy, listening, Song Room, audio, personal surfaces, user-ready, experience, full concept, and release readiness — all status `0`
- Visual capture step: success

### Visual QA

- Evidence commit: [`dbe315e`](https://github.com/MakeItRando/Rando/commit/dbe315e6ad1687537594a80da566af44645c764f)
- Captures: `18`
- Manually inspected and accepted: `18/18`
- Viewports: `1440×900`, `390×844`, and `320×700`
- Included: direct Discover, lower Discover, Sounds, Journey picker, Genre page, top songs, Artist Journey, Song Room About/Lyrics/Up next, Light Discover, mobile Discover/picker/R&B/artist/Change genre, compact Discover, and Reduced Motion Song Room
- Reported runtime errors: none
- Reported capture failures: none
- Broken rendered images: none
- Horizontal overflow: none
- Undersized required targets: none

### Security review

- Changed files inspected: `58`
- Credential/secret-pattern findings: `0`
- GitHub Advanced Security was unavailable; the targeted full-diff review is the controlling evidence.

### Exact portable-preview audit

- Preview branch: [`873fbbe`](https://github.com/MakeItRando/Rando/commit/873fbbeb1d209889250825b054b235b8493b4e05)
- Exact HTML Git blob: `759a9df34423092ee5843f57f09efe7f4bd43363`
- Exact blob byte length: `500467`
- Runtime assertions: `37/37` passed over local HTTP
- Covered: raw malformed-state repair, direct Discover, cold-start recommendation gating, search, Sounds, playback, Song Room, playback continuity, first-use picker, R&B route, contextual close/focus return, Artist Journey, Back/Forward, 320px overflow, Reduced Motion, and Song Room timing/metadata layout
- Page, console, request, and HTTP errors: `0`
- Audit-only local MP3 fixtures exercised HTTP playback under the six exact preview filenames; they were not committed or represented as repository recordings. All six repository MP3 objects and their exact preview-branch blob SHAs were independently confirmed.

## Product corrections now closed

- Discover opens directly rather than showing a genre chooser.
- Made for you is hidden until real played-track history exists, then uses the explicit eyebrow `From your recent plays`.
- Continue listening appears only after activity.
- Sounds opens the correct section and result set.
- Journeys owns first-use genre selection and route-backed genre pages.
- Change genre closes contextually and returns focus without losing the origin route.
- Playback continues through route changes.
- malformed persisted arrays/records are normalized and the repaired snapshot is written back to `rondo-prototype-v2`.
- legacy repeat `off` migrates to `continue`; supported modes are `continue`, `track`, and `artist`.
- mobile top actions and enabled directory alphabet controls meet the 44×44px contract.
- mobile Genre pages hide the irrelevant directory trigger.
- Song Room time/metadata columns remain separated in compact layouts.
- Reduced Motion uses a truthful static signal.

## Canonical implementation policy

`src/ui/discoveryHub.js` is the v0.3.2 Discover/Journey route implementation. `renderDiscoverView()` in `src/ui/views.js` is dormant, noncanonical legacy code containing superseded conceptual framing. Do not revive it. Delete it before production catalog integration, after the accepted candidate is integrated and no caller remains. Do not create a second renderer.

## Confirmed owner decisions

1. **Rondo everywhere.** Plan a safe technical naming migration before production.
2. **Broad, source-neutral catalog.** Support artists and genres broadly.
3. **Thousands first, millions ready.** Use stable IDs, normalized models, bounded APIs, indexed/debounced search, cursor pagination, lazy assets, and background ingestion. Never send or flatten the full catalog in the browser.
4. **Owner-supplied legal path.** Public availability in another app is not authorization.
5. **No payments in V1.** Reconsider only in a separately approved later phase.

## Immediate next action

1. Product owner tests the portable preview on desktop and phone.
2. Record all feedback without merging PR #5.
3. If changes are required, update candidate source, rerun the complete exact-head gate, republish evidence/preview, inspect every changed visual, and refresh this handoff in the same session.
4. Merge only after explicit product-owner acceptance.
5. Begin production foundations and real-catalog work only after that acceptance; preserve the provider-neutral scale and rights contracts.

## Current risks

- Experience approval is still pending; green engineering evidence is not acceptance.
- `main` runtime intentionally lags the candidate until approval.
- PR #5 has a long diagnostic history and a dirty merge state; clean integration history only when preparing an accepted merge.
- Existing `Rando` technical URLs need a deliberate Rondo migration.
- The legal/source implementation package, launch territories, and production platform mix remain future inputs.
- Prototype local storage is not secure account sync.
- The four hard-coded prototype genres validate the interaction model only; production must use one data-driven taxonomy and renderer.
