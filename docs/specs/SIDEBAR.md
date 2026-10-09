# Spec: Sidebar (desktop)

Status: approved D-078 (2026-10-07: "i like the new sidebar"), Home E rev 14 → 14.1 changes below. Desktop only — phone uses the bottom tabs. Decisions: D-077 (clear), D-078.

## Job
Get back to what you care about in one click, and show at a glance what is alive right now — without becoming a long list of names.

## Sections, top → bottom
1. **Nav** — Home, Explore, Journeys, Library (unchanged).
2. **Journey card** — your current Journey artist, tinted with their art: genre, artist, "N of M heard", a dot per song (heard = filled, playing = orange pulse), one round Play/Pause. Tap the card → Journeys page; tap Play → continue at the first unheard song. This puts Rondo's signature feature where other apps put nothing.
3. **Following** — round artist photos in a row, **three across** (swipe/scroll for more, snaps) (like stories, which teens already understand). **Orange ring = new music you haven't looked at**; it goes plain after you open the artist. The artist you're listening to gets a white ring and a small equalizer. Tap → Artist page. Scrolls sideways when you follow many.
4. **Playlists** — back to the original list (cover, name, song count, equalizer on the one playing). The two-column cover shelf from rev 14 was dropped by the owner (rev 14.1); it also collided with the On repeat `.shelf` class and blew up those cards.

4b. **Recently played** (rev 14.2, D-080) — up to 2 rows above Playlists: the last albums/singles, radios, mixes or artist sets you played that aren't already in the sidebar. Journeys are left out (they have the card). Tap → its page (Release, Playlist/Radio, Artist).
4c. **Progress line** — the playing playlist gets a thin orange line under it showing how far through it you are.
4d. **Drop to add** — drag a song from anywhere (cards, playlist/artist/release rows, queue, the bottom-bar cover) or a whole album/playlist card onto a playlist or Liked songs. While dragging, playlists show a dashed "Drop to add"; the one under the pointer lights orange. Toast with Undo; songs already there are skipped.
4e. **Dividers** — thin lines between nav, Journey card, Following, Recently played and Playlists.
5. **Collapse button** — top right of the sidebar column (in the top bar, next to the logo). Collapses to the 72 px rail (icons, Journey cover, artist photos, playlist covers) and expands back; remembered between visits. Hidden when the window is already narrow (rail is forced ≤1020 px).

## States
- Nothing followed: Following section hidden (V1 build). Journey not started: "Not started yet", empty dots. Journey finished: "Finished · stamp collected".
- Narrow window (≤1020 px, 72 px rail): covers only; playing item and live Journey get an orange outline.

## Motion
Record slide-out + spin (3.2 s/turn), Journey dot pulse while playing, small lift on hover. Reduced Motion: no spin/pulse, record shown still. Final motion in the polish pass (D-073).

## Scope / data
V1 local: FOL (followed), seen-new set, JR active Journey, playlists. Many playlists (30+) → the shelf shows pinned + recent, full list lives in Library (to design).

## Acceptance tests
Journey card Play starts/pauses the Journey; card opens Journeys; Following ring clears after opening the artist; playing playlist row has `.on`; collapse button shrinks to the rail and expands again; On repeat cards keep their size.
