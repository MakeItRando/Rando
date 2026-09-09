# Current project state

**Last updated:** 2026-09-09 10:31 Asia/Calcutta  
**Repository:** [MakeItRando/Rando](https://github.com/MakeItRando/Rando)  
**Canonical name:** Rondo everywhere  
**Work mode for this session:** repository audit and documentation only; no product-code changes

## Branch matrix

| Branch | Reference | Purpose | Merge state |
| --- | --- | --- | --- |
| `main` | Current HEAD; application baseline `eaafc4c`, followed only by documentation commits in this session | Stable v0.3.0 runtime plus canonical specifications and handoff | Current default branch |
| `rondo-v031-user-ready` | `305e9a3` | v0.3.2 user-experience candidate | Draft PR #5; unmerged |
| `rondo-v031-preview` | `bef0535` | Portable test preview | Test-only; keep off `main` |
| `rondo-v23-song-room` | `a5e4905` | Historical v0.3 Song Room work | Merged through PR #3 |
| `rondo-v22-immersive` | `ea05c73` | Historical immersive-listening work | Merged through PR #2 |

Always verify the live `main` HEAD before new work. This file avoids a self-referential main SHA because updating it creates a new commit; exact candidate and runtime-baseline SHAs remain fixed evidence.

## Current release split

- **Stable `main`:** v0.3.0 runtime, artwork-adaptive Song Room, fictional 8-artist/15-release/39-track catalog, six authorized Rondo Originals demos, local saves/moments/notes, playback, queue, volume, and responsive states. Later commits in this session changed documentation only.
- **Candidate:** v0.3.2, direct song-first Discover, Journey-owned genre selection, route-backed Genre Journey pages, independent Journey continuity, revised Song Room, expanded QA, and portable preview.
- **Production system:** not started. Real artists, authorized songs, production accounts, provider/source connectors, catalog ingestion, backend, large-scale search, and operations begin only after experience approval.
- **Payments:** explicitly excluded from V1.

## Confirmed owner decisions — 2026-09-09

1. **Rondo everywhere.** Normalize repository, package, infrastructure, domain, and future store naming before production through a planned migration; do not break current prototype URLs casually.
2. **Broad catalog.** The intended system should support artists and genres broadly and must be source/provider neutral.
3. **Scale.** Design for thousands of songs at initial rollout and millions without a domain or UX rewrite. Never ship the full catalog to the browser.
4. **Legal/source plan.** The product owner will provide the legal acquisition and integration package before real-source implementation. Public availability in another app is not treated by code as authorization.
5. **No V1 payments.** Do not build subscriptions, checkout, tips, artist billing, payment entitlements, taxes, refunds, disputes, or payouts into V1.

## QA state

- Draft PR: [#5 — Rondo v0.3.2 Discover and Song Room test candidate](https://github.com/MakeItRando/Rando/pull/5)
- PR description references an earlier successful run: [34223044605](https://github.com/MakeItRando/Rando/actions/runs/34223044605/job/102050449015).
- Latest observed check on head `305e9a3`: [34268766772](https://github.com/MakeItRando/Rando/actions/runs/34268766772/job/102204821921) — **failure**.
- Combined status endpoint showed no final commit status contexts; the check-run result is the controlling evidence.
- Therefore the candidate is **not currently test-ready**, despite older “ready” language in the previous conversation and PR body.

## Work completed in this documentation session

- Audited repository identity, permissions, branches, commit history, PRs, issues, root tree, source modules, state, audio, view rendering, catalog, build path, and test surfaces.
- Recovered prior product direction from the four supplied screenshots because the linked previous chat could not be loaded and session search was unavailable.
- Added root `AGENTS.md` plus the requested `agent.md` entry point.
- Added this handoff system, page specifications, roadmap, quality gates, snapshot transcript, and unresolved-decision register.
- Updated canonical product, design, architecture, data-model, and production-system documents on `main`.
- Recorded the owner decisions above across the decision log, product spec, production plan, roadmap, architecture, and data model.
- Did not modify application code, candidate code, tests, preview files, or media.
- Did not merge PR #5 or tell the user to test.

## Immediate next action

When development resumes:

1. Read the full handoff and owner decisions.
2. Re-read the latest PR #5 diff and candidate head; do not assume the old PR description is current.
3. Diagnose the latest failing check without weakening assertions.
4. Run the complete gate in `QUALITY_GATES.md` from a clean install.
5. Inspect every required visual state; fix all failures and regressions.
6. Verify the accepted UI still supports future paginated/indexed catalog data rather than hard-coded prototype counts.
7. Update this file and QA evidence.
8. Only then ask the user to test the candidate.
9. Keep PR #5 draft and unmerged until explicit approval.

## Known blockers and risks

- Latest candidate QA is red.
- The previous chat URL was not accessible; screenshot evidence is preserved in `SNAPSHOTS.md`.
- Launch territory/platform and the concrete legal/source integration package are future production inputs.
- Main runtime intentionally lags the candidate while testing is pending; documentation must keep that split explicit.
- The candidate branch has a long diagnostic commit history. Preserve evidence now; squash or otherwise clean history only when preparing the accepted merge.
- The candidate repeat-state validation appears inconsistent with player repeat modes (`off` versus `track`) and requires verification in the development round.
