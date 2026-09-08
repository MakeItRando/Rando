# Rondo product design direction

## Intent

Rondo is music-first, artwork-led, and easy to understand. It should feel designed by a careful product team, not generated from a pile of effects or marketing phrases.

The interface follows a simple rhythm:

`find → play → explore → keep`

Curiosity comes from music, artwork, and a few strong choices. Copy explains what an action does and then gets out of the way.

## Primary hierarchy

```text
Discover
  → search / suggestions / sounds → song
  → Genre Journeys
Journeys
  → first visit: genre picker
  → genre page → artist → release
Any song
  → Song Room
```

Discover and Journeys must never feel like duplicate pages. Discover is quick and song-forward. Journeys is deliberate and artist-forward.

## Page partitions

Discover, Library, Profile, Journey genres, and guided artist Journeys use distinct hash routes inside one application shell. The visible route owns the main landmark, document title, and heading focus.

This page model gives listeners clear destinations and browser Back/Forward without restarting the active song. Inactive page content is removed rather than left as a large hidden duplicate. Artwork below the fold loads lazily.

Separate HTML documents are intentionally avoided because they would reset playback, queue, position, and Song Room unless Rondo introduced a much more complex shared-player process.

## Discover

Discover opens immediately. It does not ask someone to choose a genre before seeing music.

The page begins with one concise line, a useful search field, and Continue listening only when it is relevant. Scannable sections then surface Hits today, personal picks, Bangers, Sounds, Hidden gems, New & rising, and links into Genre Journeys.

Cards should vary through real release artwork and content hierarchy, not random decoration. Music feels special through sequencing, contrast, scale, and art—not paragraphs of lore.

## Journey picker

The genre picker appears only when Journeys has no saved active genre or when the listener chooses Change genre.

- four direct, readable choices;
- artist and song counts;
- per-genre progress;
- a primary action that names the selected genre;
- focus containment, Escape, background inertness, and clear focus state;
- a safe Back to Discover path.

It is a focused decision, not a permanent dropdown and not a Discover interruption.

## Genre Journey page

A genre page should feel like a real destination:

- a distinct genre title and restrained color atmosphere;
- stacked release art rather than generated illustration;
- progress and the next artist near the top;
- Start/Resume, Play top mix, and Change genre as the main actions;
- scoped search;
- songs, releases, artists, and hidden finds in clear sections;
- a visible path back to Discover.

The page can vary its accent by genre, but layout, control placement, and language stay consistent. The genre page belongs under Journeys and leads into the existing artist-by-artist flow.

## Guided artist Journey

Inside an artist Journey, the old visible genre dropdown is removed. A compact current-genre summary and Change action replace it. Alphabetical browsing, release sequence, completion, queue, and playback remain intact.

The artist-level primary control must say Play artist, Pause artist, or Resume artist truthfully. Changing pages or reopening the artist directory never stops playback by itself.

## Release identity

Each release carries distinct cover art, accessible accent, official sequence, and concise context. Those elements recur across Discover, Journey pages, release pages, Song Room, and Library so an album is recognizable rather than generic.

## Artwork-adaptive Song Room

The Song Room remains an immersive listening surface. It uses the active cover to set its accent and blurred atmosphere while keeping controls readable.

### Desktop

- artwork and song title share the stage without oversized type;
- the waveform is active only when playback is active;
- About, Lyrics, Credits, Extra, and Up next sit in a compact context panel;
- previous, play/pause, next, repeat, timeline, and volume remain easy to find;
- a subtle cover/backdrop response adds life without competing with the song.

### Mobile

- artwork stays dominant;
- the song title remains compact;
- previous, play/pause, and next are always clear;
- context becomes a usable lower sheet;
- a bottom mode bar keeps About and Lyrics reachable;
- 390px and 320px layouts avoid horizontal overflow.

## Waveform and volume

The waveform communicates state, not decoration. Authorized audio can drive analyser levels. If analysis is unavailable, synchronized deterministic motion is labeled Playback motion. Paused and Reduced Motion states are visually distinct.

Volume stays a familiar native slider with an icon, numeric percentage, artwork-colored fill, restrained level feedback, synchronized values, and correct mute restoration. It never pretends to be frequency analysis.

## Motion rules

- animate only playback, focus, navigation, or a subtle artwork response;
- avoid orbiting decoration, floating particles, automatic card motion, or constant page-wide animation;
- keep transitions short and calm;
- remove nonessential motion when Reduced Motion is enabled;
- generated imagery is not part of the visual system.

## Copy rules

- use familiar labels such as About, Lyrics, Credits, Extra, Up next, Change genre, and Resume Journey;
- prefer one short sentence over a paragraph;
- describe the action, not the product strategy;
- avoid policy or provenance language in the main listening flow;
- use Play, Pause, Resume, Saved, and Open truthfully;
- build curiosity through selection and art rather than vague language;
- leave unknown metadata unavailable rather than inventing it.

## Accessibility and interaction quality

- one visible main landmark per page state;
- route-specific document titles and route announcements;
- heading focus after in-app route changes;
- visible keyboard focus and focus containment in modal surfaces;
- focus returns to a useful place after close;
- 44×44px important controls;
- `aria-current` on active primary navigation;
- non-color selection states;
- long names, missing artwork, unavailable sources, and instrumental tracks remain usable;
- no document-level horizontal overflow at desktop, 390px, or 320px.

## Performance truth

Page routing improves organization and lets Rondo render only what is active. It does not automatically reduce the JavaScript download. Real initial-load savings will come later from code splitting, paginated catalog data, image sizing, and provider-side caching.

## Prototype status

Version 0.3.2 is the user-test candidate for the corrected page architecture. It includes a direct Discover home, first-time Journey picker, four Journey genre subpages, independent per-genre progress, persistent playback context, route navigation, distinct release art, the restrained Song Room, six Rondo Originals demos, responsive layouts, Reduced Motion, and automated desktop/mobile visual QA.
