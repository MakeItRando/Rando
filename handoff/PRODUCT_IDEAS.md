# Ranked product and design ideas

These are proposals for evaluation, **not implemented claims**. They preserve Rondo's music-first, truthful, non-manipulative direction and avoid copying competitors.

## P0 — strongest V1 differentiation

### 1. Quiet playback-context chip

Show a compact chip in the transport/side player: `Journey · Kairo Vale` or `Discover · Hits today`. Selecting it opens a two-card switcher with both saved sessions and positions. This makes the dual-session model understandable without adding a mode dialog.

### 2. Resume shelf

A truthful shelf that combines unfinished Journey, last global queue, partially explored release, and saved Song Room moment. Each card says exactly what will resume and from where. It should be based only on real activity.

### 3. Explainable Smart Queue

Offer small reasons per insertion—`same producer`, `from this release`, `new to you`, `saved artist`, `fits current energy`. Let listeners remove the reason/category. Avoid opaque “AI chose this” language.

### 4. Queue tuning, not endless autoplay

Two optional, reversible controls:

- **Familiar ↔ Discover**
- **Steady ↔ Shift energy**

Regenerate only upcoming items, preserve manually queued songs, preview the effect, and never trap the listener in autoplay.

### 5. Anti-fatigue sequencing

Avoid repeating the same artist, near-identical tempo, or sonic density unless the listener asks. Offer `Keep this feel`, `Change the mood`, and `Go deeper` instead of generic radio controls.

### 6. Rich artist worlds

Artist pages should connect releases, collaborators, producers, samples/interpolations where authorized, credits, era, and listener notes. Journey progression should feel like entering an artist's world, not checking boxes.

### 7. Song moments

Let a listener save a private timestamp with a short note, lyric line where licensed, or visual palette. Moments are searchable in Library and can later become consent-based share cards. No public social pressure in V1.

### 8. Non-manipulative Journey maps

Use albums/eras/collaborators as meaningful checkpoints. Progress reflects genuinely heard music and can be paused or reset. No streaks, shame, fake scarcity, or content locks.

## P1 — post-V1 growth

### 9. Credits-first discovery graph

Navigate by producer, writer, instrumentalist, label/imprint, scene, or collaborator. This can become Rondo's defensible discovery graph if provenance is accurate and rights-safe.

### 10. Personal listening lenses

Private views such as `voices I return to`, `late-night discoveries`, `albums I finished`, or `producers I keep finding`. Derive them only from actual behavior and explain the signal.

### 11. Device handoff

Move the active logical session—including context, queue, index, and position—between phone/web/desktop without flattening Journey/global sessions together.

### 12. Offline continuity

Authorized downloads keep both sessions coherent. Show availability honestly, preserve queue order, and provide graceful substitutions only with explicit consent.

### 13. Artist-controlled context

Verified artists can publish release notes, track stories, credits, listening order, and authorized visual assets. Keep editorial and artist-authored material clearly labeled.

## P2 — experimental/later

### 14. Shareable song moments

Generate restrained cards or short links around a timestamp, note, or authorized lyric excerpt. Receiving listeners land in a preview with clear source/provenance—not an engagement trap.

### 15. Collaborative listening paths

Friends can assemble a finite path with annotations and handoffs. It ends deliberately; it is not an infinite feed. Permissions and privacy must be explicit.

### 16. Context-aware discovery controls

Optional context such as focus, commute, or night can tune a temporary queue. Context expires and is never silently converted into a permanent sensitive profile.

## Design system opportunities

- Treat artwork as atmosphere, not wallpaper: restrained palette sampling and stable contrast.
- Use one consistent side-player/Song Room expansion grammar across all global sources.
- Prefer dense, useful shelves over giant hero banners.
- Make queue origin, progress, and switching visible before adding more recommendation surfaces.
- Add delightful micro-motion only for playback, focus, queue change, and context restoration; honor Reduced Motion.
- Use real empty/loading/error/offline/unavailable states as branded moments rather than generic skeletons.

## Explore backlog (owner asked to keep these, 2026-10-07)

Approved for now (D-067, building): full search results page, Rabbit hole trail, Save a tune. Saved for later:

### E1. Song of the day (V1-backend)
One song everyone on Rondo gets the same day, shown at the top of Explore with how many people played/kept it today. Gives teens a shared thing to talk about. Picked by a person/editorial rule, not an algorithm; never repeats an artist within 30 days. Needs a backend and enough listeners.

