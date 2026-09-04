# Rondo product design direction

## Intent

Rondo should make a large music catalog understandable without copying an existing streaming dashboard. The visual system is editorial, artwork-led, dark by default, and precise about artists, releases, features, credits, and genre provenance.

## Primary hierarchy

`Rondo account → taste profile → genre → alphabetical artist → Artist Focus → matching/all catalog → album or EP → track → Details/Lyrics/Credits`

## Visual system

- Neutral interface chrome lets artwork and the active genre carry color.
- Lines, alignment, scale, and whitespace come before cards or heavy shadows.
- Warm ivory remains the light canvas; near-black listening surfaces define Night.
- Signal red remains the identity color, while runtime genre signals tint playback controls and ambience.
- Rounded pills are reserved for filters, tags, and compact status—not every surface.

### Listening palettes

| Genre | Accent | Secondary | Base |
| --- | --- | --- | --- |
| Hip-Hop | `#FF6846` | `#8C63FF` | `#09080D` |
| R&B | `#FF79BD` | `#8B7BFF` | `#0E0810` |
| Electronic | `#47E0CF` | `#5F7CFF` | `#050D11` |
| Jazz | `#F4B85F` | `#C45F7D` | `#100B08` |

Color is always paired with labels and position. It never communicates state alone.

## Desktop composition

- **Navigation rail:** Discover, Genres, Library, Journeys, Search, and Profile
- **Top bar:** location, journey visibility, appearance, search, and account
- **Genre Journey:** genre selector, A–Z index, artist list, and chapter context
- **Artist Focus:** portrait, biography, styles, counts, actions, and progress
- **Catalog:** albums/EPs newest-to-oldest with official track order
- **Inspector:** listening signals plus Details, Lyrics, and Credits
- **Transport:** persistent playback, progress, repeat, queue, availability, and volume

Playback collapses Genre Journey and widens the listening canvas. The control remains available in the top bar.

## Mobile composition

- compact top bar with journey, identity, appearance, search, and profile;
- fixed off-canvas Genre Journey above the app stack;
- condensed Artist Focus with no horizontal overflow;
- grouped album/EP catalog and persistent mini-player;
- full-screen player, immersive lyrics, queue, and completion sheet.

At 320px and 390px, the artist content begins directly below the top bar; the hidden journey occupies no normal-flow space.

## Full player and lyrics

The full player uses a three-part desktop rhythm: haloed artwork, track/control column, and large synchronized lyrics. On mobile it becomes a single reading flow. Current lyrics use warm ivory; past and future lines use controlled opacity; genre color marks interaction and time.

## Motion contract

- Motion follows playback, loading, or navigation state.
- Spectrum bars and halo drift are playback-driven simulations.
- No copy or UI claims real audio analysis.
- Paused motion becomes still rather than disappearing.
- Reduced-motion mode removes nonessential animation and smooth scrolling.

## Interaction quality

- 44×44px minimum for important controls;
- strong visible focus and synchronous focus return for dialogs;
- AA contrast for readable text and meaningful boundaries;
- no tooltip-only explanations;
- Escape closes the topmost overlay first;
- queue, player, and journey actions preserve playback;
- long names, metadata gaps, translated lyrics, and unavailable states must remain usable.

## Prototype status

Version 0.2.2 implements the immersive listening direction with fictional sample data. Production integration still requires licensed connectors and server-backed accounts.
