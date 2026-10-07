# Spec: Explore

Status: **owner-approved (D-066)** + additions D-067 (search page, Rabbit hole, Save a tune — built, awaiting look). Genre Journey pages come with the Journeys step. Later ideas: handoff/PRODUCT_IDEAS.md § Explore backlog. Built inside the Home E study (`design/studies/2026-10-05-home-e/`, rev 5) so it shares the real player, queue and state rules. Desktop + phone (D-062).

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

## Search page (D-067)

- Focusing the Explore search field turns the page into search (Explore sections hide; phone shows Cancel). Inside Explore, ⌘K / Ctrl+K and / focus this field; elsewhere they still open the palette.
- **Empty query:** Recent searches (remove one with ×, Clear all with Undo) + Browse genres tiles.
- **Typing:** results update on every key. Matching ignores case and accents, every word must match title, artist/subtitle or genre; ranking = exact → starts with → word starts with → contains, then Artists, Genres, Playlists, Songs. Matched text is bold.
- Layout: filter chips All · Songs · Artists · Playlists & releases · Genres (with counts; empty ones disabled) → **Top result** card (big, plays/opens) + Songs (4, "All n") → Artists, Playlists & releases, Genres (4 each, "All n").
- Rows show live state (accent + pause) when that song/source is playing; pressing again pauses (D-055).
- Enter = play/open top result and remember the query; Esc clears the text, Esc again leaves search.
- **No results:** "No results for "x"" + tip + suggestion chips. Never an empty screen.
- Phone: same, Cancel button, sideways-scrolling filter chips, one column.

## Rabbit hole (D-067)

- Starts when you play any Go from mix: the seed song is the first stop.
- While that mix plays a different song, a dashed card offers **Go from <now playing> next** — hopping re-seeds Go from without touching playback.
- Trail bar: "Rabbit hole · Night Transit → Margins → …" (tap a stop to go back to its Go from), count of songs played, **Save as playlist** (every song played in the hole, in order; Undo), × End (Undo).

## Save a tune (D-067)

- **Save tune** next to Play mix (disabled when every dial is Any or nothing matches). Saved tunes are playlists that keep their dials and update as songs are added ("Tune · 9 songs · updates"), with a small tune badge in the sidebar / Library.
- "Your tunes" chips above the dials restore a saved tune; a saved tune shows **Saved** (pressing again just says it's already saved).

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

Search: results in place with best match first, no-results state, Esc twice leaves, Ctrl+K focuses the field; Rabbit hole hop re-seeds and Save as playlist doesn't change playback; Save tune saves once and its chip restores the dials. Explore tab opens Explore; no element overflows at 390 px and no sideways scroll; Dig opens from Explore and closing returns to Explore; Tune only includes matching songs; Play mix plays the tuned source and a second press pauses; empty tune disables Play; Go from plays, keeps its seed while playing, stops at its end.

## Open questions

- ~~Dig tab~~ → inside Explore, 4 tabs (owner yes, D-066).
- ~~Most kept before enough listeners~~ → hidden until ≥ 500 digs/week (owner yes). The study shows it so the design is visible.
- Owner asked for more Explore ideas (2026-10-07); candidates listed in handoff/STATE.md, awaiting pick.
