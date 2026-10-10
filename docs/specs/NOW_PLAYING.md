# Spec: Now Playing

Status: **study, proposal D-068** (awaiting owner verdict). Built in Home E rev 7 (`design/studies/2026-10-05-home-e/`, end of `app.js`/`style.css`). Desktop + phone (D-062). Replaces the rev 3 lyrics overlay.

## Job

See and steer what's playing right now: the song, where it comes from, what plays next, who made it.

## Open / close

Open: song title or sleeve on the stage, lyrics button or the song in the player bar, **L**; on phone tap the mini player. Close: chevron, **Esc**, **L**; on phone also swipe down on the header/sleeve. Opening never changes playback.

## Layout

- **Header:** "Playing from <source type>" + source name (or "Playing from your queue"), position `01/09`, ⋯ song menu, close.
- **Left (desktop) / top (phone):** sleeve (vinyl slides out and spins only while playing; static under Reduced Motion), title, artists (each name tappable → artist page later), Like, tags (BPM, key, length, "×14 on repeat" when ≥ 5 plays), Follow, Add to playlist, Share lyric (Share for instrumentals).
- **Phone only — own controls:** scrubber (same clean 3 px line, drag, ±5 s keys) with elapsed / remaining, Shuffle · Previous · Play/Pause (72 px) · Next · Repeat, then Devices · Sleep timer · Share · Up next. The mini player and bottom tabs hide while Now Playing is open.
- **Desktop:** the bottom player bar stays the controller (no duplicate controls). Home filters hide while Now Playing is open.
- **Tabs (right on desktop, below controls on phone, sticky):** Lyrics · Up next · Credits · About. Keys 1–4 switch tabs.

## Tabs

- **Lyrics:** synced; current line bright, past dim; click a line to jump; credit line "Lyrics · <writers>". No lyrics → **Instrumental** state (moving bars while playing, BPM + key, See credits). No guessing copy.
- **Up next:** Now (with time), total time left; **Next in queue** (user-added, each removable with Undo, Clear with Undo); **Next from <source>** (only that source, D-055/B-002); footer is honest: "End of <source>. Playback stops here." or the repeat state. Tap a row = play it.
- **Credits:** Performed by, Written by, Produced by, Mixed by, Label. Each person shows how many other songs in Rondo they're credited on and **Play their credits** (a finite source "Credits: <name>"). This is the credits-first discovery idea (PRODUCT_IDEAS #9). Names are study placeholders; real ones come from label metadata.
- **About:** Release, Genre, Tempo, Key, Length, Your plays ("First listen" for new songs), Liked; **Go from this song** (opens Explore at Go from), Share.

## States

Playing / paused (vinyl, bars, play button), from your queue, last song of a source (Up next shows only the end note), instrumental, Dig song (Follow instead of Following), long titles wrap to two lines.

## Responsive

≥1021: two columns (sleeve ≤ 420 px / 46 vh). 641–1020: narrower columns. ≤640: one scrolling column, sticky header + sticky tabs, no sideways scroll at 390 px (tested).

## Scope

V1-local: all of it. Credits counts across the whole catalog and Devices = V1-backend.

## Acceptance tests (in `check.mjs`)

L opens with tabs; Up next lists only the active source after the user queue and the end note; remove from queue + Undo; Credits → Play their credits plays that person's songs; Esc closes; phone: full screen with own controls, bar hidden, play toggles, scrubber seeks, no sideways scroll, close works.

## Rev 14 (D-079): no dead ends, numbers out of sight
- **No empty Lyrics screen.** If a song has no lyrics (instrumental or not in the catalog yet), the Lyrics tab is greyed out and the page opens on **About** instead; it switches back to Lyrics for the next song that has them.
- **About = this song and you:** Journey stop card (when playing from a Journey: "Stop 3 of 6" + dots, tap → Journeys), "From the album/EP" card (tap → Release page), **You and this song** (plays or "New · first listen", liked, in how many of your playlists + their names), then Genre · Pace · Length, Go from this song, Share.
- **BPM and key are gone from the main view.** Header chips show only length + "on repeat". Pace is a word (Laid back / Steady / High energy); the numbers stay in data and power Go from, Tune a mix, radio and Journey flow behind the scenes.

