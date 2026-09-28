# Current project state

**Reviewed:** 2026-09-28. Verify live GitHub heads and checks before acting. **Product:** Rondo; repository still has legacy `Rando` technical naming. **Current round:** documentation/handoff reconciliation only, no app implementation, no experience acceptance, no merge.

## Verdict

The latest candidate is on a draft unmerged PR, not `main`. Its local-preview automated gate passed, but the repository does not show a new exact published-preview runtime audit or complete manual visual acceptance after the latest source change. Previous green claims in this handoff referred to older candidate SHAs. Do not transplant those claims to the current head or ask the owner to test as though the quality gate is complete.

## Branch and evidence matrix

| Surface | Last verified ref | Status |
| --- | --- | --- |
| `main` | Stable runtime baseline [`eaafc4c`](https://github.com/MakeItRando/Rando/commit/eaafc4c3ad5f4151b9b0852d16f6543737c16821); documentation continued at `8bec45d` before this update | Canonical specs; no candidate runtime |
| [PR #5](https://github.com/MakeItRando/Rando/pull/5) / `rondo-v031-user-ready` | [`cd25bbd`](https://github.com/MakeItRando/Rando/commit/cd25bbda8b4e92671c9a61fd97352b9eaac6fc1d) | Open draft, unmerged; merge state last reported dirty |
| Candidate CI | [run 34465613545, job 102833363733](https://github.com/MakeItRando/Rando/actions/runs/34465613545/job/102833363733) | Successful local built-preview workflow: install, high-severity audit, build/check/unit, 13 browser suites, visual capture |
| Evidence branch `rondo-v032-qa-evidence` | [`513d538`](https://github.com/MakeItRando/Rando/commit/513d538822a3ea2d4b7f50b2c777a5594815fa71) | [run summary](https://github.com/MakeItRando/Rando/blob/513d538822a3ea2d4b7f50b2c777a5594815fa71/latest/run-summary.txt), [test results](https://github.com/MakeItRando/Rando/blob/513d538822a3ea2d4b7f50b2c777a5594815fa71/latest/test-results.json), [18-capture visual report](https://github.com/MakeItRando/Rando/blob/513d538822a3ea2d4b7f50b2c777a5594815fa71/latest/visual-report.json) |
| Preview branch `rondo-v031-preview` | [`089bd21`](https://github.com/MakeItRando/Rando/commit/089bd2125ab002b3aa70f8587578e01c2a879a5f) | Generated test artifact; HTML blob `3f09d59b7207a02be3624d044bc06f8d672c0cd9`, 527,599 bytes; branch name does not define candidate version |

The [test preview](https://htmlpreview.github.io/?https://raw.githubusercontent.com/MakeItRando/Rando/rondo-v031-preview/rondo-v031-preview.html) is a candidate surface, not an accepted release. `b752cc6` and its run `34387982105`, evidence `7f9ddf7`, preview `904374d` were an earlier passing correction, subsequently superseded by `cd25bbd`. Older `89fc0d5` material is likewise historical.

## Candidate behavior and implementation boundary

One physical audio engine now supports two resumable logical sessions: Journey keeps its genre, artist, track, route, queue, position, and progress; Global keeps source, track, queue, and position. Navigation alone does not change sessions. Explicit non-Journey play should leave Journey state intact; explicit Journey play should preserve the Global session. The candidate uses `src/ui/playbackContexts.js` and `src/ui/journeyStateGuard.js` compatibility layers. Do not treat this as production architecture: move to store/audio ownership before real catalog integration. `src/ui/discoveryHub.js` is the intended Discover/Genre renderer; old `renderDiscoverView()` remains a competing code path. Release chapter state is not proven independently deep-linkable.

## Still required before the owner test request or merge

1. Independently audit the exact published `3f09d59…` HTML and referenced media over HTTP against the current candidate, with error/resource/accessibility/flow checks. The older 37/37 audit is not evidence for this blob.
2. Inspect all 18 captures from the latest evidence and record a fresh manual result. Automated report zeros do not prove visual acceptance; check desktop, phone, 320px, Light, Reduced Motion and changed playback surfaces.
3. Reconcile draft PR #5 body with its latest head, candidate run, preview, and known limitations. Resolve dirty merge state only after acceptance and under the integration plan.
4. Collect explicit product-owner desktop/phone experience feedback and acceptance; rerun exact-head gates for any source change. Only then consider integration and post-merge QA.

The critical walkthrough: Kairo Vale Journey → play → Discover without interruption → select a Discover track → inspect Global side player/source queue → manually expand Song Room → return to restored Kairo Vale Journey. **Do not call the project ready to test in this documentation-only round.**

## Future dependencies

Real artists/songs, secure accounts, source adapters, rights enforcement, indexed search, and backend are not implemented. Wait for experience acceptance and the owner's implementation-facing legal/source package; confirm territory/platform decisions. Public presence on a service grants no rights. Thousands-first, millions-ready and provider-neutral. Payments excluded from V1. Update this file and every affected specification in the same session whenever code, evidence, decisions, or branch state changes.
