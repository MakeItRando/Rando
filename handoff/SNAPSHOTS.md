# Conversation and visual snapshot index

## Source note

The previous chat link supplied on 2026-09-09 could not be loaded as a Notion page or session, and session search was temporarily unavailable. Four screenshots attached by the user were therefore treated as state-recovery evidence. Their actionable content is preserved below so a future agent does not depend on chat access.

The binary originals were not transferred into the repository in this session. Future exportable screenshots/videos must follow `snapshots/README.md` and be linked here with exact branch, SHA, route, viewport, appearance, and state.

## Snapshot 1 — Earlier “ready for your test” state

Visible context:

- User asked for final touches before adding real artists, songs, and the real system.
- User reported that Play artist still looked unchanged and some concepts felt overexplained.
- User wanted Song Room to feel active, volume to do more, design to be professional and compelling, and curiosity to be stronger without becoming excessive.
- Earlier assistant claimed Play/Pause/Resume truthfulness, an active waveform, volume feedback, restrained Song Room, desktop/mobile QA, and no blockers.

Recovered decision:

- Treat that readiness statement as historical only. Current check evidence controls readiness.
- Artist playback labels, active track indication, waveform, volume, and Song Room quality are explicit acceptance criteria.

## Snapshot 2 — Discover and design correction

Visible user feedback:

- Discover had been turned into a genre-choice popup; user wanted a music-first page instead.
- Desired Discover behavior included songs, suggestions, famous/current picks, genre browsing, search, and direct playback.
- User separated Explore/Discover from the guided Journey flow.
- Song Room worked functionally but did not yet feel visually appealing or inviting enough.
- User rejected huge text, excessive animation, and generated-looking decoration; wanted simple, human, app-scale design.

Recovered decision:

- Discover opens directly; no genre popup.
- Use music, artwork, and concise sections to build interest.
- Keep motion limited and purposeful.

## Snapshot 3 — Corrected information architecture

Visible user direction:

- Put the genre selection inside Journeys.
- Each genre should open its own page.
- Discover should contain music suggestions, today/hit/banger sections, search, and compact genre entry points.
- Remove the permanent Journey genre dropdown; if no Journey exists, show a picker, and provide a later Change genre action.
- Save progress independently.

Visible assistant recommendation accepted in the next screenshot:

- Discover as a finite living music homepage.
- Genre pages as deeper destinations.
- Preserve meaningful state, not temporary UI state.
- Keep continuous playback.
- Add Journey progress and Resume Journey.
- Add “Because you liked…” only after genuine history.
- Avoid streaks, excessive unlocks, fake charts, autoplay traps, and giant promotional banners.

Recovered decision:

- Confirmed Discover/Journeys separation and page hierarchy.
- Genre pages bridge free browsing into guided Journeys.

## Snapshot 4 — Route-backed pages accepted

Visible user response:

- User agreed with the proposed ideas.
- User asked whether Genre pages should live in Journeys as subpages.
- User suggested web-app pages for accessibility/performance and wanted loading/resource concerns considered.

Recovered decision:

- Use route-backed SPA pages so each destination has a distinct URL, title, landmark, and Back/Forward behavior while global playback remains uninterrupted.
- Be precise: routing alone does not reduce bundle size. Render only the active page now; use lazy artwork and later code splitting/pagination/provider caching for real load improvements.

## Repository evidence captured during this audit

- `main` head before documentation: `eaafc4c`.
- v0.3.2 candidate head: `305e9a3`.
- PR #5: open, draft, unmerged.
- Latest observed candidate check: failed.
- Candidate adds route, experience, full-concept, user-ready, release-ready, and visual-capture tests.
- The preview branch remains separate from `main`.

## Future evidence template

For every image or video, add:

```text
File:
Date/time:
Branch and SHA:
Build/preview URL:
Route and state:
Viewport/device:
Appearance and motion preference:
What the evidence proves:
Known issue visible:
Related test/run:
```
