# Rondo backlog — one arranged list

**Updated:** 2026-10-10 (Home E rev 19.1). This is the single place for *what's next*. Details of each idea live in [PRODUCT_IDEAS.md](PRODUCT_IDEAS.md); decisions in [DECISIONS.md](DECISIONS.md); every owner message in [CONVERSATION_LOG.md](CONVERSATION_LOG.md). Update this file in the same session whenever the owner says yes / no / later to anything.

Status words: **Now** (working on it) · **Next** (agreed, queued) · **Profile & social phase** (owner: "we will work on them when designing profiles") · **Real apps** (needs native apps/backend) · **Parked** (maybe, ask again later) · **Dropped** (owner said no / not useful).

## Now (owner 2026-10-11: "we should be working on song room for sure before going to library… its design the worst i think, following playlist and artist journey playlist")
1. **Library page — rev 23 built (D-091 proposal)**: filters, Find, Recent/A–Z, tiles (moments, Your month, Passport), ⋯ Pin to top (phone pins), Download (state), Edit details, Delete + Undo, New playlist. Later: real import (H3), real downloads/storage (H5), folders only if asked.

## Next (agreed order)
1. Profile/Settings → First run.
2. Build the real apps on the approved design (D-062 desktop + phone), polish/motion pass (D-073, I6 cover-tinted app).

## Built recently (owner has seen)
- Song room fixes (rev 20, D-088), Playlist page basics (rev 21, D-089), Artist Journey page (rev 22, D-090) — confirmed, owner: "continue".
  - **Song room fixes — rev 20 built (D-088 proposal)**: Credits → Songs with <name>, About one line, first ♥ → Add a note, phone labels, lyrics fade. Owner chose fixes over a full redesign ("its not that bad either"). Original notes: Problems seen by eye: static cover left / text right looks like a settings page, same as the Home hero; tabs bar sits over the first lyric lines (no fade); Credits repeats "Play their credits" 5×; About reads like a form; right third empty on wide screens; on phone the lyrics only start after scrolling past cover + controls; 4 unlabeled icons on phone. Also brings H8 (translation) and H9 (start point) if they fit.
  - **Playlist page — rev 21 built (D-089 proposal)**: one list per playlist, Liked = liked, Remove + Undo, drag to reorder (desktop), Find, real New playlist, hero tint. Later: phone reorder (touch drag, real app), "date added" column if people ask.
  - **Artist Journey page — rev 22 built (D-090 proposal)**: station strip (prev/next station + rings), Starts here / Continue here, one real Follow state + Undo. Original notes: same cover repeated per release, long list, little sense of a journey. Later: real per-release covers (catalog).
- Your month (rev 19, D-087 confirmed — owner: "yes perfect"). Rev 19.2 readability pass (text contrast ≥4.5:1). Rev 19.1 final touches + bug pass (M vs ⇧M, This week = month numbers, dates match stamps, labels).
- Pin to top (rev 18, D-086 confirmed — owner: "yes nice").
- Playlist refresh + **Mixtapes** (rev 17, D-085 confirmed — owner: "yes, i like that"); final touches rev 17.1. Receiver view + share link → Profile & social phase / V1 backend.
- Song room lyrics + new icon set (rev 16, D-084), tidy left side + selectable lyrics + Copy lyrics (16.1) — owner: "i like that". Final touches rev 16.2: phone lyrics box follows the line, Enter/Space jumps, reduced motion.
- Moments (D-082) + remove (Already saved · Remove, ×) + Artist moments; player look never changes inside a moment (rev 15.2).
- Sleep timer chip: one line, replaces the clock while on (rev 15.3). Timer itself existed (15/30/45/60 min, End of this song).
- Tap a lyric line to jump — already existed (Now Playing → Lyrics).
- About fills itself (rev 15.3, D-083 confirmed): First heard + where from, when you play it most, which playlists. Owner: "make it more auto, people are lazy".
- Deep cuts, Song notes, sidebar (D-078/080/081).

