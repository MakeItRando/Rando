# Rondo product design direction

## Intent

Rondo is cinematic, editorial, artwork-led, dark by default, and precise about artists, releases, featured roles, credits, and provenance. The song—not the application chrome—is the emotional center.

## Primary hierarchy

`Account → taste profile → genre → artist → release → track → Song Room → context and memory`

## Artwork-adaptive system

Neutral near-black chrome prevents competing colors. Each release supplies one accessible signal used for focus, progress, selected states, and ambience. Artwork carries emotion; genre remains visible text. Selected states never rely on color alone.

| Palette | Accent | Use |
| --- | --- | --- |
| Night | `#6F9DFF` | Cobalt release signal |
| Continuum | `#E3A35F` | Amber release signal |
| Blue | `#51C8D8` | Cyan release signal |
| Afterimage | `#E66D9A` | Rose release signal |
| Fallback | `#FF4B2E` | Missing/inaccessible artwork |

## Song Room composition

### Desktop

- asymmetrical title and artwork stage;
- live lyric line and saved-moment action anchored to the stage;
- dedicated context panel for Story, Lyrics, Credits, and Up Next;
- restrained fixed transport with timeline, repeat, previous/next, and volume.

### Mobile

- artwork and title remain primary;
- context becomes a scrollable lower sheet;
- Room, Lyrics, Story, Credits, and Queue use persistent bottom navigation;
- transport and sheet respect safe areas and 320px layouts.

## Personal memory

Private notes sit below provenance rather than competing with the song story. They use quiet typography, explicit “Only you” language, and a clear save action. Library cards separate moments from notes and reopen the exact listening context.

## Surrounding application

Genre Journey collapses when playback starts and can reopen without interruption. The surrounding app retains genre-reactive ambience while the Song Room uses the release artwork signal. Light and Night remain persistent preferences outside the immersive room.

## Motion contract

- Motion follows playback, loading, or navigation state.
- Spectrum and halo movement are playback-driven simulations.
- No UI claims microphone, FFT, or live signal analysis.
- Reduced Motion freezes nonessential movement while preserving hierarchy.

## Interaction quality

- visible keyboard focus and focus containment in modal surfaces;
- 44×44px important controls;
- synchronized lyrics and timelines support direct seeking;
- unknown metadata remains unavailable instead of invented;
- long names, instrumental tracks, missing artwork, and unavailable sources retain usable states.

## Prototype status

Version 0.3.0 implements the artwork-adaptive Song Room, six authorized Rondo Originals demos, personal moments/notes, real volume, and regression coverage across desktop, mobile, compact, and Reduced Motion states.
