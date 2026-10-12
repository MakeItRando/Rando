# Current project state

**Updated:** 2026-10-11 (Home E rev 22). **Product:** Rondo. **Phase:** design-first program (D-048) — every page is designed and approved in one interactive study before the real apps are built (D-062 desktop + phone).

## Right now

- **Prototype:** Home E study, rev 22 — https://makeitrando.github.io/Rando/design/studies/2026-10-05-home-e/home.html (code: `design/studies/2026-10-05-home-e/`). `check.mjs` (browser test suite, ~70 feature groups) **PASS on a fresh clone of `main`, 2026-10-10.**
- **Last QA pass (rev 19.1):** every screen × desktop/phone × dark/light checked for script errors, overflow, broken text, duplicate ids, unnamed buttons; every visible button clicked on 8 screens × desktop/phone — zero errors. Bugs found and fixed are listed in [SESSION_2026-10-07.md](SESSION_2026-10-07.md) (rev 19.1).
- **Rev 19.2 (readability):** grey text and light-mode orange text were below the 4.5:1 readable minimum — colour tokens fixed (`--t3`, new `--acct`), stamp labels fixed; re-audited, all pass. Checked by automated audit + pixel sampling.
- **Rev 19.3 (by-eye review, 2026-10-11):** screenshots of every main screen reviewed by eye (desktop + phone, light + dark). Fixed: stray box around phone filter chips, cut-off 4th Following ring, Home "Next" vs Journeys "Now" for the same station. Remaining weak spots listed in BACKLOG ("Found in the by-eye review").
- **Rev 20 (2026-10-11):** Song room fixes (D-088 proposal) — Credits → Songs with <name>, About one line, first ♥ → Add a note, phone icon labels. Rev 20.1: ♥ in the player bar + hero heart bug fixed. See NOW_PLAYING.md.
- **Rev 21 (2026-10-11):** Playlist page basics (D-089 proposal) — one list per playlist, Liked = liked, Remove + Undo, drag to reorder, Find, real New playlist. See PLAYLISTS.md.
- **Rev 22 (2026-10-11):** Artist Journey page (D-090 proposal) — station strip (move along the Journey without the map), Starts here / Continue here, one real Follow state + Undo; sidebar Liked count fixed. See JOURNEYS.md.
- **Next:** verdicts on D-088 / D-089 / D-090 → Library (owner, 2026-10-11). Full ordered list + every owner verdict: [BACKLOG.md](BACKLOG.md).
- **App runtime on `main`** is still the old v0.3.0; PR #5 (v0.3.2) is an old draft with open bugs B-001/B-002 — it will not be merged; the app gets rebuilt on the approved design.

## Page status

| Page / feature | Study rev | Spec | Status |
| --- | --- | --- | --- |
| Home (desktop + phone) | 3–4 | docs/specs/HOME.md | Approved (D-058, D-065) |
| Explore + search, Dig, Rabbit hole, Save a tune | 4–6 | EXPLORE.md, HOME.md § Dig | Approved (D-061, D-066); additions built (D-067) |
| Now Playing / Song room (lyrics, Up next, Credits, About) | 7, 16–16.2, 20 | NOW_PLAYING.md | Approved (D-068, D-084); rev 20 fixes proposed (D-088) |
| Journeys + stamps / passport | 8–9, 22 | JOURNEYS.md, STAMPS_PASSPORT.md | Approved (D-069, D-070); rev 22 Artist Journey page proposed (D-090) |
| Listening flow (radio, Keep going, Pick up, Add similar) | 10 | FEATURE_PLAN.md | Approved (D-071) |
| Playlist page + Radio page | 11, 17, 21 | PLAYLISTS.md | Radio/playlist page approved (D-072); refresh + Mixtapes approved (D-085); rev 21 basics proposed (D-089) |
| Artist page | 12–12.1 | ARTIST.md | Approved (D-074, D-075) |
| Release page | 13 | RELEASE.md | Approved (D-076) |
| Sidebar + Pin to top | 14, 18 | SIDEBAR.md | Approved (D-078, D-080, D-086) |
| Moments | 15 | MOMENTS.md | Approved (D-082) |
| About auto facts | 15.3 | NOW_PLAYING.md | Approved (D-083) |
| Your month | 19–19.1 | YOUR_MONTH.md | Approved (D-087) |
| **Library** | — | — | **Next** |
| Profile & settings, First run | — | — | Not started |

## Repo (checked live on GitHub, 2026-10-10)