## Profile & social phase (save until we design profiles)
Owner (2026-10-10): visiting someone's profile should let you *feel their music taste*, recommend them songs, talk to them, and more.
- **Taste on a profile** — their sound in a glance: top genres as words, 3 songs that define them, finished Journey stamps (passport E3), their moments (if shared). "You both love…" line when tastes overlap.
- **Recommend to someone** — send a song/playlist straight to a person's profile inbox, with one line.
- **Talk** — simple replies on a shared song (no public comment walls; teen safety first).
- **Swap a song (N10)** — send one, get one back.
- **Playlists from friends or strangers** (owner's take on N1) — follow real people's playlists, lean toward underrated artists. Note: Dig already covers "no-hype discovery" for songs; this is the people side.
- **Mixtape for a friend (I2)** links here once accounts exist.
- **Moment reel (N5), Room mode (N6)** — parked here as social reminders, owner unsure they're useful.
- **Friends on the same Journey (J5/E7), Listen together (I5/H12)** — V2.
- **Collector number / Early ear (E1/E2)** — profile badges, never rankings.

## Real apps
Mini player window (I4), Journey take-along offline (I7), lock-screen/car controls, widgets (E8), Room mode (N6), device hand-off.

## Parked
- **Lyrics licence check** — full-lyrics copy/share may be limited by the lyrics provider; confirm at licensing (ARCHITECTURE/PRODUCTION_PLAN).
- **Quiet hours (N7)** — owner: would it add an onboarding step? and many people listen after midnight. Answer: it only mutes *notifications*, never music; no onboarding step. If kept, one Settings toggle, **off** by default. Decide in Settings design.
- Song of the day, Decades dial (Explore backlog).

## Dropped
- **Blind listen (N1)** as its own feature — overlaps Dig (owner: "dig works like the same no?"). Yes; Dig already hides hype (no play counts until enough listeners).
- **Side A / Side B playlists (N4)** — owner: "should be a useful feature not an easter egg".
- Filled ✦ / changing player look inside a moment (rev 15.1) — owner: "thats bad".

## Found in the by-eye review (2026-10-11)
- **Song room on wide screens** — lyrics stop at the middle, right third empty. Fix in the Song room pass with H8/H9 (e.g. centre the lyrics or let them use the width). Not a new feature.
- **Placeholder art is flat** — every cover is a simple shape, so pages look alike. Real covers + I6 cover-tinted app fix it in the real apps; prototype stays as is.
- **Day-one Home** — every screen assumes months of history; a brand-new listener's Home/sidebar/Your month are not designed. Belongs to First run (H6/H11).

## Holes found (2026-10-10 audit) — things the app still lacks
| # | Hole | Why it matters | When |
| --- | --- | --- | --- |
| H1 | Song room / Lyrics look plain; demo lyrics are 4 lines on loop | Where people spend most time | **Rev 16–16.1 built** (lyrics, left side, copy) |
| H2 | Icon set is inconsistent / weak | Owner: "icons are bad"; seen on every screen | **Rev 16 built** (one set, 1.75 px round) |
| H3 | **Import from other apps** (Spotify/Apple Music/YouTube playlists + likes) | Biggest reason people don't switch apps | First run / Library design — rev 23: Library has the entry button (real import = real app) |
| H4 | **Explicit filter / clean versions** + "E" badge | Teen audience, parents | Settings design |
| H5 | **Offline/downloads** — no download button, state or storage view anywhere | Teens on mobile data | Library design — rev 23: Download + Downloaded filter (state only) |
| H6 | **No-connection, error and empty states** | Every real app hits these on day one | First run + each page |
| H7 | **Search by a lyric line** you half remember | Common real search; we have lyrics | Search refresh |
| H8 | **Lyrics translation / romanization** (K-pop, Latin, Afrobeats) | Global teen taste | Not done in rev 16 — later Song room pass |
| H9 | **Your start point** — if you always skip a song's intro, About offers "Start at 0:18 next time" (auto, from play history) | Auto, useful, nobody has it | Not done in rev 16 — later Song room pass |
| H10 | Accessibility pass (screen reader labels, focus, reduced motion everywhere) | Required for real apps | Real apps |
| H11 | Library page, Profile/Settings, First run not designed | Core pages | Next list |
