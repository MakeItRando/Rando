# Spec: Journeys

Status: **approved, D-069** (owner 2026-10-07: "yes i like that, the stamp idea is good"). Built in Home E rev 8 (`design/studies/2026-10-05-home-e/`, end of `app.js`/`style.css`). Desktop + phone (D-062). Follows D-008 (picker only with no active Journey or after Change genre), D-014 (A→Z, release order, explicit artist boundary) and D-038 (other playback never touches Journey state).

## Job

Know a genre properly: go through its artists one at a time, A to Z, and always know where you are. Journeys is deliberate and artist-first; Explore and Home are quick and song-first. They never duplicate each other.

## Landing

- **Journeys** (sidebar, phone tab, Home Journey card, "<genre> Journey" links in Explore) opens the **genre page of your active Journey**.
- No Journey started yet → the **Choose a Journey** picker opens on top (D-008).
- Home path nodes open that artist's Journey page directly.

## Genre page

- **Hero** (tinted with the genre colour): breadcrumb *Journeys › Hip-Hop*, genre name, one-line note, facts **3 of 7 artists · 41 of 88 songs · Full discography**, one progress line.
- **Actions:** primary **Start / Resume / Pause <current artist>** (one button, state-aware), **Play top mix**, **Change genre**.
- **Search <genre>:** scoped to this Journey (artists, songs, releases). Esc clears. No results → "Nothing in the Hip-Hop Journey matches "…". Try Explore to search everything."
- **Your map:** every artist is a station, A→Z, joined by a line. Each station has a ring (songs heard / songs in the Journey) and a state: **Finished** (check), **Now** (accent ring, bars while playing), **Next**, upcoming (song count, dimmed). Tap → Artist Journey. Phone: vertical timeline.
- **Now on your Journey:** current artist (origin, tags, songs heard), Start/Resume + Open, then the **boundary card** (below).
- **Your stamps:** one stamp per finished artist with the date; empty numbered slots for the rest. "No streaks, no timers."
- **Top songs in <genre>:** first song of each artist, plays as a mix — the Journey stays where it is.
- **Releases** (newest first) and **Your other Journeys** (per-genre progress, tap to switch).

## Artist Journey

- Breadcrumb *Journeys › Hip-Hop › Moni Gray*. Large round portrait with a progress ring; "Station 4 of 7 · Hip-Hop Journey"; origin · years active · tags; a short factual bio; **Start / Resume / Replay**; Follow; "0 of 6 songs heard".
- Finished artist: their **stamp** sits in the hero.
- **Catalog toggle:** *<genre> songs* / *All catalog*.
- **Releases newest → oldest** (D-014), each with sleeve, type · year, song count · length, and songs in official order. Song states: number, ✓ heard, bars = playing now, dimmed "not in Essentials".
- **Detours:** songs this artist is featured on outside the Journey. They play normally but **don't count toward progress**.
- **Boundary card** at the end.

## Artist boundary (D-014)

- Before finishing: "After Moni Gray: Nia Vale · 11 songs · Chicago, US. Finish Moni first, or skip ahead — your progress stays." → **Meet Nia** · **Skip ahead**.
- After finishing: playback **stops** at the last song (never autoplays the next artist), toast "You finished Moni Gray · stamp collected" → **Meet Nia**; the card turns solid: "Next: Nia Vale … won't start until you say so."
- **Skip ahead** moves the current artist; the toast keeps the old artist's progress and offers **Undo**. No locks.
- Last artist finished: "You finished the Hip-Hop Journey" → Choose a genre.

## Meet the artist

Modal: portrait, station, origin · years · tags, bio, a **15 s hook** (ring timer, pause/replay; main playback pauses and a Resume toast appears after), **Start <artist>** / **Not now**, and a note: "Starting Nia makes them your current artist. Moni Gray keeps their progress."

## Pace

Chosen when you open a genre you haven't started: **Essentials** (first 5 songs per artist) or **Full discography**. Shown in the hero; fixed once started (shown in the picker as "Depth: … · chosen when you started"). Essentials hides nothing — songs outside it stay visible, dimmed.

## Change genre (picker)

Left: every genre with artists · songs, progress line, and state (**Active / In progress / New**). Right: the selected genre — artist portraits, note, Artists (n, A to Z), Progress, pace choice if new, **Open / Continue <genre> Journey**. Arrow keys move between genres. Changing never erases anything; each genre keeps its own current artist and progress.

## Playback rules

- Journey playback is its own source per artist ("Hip-Hop Journey · Moni Gray"). Only songs started from a Journey count as heard.
- **Play top mix**, Detours, Explore, Home and Search playback never change Journey genre, artist, position or progress (D-038).
- End of an artist always stops (D-014, D-055).

## States

Not started genre (no progress, pace choice), in progress, current artist playing / paused, artist finished (stamp, boundary ready), genre finished, search with/without results, generated songs without lyrics ("No lyrics yet" in Now Playing instead of calling them instrumental).

## Responsive

Desktop: hero with actions right, horizontal map, two columns (Now + Stamps). ≤1020 px: one column. Phone (390 px): stacked hero with full-width Start, vertical map, stacked cards, releases as a swipe row, picker full width above the mini player. No sideways scroll (tested).

## Scope

- **V1-local:** everything above with local progress.
- **V1-backend:** real catalog data (release order, features for Detours, bios, origin), synced progress and stamps.
- **V2:** friends on the same Journey (J5).
- Saved for later (PRODUCT_IDEAS → Journey ideas): J1 passport / share a stamp, J2 genre finish recap, J3 Journey picks playlist, J4 era checkpoints.

## Study limitations

- Only Hip-Hop uses hand-made songs (Moni Gray m1–m6). Other genres, artists, bios and song titles are **generated placeholders** so every genre can be clicked through; real data replaces them.
- The Home Journey card still shows Hip-Hop.
- *All catalog* toggle only shows a toast (study artists have no non-genre releases).

## Acceptance tests (`check.mjs`)

Journeys nav opens the genre page with the map · station opens the Artist Journey · Start plays from the first unheard song · end of artist stops, stamp + toast, never autoplays the next artist · Skip ahead + Undo keeps progress · Play top mix doesn't change progress · Change genre switches, applies pace, erases nothing · Meet pauses main playback; Start makes that artist current and plays · scoped search no-results · phone Journeys tab + no sideways scroll at 390 px.
