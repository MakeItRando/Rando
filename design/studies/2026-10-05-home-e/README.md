# Home study E — interactive (2026-10-05)

**Status:** rev 4 approved (D-065, "thats perfect"); **rev 19 Your month** (D-087 proposal, [YOUR_MONTH.md](../../../docs/specs/YOUR_MONTH.md)), **rev 18 Pin to top** (D-086 confirmed, [SIDEBAR.md](../../../docs/specs/SIDEBAR.md)), **rev 17 Playlist refresh + Mixtapes** (D-085 confirmed, [PLAYLISTS.md](../../../docs/specs/PLAYLISTS.md)), **rev 16–16.2 Song room lyrics + new icon set** (D-084), **rev 15 Moments** (D-082), **rev 5 adds the Explore page** (approved, D-066), **rev 6 adds search page, Rabbit hole, Save a tune** (D-067), **rev 7 adds the Now Playing page** (approved, D-068, [NOW_PLAYING.md](../../../docs/specs/NOW_PLAYING.md)), **rev 8 adds Journeys** (approved, D-069, [JOURNEYS.md](../../../docs/specs/JOURNEYS.md)), **rev 9 adds stamps, passport, share cards** (D-070, [STAMPS_PASSPORT.md](../../../docs/specs/STAMPS_PASSPORT.md)), **rev 14–14.1 sidebar with character + Now Playing About, BPM/key hidden** (D-078 confirmed, D-079 proposal; [SIDEBAR.md](../../../docs/specs/SIDEBAR.md)), **rev 13 adds the Release page** (approved D-076; rev 13.1 clarity pass, D-077; [RELEASE.md](../../../docs/specs/RELEASE.md)), **rev 12 adds the Artist page** (approved D-074; final touches rev 12.1, D-075; [ARTIST.md](../../../docs/specs/ARTIST.md)), **rev 11 adds the Playlist page + Radio page** (D-072 proposal), **rev 10 adds the listening flow** (D-071 proposal, [FEATURE_PLAN.md](../../../docs/specs/FEATURE_PLAN.md); spec [EXPLORE.md](../../../docs/specs/EXPLORE.md)). Rev 3 (D-058). Owner on rev 3 (2026-10-07): bottom scrubber looks untidy; Home "boring sometimes… not giving the vibe to explore"; then approved all review feedback (D-060), Dig (D-061), desktop + mobile apps first (D-062). Rev 3: Home complete (D-058). Owner on rev 2: liked every suggestion, light mode "awesome", bottom bar left to us (kept). Rev 2 (D-057): Owner on rev 1: "way way better… so close"; keep the Journeys filter but don't leave it empty; add light mode.

Previous: Owner on C: "way better… but we can do way better; some places feel old; Journey button must change when it's playing and offer Open Journey; make it more advanced, engaging, interactive, correct and systematic; audience mostly teenagers; Home first."

**Try it:** https://makeitrando.github.io/Rando/design/studies/2026-10-05-home-e/home.html (GitHub Pages; resize the window below 640 px or use phone emulation for the phone layout) — or download this folder and open `home.html`.

**Test it:** `CHROMIUM=$(which chromium) node design/studies/2026-10-05-home-e/check.mjs` from a folder with `playwright` installed (exit 0 = PASS: scrubber seek, Dig open/pause, Keep order, Undo, end of stack, Play Dug, natural source end stops, no phone overflow at 390 px, Dig tab).

![Rev 4 walkthrough (animated)](renders/walkthrough-rev4.svg)

New in rev 13 — **Release page**: on an Artist page click a release (or Go to album/EP on the Stage) → record slides out from behind the cover when you press Play, plays in order, Side A/B, ⌄ for each song's credits, Liner notes, Save. Demo hook: `release:'silver'`.

New in rev 12 — **Artist page**: song ⋯ → Go to artist, an artist name in Now Playing or on the Stage, search, or a Following row → header (Play, Follow, Artist radio), Popular, Latest release, Your Journey card ↔ Artist Journey ("Artist page" chip), Releases + filter, More in genre, About + Worked with. Rev 12.1: sticky mini header on scroll, ⋯ → Not for me (with Undo), release-alert bell, You and <artist> card, NEW + heard on releases. Demo hook: `artist:'Kairo Vale'`. Motion/polish waits for the real apps ([MOTION.md](../../../docs/MOTION.md)).

