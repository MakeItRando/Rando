# Rondo product design direction

## Purpose

Rondo's interface should make a large music catalog understandable without copying a streaming dashboard. The experience is artwork-led, editorial in spacing, and precise about artists, releases, credits, and genre provenance.

## Primary screen hierarchy

`Genre → alphabetical artist → artist information → matching/all catalog → release → track → playback details`

## Desktop composition

- **Navigation rail:** Discover, Genres, Library, Search, and Settings
- **Top bar:** current genre, A–Z navigation, search, and profile
- **Artist Focus:** artist portrait, concise information, sourced genres, catalog counts, save/skip controls, and meaningful progress ring
- **Catalog:** releases newest-to-oldest with tracks in album order
- **Inspector:** Details, Lyrics, and Credits tabs
- **Transport:** persistent playback, queue, repeat mode, device state, and volume

The first prototype's circular style map is removed from the main experience. A circular form may remain only as artist-catalog progress around the artist portrait.

## Mobile composition

- compact genre and artist header;
- swipeable A–Z artist index;
- collapsible Artist Focus summary;
- catalog grouped by release;
- persistent mini-player;
- full-screen Now Playing surface;
- full-screen synchronized lyrics with controls kept reachable by one hand;
- bottom sheet for artist completion.

## Lyrics direction

Lyrics should feel as immersive as a modern streaming product while remaining recognizably Rondo:

- cover-derived background color with strict contrast safeguards;
- large, left-aligned synchronized lines;
- current line in warm ivory and upcoming lines at reduced opacity;
- signal red used for position and interaction, not entire paragraphs;
- swipe between Details, Lyrics, and Credits;
- persistent compact transport;
- source and songwriter attribution at the end.

## Catalog details

Each release header includes cover, title, type, date, track count, duration, and save state. Each song row explicitly identifies the release it belongs to, featured artists, genre/style labels, duration, and explicit status.

## Touch-up checklist

- Replace the unexplained orbit map with Artist Focus
- Add A–Z artist navigation and Skip artist
- Group songs under visible release headers
- Add Matching songs / All catalog segmented control
- Add Details / Lyrics / Credits tabs
- Add repeat-artist state and artist-completion prompt
- Add skeletons without layout shift
- Add unavailable, disconnected, and partial-metadata states
- Increase touch targets to at least 44px on mobile
- Preserve visible focus and reduced-motion behavior
- Validate truncation for long artist, track, and album names
- Never use a tooltip as the only explanation for an icon

## Prototype status

The current deployed screen remains a visual prototype with fictional data and demonstrates the brand foundation. It must be redesigned to match this document before production integration begins.
