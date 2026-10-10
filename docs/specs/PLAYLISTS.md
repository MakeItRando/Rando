# Spec: user playlists (V1 scope, draft)

**Decision:** D-047 (owner, 2026-10-04): listeners can create their own playlists. Status: specified at product level; design study A covers the playlist page. Not implemented.

## Jobs to be done

- Collect songs for a moment (drive, focus, Sunday) in seconds, from anywhere a song appears.
- Play, shuffle and reorder them; see where playback comes from.
- Grow a playlist without searching: "Fits this playlist" suggestions from its own songs (explainable, no fake AI claim).

## Core behavior

- **Create:** `+` in sidebar/Library, "New playlist" in any song's Add-to-playlist sheet (create-and-add in one step). Default name "My playlist #n", editable inline; optional description; cover = 2×2 mosaic of first four distinct releases until a custom image is allowed (later, moderated).
- **Add:** song menu → Add to playlist (recent playlists first, search inside sheet, duplicate warning with "Add anyway"). Multi-select add from album/Journey lists. Toast with Undo and "View".
- **Edit:** reorder (drag on desktop, handle on mobile, keyboard move up/down), remove with Undo, rename, delete with confirm.
- **Play:** Play/Shuffle; playback session source = `playlist:<id>`; Up next shows remaining playlist items; natural end follows playlist order (regression with B-001/B-002 fixes).
- **Liked songs** is a system playlist (not deletable, ordered by date liked).
- **Privacy:** private by default. Sharing/public/collaborative playlists are V2 candidates, require accounts and moderation.
- **Limits:** soft cap 10,000 items; virtualized lists; unavailable songs stay listed greyed with reason.

## Data (prototype → production)

`Playlist { id, ownerId, name, description?, createdAt, updatedAt, itemCount, visibility: 'private' }`, `PlaylistItem { playlistId, position (fractional index), trackId, addedAt }`. Prototype stores in browser-local state with versioned migration; production syncs per account.

## Acceptance

Create/add/reorder/remove/delete with keyboard and touch; Undo works; playback context and natural end follow playlist; 320/390/1440 layouts; empty state ("Add songs from anywhere with +"); long names truncate; screen-reader announcements for add/remove/move.

## Playlist page — Home E rev 11 (D-072 proposal, 2026-10-07)

Owner: "the playlist ui not that good". There was no playlist page (sidebar rows only toggled play; "Go to playlist" did nothing). Now:

- **Open:** sidebar playlist rows and Stage "Go to playlist" open the page. Opening never changes playback.
- **Header:** tinted by the cover tone; cover = 2×2 mosaic of the first four different sleeves (Liked songs = heart tile); "Playlist · by mikoto", title, songs · total time; actions: Play / Pause (state-aware, D-055), Shuffle, Share, ⋯ (rename, edit, delete — later).
- **Track list:** # (eq when playing, play icon on hover) · sleeve · title + artist · tempo · key · liked heart · time · ⋯ on hover (song menu). Row click plays from that song in this playlist; the playing row is highlighted.
- **Add songs that fit (H8):** 5 songs scored from the playlist's own songs (same signals as radio), Add with Undo, Refresh for the next 5. No reasons shown. Not on Liked songs.
- **Phone:** Back link, stacked header (cover ≈ half the width), compact rows (sleeve, title, heart, ⋯).
- Later: drag to reorder, edit details, collaborative playlists (V2).

## Rev 17 (D-085 proposal, 2026-10-10): Playlist refresh + Mixtapes

Owner: Playlist page was the most boring page; Mixtapes (I2) was on the agreed list.

**Playlist refresh (small, useful):**
- Song list column header said "Tempo · key" over album names — now says **Album**.
- An auto **"what's in it"** line under the stats, counted from the songs themselves: *Mostly genre & genre · pace range · N artists*. Nothing written by AI, nothing invented (D-050).
- Playlist **⋯** opens a small menu: **Make it a mixtape** / **Edit mixtape**, plus "Rename, edit, delete · later" (comes with the Library design). Liked songs and radios have no mixtape option.

**Mixtapes — a playlist made for someone:**
- **Make it a mixtape** opens a sheet: **For** (a name), **Note** (140 characters, counter), **Sticker** (pick one of the covers in the playlist), **Tape** colour (4 swatches), live preview of the tape. **Make mixtape** → toast with Undo.
- The playlist page turns into a tape: cassette with the sticker on the label, the title and "for Aki", reels turn while it plays (they stay still with reduced motion). Caption "Mixtape · from mikoto · for Aki". The **note shows first**, right under the title, signed "— mikoto".
- Sidebar row says "Mixtape · N songs".
- **Edit mixtape** keeps everything; **Make it a playlist again** (with Undo) turns it back. Esc / Cancel closes the sheet.
- **Share** on a mixtape says honestly that the link comes with sharing (V1 backend): the receiver opens it as a tape, note first. Receiver view = profile & social phase.
- Not added (on purpose): handwriting fonts, AI notes, decorations, timers.

### Rev 17.1: Mixtape final touches (owner: "yes, i like that")
- Everywhere the source is named it says **mixtape**: Now Playing ("Playing from mixtape"), the Song room header, the queue panel, Recently played.
- Sheet keyboard: Enter in **For** jumps to the note, **Ctrl/⌘+Enter** makes the mixtape, Tab stays inside the sheet, closing returns focus to ⋯.
- Tape colours have names for screen readers and on hover (Cream, Yellow, Orange, Sky).
- Checked on phone and in light mode.
- Playlist ⋯ now also has **Pin to top** (see SIDEBAR.md rev 18).
