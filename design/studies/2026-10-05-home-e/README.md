# Home study E — interactive (2026-10-05)

**Status:** revision 4 proposal (D-065, awaiting owner verdict) on top of rev 3 (D-058). Owner on rev 3 (2026-10-07): bottom scrubber looks untidy; Home "boring sometimes… not giving the vibe to explore"; then approved all review feedback (D-060), Dig (D-061), desktop + mobile apps first (D-062). Rev 3: Home complete (D-058). Owner on rev 2: liked every suggestion, light mode "awesome", bottom bar left to us (kept). Rev 2 (D-057): Owner on rev 1: "way way better… so close"; keep the Journeys filter but don't leave it empty; add light mode.

Previous: Owner on C: "way better… but we can do way better; some places feel old; Journey button must change when it's playing and offer Open Journey; make it more advanced, engaging, interactive, correct and systematic; audience mostly teenagers; Home first."

**Try it:** https://makeitrando.github.io/Rando/design/studies/2026-10-05-home-e/home.html (GitHub Pages; resize the window below 640 px or use phone emulation for the phone layout) — or download this folder and open `home.html`.

**Test it:** `CHROMIUM=$(which chromium) node design/studies/2026-10-05-home-e/check.mjs` from a folder with `playwright` installed (exit 0 = PASS: scrubber seek, Dig open/pause, Keep order, Undo, end of stack, Play Dug, natural source end stops, no phone overflow at 390 px, Dig tab).

![Rev 4 walkthrough (animated)](renders/walkthrough-rev4.svg)

New in rev 4: the bottom progress is a **clean 3 px line** — hover or drag shows a thumb and a time bubble; arrow keys seek ±5 s; it is an ARIA slider · **Dig** band on Home → open the stack of 10 unheard songs; each plays a 15 s hook (ring), **Keep** (→ / swipe right) or **Skip** (← / swipe left), Space pauses the hook, Esc leaves; Undo toast; main playback pauses while digging and offers Resume; the stack ends ("Done for today") → Play Dug, kept songs land in the **Dug** playlist; "Play full song" plays it with Dig as the source · Dig artists show **Follow** · all micro labels are sentence case · **phone layout (≤640 px):** bottom tabs Home / Journeys / Dig / Library, mini player with 2 px progress that opens full-screen Now Playing, filter moves into the page, no overlaps at 390 px.

Things to try: ⌘K / Ctrl+K search (arrows + Enter) · Start Moni Gray → button becomes Pause, ring fills, node shows Playing · Queue button (bottom right) · + in the stage → add to playlist, Undo, duplicate warning · click a playing card again = pause (never restarts) · Moods · Music/Journeys/Following filter · Space · waveform seek · let a source end (it stops, no unrelated songs).

New in rev 3 (final Home): click the song title or press **L** → Now Playing with synced lyrics (click a line to jump) · ⋯ → Share → story/post card with lyric, background and format · This week → **Your September** recap (5 story cards, auto-advance, ←/→) · bell → notifications with live Play/Pause, Mark all as read · avatar → profile menu with Appearance Dark/Light/Auto + Keyboard shortcuts · press **?** for all shortcuts · clock in the player → sleep timer (15–60 min, end of song) + crossfade · repeat cycles off → source → song (never adds unrelated songs) · draggable volume + mute · Devices · sidebar + → New playlist or New Blend · On repeat See all expands, Browse genres adds more Journeys, Manage lets you unfollow with Undo · "Music" filter renamed **For you** · narrow windows collapse the sidebar.

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
| ![](renders/10-home-final.svg) | Final Home (rev 3), dark |
| ![](renders/11-now-playing-lyrics.svg) | Now Playing + synced lyrics |
| ![](renders/12-share-card.svg) | Share card: story / post, lyric, background |
| ![](renders/13-monthly-recap.svg) | Monthly recap, card 1 of 5 |
| ![](renders/14-notifications-light.svg) | Notifications (light) |
| ![](renders/15-shortcuts.svg) | Keyboard shortcuts (?) |
| ![](renders/16-sleep-timer.svg) | Sleep timer + crossfade, timer running |
| ![](renders/17-blend-light.svg) | Start a Blend (light) |
| ![](renders/18-profile-light.svg) | Profile menu, Appearance Dark / Light / Auto |
| ![](renders/19-clean-scrubber.svg) | Rev 4: clean scrubber, thumb + time bubble on hover |
| ![](renders/20-dig-on-home.svg) | Rev 4: Dig band on Home (10 unheard songs today) |
| ![](renders/21-dig-card.svg) | Rev 4: Dig card, 15 s hook ring, Skip / Keep |
| ![](renders/22-dig-swipe-keep.svg) | Rev 4: swipe right = Keep |
| ![](renders/23-dig-done.svg) | Rev 4: finite end — Done for today, Play Dug |
| ![](renders/24-phone-home.svg) | Rev 4: phone Home (390 px), bottom tabs + mini player |
| ![](renders/25-phone-lower.svg) | Rev 4: phone, lower sections |
| ![](renders/26-phone-dig.svg) | Rev 4: phone Dig |
| ![](renders/27-phone-now-playing.svg) | Rev 4: phone Now Playing + lyrics |
| ![](renders/28-phone-light-home.svg) | Rev 4: phone Home, light |
| ![](renders/29-phone-trio.svg) | Rev 4: phone Home / Dig / Now Playing side by side |

All counts come from `data.js`; sleeves are code-drawn placeholders, not product assets (real art arrives with the catalog, D-063). Dig songs and artists are fictional. See [docs/specs/HOME.md](../../../docs/specs/HOME.md).
