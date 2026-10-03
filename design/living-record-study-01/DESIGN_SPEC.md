# Rondo experience study 01: The Living Record

Status: exploratory design direction, not approved production UI.

## Product feeling

Rondo should be calm while browsing, intimate while listening, and trustworthy
everywhere. It should not look like a streaming catalog recolored with gradients.
The product earns affection through music, useful restraint, clear behavior, and
small moments of craft.

## Core interaction idea

The Rondo ring is a functional visual primitive, not decoration. It can express:

- playback progress;
- loading and retry;
- a selected taste or track;
- follow state;
- Journey progress;
- the transition between browsing and focused listening.

Do not stamp the ring on every surface. Use it only when an action has progress,
completion, orbit, or continuity.

## Two experience surfaces

### Explore surface

Warm paper (`#F0ECE3`) supports onboarding, Discover, Search, Library, Journeys,
and most artist browsing. It should feel open, legible, and tactile.

### Listen surface

Deep ink (`#080B12` to `#111217`) supports the Song Room and focused playback.
Controls become quieter; artwork and one current lyric receive priority.

The move from Explore to Listen is a shared-element transformation originating
from the selected cover. Reduced-motion mode uses a 160ms crossfade.

## Typography

- Interface decisions, artist names, song titles, and navigation use a modern
  grotesk sans with strong weight contrast.
- Serif is reserved for lyrics, artist/editorial notes, and expressive long-form
  language.
- Never use small uppercase text as the only label for an important action.
- Body text floor: 14px in production; secondary metadata may use 12px when it is
  not required to complete a task.

The prototype uses system fonts. Production typography requires licensing and
loading-performance review before selection.

## Color behavior

Stable colors:

- Paper: `#F0ECE3`
- Ink: `#111217`
- Focused-listening ink: `#080B12`
- Rondo signal: `#F0644B`
- Neutral foreground: `#F7F4ED`

Track-derived color is not copied directly from cover artwork.

1. Sample the dominant and secondary colors.
2. Reject near-black, near-white, and skin-dominant samples.
3. Reduce saturation to a controlled range.
4. Adjust luminance for the active surface.
5. Use the result only for artwork reflection, progress, active lyric markers,
   and short transitions.
6. Fall back to the release palette or stable Rondo signal color.

Track color should occupy no more than roughly 5% of a functional screen outside
the artwork itself. It must never sit behind long text unless contrast is
independently verified.

## First-minute experience

The user should reach playable music after one meaningful choice.

1. Ask for one artist they return to.
2. Offer an honest browse-first escape.
3. Create a finite first mix.
4. Let playback behavior teach the system.
5. Ask for account creation only when it protects something the user wants to
   keep or sync.

Preferred copy:

- “Let’s find one good song.”
- “Start with someone you already love.”
- “Make my first mix.”
- “I’d rather look around.”

Avoid:

- “Calibrate your journey.”
- “Define your sonic identity.”
- “Generate personalized recommendations.”
- “Unlock your experience.”

## Page grammar

### Discover

Finite, editorial, and explainable. One lead recommendation receives emphasis.
Smaller shelves state how they relate to listening history. Infinite feed
patterns are not allowed.

### Journeys

Journeys are sequenced editorial routes, not playlists with a different title.
Use chapters, progression, and restrained unrevealed moments. Do not use streaks,
countdowns, or manipulative completion pressure.

### Artist

Prioritize identity, an editorial “start here,” releases, following, credits, and
upcoming work where authorized. Listener counts and vanity metrics are secondary.

### Song Room

Prioritize artwork, title, artist, playback, and one current lyric or contextual
line. Lyrics, About, Credits, Extras, and Queue remain explicit modes. Browsing
does not silently replace playback.

### Library

Represent remembered music and listening continuity, not a settings menu. Use
Saved songs, Artists, Releases, Journeys, history, downloads, and unfinished
listening as distinct objects.

## Motion

- Press feedback: 70–100ms
- Small state transition: 160–220ms
- Shared-element transform: 280–420ms
- Queue reorder: direct manipulation with low-bounce settle
- Follow: ring completes once with optional light haptic
- Lyrics: gentle timing transition; no constant karaoke motion by default

Motion must preserve origin and destination. Do not add floating particles,
decorative bouncing, continuous glow, or unrelated parallax.

## Trust states

Loading, offline, empty, partial-catalog, unavailable, explicit-content,
territory-restricted, and playback-error states require designed language and
recovery paths. Never imply a song is playable before rights and source checks
complete.

Examples:

- “You’re offline. Saved music is still here.”
- “Your Library has room. Save something worth returning to.”
- “This one slipped. Try loading the song again.”

## Accessibility contract

- WCAG AA contrast for all text and meaningful boundaries.
- Minimum 44×44px touch target.
- Keyboard and screen-reader parity.
- Content remains usable at 200% text zoom.
- Meaning never depends on color or motion.
- Reduced-motion mode has equivalent spatial context.
- Artwork has useful alternative text only when it conveys information.

## Prototype coverage

The study demonstrates:

- first-minute onboarding;
- Discover;
- a Journey;
- an artist page and follow state;
- the Song Room and save state;
- persistent mini-player behavior;
- desktop split-context playback;
- system color, voice, motion, trust, and accessibility principles.

It does not yet demonstrate production authentication, real catalog search,
territorial availability, payments, recommendation infrastructure, downloads,
or complete Library and Profile flows.

## Acceptance bar before production implementation

- Owner accepts the overall emotional direction.
- Mobile and desktop flows are reviewed as behavior, not isolated screenshots.
- Light/dark and track-color rules pass automated contrast tests.
- Motion is tested on mid-range hardware.
- All page states and responsive boundaries are specified.
- Copy receives a dedicated human-language pass.
- The redesign maps to existing playback-context and routing contracts.
- No production change merges only to imitate this prototype visually.