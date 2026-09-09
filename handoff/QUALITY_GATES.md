# Rondo quality gates

Passing automated commands is necessary but not sufficient. This checklist controls product-test requests and merges.

## Current v0.3.2 gate status

**Green for product-owner testing; not accepted or merged.**

Controlling evidence:

- candidate `89fc0d5d352db31ab90ff7d5b25b698db8e8c6cf`;
- successful run [`34332141798`](https://github.com/MakeItRando/Rando/actions/runs/34332141798/job/102403183216), check `102403183216`;
- evidence `dbe315e6ad1687537594a80da566af44645c764f`;
- preview `873fbbeb1d209889250825b054b235b8493b4e05`, exact HTML blob `759a9df34423092ee5843f57f09efe7f4bd43363`;
- all 12 browser suites status `0` plus visual capture success;
- 18/18 final captures manually inspected and accepted;
- 58 changed files reviewed with zero credential-pattern findings;
- 37/37 exact portable-preview assertions passed over HTTP with zero runtime/resource errors.

PR #5 must stay draft and unmerged during testing. Any candidate source change invalidates this exact-head evidence and requires a complete rerun.

## Gate 1 — Source and dependency integrity

From a clean checkout of the exact candidate head:

```bash
npm ci
npm audit --audit-level=high
npm run check
npm run test:unit
npm run build:preview
```

Require deterministic installation, no unexplained high/critical findings, syntax coverage for every runtime/test-policy module, valid catalog/editorial references, reproducible preview output, and no generated QA artifacts on `main`.

## Gate 2 — Enforced browser regressions

Serve the built preview and run the candidate's exact `npm test`/workflow. The workflow must enforce all suites rather than treating individual `continue-on-error` steps as success:

1. App smoke paths
2. Interface quality
3. Discover and Journey routes
4. Product policy
5. Listening flow
6. Song Room
7. Audio behavior
8. Personal surfaces
9. User-ready flow
10. Experience details
11. Full concept flow
12. Release readiness
13. Visual capture

Coverage includes onboarding/profile, global and Discover search, direct Discover, recommendation gating, malformed-state migration, first-use picker, Change genre, four Genre pages, per-genre progress, browser history/titles, Artist Journey/completion, playback truthfulness, queue/repeat/seek/media safety, Song Room modes, authorized/unavailable audio, waveform truthfulness, volume/mute, saves/moments/notes/Library, persistence, desktop/mobile/320px/Light/Reduced Motion.

Never remove an assertion, hide a browser error, or add arbitrary waits merely to obtain green status. Fix the product or the deterministic test contract at the correct layer.

## Gate 3 — Runtime diagnostics

For required non-modal states:

- zero uncaught exceptions and Rondo console errors;
- zero failed required requests or HTTP errors;
- zero broken visible image/audio references;
- zero document horizontal overflow;
- exactly one visible main landmark;
- no nested controls or invisible focusable content;
- no stuck `inert` state after close;
- no duplicate audio element, playback timer, analyser, queue, or route state.

For modal states, the dialog may temporarily replace the visible main in the accessibility tree, but it must contain focus, make the background inert, close with Escape/appropriate outside action, and return focus usefully.

## Gate 4 — Exact portable-preview audit

Audit the exact published HTML blob, not a locally rebuilt approximation.

1. Confirm the Git blob SHA and byte length.
2. Serve over HTTP so relative audio paths match deployment behavior.
3. Confirm all published media objects exist on the exact preview branch.
4. Exercise direct Discover, cold-start gating, search, Sounds, representative playback/Song Room, cross-route playback, first-use Journeys, a non-default genre, Change genre close/focus, Artist Journey, Back/Forward, 320px reflow, Reduced Motion, and timing/metadata layout.
5. Require zero page, console, request, and HTTP errors.

Audit-only media fixtures may be used solely to make local HTTP playback deterministic after the exact repository assets and blob identities are independently verified. Never commit or misrepresent such fixtures.

## Gate 5 — Manual visual QA

Inspect every rendered image, not only report JSON. The v0.3.2 final matrix contains 18 named captures:

1. desktop Discover;
2. desktop Discover lower page;
3. desktop Discover Sounds;
4. desktop Journey picker;
5. desktop Hip-Hop Genre page;
6. desktop Hip-Hop songs;
7. desktop Artist Journey;
8. desktop Song Room About;
9. desktop Song Room Lyrics;
10. desktop Song Room Up next;
11. Light Discover;
12. mobile Discover;
13. mobile Journey picker;
14. mobile R&B Genre page;
15. mobile R&B Artist Journey;
16. mobile Change genre/directory state;
17. 320px Discover;
18. Reduced Motion Song Room.

Also spot-check unavailable media, missing artwork, long names, dense metadata, empty/populated Library, Profile/onboarding, and changed surfaces whenever related source changes.

Accept only when there is no overlap, clipping, detached control, unreadable text, overflow, filler-like repeated artwork, excessive motion, covered content, undersized required target, or desktop/mobile identity drift.

## Gate 6 — UX walkthrough

1. Open Discover and find/play music without choosing a genre.
2. Verify Made for you is absent on cold start and appears only after genuine listening.
3. Search for songs, artists, and releases; open Sounds.
4. Play, pause, resume, seek, change volume, mute, and unmute.
5. Navigate while playback continues.
6. Enter Journeys first-use, choose a genre, start an Artist Journey, and Change genre without losing progress.
7. Return to Discover without replacing the active Journey.
8. Open a release and all Song Room modes.
9. Save track/release/artist/moment/note and reopen from Library.
10. Reach artist completion and verify explicit boundary confirmation.
11. Reload and restore meaningful continuity without autoplay.
12. Repeat on phone/narrow viewport and keyboard-only.

Ask whether the next action is obvious, Discover is useful, Journeys are deeper without confusion, Song Room supports rather than competes with music, and copy sounds like user language rather than strategy.

## Gate 7 — Accessibility

Require semantic headings and landmarks, keyboard access, visible focus, dialog focus containment/return, Escape behavior, accurate names/roles/values/current/pressed/selected states, complete slider keyboard behavior, non-color states, 44×44px important targets, Reduced Motion, zoom/reflow, and screen-reader spot checks for navigation, picker, player, and errors.

## Gate 8 — Security, privacy, rights, and scale

- scan changed source/configuration for secrets and production personal data;
- keep provider/payment credentials out of client code and history;
- record playback/content provenance and authorization boundaries;
- use no unlicensed commercial recordings, artwork, biographies, or lyrics;
- preserve local-only prototype account/note language;
- require production threat/privacy/rights review;
- use stable IDs, normalized provider-neutral models, bounded listener state, bounded/cursor-paginated APIs, indexed/debounced search, and one shared data-driven Genre implementation;
- never deliver or flatten the complete production catalog in the client;
- never add payments to V1.

## Gate 9 — Documentation and release evidence

Update in the same work session:

- `handoff/STATE.md` with exact candidate/evidence/preview/run status;
- `handoff/DECISIONS.md` for changed choices;
- product/design/architecture/data/production docs for changed contracts;
- this checklist for changed coverage;
- `handoff/SNAPSHOTS.md` for visual evidence;
- PR description with exact commands, results, limitations, and preview URL.

Evidence must identify the exact candidate, environment, command results, visual matrix, known limitations, preview, security review, and user approval/merge state.

## Gate 10 — Test request and merge

Ask the user to test only when Gates 1–9 pass and repository evidence agrees. Keep the PR draft/unmerged during testing. Merge only after explicit acceptance, then update `main`, retain useful tests, remove test-only integration material where appropriate, run the post-merge gate, update handoff/release notes, and only then begin the approved real-system phase.
