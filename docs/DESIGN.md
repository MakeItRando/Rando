# Rondo product design direction

## Intent

Rondo is cinematic, editorial, artwork-led, dark by default, and precise about artists, releases, featured roles, credits, provenance, and state. The music—not the application chrome—is the emotional center.

The interface follows one emotional rhythm:

`anticipation → entrance → listening → revelation → memory`

Curiosity comes from strong framing, not vagueness. Context arrives in layers instead of being delivered all at once.

## Primary hierarchy

```text
Account → taste profile
  → Discover → door / chapter / scene / signal
  → Journeys → genre / artist / release
  → track → Song Room → revelation → memory
```

Discover and Journeys must never feel like duplicate pages. Discover is finite, editorial, and release-forward. Journeys is systematic, navigable, and artist-forward.

## Discover composition

- A light editorial entrance establishes contrast with the dark listening world.
- Tonight's Door provides one decisive primary action and one quieter chapter action.
- New Chapters gives each release a visual identity rather than repeating a generic album card.
- Controlled serendipity discloses where it leads after selection; it does not become a random-play trap.
- Scenes and cross-song signals explain relationships in plain language.
- Listening history appears as a trace, not a gamified score.

The page remains finite. Empty space, chapter numbering, and restrained copy create anticipation better than an endless wall of options.

## Release identity

Each release carries a cover, chapter number, hook, liner-style note, motif, signal color, and optional artifact. Those elements may recur across Discover, release chapter, Song Room, and Library so the release becomes recognizable as a world rather than a thumbnail.

The release page uses the browsed release's own local palette. The fixed transport and Song Room continue using the active recording's palette when listening to another chapter.

## Artwork-adaptive system

Neutral near-black chrome prevents competing colors. Each release supplies an accessible signal used for focus, progress, selected states, waveform activity, volume, and ambience. Artwork carries emotion; genre remains visible text. Selected states never rely on color alone.

Representative palette signals include:

| Release family | Accent | Use |
| --- | --- | --- |
| Blacktop Studies | cobalt | nocturnal motion and active signal |
| Silver Weather | amber | warmth, distance, and chapter detail |
| Blue Room | cyan | spacious electronic signal |
| Afterimage | rose | memory and residue |
| Fallback | Rondo red | missing or inaccessible artwork only |

## Song Room composition

### Desktop

- asymmetrical title and artwork stage;
- active, progress-aware waveform plus explicit signal-state label;
- live lyric line and saved-moment action anchored to the stage;
- dedicated context panel for Room, Lyrics, Story, Credits, Reveals, and Queue;
- restrained fixed transport with timeline, repeat, previous/next, and an expressive sound field.

### Mobile

- artwork and title remain primary;
- context becomes a scrollable lower sheet;
- Room, Lyrics, Story, Credits, Reveals, and Queue use persistent bottom navigation;
- transport and sheet respect safe areas and 320px layouts;
- the compact player preserves the active waveform and core controls without horizontal overflow.

## Waveform and signal language

The waveform is active only when playback is active. Authorized audio can drive real analyser levels. If browser policy or source permissions prevent analysis, synchronized deterministic motion remains available but is labeled **Playback motion**. Paused and Reduced Motion states are visually and semantically distinct.

The Song Room waveform, context micro-spectrum, compact signal, timeline, and volume feedback all derive from one playback state; they must not drift into contradictory animation.

## Volume as a sound field

Volume is presented as part of the listening instrument rather than a plain utility slider:

- circular level ring and numeric percentage;
- responsive segmented meter;
- artwork-colored slider fill and thumb in Song Room;
- synchronized controls across main transport and immersive room;
- mute/unmute that restores the listener's last audible level;
- native range semantics for keyboard and assistive technology.

Visual feedback must imply level, not frequency analysis.

## Reveals and curiosity

Reveals open optional context after genuine listening time. Locked copy states the threshold and explicitly says that the music remains available. Opened artifacts should feel specific to the release—route cards, field notes, images, or studio fragments—not like interchangeable achievement badges.

No song, credit, lyric access, or accessibility function is locked. The design rewards attention without punishing interruption or manufacturing scarcity.

## Personal memory

Private notes sit below provenance rather than competing with the song story. They use quiet typography, explicit “Only you” language, and a clear save action. Library cards separate moments, notes, saves, and artifacts and reopen the exact listening context.

## Surrounding application

Journeys collapses its directory when playback starts and can reopen without interruption. On mobile, persistent Discover, Library, Journeys, and Profile navigation remains reachable above the compact player; only Journeys exposes the artist-directory drawer. The surrounding app retains genre-reactive ambience while Song Room uses the active release signal. Light and Night remain persistent preferences outside the immersive room.

## Interaction quality

- visible keyboard focus and focus containment in modal surfaces;
- focus returns to the actual opener after close;
- 44×44px important controls;
- synchronized lyrics and timelines support direct seeking;
- stateful actions say Play, Pause, Saved, Open, or Revealed truthfully;
- unknown metadata remains unavailable instead of invented;
- long names, instrumental tracks, missing artwork, and unavailable sources retain usable states;
- compact headers stay in one row at 320px and no document-level horizontal overflow is permitted.

## Prototype status

Version 0.3.1 is the full-concept user-test candidate. It includes the dedicated Discover destination, fifteen release identities and chapter pages, optional listening reveals, artwork-adaptive Song Room, analyser-backed authorized audio, labeled playback fallback, synchronized expressive volume, six Rondo Originals demos, personal memory, accessible navigation, and regression coverage across desktop, mobile, compact, unavailable-audio, and Reduced Motion states.