- **Rev 14.4 (I8): Your note** — a private note on the song (from the song ⋯ menu → Add a note, or the dashed "Add a private note" card here) shows in About as a quote. Only you see it.

## Rev 15.3 (D-083 proposal): About fills itself
Owner: "make it more auto… people are lazy and not creative". Under the three numbers in **You and this song**, automatic facts from play history — nobody types anything:
- **First heard** — date + where it came from (Dig, a Journey, Artist radio, Search, a playlist, a friend's share).
- **You play it most** — late at night / in the evening / in the morning / on weekends.
- **In your playlists** — names.
- New song → "First listen · right now".
Prototype uses stable demo values per song; real apps compute from play history (V1 backend). Next candidate: **Your start point** (BACKLOG H9).

**Sleep timer chip (rev 15.3):** when a timer is on, the clock icon in the bottom bar is replaced by one orange pill — "After this song" or "29 min left"; tap to change or turn off.

**Owner note (2026-10-10):** the Song room / Lyrics panel "doesnt look that good and creative"; icons are bad → redesign is **Now** in [BACKLOG.md](../../handoff/BACKLOG.md).

## Rev 16 (D-084 proposal): Song room lyrics + one icon set
Owner: lyrics panel / song room "doesnt look that good and creative… where user gonna spend most of time"; "icons are bad"; "we dont wanna overdo… things we add should be useful, fun to use".
- **Timed lyrics, real length.** Each line has a start time (`LT` in the prototype; real apps get synced lyrics from the licensed provider). The sung line is white, past lines fade, upcoming lines are mid-grey. No more 4 lines looping every 7 s.
- **Sections + who sings.** Small labels above blocks: Verse 1 · Kairo Vale, Pre-chorus, Chorus, Verse 2 · Mira Son, Bridge · both. Useful on features; only shown when the lyrics data has them.
- **Instrumental gaps.** Breaks of 8 s or more (intro, solo, outro) show three dots that fill as the break plays, plus how long it is — you see when the vocals come back.
- **Your moments in the lyrics.** Lines inside a saved moment carry a small orange ✦ in the left gutter.
- **Hover a line → its time; tap → jump there.**
- **Follow / Back to now.** Lyrics scroll with the song. Scroll yourself and following stops; a "Back to now" pill brings it back.
- **Not synced yet.** Songs whose lyrics have no timings show the lines as a still "Lyrics preview · not synced yet" — no fake highlighting.
- Home "Now playing" lyric line uses the same timing.
- **Icon set:** all icons redrawn in one language — 1.75 px stroke, round caps and joins, soft 2 px corners. Clearer meanings: Lyrics = speech bubble with lines; Settings = two sliders (old one looked like brightness); filled rounded play/pause.
- Demo lyrics for Night Transit, Blue Hour and Small Hours are placeholder text for fictional demo songs (credited "demo lyrics"); they are not product copy.

Acceptance: line sung at t is highlighted; sections + singer shown; gap dots fill with no sung line; moment lines marked; tap jumps; scroll → Back to now → follows; untimed songs say not synced yet; no missing icons.

## Rev 16.1: tidy left side + copy lyrics
Owner: "yes do that" (tidy the Song room left side); "why i cant copy the whole lyrics at a time".
- **Left side:** removed the "3:08" and "×14 on repeat" chips (length is in the player bar; plays live in About). **Follow** sits next to the artist name. One action row: ♥ like · + add to playlist · Share · ✦ Save moment (round outlined icon buttons + two labelled buttons).
- **Lyrics are selectable text** — drag to select any lines and copy (time stamps and dots are not copied). Selecting never jumps the song; a plain tap still jumps.
- **Copy lyrics** — button at the end of the lyrics and in the song ⋯ menu; copies title, artists, every line with [Verse]/[Chorus] labels. Toast "Lyrics copied". Real apps: copying respects the lyrics licence (full copy may be limited per provider — check at licensing).
