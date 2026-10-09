# Spec: Sidebar (desktop)

Status: study, proposal D-078 (2026-10-07), Home E rev 14. Desktop only — phone uses the bottom tabs. Decisions: D-077 (clear), D-078.

## Job
Get back to what you care about in one click, and show at a glance what is alive right now — without becoming a long list of names.

## Sections, top → bottom
1. **Nav** — Home, Explore, Journeys, Library (unchanged).
2. **Journey card** — your current Journey artist, tinted with their art: genre, artist, "N of M heard", a dot per song (heard = filled, playing = orange pulse), one round Play/Pause. Tap the card → Journeys page; tap Play → continue at the first unheard song. This puts Rondo's signature feature where other apps put nothing.
3. **Following** — round artist photos in a row (like stories, which teens already understand). **Orange ring = new music you haven't looked at**; it goes plain after you open the artist. The artist you're listening to gets a white ring and a small equalizer. Tap → Artist page. Scrolls sideways when you follow many.
4. **Playlists shelf** — two-column covers instead of a text list (Liked songs, your playlists, Dug, saved radios/tunes). **The one playing slides its record out of the sleeve and spins** (stops when paused) — the same record motif as the Release page, so "playing" reads the same everywhere. + makes a new playlist.

## States
- Nothing followed: Following section hidden (V1 build). Journey not started: "Not started yet", empty dots. Journey finished: "Finished · stamp collected".
- Narrow window (≤1020 px, 72 px rail): covers only; playing item and live Journey get an orange outline.

## Motion
Record slide-out + spin (3.2 s/turn), Journey dot pulse while playing, small lift on hover. Reduced Motion: no spin/pulse, record shown still. Final motion in the polish pass (D-073).

## Scope / data
V1 local: FOL (followed), seen-new set, JR active Journey, playlists. Many playlists (30+) → the shelf shows pinned + recent, full list lives in Library (to design).

## Acceptance tests
Journey card Play starts/pauses the Journey; card opens Journeys; Following ring clears after opening the artist; playing playlist tile has `.on`.
