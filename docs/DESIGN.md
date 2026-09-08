# Rondo product design direction

## Intent

Rondo is music-first, artwork-led, and easy to understand. It should feel designed by a careful product team, not generated from a pile of effects or marketing phrases.

The interface follows a simple rhythm:

`choose → play → explore → keep`

Curiosity comes from music, artwork, and a few strong choices. Copy explains what an action does and then gets out of the way.

## Primary hierarchy

```text
Discover
  → chooser → genre playlist
  → chooser → Explore
Journeys
  → genre → artist → release
Any song
  → Song Room
```

Discover and Journeys must never feel like duplicate pages. Discover is quick and song-forward. Journeys is systematic and artist-forward.

## Discover chooser

Opening Discover presents a focused modal with two routes:

- pick one of four genres and continue with a dynamically named Listen action;
- choose Browse everything to open Explore.

The decision fits on one screen. Supporting text is short, focus is contained, Escape and outside click dismiss it, and the opener regains focus.

## Genre playlist

A genre playlist should be readable at a glance:

- genre name and one short line;
- search and Play mix;
- cover art, song, artist, release, style, and duration;
- obvious direct-play controls;
- selected and playing states that do not rely on color alone.

## Explore

Explore is a separate page, not a genre selector stretched into a feed. Its first view contains search, Popular now, and Hidden gems. Scrolling reveals recognizable genre sections with direct playback and links into the matching playlist.

Cards should vary through real release artwork and content hierarchy, not random decoration. Underrated music can feel special through placement and art rather than long descriptions.

## Release identity

Each release carries a distinct cover, accessible accent, official sequence, and concise context. Those elements can recur across Explore, genre playlists, release pages, Song Room, and Library so an album feels recognizable rather than generic.

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

## Waveform and playback feedback

The waveform communicates state, not decoration. Authorized audio can drive analyser levels. If analysis is unavailable, synchronized deterministic motion is labeled Playback motion. Paused and Reduced Motion states are visually distinct.

The waveform, timeline, compact signal, and level meter must all agree about whether music is playing.

## Volume

Volume should feel connected to the listening experience while remaining a familiar slider:

- clear icon and numeric percentage;
- artwork-colored fill;
- restrained segmented level feedback;
- synchronized controls across the main transport and Song Room;
- mute and unmute that restore the previous audible level;
- native range behavior for keyboard and assistive technology.

Visual feedback shows level; it must not pretend to be frequency analysis.

## Motion rules

- animate only playback, focus, navigation, or a subtle artwork response;
- avoid orbiting decoration, floating particles, automatic card motion, or constant page-wide animation;
- keep transitions short and physically calm;
- remove nonessential motion when Reduced Motion is enabled;
- generated imagery is not part of the visual system.

## Copy rules

- use familiar labels such as About, Lyrics, Credits, Extra, and Up next;
- prefer one short sentence over a paragraph;
- describe the action, not the product strategy;
- avoid policy or provenance language in the primary listening flow;
- use Play, Pause, Resume, Saved, and Open truthfully;
- leave unknown metadata unavailable rather than inventing it.

## Surrounding application

Journeys can collapse its directory when playback starts and reopen without interruption. On mobile, Discover, Library, Journeys, and Profile remain reachable above the compact player. Light and Night are persistent workspace preferences; the Song Room may retain its artwork-adaptive immersive treatment.

## Interaction quality

- visible keyboard focus and focus containment in modal surfaces;
- focus returns to the actual opener after close;
- 44×44px important controls;
- synchronized lyrics and timelines support direct seeking;
- long names, instrumental tracks, missing artwork, and unavailable sources keep usable states;
- compact headers stay in one row at 320px;
- no document-level horizontal overflow.

## Prototype status

Version 0.3.2 is the corrected user-test candidate. It includes the Discover chooser, four genre playlists, cross-genre Explore, distinct release art, restrained artwork-adaptive Song Room, truthful waveform states, expressive volume, six Rondo Originals demos, responsive layouts, Reduced Motion, and automated desktop/mobile visual QA.
