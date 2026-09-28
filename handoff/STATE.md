# Current project state

**Reviewed:** 2026-09-28. Verify live GitHub refs/checks before acting. **Product:** Rondo; repository still has legacy `Rando` technical naming. **Current phase:** candidate experience QA and documentation, not accepted production integration.

## Verdict

The candidate in draft [PR #5](https://github.com/MakeItRando/Rando/pull/5) is unmerged. Earlier local-preview CI passed, but 10 owner-supplied PNGs now expose a **user-facing Song Room metadata defect (`undefined`)**, traced to an unset `palette.signal` field in `src/app.js`. See [VISUAL_REVIEW_2026-09-28.md](VISUAL_REVIEW_2026-09-28.md). The review also flags 320px Discover first-screen density/search truncation. Do not invite owner acceptance testing until fixed and fully regated. Earlier exact-preview/manual green claims belong to older source heads.

## Branch and evidence matrix

| Surface | Last verified ref | Status |
| --- | --- | --- |
| `main` | Stable runtime baseline [`eaafc4c`](https://github.com/MakeItRando/Rando/commit/eaafc4c3ad5f4151b9b0852d16f6543737c16821); documentation commits later | Canonical specs and review, no candidate runtime |
| [PR #5](https://github.com/MakeItRando/Rando/pull/5) / `rondo-v031-user-ready` | [`cd25bbd`](https://github.com/MakeItRando/Rando/commit/cd25bbda8b4e92671c9a61fd97352b9eaac6fc1d) | Open draft, unmerged; last reported dirty |
| Candidate CI | [run 34465613545, job 102833363733](https://github.com/MakeItRando/Rando/actions/runs/34465613545/job/102833363733) | Successful local built-preview workflow: install, audit, build/check/unit, 13 browser suites, visual capture. **Not a passing gate for newly discovered defect** |
| Evidence branch `rondo-v032-qa-evidence` | [`513d538`](https://github.com/MakeItRando/Rando/commit/513d538822a3ea2d4b7f50b2c777a5594815fa71) | [run summary](https://github.com/MakeItRando/Rando/blob/513d538822a3ea2d4b7f50b2c777a5594815fa71/latest/run-summary.txt), [test results](https://github.com/MakeItRando/Rando/blob/513d538822a3ea2d4b7f50b2c777a5594815fa71/latest/test-results.json), [18-capture report](https://github.com/MakeItRando/Rando/blob/513d538822a3ea2d4b7f50b2c777a5594815fa71/latest/visual-report.json) |
| Preview branch `rondo-v031-preview` | [`089bd21`](https://github.com/MakeItRando/Rando/commit/089bd2125ab002b3aa70f8587578e01c2a879a5f) | Generated test artifact; HTML blob `3f09d59b7207a02be3624d044bc06f8d672c0cd9`, 527,599 bytes; exact published-preview runtime audit not yet recorded |

The [portable preview](https://htmlpreview.github.io/?https://raw.githubusercontent.com/MakeItRando/Rando/rondo-v031-preview/rondo-v031-preview.html) is a candidate surface, not an accepted release. Earlier `b752cc6` and `89fc0d5` refs are history, not the current QA head.

## Candidate behavior and production boundary

One physical audio engine supports two resumable logical sessions. Journey retains genre, artist, track, route, queue, position and progress; Global retains playback source, track, bounded source queue and position. Navigation alone does not change session. Explicit Global play should preserve Journey; explicit Journey play should preserve Global. Candidate `src/ui/playbackContexts.js` and `src/ui/journeyStateGuard.js` are DOM/event compatibility controllers, not production ownership. Migrate to store/audio before real catalog. `src/ui/discoveryHub.js` is intended Discover/Genre renderer; dormant `renderDiscoverView()` is competing code. Release chapter state is not proven independently deep-linkable.

## Next work, in order

1. Fix Song Room `palette.signal` defect at candidate source, assert metadata never renders `undefined`/`null`, and inspect all affected surfaces. Address compact Discover density/copy if feasible without breaking navigation/playback.
2. Run complete exact-head candidate CI and republish evidence/preview. Independently audit exact published HTML/media over HTTP; local build alone is not sufficient.
3. Inspect all 18 screenshots from the **new** head, including desktop/mobile/320px/Light/Reduced Motion and Global side player; record actual visual result. Current attachment-based review covers only 10 PNGs, not exact Git JPEG bytes or the whole set.
4. Reconcile PR #5 description with new head/results. After gates pass, ask owner to test Kairo Vale Journey → Discover continuity → Global source queue/side player → explicit Song Room → restored Journey on desktop and phone. Obtain explicit acceptance before clean integration/merge and post-merge QA.

## Future dependencies

Real artists/songs, secure accounts, authorized source adapters/territorial rights, indexed search and backend are not implemented. Await experience acceptance and owner's implementation-facing legal/source package; confirm territory/platform. Public availability is not rights clearance. Provider-neutral, thousands first and millions ready. V1 excludes payments. Update this state and affected specs in the same session as every code, decision, evidence or branch change.
