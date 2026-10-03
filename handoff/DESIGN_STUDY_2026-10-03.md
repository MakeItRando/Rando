# Experience design study: 2026-10-03

## Why this exists

The owner rejected the current onboarding and broader visual language as
low-effort, overly synthetic in its vocabulary, too saturated in places, and not
yet distinctive enough to feel like a professionally designed product.

Generated concept boards were also rejected as incomplete: they showed visual
skins rather than a coherent product system across discovery, playback, artists,
Journeys, Library, motion, accessibility, and desktop.

## Current response

`design/living-record-study-01/` is an isolated, interactive study. It does not
modify the v0.3.2 candidate and must not be treated as accepted production UI.

The study proposes:

- “The Living Record” as a functional identity based on the Rondo ring;
- a warm Explore surface and focused dark Listen surface;
- one meaningful onboarding seed before first playback;
- controlled track-derived light instead of full-screen color flooding;
- distinct page grammar for Discover, Journeys, Artists, and Song Room;
- origin-preserving motion and a reduced-motion equivalent;
- designed offline, empty, error, and accessibility contracts.

## Important critique retained

The first draft of this study leaned too heavily on fashionable editorial-serif
styling. The product screens were revised so interface decisions, song titles,
artist names, and navigation use a modern sans. Serif is now reserved for lyrics
and editorial language. Future work must continue testing whether the system is
recognizably Rondo rather than merely tasteful.

## Verified state

- Isolated design prototype; no production files changed.
- Five mobile scenes render and switch correctly.
- Follow and save states work.
- Desktop layout has no horizontal overflow.
- 390px design-study layout has no horizontal overflow.
- Browser console errors: zero.
- Final artifact capture reports no clipped elements, overlay intersections, or
  horizontal viewport overflow.

## Next gate

The owner should review the direction, not approve individual colors in
isolation. If the emotional and interaction direction is accepted:

1. expand the prototype to Search, Library, Profile, Queue, Lyrics, errors,
   offline, loading, text zoom, and reduced motion;
2. map the accepted system onto existing routing and playback-context contracts;
3. write an incremental implementation plan with rollback checkpoints;
4. implement on the candidate branch and rerun the complete v0.3.2 quality
   matrix;
5. keep the redesign unmerged until owner testing and explicit acceptance.

## Do not do

- Do not merge this study as production UI.
- Do not recolor the existing app and call the redesign complete.
- Do not use a mascot without a genuine product role.
- Do not turn Journeys into playlists, Artist pages into metric dashboards, or
  Discover into an infinite feed.
- Do not copy sampled album colors directly into interface backgrounds.
- Do not lose existing playback-context continuity while redesigning navigation.