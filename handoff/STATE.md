# Current project state

**Reviewed:** 2026-10-04 (session 2). **Product:** Rondo. **Phase:** **design-first program** (D-048) — design every page before implementation approaches. Playback blockers B-001/B-002 still block any owner testing. **This round:** owner answers recorded (D-045 play-first, D-046 follow = both, D-047 playlists), design program + foundation study A added. No app code changed.

Start with [DESIGN_PROGRAM.md](DESIGN_PROGRAM.md) for design work. Current proposal: study C (2026-10-05, interactive), awaiting owner verdict; anti-slop rules are binding. No AI features (D-050).

## Verdict

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