New in rev 11 — **Playlist page**: click a playlist in the sidebar (or Go to playlist) → header, track list, Add songs that fit. **Radio page**: start a radio, then Go to radio (or the toast's Open) → vinyl hero, New spin, Save as playlist, and 50 cards: Now/Next face up, the rest face down until they play — tap to peek, Show all. Radio no longer says why it picked songs. Demo hooks: `pv:'late'`, `pv:1,radio:'night'`, `peek:[…]`, `pvShow`.

New in rev 10 — **Listening flow**: song ⋯ menu or Now Playing → About → **Start radio** (50 songs; Up next says why and that it ends) · end of a playlist/radio → **Keep going** card (Radio / Continue Journey / Dig — nothing starts by itself) · cold open → Stage says **Pick up where you left off** · Up next ends with **Add similar** (+, Undo). Demo hooks: `cold`, `radio:'night'`, `radioOff`, `kg`.

New in rev 9 — **Stamps & passport**: tap any stamp → flip for the back (dates, first/last/most-played song), Early ear (listeners when you finished → now), collector number, new songs since, private note, Share (story / square card) and Pin · Open passport (in Your stamps) → pinned 3, genre seals, all stamps · rings show a halfway dot · Journey of the week card on the genre page. Lo-fi is pre-finished to show the genre seal; all counts are placeholders.

New in rev 8 — **Journeys**: Journeys in the sidebar or phone tab → genre page with a map of artists A→Z (rings = songs heard) · tap a station → Artist Journey (releases newest first, ✓ heard, Detours) · Start/Resume plays only that artist and stops at the end with a stamp — the next artist never autoplays · Meet <next> plays a 15 s hook · Skip ahead (Undo keeps progress) · Change genre picker (arrow keys; pace Essentials / Full for new genres) · Search inside the Journey · Play top mix doesn't touch progress. Non-Hip-Hop artists and songs are generated placeholders.

New in rev 7 — **Now Playing page**: press **L** or click the song → Lyrics / Up next / Credits / About tabs (keys 1–4) · Up next: your queue (remove, Clear, Undo) then the same source, with an honest end · Credits: Play their credits · About: Go from this song · instrumentals show an Instrumental state · on phone tap the mini player → full screen with its own scrubber and controls, swipe down to close.

New in rev 6: click the Explore search field (or ⌘K / / inside Explore) → **search page**: Recent searches (remove, Clear all + Undo), Browse genres; type → filter chips, Top result, Songs, Artists, Playlists & releases, Genres; Enter plays the top result; Esc clears, Esc again leaves; try "qwzx" for the no-results state · play a **Go from** mix → when the next song plays, **Go from <song> next** hops deeper; the **Rabbit hole** trail shows each stop, **Save as playlist** keeps every song you played · **Save tune** next to Play mix → saved tunes appear in Playlists and as "Your tunes" chips.

New in rev 5 — **Explore** (sidebar, phone tab, or press **E**): big search + Recent chips · Dig card · **Tune a mix**: set Tempo / Voice / Feel and the count, sleeves and reason update live; Play mix plays a finite "Tuned" source (press again = pause) · **Go from <current song>**: same tempo, same keys, featured artist — computed from the song you're hearing, stays put while you play one · Genres (each a Journey) · Out this week (all releases, Following tag) · Most kept in Dig across Rondo. Phone tabs are now Home / Explore / Journeys / Library (Dig lives in Explore and on Home).

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
| ![](renders/30-explore.svg) | Rev 5: Explore — search, Dig, Tune a mix, Go from |
| ![](renders/31-explore-genres.svg) | Rev 5: Explore — Go from + Genres |
| ![](renders/32-explore-releases-kept.svg) | Rev 5: Out this week + Most kept in Dig |
| ![](renders/33-explore-tuned-playing.svg) | Rev 5: Tuned mix Slow · Dark playing (Pause, accent border) |
| ![](renders/34-explore-light.svg) | Rev 5: Explore, light |
| ![](renders/35-phone-explore-trio.svg) | Rev 5: phone Explore, top → bottom |
| ![](renders/36-search-recent.svg) | Rev 6: search page, empty: Recent searches + Browse genres |
| ![](renders/37-search-results.svg) | Rev 6: results for "mo": Top result, Songs, Artists |
| ![](renders/38-search-filter-songs.svg) | Rev 6: Songs filter (live state on the playing song) |
| ![](renders/39-search-no-results.svg) | Rev 6: no results |
| ![](renders/40-rabbit-hole.svg) | Rev 6: Rabbit hole trail + Go from <song> next |
| ![](renders/41-save-tune.svg) | Rev 6: saved tune Slow · Dark (sidebar + Your tunes) |
| ![](renders/42-phone-search-hole.svg) | Rev 6: phone search, results, Rabbit hole |
| ![](renders/43-np-lyrics.svg) | Rev 7: Now Playing — Lyrics |
| ![](renders/44-np-up-next.svg) | Rev 7: Up next — your queue + same source + end note |
| ![](renders/45-np-credits.svg) | Rev 7: Credits with Play their credits |
| ![](renders/46-np-about.svg) | Rev 7: About + Go from this song |
| ![](renders/47-np-light-instrumental.svg) | Rev 7: Instrumental state (light theme; page keeps its sleeve colour) |
| ![](renders/48-phone-np-trio.svg) | Rev 7: phone Now Playing — controls, lyrics, Up next |
| ![](renders/49-journeys-genre.svg) | Rev 8: Journeys genre page — hero, map, Now on your Journey, stamps |
| ![](renders/50-journeys-genre-scrolled.svg) | Rev 8: boundary card, top songs, releases, other Journeys |
| ![](renders/51-journeys-artist-current.svg) | Rev 8: Artist Journey — current artist (Moni Gray) |
| ![](renders/52-journeys-artist-finished.svg) | Rev 8: finished artist with stamp, heard ticks |
| ![](renders/53-journeys-change-genre.svg) | Rev 8: Change genre picker with pace choice for a new genre |
| ![](renders/54-journeys-meet.svg) | Rev 8: Meet the artist — 15 s hook, main playback paused |
| ![](renders/55-journeys-search.svg) | Rev 8: search inside the Hip-Hop Journey |
| ![](renders/56-journeys-genre-light.svg) | Rev 8: genre page, light |
| ![](renders/57-journeys-phone.svg) | Rev 8: phone: genre map, artist page, picker |
| ![](renders/58-stamp-front.svg) | Rev 9: stamp sheet — early ear, collector number, new since, note |
| ![](renders/59-stamp-back.svg) | Rev 9: flipped: back of the stamp |
| ![](renders/60-passport.svg) | Rev 9: passport — pinned, genre seals, stamps |
| ![](renders/61-share-stamp.svg) | Rev 9: share card, story 9:16 |
| ![](renders/62-share-passport.svg) | Rev 9: passport share card |
| ![](renders/63-genre-seal-essentials.svg) | Rev 9: finished genre (Lo-fi, Essentials edition) with seal |
| ![](renders/64-journey-of-the-week.svg) | Rev 9: Journey of the week card |
| ![](renders/65-phone-passport-stamp-share.svg) | Rev 9: phone: passport, stamp sheet, share |
| ![](renders/66-pick-up-stage.svg) | Rev 10: cold open — Stage says Pick up where you left off |
| ![](renders/67-keep-going.svg) | Rev 10: Keep going card when a playlist ends (no autostart) |
| ![](renders/68-radio-up-next.svg) | Rev 10: radio Up next with reasons (superseded by rev 11: reasons removed, picks stay face down) |
| ![](renders/69-add-similar.svg) | Rev 10: end of radio + Add similar |
| ![](renders/70-menu-start-radio.svg) | Rev 10: song menu Start radio |
| ![](renders/71-phone-listening-flow.svg) | Rev 10: phone: Pick up, Keep going, Add similar |
| ![](renders/72-playlist-page.svg) | Rev 11: Playlist page |
| ![](renders/73-playlist-fit.svg) | Rev 11: Add songs that fit |
| ![](renders/74-radio-page.svg) | Rev 11: Radio page — face-down cards, peeked card, New spin |
| ![](renders/75-radio-up-next.svg) | Rev 11: radio Up next — Next + face-down block, no reasons |
| ![](renders/76-phone-playlist-radio.svg) | Rev 11: phone: Playlist, Radio, Up next |
| ![](renders/77-artist-page.svg) | Rev 12: Artist page — header, Popular, Latest release, Your Journey |
| ![](renders/78-artist-releases-about.svg) | Rev 12: Releases, More in Hip-Hop, About + Worked with |
| ![](renders/79-phone-artist.svg) | Rev 12: phone Artist page |
| ![](renders/80-artist-final.svg) | Rev 12.1: bell, ⋯ menu, You and Asha, sticky header |
| ![](renders/82-release-page.svg) | Rev 13: Release page — record out while playing, Side A/B, credits open |
| ![](renders/83-release-liner-notes.svg) | Rev 13: Liner notes + More from artist |
| ![](renders/84-phone-release.svg) | Rev 13: phone Release page |
| ![](renders/81-phone-artist-final.svg) | Rev 12.1: phone — action row, Not for me banner, sticky header + NEW/heard releases |

All counts come from `data.js`; sleeves are code-drawn placeholders, not product assets (real art arrives with the catalog, D-063). Dig songs and artists are fictional. See [docs/specs/HOME.md](../../../docs/specs/HOME.md).


> **CSS rule for this study:** before adding a class, `grep -n "\.name" style.css` — names are global and several short ones are already taken (`.shelf` = On repeat row, `.hd`, `.pk`, `.av`, `.nb`). Rev 14 broke On repeat by reusing `.shelf`.
