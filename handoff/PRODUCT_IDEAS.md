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

## Suggested order

1. Validate separate playback sessions with the owner.
2. Add context chip and two-session switcher.
3. Add Resume shelf.
4. Add explainable queue reasons and tuning controls.
5. Deepen artist worlds, credits, and private moments.
6. Build device/offline continuity after production accounts and authorized playback exist.
