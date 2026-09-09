# Rondo product design direction

## Intent

Rondo is music-first, artwork-led, professional, and immediately understandable. It should feel made by a careful product team, not assembled from effects, strategy copy, or competitor patterns.

`find → play → explore → keep`

Curiosity comes from music, artwork, sequencing, contrast, and a few strong choices. Copy explains an action and gets out of the way.

## Hierarchy

```text
Discover
  → search / editorial / history-backed picks / sounds → song
  → compact Genre Journey links
Journeys
  → first visit: genre picker
  → Genre page → Artist Journey → release
Any song
  → Song Room
Library / Profile
  → memory and editable listener setup
```

Discover is quick/song-forward. Journeys is deliberate/artist-forward. They must never become duplicate pages.

## Route and shell behavior

Discover, Library, Profile, Genre pages, and Artist Journeys use distinct hash routes inside one shell. The active route owns title, main landmark, heading focus, and announcement. Back/Forward works without restarting the active recording. Inactive page DOM is removed or hidden intentionally; artwork loads lazily.

Separate documents are avoided in the prototype because they would reset playback/queue/position. Production can code-split without changing the route contract.

## Discover

Discover opens directly and never asks for a genre before showing music.

Order:

1. concise orientation and useful search;
2. Continue listening only when relevant;
3. finite editorial/history-backed shelves;
4. Sounds/moods;
5. compact Genre Journey links.

Made for you is absent at cold start. Once genuine played-track history exists, the section may appear with plain evidence-based framing such as `From your recent plays`.

Cards vary through authorized release identity and hierarchy—not random decoration. Prototype popularity copy is editorial; production trend copy needs source/time.

`src/ui/discoveryHub.js` is the canonical v0.3.2 renderer. The dormant `renderDiscoverView()` in `src/ui/views.js` uses rejected language such as “Find a door, not a feed” and must not be revived/adapted. Remove it before production catalog integration so one Discover contract remains.

## Journey picker

Appears only with no active Journey or after Change genre.

- direct readable choices;
- dynamic artist/song counts and per-genre progress;
- selected state and named primary action;
- contextual Back/close language;
- focus containment, Escape, inert background, and return;
- 44×44px targets.

It is a focused decision, not a permanent dropdown or Discover interruption.

## Genre page

A real destination with restrained genre atmosphere, stacked real release art, progress/next artist, Start/Resume, Play top mix, Change genre, scoped search, songs/releases/artists/hidden finds, and Discover return.

All genres share layout, language, and interaction. Variation comes from data/art/accent. Production adds genres by taxonomy/configuration—not copied CSS/JS/routes or fixed counts.

## Artist Journey and release identity

Inside Artist Journey, a compact current-genre/Change action replaces the old dropdown. Alphabetical browsing, release sequence, completion, queue, and playback remain clear. Artist primary action truthfully says Play/Pause/Resume.

Each release carries distinct authorized art, accessible accent, official sequence, and concise supplied context across Discover, Genre pages, release, Song Room, and Library.

## Song Room

The active cover drives accent and restrained blurred atmosphere while controls stay readable.

Desktop: art/title share stage without poster-scale type; active waveform only during playback; compact About/Lyrics/Credits/Extra/Up next; clear transport/timeline/volume.

Mobile: art remains dominant; title is compact; previous/play/next are clear; context becomes a usable sheet; mode bar remains reachable; 390px and 320px layouts do not overflow.

The time row uses three non-overlapping columns for elapsed, metadata, and remaining time. Metadata may truncate rather than collide.

Waveform communicates truth:

- `audio` only with active analyser data;
- `motion` for deterministic playback-driven fallback;
- `paused` while paused;
- `reduced` for meaningful static Reduced Motion.

Volume uses a native slider, icon, percentage, restrained level feedback, synchronized values, and correct mute restore. It never pretends to be frequency analysis.

## Motion

Animate only playback, focus, navigation, or subtle art response. Avoid orbits, particles, automatic card motion, and constant page-wide effects. Keep transitions short/calm and remove nonessential motion under Reduced Motion. Generated imagery is not part of the system.

## Copy

Use familiar labels: About, Lyrics, Credits, Extra, Up next, Change genre, Resume Journey, Play/Pause/Resume/Saved/Open. Prefer one short sentence. Describe actions, not product strategy. Keep policy/provenance out of primary listening copy while retaining it where decisions/rights need clarity. Unknown metadata stays unavailable.

## Accessibility and interaction quality

- one active page main landmark outside modal states;
- route titles/announcements and deliberate heading focus;
- visible focus and keyboard actions;
- topmost dialog containment/Escape/useful focus return;
- accurate current/pressed/selected/value states;
- 44×44px important mobile controls;
- non-color states;
- long names, missing art, unavailable sources, and instrumentals remain usable;
- no document overflow at desktop, 390px, or 320px;
- nav/player/content never cover each other.

## Large-catalog visual contract

- bounded shelves and first renders;
- progressive disclosure instead of giant lists;
- cursor-paginated/accessible virtual lists where needed;
- debounced search with stable loading/empty/error/rights states;
- dynamic counts from page metadata, never hard-coded global totals;
- skeletons preserve layout without false content;
- stable art aspect ratios and responsive image sizes;
- one data-driven Genre composition for all taxonomy entries;
- no full-catalog browser rendering or flattening.

## Current quality status

v0.3.2 candidate `89fc0d5` completed:

- all 12 enforced browser suites plus visual step green in run `34332141798`;
- 18/18 final desktop/mobile/compact/Light/Reduced Motion captures manually accepted;
- exact published preview blob passed 37/37 runtime checks with zero runtime/resource errors;
- no unresolved product defect identified.

It is ready for product-owner testing, not yet accepted or merged.