- **`main`** — everything: docs, handoff, design studies, old v0.3.0 app. All design work is pushed straight to `main` (owner delegates, D-059).
- **Open PRs:** only **#5** "Rondo v0.3.2" (draft, branch `rondo-v031-user-ready`, last updated 2026-10-04). Old app candidate with bugs B-001/B-002 — kept for reference, not to be merged; the real apps get built fresh on the approved design. PR #9 (Living Record) closed/rejected.
- **Open issues:** none.
- **Other branches (old, kept for history, nothing to merge):** `design/living-record-study-01` (rejected study), `docs/candidate-green-2026-10-03`, `docs/reconcile-pr5-status`, `docs/repo-audit-2026-10-03`, `rondo-v22-immersive`, `rondo-v23-song-room`, `rondo-v031-preview`, `rondo-v031-user-ready` (PR #5), `rondo-v032-qa-evidence`. The tools I have can't delete branches; the owner can delete them on GitHub any time. Nothing on them is needed.

## Earlier notes (history, kept as written)

- `main` = canonical docs + design studies + stable v0.3.0 app runtime. Latest design work: [Home E rev 5 — Explore proposal (D-066)](../design/studies/2026-10-05-home-e/README.md) — try it at https://makeitrando.github.io/Rando/design/studies/2026-10-05-home-e/home.html
- **The 2026-10-07 morning session was lost** (clean scrubber, Dig feature, walkthrough, docs overhaul never pushed). See [SESSION_2026-10-07.md](SESSION_2026-10-07.md). Its scrubber + Dig work was redone and pushed as Home rev 4.
- Owner feedback (scrubber untidy; "boring… no vibe to explore") addressed in rev 4: clean scrubber, Dig, phone layout.
- Review findings: Home has no phone layout (teen audience = phone first); see [REVIEW_2026-10-07.md](REVIEW_2026-10-07.md).
- Owner answered Q11–Q15 (D-060..D-064). **Home rev 4 approved** (D-065, "thats perfect"). **Explore approved** (D-066, [EXPLORE.md](../docs/specs/EXPLORE.md)); 4 phone tabs; Most kept in Dig hidden until enough listeners.
- **Built (D-067, Home E rev 6):** search results page, Rabbit hole, Save a tune — awaiting owner look. `check.mjs` PASS. Saved for later in PRODUCT_IDEAS § Explore backlog: Song of the day, Decades dial. Original candidates: full search results page (recommended), Rabbit hole trail (hop Go from → Go from, save the trail as a playlist), Save a tune as a playlist, Song of the day (one pick for everyone, V1-backend), Decades/era dial (needs year metadata). `check.mjs` PASS.

- **Rev 10 (D-071 confirmed, 2026-10-07):** [FEATURE_PLAN.md](../docs/specs/FEATURE_PLAN.md) arranges all H/J/E ideas without overcrowding; built Song radio, Keep going, Pick up (in the Stage), Add similar. `check.mjs` PASS. Awaiting owner verdict; next: V1.1 items from the plan (Rewind toggle, Your mixes, New for you, Add songs that fit, Journey map views) or remaining pages (Artist, Library, Release, Playlists, Profile).

- **Rev 11 (D-072 confirmed):** Playlist page + Radio page (face-down surprise cards), radio reasons removed. Owner: "thats way better".

- **D-073:** polish/motion deferred to the real apps ([MOTION.md](../docs/MOTION.md)). **Rev 12 Artist page approved (D-074)**; rev 12.1 final touches (D-075 confirmed). **Rev 13 Release page approved (D-076); D-077 clarity rule (every feature, easy to understand); rev 13.1 credits → song menu. Rev 14–14.1: sidebar with character (D-078 confirmed: Journey card, Following 3-wide rings, list playlists, collapse button) + numbers out of sight / Now Playing About (D-079 proposal). Rev 14.2–14.3 sidebar progress line, Recently played, drop to add, dividers (D-080 confirmed). Rev 14.4 playing rises to top, Deep cuts, Song notes (D-081: all ideas approved). Rev 15 Moments (D-082 proposal); rev 15.1–15.2 remove moments (Already saved · Remove, ×; player look unchanged) + Artist moments. Next: Mixtapes + Playlist page refresh → Pin to top.** Next: Library, Profile/Settings, First run. Next pages: Release, Library, Profile/Settings, First run.

## Next actions (in order) — superseded by [BACKLOG.md](BACKLOG.md) (2026-10-10)

1. ~~Owner answers Q11–Q15~~ (D-060..D-064).
2. ~~Home rev 4~~ approved (D-065). ~~Explore~~ approved (D-066). ~~Explore additions~~ built (D-067). **Now Playing approved** (D-068, "perfect for now; changes later as we use it"). **Journeys built** as Home E rev 8 (D-069 proposal, docs/specs/JOURNEYS.md, check.mjs PASS) — **approved** ("yes i like that, the stamp idea is good"). **Stamps, passport, share cards built** (Home E rev 9, D-070, docs/specs/STAMPS_PASSPORT.md); all J1–J16 / E1–E8 approved as direction, the rest specced for later. Owner: further changes after real users give feedback. Next: owner review of rev 9, then the next page in DESIGN_PROGRAM.
3. ~~Now Playing page~~ (D-068) → **Journey pages** (picker, genre, artist journey; desktop + phone) → remaining pages (order in [DESIGN_PROGRAM.md](DESIGN_PROGRAM.md)).
4. After all key pages are approved: choose the build approach, rebuild the app on the approved design, fix B-001/B-002/B-003 inside that rebuild, full quality gates, then ask the owner to test.

## App candidate (unchanged since 2026-10-04)

### Verdict

**Do not request acceptance testing or merge PR #5 yet.** Existing candidate automation passes, but fresh read-only probes reproduced wrong Global natural-end progression and one-result Search queue leakage. See [AUDIT_2026-10-04.md](AUDIT_2026-10-04.md). Earlier blanket test-ready language is superseded, not proof of full listening-session correctness.

Original Rondo's product model (Discover/Journeys/Song Room content, two playback sessions) is kept; its visual layer is being modernized under D-048. Living Record study PR #9 is rejected and closed, never merged. See [DESIGN_RESET_2026-10-04.md](DESIGN_RESET_2026-10-04.md).

## Exact evidence and branch boundary

| Surface | Exact ref | Status |
| --- | --- | --- |
| Audited main baseline | `c656489a2892c9e6864d8e0a03b74d967e68bb20` | Stable v0.3.0 runtime; this round adds docs/archive commits only; resolve current main live |
| Candidate / PR #5 | `d9bc54f8db83efc1cc3360266391cd5d0a3442a0` | Open draft, unmerged, based on main baseline; not synchronized with later docs-only main commits |
| Candidate CI | run `37125854133`, job `111210924804` | Passed at exact candidate head |
| Archived evidence | `d1635f515cc81e7d82b614f483e7894e8a70b10f` | 13 suites and visual success; not coverage of new blockers |
| Portable preview | `74272e6e1e05f6abcfde1b7df5fcb5bf3662c52f` | Current unchanged runtime build; HTML blob `0405bc5a0ba00a03b492dd29af83c38d39019e95` |
| HTML identity | 532629 bytes; SHA-256 `39db95b35f3a2421631e2178417a08e4af9d8bda0774e4cb4f3be68fd1ef38b5` | Git-published bytes and local candidate rebuild match this round |
| Fresh local checks | unchanged `d9bc54f` | Install, zero-reported-vulnerability candidate audit, static, unit/migration, build, all 13 browser suites passed; 18 automated captures, 0 failures/runtime errors |
| Main dependency audit | audited baseline | **1 high Playwright advisory remains** |
| Visual review this round | exact archived contact sheet + full-size About/mobile Discover | Original identity retained; not exhaustive accessibility or full-size 18-state acceptance |
| Owner acceptance | not given | Prior onboarding/design criticism remains unresolved |

The source-level Song Room metadata/desktop-mode/SVG/320px/query-first/canonical-preview fixes at `742abac` remain implemented. Later integration head `d9bc54f` added documentation synchronization, not another runtime redesign.

## Blockers and next development sequence

1. **B-001:** Global natural end changes `a101` → artist track `a102`, not queued `g101`; global selected ID stays stale. Unify end/buttons/media actions under active session ownership and add regressions.
2. **B-002:** a single Search result silently expands to unrelated 20-item Discover queue. Respect source boundaries and deliberate queue endings.
3. **B-003:** main still carries high-risk Playwright development dependency; resolve in a deliberate dependency/integration pass.
4. Verify first-class session persistence, Media Session controls, and legacy renderer caller migration. Avoid new DOM repair guards.
5. Refine onboarding within original design only after first-listen/setup contract is clarified. No rejected concepts.
6. Reconcile current main docs and candidate, run complete exact-head gates plus added edge cases, publish aligned preview/evidence, manually review desktop/mobile/onboarding/Global player/Library/Profile/zoom/reduced-motion states.
7. Only then invite owner desktop/phone testing. Acceptance → deliberate merge → post-merge QA → secure foundation and authorized catalog phase.

## Production boundary and continuity

Fictional 8 artists, 15 releases, 39 tracks, four playable genres and six original 32-second demo recordings; other tracks can be simulated timelines. Browser-local profile/saves/notes/progress are not accounts or cloud sync. No real ingestion, backend, production search, territory enforcement or payments. V1 excludes payments.

Update this state, affected page/architecture specs, decisions, QA/media index, roadmap and handoff report in the same session as every meaningful change. Label proposal, implementation, automated pass, manual review, owner acceptance, merge and post-merge verification separately. Preserve history and exact SHAs; never convert green checks into a promise of perfection.

## Design debt (owner, 2026-10-07)
- Main pages (Home, Explore, Journeys) look good. **Playlist page, Radio/other sub-pages and the sidebar feel boring / old-fashioned** and need a character pass to reach main-page level — not only motion polish. Must stay simple (D-077).
