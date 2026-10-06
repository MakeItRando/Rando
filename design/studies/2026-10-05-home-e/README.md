# Home study E — interactive (2026-10-05)

**Status:** revision 2 (D-057), awaiting owner sign-off. Owner on rev 1: "way way better… so close"; keep the Journeys filter but don't leave it empty; add light mode.

Previous: Owner on C: "way better… but we can do way better; some places feel old; Journey button must change when it's playing and offer Open Journey; make it more advanced, engaging, interactive, correct and systematic; audience mostly teenagers; Home first."

**Try it:** [home.html (interactive)](https://htmlpreview.github.io/?https://github.com/MakeItRando/Rando/blob/main/design/studies/2026-10-05-home-e/home.html) — or download this folder and open `home.html`.

Things to try: ⌘K / Ctrl+K search (arrows + Enter) · Start Moni Gray → button becomes Pause, ring fills, node shows Playing · Queue button (bottom right) · + in the stage → add to playlist, Undo, duplicate warning · click a playing card again = pause (never restarts) · Moods · Music/Journeys/Following filter · Space · waveform seek · let a source end (it stops, no unrelated songs).

New in rev 2: sun/moon button (top right) = light mode, remembered, follows system by default · Journeys filter shows Your Journeys (per-genre cards with live Pause/Resume/Start) + Artists you finished (Replay) · Following filter shows Artists you follow (NEW badges) + releases · ⋯ in the stage or right-click any song → Play next / Add to queue / Add to playlist / Go to artist / Share · queue drawer splits "Next in queue" (yours) from "Next from <source>".

| Render | State |
| --- | --- |
| ![](renders/01-playlist-playing.svg) | Playing from playlist Late drive; vinyl slides out of the sleeve while playing |
| ![](renders/02-journey-playing-queue.svg) | Journey playing: Pause + Open Journey, progress ring 2/6, queue drawer shows the real Journey queue |
| ![](renders/03-search-palette.svg) | ⌘K search: artists first, then songs |
| ![](renders/04-mood-playing-toast.svg) | Mood playing + "Added to Sunday, slow · Undo" |
| ![](renders/05-lower-sections.svg) | On repeat (×plays), Moods, New from artists you follow |
| ![](renders/06-light-home.svg) | Light mode (rev 2); the stage stays a dark sleeve-coloured island |
| ![](renders/07-journeys-view.svg) | Journeys filter: Your Journeys + Artists you finished |
| ![](renders/08-light-menu-queue.svg) | Song menu (Play next…) + drawer with Next in queue / Next from source |
| ![](renders/09-following-view.svg) | Following filter: Artists you follow + new releases |

All counts come from `data.js`; sleeves are code-drawn placeholders, not product assets. See [docs/specs/HOME.md](../../../docs/specs/HOME.md).
