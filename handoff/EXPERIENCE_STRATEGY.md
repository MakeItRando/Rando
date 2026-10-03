# Rondo experience strategy

**Status:** proposed direction and quality lens, not new owner-approved scope. Use after the current candidate is fixed and accepted.

## Product thesis

Rondo should win by making music exploration feel continuous and trustworthy, not by reproducing a giant streaming catalog UI. The core promise is **find → play → explore → keep**:

- immediate enough for “play something good”;
- deep enough to understand an artist, release, song, and credits;
- calm enough that listeners do not feel manipulated;
- continuous enough that exploration never destroys where they were;
- memorable enough that a saved moment or note has value later.

## Signature advantages to protect

1. **Two listening intentions, one transport.** Global listening and a deliberate Journey each remember their own queue, recording, position, and source. The UI always explains which one is active.
2. **Artist worlds, not profile dumps.** Journeys sequence releases and context into a comprehensible path without locking ordinary playback.
3. **Song Room as useful depth.** Lyrics, credits, provenance, About, queue, moments, and notes belong around the recording; decorative effects never outrank the song.
4. **Explainable discovery.** Short finite shelves and queue reasons beat infinite unexplained autoplay. “Because you saved…” is better than fake precision.
5. **Memory with restraint.** Saves, progress, moments, and private notes create return value without streaks, scarcity tricks, or social pressure.
6. **Truth as premium craft.** Unknown credits stay unknown; unavailable playback explains why; demo versus authorized media is explicit; no fake popularity or generated facts.

## UX rules

- One primary action per section; secondary actions stay quiet.
- Navigation never changes playback. Explicit play changes context.
- Persistent player communicates track, artist, state, source context, and route back to Song Room.
- Song Room expansion is always explicit and reversible; closing it returns focus and does not pause.
- Night and Light share hierarchy and contrast rather than merely inverted colors.
- Motion confirms cause, continuity, and hierarchy; Reduced Motion removes nonessential movement without removing information.
- Mobile is not a compressed desktop. Keep thumb reach, safe areas, keyboard behavior, 320px reflow, and readable metadata first-class.
- Loading, empty, offline, rights-unavailable, error, and partial-metadata states are designed—not appended later.

## Highest-value follow-up ideas

### P0: before real catalog scale

- A quiet playback-context chip: `Journey · Kairo Vale` or `Discover · Late night`, with an explicit return action.
- A Resume shelf showing the exact Journey and global sessions without merging their state.
- One canonical data-driven renderer for each route family; remove dormant and observer-patched paths.
- Search grouped by Songs, Artists, Releases, and Journeys, with keyboard navigation and rights-aware unavailable results.
- Queue controls for less like this, more like this, finish release, and stop after this—never hidden endless autoplay.

### P1: production V1 differentiation

- Credits-first discovery links for writers, producers, featured artists, samples, and versions when authorized.
- Artist-authored context modules with provenance and editorial review.
- Personal listening lenses such as recent eras, saved moments, unfinished releases, and rediscovery—not competitive scores.
- Cross-device resume only after secure identity, conflict-safe sync, and privacy controls exist.

### Later experiments

- Shareable song moments that respect territorial playback and private-note boundaries.
- Collaborative listening paths with explicit consent and no public pressure metrics.
- Context-aware discovery controls (energy, familiarity, vocals, era) that remain understandable and reversible.

## Measures that matter

Do not optimize only for raw play count. Pair activation and retention with trust and usability:

- time to first meaningful play;
- successful return to an interrupted Journey;
- search-to-play success and zero-result recovery;
- saves/moments revisited after 7 and 30 days;
- Song Room depth usage without playback abandonment;
- queue edits and intentional session endings;
- accessibility task completion and error rate;
- rights-unavailable recovery rather than dead ends;
- crash, playback-start, stall, and sync reliability.

## Anti-patterns

No fake charts, oversized filler copy, generic card walls, mandatory gamification, content locks disguised as engagement, invented credits, auto-opening Song Room, silent queue replacement, unbounded client catalogs, or “AI” features without a concrete listener benefit and transparent control.
