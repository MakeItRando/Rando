# Spec: Explore

Status: **study, proposal D-066** (awaiting owner verdict). Built inside the Home E study (`design/studies/2026-10-05-home-e/`, rev 5) so it shares the real player, queue and state rules. Desktop + phone (D-062).

## Job

Home is **your** music (what you play, your Journey, who you follow). Explore is **everything past it**: search, and finite ways to step outside your usual rotation. Nothing on Explore repeats a Home row; Dig appears on both because it is the daily habit.

## Sections, top → bottom

1. **Header** — "Explore" + a large search field (opens the same search as ⌘K; on phone this is the search page) + Recent searches chips (tap = run that search).
2. **Dig** (left card) — today's status: new today / n of 10 / done; sleeve fan; Start/Continue digging or Play Dug. Same state as the Home band (D-061).
3. **Tune a mix** (right card) — three dials, each Any or one value:
   - Tempo: Slow (< 95 BPM), Mid (95–120), Fast (> 120)
   - Voice: Vocals (has lyrics), No vocals
   - Feel: Bright (major keys), Dark (minor keys)
   Live result: count, minutes, sleeve strip, one plain sentence of why ("Songs with under 95 BPM, minor keys."). Play mix plays a finite source "Tuned: Slow · Dark", slowest first, and stops at its end. On the live tune the button toggles Pause/Resume (never restarts); the card gets the accent border. No match → "Nothing matches all three. Loosen one dial." and Play is disabled.
4. **Go from <current song>** — up to 3 cards computed from the song you are hearing:
   - Same tempo — 6 songs closest in BPM (shows the range).
   - Same dark/bright keys — songs in the same mode, exact key first.
   - More with <featured artist> (from credits) or More from <artist>.
   Cards with no songs are hidden. While one of these mixes plays, its seed song stays fixed, so the card you pressed doesn't move.
5. **Genres** — all genre tiles (8 in the demo), each is a Journey: "3 of 7 artists" + progress, or "n artists · Journey". In-progress tile shows Resume/Pause; others open the Journey (Journey pages = next design step).
6. **Out this week** (left) — every new release, followed or not; followed artists get a "Following" tag. **Most kept in Dig** (right) — top 5 songs by keep-rate across Rondo this week ("71% kept"); tap plays the full song.

## States

- Playing/paused: every card with a source shows the live state (D-055).
- Empty: no Dig left → done state; empty tune → disabled Play; Go from hides empty cards; no releases → "Nothing new this week. Follow artists from any song." (spec only).
- Offline (app): Explore shows downloaded songs only in Tune a mix and Go from; Most kept/Out this week show "Needs a connection".

## Interactions & shortcuts

- Sidebar: Home, **Explore**, Journeys, Library. **E** toggles Home ⇄ Explore. ⌘K / Ctrl+K still opens search from anywhere.
- Phone bottom tabs become **Home · Explore · Journeys · Library**. Dig moves from its own tab to the first card of Explore (plus the Home band). Reason: Dig is a once-a-day ritual, search is used many times a day; four tabs keep touch targets large. Reverting is a one-line change if the owner prefers the Dig tab.

## Responsive

≥1241: Dig 5/12 + Tune 7/12, Go from 3 cards, genres 4 columns, two lists side by side. ≤1240: Go from shows 2. ≤1020: everything single column, genres 2 columns. ≤640 (phone): stacked, Recent chips scroll sideways, Go from cards full width with visible play buttons, genre tiles 120 px, keep-rate bars hidden (percent stays). No sideways page scroll at 390 px (tested).

## Motion

Tune strip sleeves pop in (staggered 30 ms) when a dial changes; genre sleeve stacks fan on hover; Dig fan tilts on hover; card lift on hover. All off under Reduced Motion.

## Scope

| Feature | Scope |
| --- | --- |
| Search page, Recent searches, Tune a mix, Go from, Dig card, Genres | V1-local (metadata: BPM, key, lyrics flag, credits) |
| Out this week (all artists), Most kept in Dig (across Rondo) | V1-backend |
| Charts, friends' digs | V2 / not planned |

## Data

Song: bpm, key (mode), has lyrics, credits (artists), genre, release date. Dig: keep/skip events (aggregated, anonymous) for Most kept. No AI, no "for you" guessing (D-050): every reason shown is a fact from metadata.

## Acceptance tests (in `check.mjs`)

Explore tab opens Explore; no element overflows at 390 px and no sideways scroll; Dig opens from Explore and closing returns to Explore; Tune only includes matching songs; Play mix plays the tuned source and a second press pauses; empty tune disables Play; Go from plays, keeps its seed while playing, stops at its end.

## Open questions

- Keep Dig as its own phone tab (5 tabs) or inside Explore (4 tabs, proposed)?
- Should Most kept in Dig show at all before Rondo has enough listeners? (Proposal: hide until ≥ 500 digs/week.)
