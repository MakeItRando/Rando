# Library

**Status:** D-091 proposal (Home E rev 23, 2026-10-11). Renders 119–122.

Library is where everything you keep lives. One page, no new ideas beyond what the app already has. It mainly brings the "later" items together: playlist Rename / Edit details / Delete, pins on phone, downloads, and a home for moments and Your month.

## What's on the page

- **Header:** "Library" + real counts (playlists · artists · albums · moments) + **New playlist**.
- **Filters:** All · Playlists · Artists · Albums · Moments · Downloaded. **Find in Library** (name or type, Esc clears). **Recent / A–Z** sort.
- **Three tiles** (All, no search): **Your moments** (count → Moments filter) · **Your month** (September · October so far → opens Your month) · **Passport** (stamp count → passport).
- **List:** Liked songs is always first, then pinned items (newest pin on top), then the rest. Recent = what's playing, then Recently played, then the default order. A–Z = by name.
  - Playlist row: cover, name, "Playlist / Mixtape / Tune · N songs". Album row: "Album · artist". Artist row: round photo, "Artist" (+ orange dot "new release" until you visit them).
  - Hover shows Play (desktop). The playing row is highlighted and says "Playing".
  - ⋯ (and right-click / menu key) on each row:
    - Playlist: Pin to top · Download · Edit details · Delete playlist. Liked songs: Download only.
    - Artist: Pin to top · Go to artist · Unfollow (Undo).
    - Album: Download · Go to artist · Remove from library (Undo).
- **Moments filter:** every saved moment (song, 30-second range); tap to play, × to remove (Undo).
- **Downloaded filter:** what's downloaded + "N songs · about X MB on this device · plays without internet" (estimate ~1.2 MB a minute).
- **Bring playlists from another app** — one quiet button at the bottom. In the prototype it only explains that import comes with the real app (needs sign-in to Spotify / Apple Music / YouTube Music). Backlog H3.

## Playlist management

- **Edit details** (Library ⋯ or the playlist page ⋯): Name (required, 60 characters) + Description (optional, 140). Enter saves, Esc cancels. The new name shows everywhere (sidebar, Library, playlist page, Now Playing). Undo.
- **Delete playlist**: gone from the sidebar, Library and Add to playlist; if you were on its page you land in Library; if it was playing, the song keeps playing. Undo brings it back (with its pin).
- **New playlist** (Library): makes an empty "My playlist #N" and opens Edit details right away. Adding songs works as before (any song's ⋯ / Add to playlist).
- Playlist page shows the description under the name and "Downloaded" in the meta line.

## Downloads (H5)

Download / Remove download on playlists, Liked songs and albums. Row shows a spinner while downloading, then an orange ↓ badge. Prototype shows the state only — real storage, quality setting and "download over mobile data" belong to Settings / real apps.

## Phone

Library tab opens the page. Filters scroll sideways, Find + sort on one line, tiles scroll sideways, one column of rows with ⋯ always visible. **Pins work on phone here** (⋯ → Pin to top) — phone has no sidebar, so Library is where pins show. Back on a playlist opened from Library returns to Library.

## Not done (on purpose)

- Folders, grid/list toggle, custom sort orders — add only if people ask.
- Older months of Your month: the study only has September and October; the tile lists what exists.
- Import itself (H3) and real downloads (H5 storage) — real apps.

## Acceptance tests (`check.mjs`)

Library nav + phone tab open the page · Liked first, every followed artist and saved album listed · Artists filter · Find filters + keeps focus + says when nothing matches · A–Z · Pin to top from Library (under Liked) + Undo · Download shows downloading → downloaded + Downloaded filter with song count · Edit details refuses an empty name, renames everywhere, description + Downloaded on the playlist page · playlist ⋯ has Edit details + Delete (no "later") · Delete removes from sidebar + Library + returns to Library, Undo restores · row Play stays in Library · Your moments tile lists moments · New playlist makes an empty playlist, asks for a name, opens · phone: no sideways scroll, ⋯ offers Pin to top, Back returns to Library.
