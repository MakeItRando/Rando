# Current project state

**Reviewed:** 2026-10-03 (full repository audit, no app code changed). Verify live GitHub refs/checks before acting. **Product:** Rondo; repository still has legacy `Rando` technical naming. **Current phase:** candidate experience QA, not accepted production integration.

## Verdict

Pre-update `main` was `c0a11fe`; its stable runtime remains `eaafc4c` followed by canonical documentation. The candidate in draft [PR #5](https://github.com/MakeItRando/Rando/pull/5) is unmerged and **red**. Head `9046918` failed [CI run 36836698618](https://github.com/MakeItRando/Rando/actions/runs/36836698618/job/110285723482): 12 browser suites and visual capture passed, **Song Room failed** with `Desktop Credits: Song Room rendered a placeholder value "undefined"` ([log](https://github.com/MakeItRando/Rando/blob/6f68fdabd5bd4e26b50335aa6c486e01a2ac31ec/latest/test-logs/song-room.log)). The 2026-09-28 Song Room `undefined` defect is **not fixed**, despite the 2026-10-01 commit messages claiming it was. Do not invite owner testing.

## 2026-10-03 verification

A clean local candidate recheck passed install, zero-vulnerability audit, preview build, static/unit, smoke, interface, routes, product policy, playback-context, and listening checks, then reproduced the same Song Room `undefined` failure. Stable `main` passed preview build, static/unit, and all six browser suites, but `npm audit --audit-level=high` failed on Playwright advisory `GHSA-7mvr-c777-76hp`. See [AUDIT_2026-10-03.md](AUDIT_2026-10-03.md). Dependency remediation is required engineering work for the next integration candidate.

## Root cause (verified by reading head source)

1. `src/app.js` `renderFullPlayer()` still writes `` `${audioMeta(track)} · ${palette.signal} · ${playbackSource(track)}` ``. `getArtworkPalette()` has no `signal`. On open, `renderNowPlaying()` runs `syncAppearance()` afterwards and overwrites the line correctly, so About looks fine; any mode switch calls only `renderFullPlayer()`, so Credits/Lyrics/Extra/Up next show `undefined`.
2. Commits `38590a2` and `4f4c19e` describe a `songRoomMetaText()` single writer and desktop `room → story` resolution in `src/app.js`, but **those `src/app.js` changes never landed**. `polish.css`, test changes and `index.html` link did land.
3. `9046918` added `src/ui/runtimeQualityGuard.js`, a document-wide `MutationObserver` that rewrites the DOM after render. Its regex is double-escaped in a literal (`/\\b(undefined|null|NaN)\\b/`), so it matches a literal backslash and **never strips anything**. It also contradicts AGENTS.md (no new DOM interception glue). It should be deleted, not repaired.

## Correct fix (next session)

In `src/app.js`: one metadata writer (`songRoomMetaText(track)`) used by both `syncAppearance()` and `renderFullPlayer()`; resolve `room` to `story` on desktop inside `renderFullPlayer()`; render play/pause in `#fullPlay` with the shared SVG paths instead of `Ⅱ`/`▶`. Delete `runtimeQualityGuard.js` and its import in root `app.js`. Rerun the full workflow, then review all 18 captures from the new head.

## Branch and evidence matrix

| Surface | Last verified ref | Status |
| --- | --- | --- |
| `main` | Runtime baseline [`eaafc4c`](https://github.com/MakeItRando/Rando/commit/eaafc4c3ad5f4151b9b0852d16f6543737c16821); docs after | Canonical specs; no candidate runtime |
| [PR #5](https://github.com/MakeItRando/Rando/pull/5) / `rondo-v031-user-ready` | `9046918` | Open draft, 206 commits; body reconciled to `9046918` on 2026-10-03; mergeability was previously dirty and returned unknown during the audit |
| Candidate CI | [run 36836698618](https://github.com/MakeItRando/Rando/actions/runs/36836698618/job/110285723482) | **Failed** (song_room) |
| Evidence `rondo-v032-qa-evidence` | [`6f68fda`](https://github.com/MakeItRando/Rando/commit/6f68fdabd5bd4e26b50335aa6c486e01a2ac31ec) | Evidence for `9046918`; [run summary](https://github.com/MakeItRando/Rando/blob/6f68fdabd5bd4e26b50335aa6c486e01a2ac31ec/latest/run-summary.txt) |
| Preview `rondo-v031-preview` | `089bd21` | **Stale**: built from `cd25bbd`. The workflow publishes previews only after the quality gate passes, so it was not updated |

## Candidate behavior and production boundary

Unchanged from prior record: one physical audio engine, two resumable logical Journey/Global sessions; `playbackContexts.js`, `journeyStateGuard.js` and now `runtimeQualityGuard.js` are compatibility glue, not production ownership. `src/ui/discoveryHub.js` is canonical Discover/Genre; dormant `renderDiscoverView()` remains competing code and is still imported by `src/app.js`.

## Next work, in order

1. Apply the correct fix above at source; delete the guard; full CI green at the new exact head.
2. Manual review of all 18 new captures; audit the exact published preview over HTTP.
3. Rewrite PR #5 body to the new head and results.
4. Owner desktop/phone test, then explicit acceptance before merge.

## Process lesson

A commit message is not evidence. After every push, re-read the changed file at the new SHA and confirm CI on that SHA before reporting a fix.

## Future dependencies

Real artists/songs, secure accounts, authorized adapters/territorial rights, indexed search and backend are not implemented. Await experience acceptance and the owner's legal/source package. V1 excludes payments. Update this file in the same session as every code, decision, evidence or branch change.
