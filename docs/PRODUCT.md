# Rondo product specification

## Product promise

Rondo helps a listener understand a genre by moving through artists one at a time, hearing albums and EPs in a deliberate order, and preserving everything worth returning to.

Rondo is equally a music player and a genre/artist explorer. It is not an article feed, a social feed, or a skin over another streaming application.

## Confirmed decisions

- **Account:** required Rondo account and editable taste setup
- **Artist order:** alphabetical within the selected genre
- **Artist chapter:** one artist at a time
- **Core releases:** albums and EPs, newest to oldest
- **Track order:** official disc and track order
- **Catalog default:** tracks matching the selected genre
- **Catalog escape hatch:** All catalog toggle
- **Boundary:** ask before continuing after an artist's final eligible track
- **Saves:** tracks, releases, artists, journeys, and progress owned by Rondo
- **Lyrics:** immersive synchronized presentation using Rondo's visual language
- **External accounts:** not required by the product concept

## Core hierarchy

`Create Rondo account → complete taste setup → choose genre → choose or resume artist → Artist Focus → matching/all catalog → album or EP → track → Details/Lyrics/Credits → completion summary → continue, replay, choose, or stop`

## Genre Journey

The journey provides a main genre selector, A–Z artist index, eligible-artist count, artist search, current chapter, and progress. A genre may contain thousands of artists; production results are paginated rather than presented as a fictional universal list.

When playback begins, the journey collapses so listening content gets the strongest visual priority. The listener can reopen or close it at any time without stopping playback. On mobile, the journey is a fixed off-canvas drawer and never reserves an empty layout column.

## Artist Focus

The panel includes artist portrait, name, location, active years, concise biography, sourced style tags, eligible-release and track counts, current alphabetical position, save/skip/play actions, and catalog completion.

## Artist catalog

**Matching** includes only tracks classified within the active genre. **All catalog** reveals the complete eligible album/EP catalog while keeping style labels visible. Tracks retain primary and featured artist distinctions, release, year, order, duration, explicit state, availability, and save action.

## Immersive listening system

### Appearance

- Night is the default appearance.
- Light and Night are both first-class, persistent preferences.
- The active genre changes the ambient accent, secondary signal, surface tint, progress treatments, and listening glow.
- Genre color never replaces text labels or semantic state.

### Genre signals

| Genre | Signal |
| --- | --- |
| Hip-Hop | Ember / ultraviolet |
| R&B | Rose / violet |
| Electronic | Cyan / cobalt |
| Jazz | Amber / burgundy |

### Motion

Signal bars, ambient drift, and artwork halos respond to the binary playback state. They are intentionally simulated interface motion—not frequency analysis or a claim that the browser is reading the audio signal. `prefers-reduced-motion` disables movement while preserving state and hierarchy.

### Up Next

Up Next shows the active artist chapter in release order, the current track, chapter progress, release context, style, and duration. Selecting a track updates playback without leaving the drawer. The queue does not silently cross the artist boundary.

### Full player

The full player combines artwork, track/release identity, featured artists, exact genre/style tags, tempo/key when supplied, progress, controls, Up Next, Genre Journey, synchronized demo lyrics, credits, and save state.

## Artist completion

After the final eligible track, playback pauses and displays tracks heard/saved, releases completed, artist progress, the next alphabetical artist, and Continue, Replay artist, Choose another artist, and Stop actions.

## Personalization

Onboarding creates the first taste profile. Behavior can later adjust suggested genres, subgenres, releases, and resume points transparently, but it never changes alphabetical artist order. Users can inspect and edit every explicit signal.

## Quality states

Every production feature defines loading, empty, partial-data, offline, unauthorized, rate-limited, unavailable-territory, and provider-error states. Controls must support keyboard use, visible focus, screen readers, 44px touch targets, safe areas, WCAG AA contrast, and reduced motion.

## Out of scope for version one

- social feeds and comments;
- podcasts and news;
- AI chat;
- public follower counts;
- collaborative listening;
- unsupported claims of real-time audio analysis;
- unlicensed commercial recordings or lyrics.
