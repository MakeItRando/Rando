# Feature plan — where every idea lives (anti-overcrowding)

Status: proposal D-071 (2026-10-07). Owner: "i like all of them (H, J, E)… i dont want to overcrowd… manage and arrange them; if it overcrowds keep the best ones."
Covers ideas H1–H12, J1–J16, E1–E8 (handoff/PRODUCT_IDEAS.md) plus what is already designed.

## Rules for arranging

1. **One home per feature.** A feature gets one primary place. Other surfaces may link to it, never copy it.
2. **Merge before adding.** If a new idea overlaps an existing block, it becomes a mode or option of that block (e.g. Rewind is a toggle on On repeat, not a new shelf).
3. **Budget per surface.** Home: at most 6 shelves below the Stage. Now Playing: 4 tabs, no new tabs. Song menu: at most 8 actions. Journeys genre page: one map, one view switch.
4. **Appear when useful, not always.** Keep going shows only when a source ends; Pick up shows only on a cold open; New for you only when there are new releases.
5. **Nothing starts by itself** (D-019). Every suggestion is one tap and says why (D-050: factual reasons only).

## Placement

| Surface | Primary features (budget) | From ideas | Built |
| --- | --- | --- | --- |
| **Home — Stage** | Current/last source. On a cold open the Stage kicker becomes "Pick up where you left off · when · source · position"; play resumes exactly there. No separate banner. | H6 | rev 10 |
| **Home — shelves (≤6)** | 1 Your Journey card (+ halfway ring J12, Journey of the week E4 inside it) · 2 Dig band · 3 On repeat with a **Rewind** toggle · 4 **Your mixes** (replaces Moods: grouped by your genre + tempo, named by the grouping) · 5 This week, with **New for you** as its first row on Fridays · 6 Following | J12, E4, H5, H3, H4 | Journey card, Dig, On repeat, This week, Following (rev 4–9); Rewind, Your mixes, New for you specced |
| **Now Playing** | Tabs stay Lyrics / Up next / Credits / About. Up next ends with **Add similar** (5 songs, +, Undo) and explains radio. About gets **Start radio**. Lyrics: select lines → **lyrics card** share (same card system as stamps). Credits: "Play their credits" for a producer/writer. | H7, H1, H10, J10 | Add similar, Start radio, radio why (rev 10) |
| **Song menu (≤8)** | Play next · Add to queue · **Start radio** · Add to playlist · Go to artist · Share (6 today; room for Go from and Like later) | H1 | rev 10 |
| **End of a source** | **Keep going** card: Radio from the last song · Continue/Resume your Journey · Dig. Esc/X closes. Never autostarts, never on Journey end (Journeys have their own boundary card, D-014). | H2 | rev 10 |
| **Explore** | Search, Dig, Tune a mix, Go from, Rabbit hole, Save a tune, Genres = Journeys. Song radio is reachable from any song, so Explore does not get its own radio block. | — | rev 5–6 |
| **Playlists** | Your playlists get "**Add songs that fit**": 10 previewed songs, pick which, Undo. Same signals as radio. | H8 | specced |
| **Journeys** | Map with a view switch **A–Z \| Years \| Connections**; artist ⋯ menu "Not for me" (skips with Undo, no lock); stamps, passport, share cards; genre seal opens a **genre recap**; Journey picks inside the stamp sheet. | J11, J9, J15, J2, J3 | stamps/passport (rev 9); rest specced |
| **Profile** | Passport (3 pins + seals) and share card. | J1, E3 | rev 9 |
| **Settings** | Playback: Crossfade, **Gapless** and **Volume levelling** on by default. | H11 | Crossfade (rev 3); rest specced |
| **Phone only** | Gestures: swipe right = add to queue, left = like, long-press = 10 s preview; haptics on like/stamp. Home-screen ring widget with Resume. | H9, E8 | specced |

## Merged or parked (to avoid overcrowding)

| Idea | Decision | Why |
| --- | --- | --- |
| H6 Pick up where you left off | **Merged into the Stage** | A separate "resume" row would repeat the Stage. |
| H5 Rewind | **Merged into On repeat** as a toggle | Same shape (your most-played), different time window. |
| H3 Your mixes | **Replaces Moods** | Moods were mood-guesses; Your mixes are grouped from facts (genre, tempo). |
| H4 New for you | **Inside This week** (Fridays) | Avoids a seventh shelf; shows only when there is something new. |
| E4 Journey of the week | **Inside the Journey card / Journeys page** | Not a separate Home shelf. |
| J5, E7, H12 friends | **One V2 "Friends" feature** (friends' passports, listen together, Journey together) | Needs accounts + safety review for a teen audience. |
| J13 Your own Journey | **Parked** | Overlaps playlists; revisit after real users. |
| J14 Hook game | **Parked** | Fun, but a game mode inside a player risks clutter; revisit with Dig data. |
| J4, J10, J16, E5 | **V1 backend** | Need real catalog/credits data before they can be honest. |

## Tiers

- **V1 core (designed):** Stage + Pick up, Journey card, Dig, On repeat, This week, Following, Now Playing (+ Add similar, Start radio), Keep going, Journeys + stamps + passport, Explore set.
- **V1.1 (specced, design next):** Rewind toggle, Your mixes, New for you, Add songs that fit, lyrics card, Journey map views, Not for me, genre recap, gapless/levelling, phone gestures, widget.
- **V2:** Friends (J5/E7/H12), anything needing listener data (radio "kept together in Dig" signal grows with users).

## Radio rules (H1)

- 50 songs including the seed song first; then it ends (D-055: sources end honestly) and Keep going appears.
- Scored from facts only: tempo within ±6 BPM, same key / same mode, same genre, shared producer or writer, featured artist, kept together in your Dig.
- **Reasons are not shown** (owner 2026-10-07, D-072: "dont say what radio is picking… we should shock them, and curious"). The picks are a surprise: on the Radio page and in Up next only Now and Next are face up; the rest are face down and turn over as they play. Tap a card to peek; **Show all** turns everything over for people who want to plan. **New spin** re-picks the songs not yet played (Undo). Radio name: "<song> radio". No claim is made, so D-050 still holds.
- Add similar shows title and artist only.
- Playing radio never changes Journey progress (D-038).
