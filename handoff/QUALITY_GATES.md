# Rondo quality gates

A clean automated workflow is necessary but not a release certificate. Source, locally tested build, exact published preview, manual visual review, owner decision, and merged runtime are separate states.

## Current candidate status (2026-10-03 audit)

- Candidate `9046918` on open draft [PR #5](https://github.com/MakeItRando/Rando/pull/5) is **red**.
- [Run 36836698618](https://github.com/MakeItRando/Rando/actions/runs/36836698618/job/110285723482) failed in Song Room because Credits renders `undefined`. Evidence `6f68fda` records 12 browser suites and visual capture succeeding before the enforced aggregate gate failed.
- A local 2026-10-03 clean recheck reproduced the failure after install, zero-vulnerability audit, preview build, static/unit, smoke, interface, routes, product policy, playback-context, and listening checks passed.
- Preview `089bd21` is stale and represents older `cd25bbd`. No current-head published artifact exists; therefore an exact-preview audit and current-head manual capture review cannot pass.
- Stable `main` build/static/unit/all six browser suites passed locally on 2026-10-03, but its dependency audit failed on high-severity Playwright advisory `GHSA-7mvr-c777-76hp`.
- Owner acceptance and merge remain pending. Do not request testing or claim readiness.

## Gate 1: source/dependencies

From a clean checkout of the exact candidate head: `npm ci`, `npm audit --audit-level=high`, `npm run check`, `npm run test:unit`, `npm run build:preview`. Verify deterministic build, package/lock coherence, referenced catalog records/media, no secrets or production personal data, and no generated QA artifacts committed to main.

## Gate 2: enforced browser behavior

Serve the built preview over HTTP, then run the candidate's enforced `npm test`/workflow. Required 13 browser suites: smoke, interface quality, Discover/Journey routes, playback-context isolation, product policy, listening, Song Room, audio, personal surfaces, user-ready, experience, full concept, release readiness. Visual capture is a separate workflow step. Confirm failures actually fail the workflow; do not suppress an assertion or add arbitrary sleeps just to make green.

Test direct Discover, genuine-history recommendation gating, global/search/Sounds, first-use and Change genre picker, all four prototype genres, Artist Journey/completion, source-derived queue, Journey/global isolation and restoration, Release/Library/Profile, save/moments/notes, migration, repeat/seek/volume/media fallback, Song Room modes, Back/Forward, reload without autoplay, mobile and keyboard.

## Gate 3: runtime and accessibility diagnostics

No uncaught exception, Rondo console error, required failed request/HTTP error, broken visible media, document overflow, nested controls, invisible focus targets, stranded inert background, or duplicate audio element/engine/timer/analyser. Exactly one visible main in ordinary page states; modal states may replace it while dialog focus is contained, Escape works, and focus returns usefully. Inspect headings/landmarks, `aria-current` and control names/values, slider keys, 44px critical targets, non-color states, screen-reader spot checks, zoom/reflow and Reduced Motion.

## Gate 4: exact published-preview audit

Independently identify published HTML Git blob SHA and byte count, then serve **those bytes** with the exact referenced media objects over HTTP. Exercise direct Discover, recommendation gating, search/Sounds, playback, two-session switching and Journey restoration, queue, explicit Song Room expansion, first-use picker, non-default genre, close/focus, Back/Forward, Library/Release paths, 320px, Reduced Motion and metadata/time layout. Record page/console/network/HTTP errors and media-identity checks. Never substitute a locally rebuilt HTML file and call it the published blob. If deterministic audit-only media fixtures are needed, identify them as such and first verify repository media separately.

## Gate 5: manual visual review

Open all [18 latest source captures](https://github.com/MakeItRando/Rando/tree/513d538822a3ea2d4b7f50b2c777a5594815fa71/latest/screenshots), plus [contact sheet](https://github.com/MakeItRando/Rando/blob/513d538822a3ea2d4b7f50b2c777a5594815fa71/latest/visual-contact-sheet.jpg). They cover desktop Discover/Sounds/Journey/Artist/Song Room, Light, mobile Discover/picker/R&B/artist/Change genre, 320px, and Reduced Motion. Record who inspected, date, exact image ref, outcome, and defects. Spot-check changed playback context/side player, long titles, unavailable audio/art, dense metadata, empty/populated Library and Profile. Reject overlap, clipping, detached controls, illegible text, covered content, motion overload and mobile identity drift. Automated report zeros are not manual acceptance.

## Gate 6: owner UX walkthrough

Once Gates 1-5 and evidence alignment are complete, ask the product owner to test desktop and phone: Kairo Vale Journey → play → Discover continuity → select Discover song → check source-specific Global side player/queue → manually expand Song Room → return to saved Kairo Vale route/track/progress. Also assess direct Discover usefulness, search/Sounds, release, Library and keyboard/narrow layouts. Record explicit accept/reject and specific feedback; do not infer approval from silence.

## Gate 7: security, rights and scale

Inspect changed source/config/patches for credentials, production personal data and unauthorized media/lyrics/art; source provenance and rights/territory are first-class, not implied by public URLs. Treat a high-severity dependency audit as a failed gate unless a time-bounded, owner-visible exception records impact, mitigation, and upgrade plan. Before real-system work: threat/privacy review, server-side secrets/authorization, stable IDs, bounded/cursor APIs, indexed/debounced/cancellable rights-aware search, bounded listener refs, and lazy assets. No complete catalog browser JSON and no V1 payments.

## Gate 8: release evidence and merge

Update [STATE.md](STATE.md), [SNAPSHOTS.md](SNAPSHOTS.md), affected specs, and PR description with exact candidate SHA, commands/results, workflow, preview blob, visual review, exceptions, secret review, owner decision and merge status. For any candidate source change, rerun the entire gate and republish exact-head evidence. Resolve dirty PR integration after acceptance, then post-merge gate and handoff update. Never attach an older green result to a newer source head.
