# Rondo quality gates

This is the release checklist for product candidates. Passing automated commands is necessary but not sufficient.

## Current gate status

**Red.** The latest observed PR #5 check on candidate head `305e9a3` failed. Do not ask the user to test and do not merge until a later full run passes and its visuals are inspected.

## Gate 1 — Source and dependency integrity

From a clean checkout of the exact candidate head:

```bash
npm ci
npm audit --audit-level=high
npm run check
npm run test:unit
npm run build:preview
```

Requirements:

- deterministic lockfile install;
- no high/critical audit findings without an explicitly documented exception;
- syntax checks cover every runtime module;
- unit tests validate all catalog/editorial references;
- build output is reproducible and contains required local assets;
- no generated previews or QA artifacts are accidentally committed to `main`.

## Gate 2 — Browser regressions

Start the built preview:

```bash
npm run serve
```

Then run:

```bash
RONDO_URL=http://127.0.0.1:4173/preview-test.html npm test
```

Candidate coverage must include:

- onboarding and profile editing;
- global search;
- direct Discover entry;
- Journey first-use picker and Change genre;
- all four Genre pages;
- independent per-genre progress;
- browser Back/Forward and titles;
- Artist Journey and completion;
- direct/release/artist playback;
- Play/Pause/Resume truthfulness;
- queue, previous/next, repeat, seeking, media-session safety;
- Song Room modes and focus;
- authorized audio and unavailable-audio fallback;
- waveform/analyser truthfulness;
- volume sync, mute, and restore;
- saves, moments, notes, Library deep links, and persistence;
- desktop, mobile, 320px, Light, and Reduced Motion.

Do not make a failing test pass by deleting the assertion, hiding errors, or replacing deterministic waits with arbitrary long delays. Fix the product or the test contract at the correct layer.

## Gate 3 — Runtime diagnostics

For every required state:

- zero uncaught exceptions;
- zero console errors caused by Rondo;
- zero broken visible images/audio references;
- zero document horizontal overflow;
- one visible main landmark outside modal states;
- no nested interactive controls;
- no invisible focusable content;
- no stuck inert background after close;
- no duplicate playback timers, audio elements, or analyser source nodes.

## Gate 4 — Manual visual QA

Render and inspect each image, not only the report JSON:

1. desktop Discover above the fold;
2. desktop Discover full page;
3. desktop search/results state;
4. desktop Journey picker;
5. each Genre page;
6. desktop Artist Journey;
7. release page;
8. Song Room Room/About;
9. Song Room Lyrics;
10. Song Room Credits/Extra/Up next;
11. Library empty and populated;
12. Profile/onboarding;
13. Light appearance;
14. 390px Discover;
15. 390px Journey picker and Genre page;
16. 390px Song Room;
17. 320px compact shell and Song Room;
18. Reduced Motion playback state;
19. unavailable media and missing artwork;
20. long names and dense metadata.

Visual acceptance:

- no overlap, clipping, detached controls, or unreadable text;
- no oversized display type that makes the app feel like a poster;
- content hierarchy is clear within seconds;
- artwork is specific and does not look duplicated or generated as filler;
- motion is restrained and meaningful;
- tap targets are at least 44×44px where required;
- contrast meets WCAG AA for text and meaningful controls;
- fixed navigation/player layers never cover required content;
- desktop and mobile feel like the same product, not separate mockups.

## Gate 5 — UX acceptance walkthrough

Use the app naturally, not only selectors:

1. Open Discover and find something to play without choosing a genre.
2. Search for a song, artist, and release.
3. Play, pause, resume, seek, change volume, mute, and unmute.
4. Navigate while playback continues.
5. Enter Journeys as a first-time user, select a genre, and start.
6. Change genres and verify earlier progress remains.
7. Return to Discover and verify the active Journey remains intact.
8. Open a release, Song Room, Lyrics, Credits, Extra, and Up next.
9. Save a track, release, artist, moment, and private note; reopen each from Library.
10. Reach artist completion and verify no silent boundary crossing.
11. Reload and verify meaningful continuity without autoplay.
12. Repeat on phone/narrow viewport and with keyboard only.

The evaluator should ask:

- Is the next action obvious?
- Does Discover feel useful rather than conceptual?
- Are Journeys deeper without becoming confusing?
- Does Song Room create an urge to listen without competing with the song?
- Does any copy sound like product strategy instead of user language?
- Is curiosity created by music and selection rather than manipulation?

## Gate 6 — Accessibility

- semantic headings and one visible main;
- keyboard access to every action;
- visible focus;
- focus containment and useful return;
- Escape closes topmost modal;
- accurate names, roles, values, `aria-current`, and pressed/selected states;
- slider arrow/Home/End behavior and readable values;
- non-color active/paused/saved states;
- Reduced Motion and zoom/reflow checks;
- screen-reader spot check on navigation, picker, player, and errors.

## Gate 7 — Security, privacy, and rights

- scan changed source/configuration for secrets;
- no provider/payment credentials in client code or history;
- no production personal data in fixtures;
- playback and content provenance are explicit;
- no unlicensed commercial recordings, artwork, biographies, or full lyrics;
- prototype local-only account/note language remains clear;
- production-facing changes receive threat, privacy, and rights review.

## Gate 8 — Documentation and release evidence

Update in the same commit/session:

- `handoff/STATE.md` with exact head and status;
- `handoff/DECISIONS.md` for changed choices;
- product/design/architecture/data docs for changed contracts;
- this file with changed coverage;
- `handoff/SNAPSHOTS.md` with screenshot/video paths and state labels;
- PR description with exact commands and results.

Evidence must include candidate SHA, environment, command results, visual-state list, known limitations, preview URL, and whether the user has approved testing or merge.

## Gate 9 — Test request and merge

Ask the user to test only when Gates 1–8 pass. Keep the PR draft/unmerged during user testing. Merge only after explicit acceptance, then:

- update `main` version/status;
- retain useful tests and remove test-only preview artifacts/workflows;
- rerun the post-merge gate;
- update handoff and release notes;
- begin real-system work only after the acceptance gate is recorded.
