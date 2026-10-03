# Conversation and visual snapshot index

## Provenance and limits

The previous Notion conversation was not retrievable during the earlier handoff. Four user-supplied screenshots were interpreted in prior repository notes; the original uploaded image bytes are not present in this Git tree. The notes below are a **recovery summary**, not a transcript or proof of every topic discussed. Do not fabricate quotes, decisions, images or videos. Additional verified conversation assets may be added later with date, source, permission, and exact file/ref.

## Recovered decisions from four screenshots

1. **Earlier readiness claim:** user still saw unchanged Play artist labels and overexplained concepts; Song Room needed to feel more active and professional. Treat prior 'ready' language as historical, not proof.
2. **Discover correction:** user rejected genre-popup home, giant type, excessive animation and generated-looking decoration. Discover should be a useful song-first page with search, playback, suggestions, hits, bangers, moods and genre links; Journeys is distinct.
3. **Journeys information architecture:** genre choice belongs in Journeys, each genre has a dedicated page, no permanent Journey dropdown; first visit picks, return resumes, Change genre stays accessible. Preserve progress and playback. No fake charts, streaks or artificial gates.
4. **Route-backed pages:** distinct accessible SPA URLs, titles/landmarks and Back/Forward with a persistent player. Routing is not itself a bundle-size optimization.

See [DECISIONS.md](DECISIONS.md) and [PRODUCT_MAP.md](PRODUCT_MAP.md) for decisions rather than treating screenshots as complete specifications.

## Current `742abac` candidate evidence

- CI run `37125303981`; evidence commit `f163d25`; all 13 browser suites and visual capture succeeded against `preview.html`.
- Portable preview commit `74272e6`; HTML Git blob `0405bc5a0ba00a03b492dd29af83c38d39019e95`, 532,629 bytes, SHA-256 `39db95b35f3a2421631e2178417a08e4af9d8bda0774e4cb4f3be68fd1ef38b5`.
- Published HTML downloaded byte-identically and served over HTTP with the preview branch's six demo audio files; 13 browser suites and 18-state capture passed independently.
- Manual review: all 18 evidence states reviewed via contact sheet; Song Room Lyrics, desktop Light, 320px Discover, and Reduced Motion Song Room spot-checked full-size. No blocker found.
- Five screenshots attached to the owner's 2026-10-03 Notion message remain conversation-history evidence, not product QA.

## Historical `9046918` failure evidence

- CI run `36836698618`; evidence `6f68fda`; Song Room failed on visible `undefined`; preview remained stale. Superseded by the source-level correction in `742abac`.

## Historical `cd25bbd` candidate evidence

- Workflow run `34465613545`, evidence `513d538`, and preview `089bd21` belong only to `cd25bbd`.
- That automated run passed 13 browser suites and generated 18 captures, but later human review exposed the Song Room metadata defect. It is useful history, not current acceptance.

## Latest capture matrix

Each filename below is available under the [exact `513d538` screenshots tree](https://github.com/MakeItRando/Rando/tree/513d538822a3ea2d4b7f50b2c777a5594815fa71/latest/screenshots), and can be linked by appending its filename to that tree URL. Do not mark manual status accepted until inspected.

| # | Filename | State | Manual result |
| --- | --- | --- | --- |
| 01 | 01-desktop-discover.jpg | Desktop direct Discover | Pending |
| 02 | 02-desktop-discover-lower.jpg | Desktop lower Discover | Pending |
| 03 | 03-desktop-discover-sound.jpg | Desktop Sounds | Pending |
| 04 | 04-desktop-journey-picker.jpg | Desktop first-use picker | Pending |
| 05 | 05-desktop-hiphop-journey.jpg | Desktop Genre page | Pending |
| 06 | 06-desktop-hiphop-songs.jpg | Desktop songs | Pending |
| 07 | 07-desktop-artist-journey.jpg | Desktop artist | Pending |
| 08 | 08-desktop-song-room-about.jpg | Desktop About | Pending |
| 09 | 09-desktop-song-room-lyrics.jpg | Desktop Lyrics | Pending |
| 10 | 10-desktop-song-room-queue.jpg | Desktop Up next | Pending |
| 11 | 11-desktop-light-discover.jpg | Light Discover | Pending |
| 12 | 12-mobile-discover.jpg | 390px Discover | Pending |
| 13 | 13-mobile-journey-picker.jpg | 390px picker | Pending |
| 14 | 14-mobile-rnb-journey.jpg | 390px R&B Genre | Pending |
| 15 | 15-mobile-rnb-artist.jpg | 390px artist | Pending |
| 16 | 16-mobile-change-genre.jpg | 390px Change genre | Pending |
| 17 | 17-compact-discover.jpg | 320px Discover | Pending |
| 18 | 18-reduced-motion-song-room.jpg | Reduced Motion modal | Pending |

The main handoff keeps references and interpretation; generated screenshots stay in the evidence branch, not duplicated on `main`. Prototype [audio assets](https://github.com/MakeItRando/Rando/tree/rondo-v031-preview/assets/audio), [artist art](https://github.com/MakeItRando/Rando/tree/rondo-v031-preview/assets/artists), and [release art](https://github.com/MakeItRando/Rando/tree/rondo-v031-preview/assets/covers) are not previous-chat attachments.

## Historical evidence (not current sign-off)

Earlier head `89fc0d5` had 12 passing browser suites, 18/18 manual captures and a 37-check exact preview audit in its old evidence. Correction `b752cc6` had [run 34387982105](https://github.com/MakeItRando/Rando/actions/runs/34387982105/job/102588986970) and an exact preview check for its own older blob. Later `cd25bbd` superseded both. Never copy earlier manual/exact-preview claims into current-head QA.

## Future snapshot/evidence template

Date and author; branch and exact candidate SHA; artifact URL/blob/bytes; page/state/device/viewport/theme/motion; what it visibly proves and cannot prove; runtime/test/run link; reviewer and manual result; issue/decision and next action. Screenshots cannot prove interaction or error-free runtime; videos require rights and an accessible playback/transcript pointer.