### E2. Decades / era dial (needs catalog metadata)
A fourth Tune a mix dial: Any · 80s · 90s · 00s · 10s · Now. Requires a reliable release year per song; hide the dial until ≥ 90% of the catalog has one.

### E3. Most kept in Dig (designed, hidden)
In Explore already (D-066) but hidden until Rondo has ≥ 500 digs/week, so the percentages mean something.

### E4. Friends' digs / charts (V2, not planned)
What friends kept this week; global charts. Needs accounts and privacy controls; charts risk sameness, so low priority.

## Journey ideas (2026-10-07, session B part 6)

Building now (D-069): Genre page with a real **map** (stations A→Z, rings, done/now/next/upcoming), **Artist Journey** (identity, releases newest→oldest, track states), **artist boundary** card ("You finished X · Meet Y" — next artist never autoplays, D-014; skipping ahead is allowed, no locks), **Meet the artist** 15 s hook before starting, **stamps** for finished artists (keepsake, not streaks), **Detours** (featured artists outside the Journey; don't count toward progress), **Pace** chosen when starting a genre (Essentials 5 per artist / Full discography), Change genre picker with accurate counts and per-genre progress, Play top mix (global session, never touches Journey progress, D-038).

Saved for later:
- **J1 Passport / share a stamp** — all stamps across genres in Profile, share card per stamp.
- **J2 Genre finish recap** — story cards when a genre is done (artists, hours, your pick per artist).
- **J3 Journey picks** — auto playlist of songs you liked during a Journey.
- **J4 Era checkpoints** — releases/eras as named checkpoints on long discographies (needs label metadata).
- **J5 Friends on the same Journey** (V2, accounts) — see who's on which artist, no rankings.

More Journey ideas (2026-10-07, after D-069 approval; owner likes stamps). All facts from metadata/plays, no guessing (D-050):
- **J6 Stamp back** — flip a stamp: dates started/finished, songs heard, first and last song, your most-played song of that artist, liked count.
- **J7 Stamp editions** — Essentials stamp vs Full-discography stamp (different edge); a bigger **genre seal** when every artist in a genre is done.
- **J8 Note on a stamp** — one private line per artist ("the 2nd EP is the one").
- **J9 Connections on the map** — thin lines between artists who featured on each other's songs (from credits); tap a line → those songs.
- **J10 Producer / label Journeys** — a Journey through one producer's credits or one label's roster (ties to Credits → Play their credits).
- **J11 Year view** — map sorted by first release year instead of A→Z (view only; progress order stays A→Z, D-014).
- **J12 Halfway moment** — small ring mark at 50 % of an artist; quiet toast, no confetti.
- **J13 Your own Journey** — pick 3–10 artists yourself, same map/stamps/boundary rules.
- **J14 Hook replay game** — after finishing an artist, 5 random 5 s hooks from their songs, tap the title; optional, no scores shared.
- **J15 Not for me** — mark an artist as skipped for good; map shows it honestly (grey, "skipped"), genre counts adjust.
- **J16 Download next artist** (V1-backend) — keep the current + next artist offline.

Engagement ideas — "worth coming back for / worth showing off" (2026-10-07, owner: "way engaging… maybe thats on fame"). Owner liked J6–J16 ("yes i like all those ideas"). Approved as direction (D-070, owner: "yes i like those idea (j and e), perfect"); designed in rev 9: E1, E2, E3, E4, E6 + J1, J6, J7, J8, J12 — see docs/specs/STAMPS_PASSPORT.md:
- **E1 Early ear** — stamp records the artist's monthly listeners when you finished ("Finished when Nia had 8,214 listeners"); if they grow, the stamp shows "You were early · now 1.2M". Real bragging right, factual.
- **E2 Collector number** — "You're the 1,284th person to finish Moni Gray" on the stamp. Lower = rarer.
- **E3 Share cards + public passport** — story-sized cards (stamp, genre seal, early ear) for Instagram/TikTok; profile link with 3 pinned stamps.
- **E4 Journey of the week** — one short editorial Journey (3 artists) for everyone; live "people on it now"; finishers get that week's stamp. An event, not a streak; flag: mild FOMO.
- **E5 Artist voice** (V1-backend, needs artists) — 20 s recorded intro on Meet, and a real thank-you note when you finish everything.
- **E6 Living stamps** — a finished stamp lights up when the artist releases something new ("1 new song"); one tap to finish again. Practical reason to return.
- **E7 Friends' passports** (V2) — see friends' stamps and who's on which artist; start a Journey together. No rankings by hours.
- **E8 Ring widget** — phone home-screen/lock-screen widget with your current artist ring and Resume.
- Avoid: streaks, hour-based leaderboards (pressure on a teen audience, rewards idle/looping playback).

Hook & ease ideas — "feels like Spotify's song radio, but honest" (2026-10-07, owner: make it more hooked and user friendly; small features and arrangement matter). Proposals, not decided. Rules kept: no autoplay traps (D-019), sources end honestly (D-055), facts only (D-050).
- **H1 Song radio** — "Start radio" on any song: 50 songs from real signals (same tempo ±6 BPM, compatible key, same genre/mood tags, shared credits, and once we have users "kept together in Dig / saved together"). Header says why ("same tempo · kept together"). Ends with H2, never silently.
- **H2 Keep going card** — when any source ends: three one-tap choices (Radio from the last song · next Journey artist · Dig), 8 s visible, no auto-start. Answers "music stopped" without an autoplay trap.
- **H3 Your mixes** — 4–6 mixes grouped from your own likes/plays by genre + tempo ("Your Hip-Hop · slow"), refresh weekly, named by the grouping, not by a mood guess.
- **H4 New for you (Friday)** — new releases from followed artists + artists you finished (ties to living stamps). Finite.
- **H5 On repeat / Rewind** — most played last 30 days; songs you played a lot months ago and stopped.
- **H6 Pick up where you left off** — first row on open: last source with exact position, one tap.
- **H7 Smart queue suggestions** — at the bottom of Up next / a playlist: "Add similar" with 5 songs from H1 signals; user taps to add.
- **H8 Playlist extender** — on your playlists: "Add 10 that fit" (same signals), preview before adding, Undo.
- **H9 Phone gestures** — swipe a row right = add to queue, left = like; long-press = 10 s preview; haptics on like/stamp.
- **H10 Lyrics card share** — select 1–4 lines → share card (same system as stamp cards).
- **H11 Crossfade + gapless + volume levelling** defaults on; Crossfade already in settings.
- **H12 Listen together** (V2) — friends join your session, shared queue.
Status (D-071, 2026-10-07): owner likes all; arranged in [docs/specs/FEATURE_PLAN.md](../docs/specs/FEATURE_PLAN.md). **Built (Home E rev 10):** H1 radio, H2 Keep going, H6 Pick up (merged into the Stage), H7 Add similar. **Specced V1.1:** H3 (replaces Moods), H4 (inside This week), H5 (toggle on On repeat), H8, H9, H10, H11. **V2:** H12 (merged into one Friends feature with J5/E7).
Already in the design: Go from, Rabbit hole, Tune a mix, Dig, Blend, On repeat, Sleep timer, Crossfade, Journeys + stamps.

## Artist page ideas (2026-10-07, after D-074). Built: A1–A4. Others saved with scope.

- **A1 You and <artist>** — heard / liked / in your playlists, Play your liked songs. *Built (rev 12.1).*
- **A2 Not for me** (J15) — leave an artist out of radio and suggestions, Undo, Journey untouched. *Built.*
- **A3 Release alerts bell** per followed artist. *Built.*
- **A4 Heard progress + NEW on releases.** *Built.*
- **A5 Artist pick** — the artist pins one song/release with a short note ("start here"). Needs artist tools. *V2.*
- **A6 Coming soon / pre-save** — upcoming release with date; one tap to get it in your library on release day. Needs label data. *V1.1 backend.*
- **A7 Timeline view** of releases (years as a line, ties to Journey map "Years" J11). *V1.1.*
- **A8 Live / tour dates** near you. *V2, partner data.*
- **A9 Artist-made playlists** ("what Kairo is listening to"). *V2, artist tools.*
- **A10 First listen** — "you first played Kairo on Aug 31 with Night Transit" in the You card, once play history exists. *V1 backend.*
- Avoid: follower counts as status, "top fan" leaderboards (teen audience, pressure).

## Suggested order

1. Validate separate playback sessions with the owner.
2. Add context chip and two-session switcher.
3. Add Resume shelf.
4. Add explainable queue reasons and tuning controls.
5. Deepen artist worlds, credits, and private moments.
6. Build device/offline continuity after production accounts and authorized playback exist.
