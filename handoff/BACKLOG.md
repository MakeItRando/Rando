# Rondo backlog — one arranged list

**Updated:** 2026-10-10 (Home E rev 16). This is the single place for *what's next*. Details of each idea live in [PRODUCT_IDEAS.md](PRODUCT_IDEAS.md); decisions in [DECISIONS.md](DECISIONS.md); every owner message in [CONVERSATION_LOG.md](CONVERSATION_LOG.md). Update this file in the same session whenever the owner says yes / no / later to anything.

Status words: **Now** (working on it) · **Next** (agreed, queued) · **Profile & social phase** (owner: "we will work on them when designing profiles") · **Real apps** (needs native apps/backend) · **Parked** (maybe, ask again later) · **Dropped** (owner said no / not useful).

## Now
- **Rev 16 built, waiting for owner look:** timed lyrics with sections, singer, gap dots, moment marks, Back to now; new icon set (D-084). Left side of the Song room (cover, chips, action buttons) not changed yet — ask owner.
- **Song room / Now Playing + Lyrics redesign** — owner (2026-10-10): "lyrics panel and songroom doesnt look that good and creative… where user gonna spend most of time"; "the icons are bad". Part of it is demo data (4 lyric lines looping), part is design. Plan: real-length demo lyrics with verse/chorus, a lyrics layout with character, new icon set across the app, then judge again. See Holes H1, H2.

## Next (agreed order)
1. **Mixtapes (I2) + Playlist page refresh** (owner: Playlist page most boring).
2. **Pin to top (S1)** in the sidebar.
3. **Your month** — improve the existing "September on Rondo" recap (owner: "already there… add things and make it better"). Any time, no streaks.
4. Library page → Profile/Settings → First run.
5. Build the real apps on the approved design (D-062 desktop + phone), polish/motion pass (D-073, I6 cover-tinted app).

## Built recently (owner has seen)
- Moments (D-082) + remove (Already saved · Remove, ×) + Artist moments; player look never changes inside a moment (rev 15.2).
- Sleep timer chip: one line, replaces the clock while on (rev 15.3). Timer itself existed (15/30/45/60 min, End of this song).
- Tap a lyric line to jump — already existed (Now Playing → Lyrics).
- About fills itself (rev 15.3, D-083 proposal): First heard + where from, when you play it most, which playlists. Owner: "make it more auto, people are lazy".
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
- **Quiet hours (N7)** — owner: would it add an onboarding step? and many people listen after midnight. Answer: it only mutes *notifications*, never music; no onboarding step. If kept, one Settings toggle, **off** by default. Decide in Settings design.
- Song of the day, Decades dial (Explore backlog).

## Dropped
- **Blind listen (N1)** as its own feature — overlaps Dig (owner: "dig works like the same no?"). Yes; Dig already hides hype (no play counts until enough listeners).
- **Side A / Side B playlists (N4)** — owner: "should be a useful feature not an easter egg".
- Filled ✦ / changing player look inside a moment (rev 15.1) — owner: "thats bad".

## Holes found (2026-10-10 audit) — things the app still lacks
| # | Hole | Why it matters | When |
| --- | --- | --- | --- |
| H1 | Song room / Lyrics look plain; demo lyrics are 4 lines on loop | Where people spend most time | **Rev 16 built** (lyrics); left side pending |
| H2 | Icon set is inconsistent / weak | Owner: "icons are bad"; seen on every screen | **Rev 16 built** (one set, 1.75 px round) |
| H3 | **Import from other apps** (Spotify/Apple Music/YouTube playlists + likes) | Biggest reason people don't switch apps | First run / Library design |
| H4 | **Explicit filter / clean versions** + "E" badge | Teen audience, parents | Settings design |
| H5 | **Offline/downloads** — no download button, state or storage view anywhere | Teens on mobile data | Library design |
| H6 | **No-connection, error and empty states** | Every real app hits these on day one | First run + each page |
| H7 | **Search by a lyric line** you half remember | Common real search; we have lyrics | Search refresh |
| H8 | **Lyrics translation / romanization** (K-pop, Latin, Afrobeats) | Global teen taste | Song room redesign |
| H9 | **Your start point** — if you always skip a song's intro, About offers "Start at 0:18 next time" (auto, from play history) | Auto, useful, nobody has it | Song room redesign |
| H10 | Accessibility pass (screen reader labels, focus, reduced motion everywhere) | Required for real apps | Real apps |
| H11 | Library page, Profile/Settings, First run not designed | Core pages | Next list |
