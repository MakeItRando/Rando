# Spec: Artist page

Status: approved D-074 (2026-10-07: "that nice, i like that"); final touches D-075 (rev 12.1). Desktop + phone.

**Job:** listen to one artist quickly (their best songs, newest release, radio), decide to follow, and see where they sit on your Journey. The **Artist Journey** (JOURNEYS.md) stays the A→Z path through everything they made; the two pages link to each other.

## Opens from

Song menu "Go to artist", artist names in Now Playing, the Stage artist name, ⌘K / search artist results, Following rows (sidebar and Home), similar-artist circles, the Artist Journey ("Artist page" chip). Opening never changes playback.

## Layout (top → bottom)

1. **Header** tinted by the artist's tone: round photo (flat placeholder until real art, D-063), "Artist · genre · city", name, monthly listeners · songs · releases. Actions: **Play** (their popular songs, state-aware Play/Pause/Resume, D-055), **Follow/Following** (Undo; followed artists' releases show in This week), **Artist radio** (same rules as song radio: 50 songs, picks face down, ends — D-072), Share.
2. **Popular** — top 5 by plays (Show 5 more → 10). Row: # / eq, sleeve, title + artists, plays, liked heart, time, ⋯ menu. Row click plays from that song.
3. **Side column** (desktop) — **New/Latest release** card with Play, and **Your Journey** card: ring = songs heard, "3 of 7 · Hip-Hop Journey", Finished · stamp collected / X of Y heard / Not started → opens the Artist Journey.
4. **Releases** — newest first; filter All / Albums / EPs / Singles (only types that exist); card: cover, title, year · type; play on hover. (Release page is a later step; cards play the release.)
5. **Appears on** — songs where they are featured (only when there are any).
6. **More in <genre>** — the other artists on the same Journey (factual, no "fans also like" until there is real listening data), with Open <genre> Journey.
7. **About** — bio (from the artist/catalog; placeholder text says so when missing — no invented copy, D-050), From, Active, **Worked with** (producers/writers from credits; tap = play their credits).

## Final touches (D-075, rev 12.1)

- **Sticky mini header** after the big header scrolls away: photo, name, Play (state-aware).
- **⋯ menu:** Open in <genre> Journey · Share · Copy link · **Not for me** (J15) — the artist is left out of radio, Add similar and suggestions; a dashed banner explains it with Undo; their Journey is untouched (skip them there). Not a block: search and their page still work.
- **Release alerts bell** (only when Following): on by default; off = no notification, releases still appear in This week.
- **You and <artist>** card in the side column: songs heard, liked, in your playlists; **Play your liked songs**. Only facts from your own listening; hidden when all are zero.
- **Releases** show a NEW badge and how much you've heard (✓ heard · 3/7 heard).
- Phone: Artist radio becomes an icon button so the action row fits one line.

## Phone

Back link, stacked header (photo ≈ half width), compact rows, side column moves under Popular, releases 2-up, similar artists 3-up.

## Later

Release page, artist pick / pinned message from the artist, tour dates (V2), verified artist tools (V2), "Not for me" on the Journey (J15) also reachable from ⋯.

## Rev 14.4 (I3): Deep cuts
"Play deep cuts · N you haven't heard" in the You and <artist> card: plays the artist's songs you've never played, least popular first, as a finite Mix (ends honestly, D-055). Shown even before you've heard the artist ("You haven't heard Nia yet").
