# Rondo product design direction

## Purpose

Rondo's interface should make a large music catalog understandable without copying an existing streaming dashboard. The experience is artwork-led, editorial in spacing, and precise about artists, releases, credits, and genre provenance.

## Primary hierarchy

`Rondo account → taste profile → genre → alphabetical artist → Artist Focus → matching/all catalog → album or EP → track → Details/Lyrics/Credits`

## Desktop composition

- **Navigation rail:** Discover, Genres, Library, Journeys, Search, and Profile
- **Top bar:** current genre, A–Z navigation, search, and account
- **Artist Focus:** portrait, concise information, sourced genres, catalog counts, save/skip controls, and meaningful progress ring
- **Catalog:** albums and EPs newest-to-oldest with tracks in official order
- **Inspector:** Details, Lyrics, and Credits
- **Transport:** persistent playback, queue, repeat mode, availability, and volume

The first prototype's circular style map is removed. A circular form remains only if it communicates artist-catalog progress.

## Mobile composition

- compact genre and artist header;
- swipeable A–Z index;
- collapsible Artist Focus;
- catalog grouped by album/EP;
- persistent mini-player;
- full-screen Now Playing;
- immersive synchronized lyrics;
- artist-completion bottom sheet.

## Lyrics direction

- cover-derived background color with strict contrast safeguards;
- large, left-aligned synchronized lines;
- current line in warm ivory and upcoming lines at reduced opacity;
- signal red for position and interaction, not entire paragraphs;
- swipe between Details, Lyrics, and Credits;
- persistent compact transport;
- source and songwriter attribution at the end;
- distinctive Rondo transitions rather than a visual copy of another product.

## Onboarding direction

Use seven or fewer focused screens, clear progress, large choices, immediate back navigation, and a review screen. Avoid gamified quizzes, forced swiping, personality labels, and vague recommendation promises.

## Touch-up checklist

- Replace the orbit map with Artist Focus
- Add A–Z artist navigation and Skip artist
- Group songs under album/EP headers
- Add Matching songs / All catalog control
- Add Details / Lyrics / Credits views
- Add repeat-artist state and artist-completion prompt
- Design required onboarding and taste-review screens
- Add library, journey progress, and resume states
- Add skeletons without layout shift
- Add unavailable, disconnected, and partial-metadata states
- Use 44px minimum mobile targets
- Preserve focus, keyboard use, and reduced motion
- Validate long artist, track, album, and translated-lyrics text
- Never use a tooltip as the only icon explanation

## Prototype status

The deployed screen is a visual brand prototype with fictional data. It must be redesigned to match this document before production integration begins.
