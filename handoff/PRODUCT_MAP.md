# Rondo product map and page specifications

## System-wide model

Rondo has one application shell, route-backed page states, one global player, one queue model, and one Song Room. Navigation changes the browsed page without silently changing the active recording or Journey.

Primary jobs:

- **Find:** Discover and search.
- **Play:** global transport and Song Room.
- **Explore:** Genre pages, Artist Journeys, releases, and credits.
- **Keep:** Library, moments, notes, progress, and Profile.

## Implementation matrix

| Surface | Stable `main` | v0.3.2 candidate | Production phase |
| --- | --- | --- | --- |
| Discover | Basic application entry | Direct route-backed music home | Real editorial, trends, personalization, search |
| Journeys | Genre/artist directory and guided flow | Journey-owned picker, genre pages, independent progress | Server-synced Journey state and real catalog |
| Artist Journey | Implemented | Preserved and refined | Real biographies, catalogs, rights-aware playback |
| Release | Basic catalog grouping | Distinct release page/chapter | Real editions, credits, context, attribution |
| Song Room | v0.3.0 implemented | Restrained UX, waveform, volume, modes | Authorized full playback and licensed context |
| Library | Local saves/moments/notes | Expanded continuity | Secure account sync, export, deletion |
| Profile | Local prototype | Editable taste flow | Identity, consent, devices, privacy controls |
| Payments | None | None | Unconfirmed model; secure provider and entitlements |

## Global application shell

Contains:

- desktop rail and mobile bottom navigation;
- route-aware current location and document title;
- search trigger and keyboard shortcut;
- Light/Night preference;
- profile entry;
- shared transport with previous, play/pause, next, repeat, timeline, volume, and queue;
- live-region feedback for important state changes;
- one visible main landmark for the active page.

Rules:

- browser Back/Forward must work;
- page changes must not stop playback;
- active navigation exposes `aria-current`;
- heading focus follows deliberate in-app route changes;
- mobile navigation and player occupy separate non-overlapping rows;
- no horizontal document overflow at 1440px, 390px, or 320px.

## Discover

### Purpose

Answer: **What should I play now?**

### Required sections

1. Search songs, artists, releases, and genres.
2. Continue listening, only after meaningful activity.
3. Made for you, only when enough taste/history exists; otherwise use explicit editorial picks.
4. Hits today / Popular now, only with a real named source and update time in production. Prototype copy must identify Rondo curation instead of claiming live charts.
5. Bangers right now.
6. Hidden gems.
7. New and rising.
8. Sounds for your mood or situation.
9. Short rows for each genre.
10. Compact links to Genre Journeys.
11. Direct song and release playback/open actions.

### Interaction rules

- Opens immediately with no genre modal.
- Search and shelves remain scannable and finite, not an endless feed.
- Playing a row creates or updates playback context without replacing saved Journey context.
- Cards use distinct real/authorized artwork in production.
- Copy remains short and familiar.
- “Because you liked…” waits for real evidence.

## Journeys landing and picker

### Entry behavior

- No active Journey → show focused genre picker.
- Active Journey → open the active genre page.
- Change genre → reopen picker without erasing progress.
- Dismiss first-use picker → return safely to Discover.

### Picker requirements

- one clear heading and short explanation;
- four direct genre choices in the current prototype;
- artist/song counts and any existing progress;
- selected state exposed as radio/pressed state;
- primary action names the selection;
- keyboard operation, focus containment, Escape, outside-close if appropriate, background inertness, and focus return;
- 44px minimum targets.

## Genre Journey page

### Purpose

Bridge free genre browsing and the guided artist Journey.

### Required content

- genre identity and restrained atmosphere;
- progress summary and last activity;
- next artist;
- Start or Resume Journey;
- Play top mix;
- Change genre;
- scoped search across songs, artists, and releases;
- top songs;
- essential releases;
- hidden finds where available;
- artists to know;
- clear link back to Discover.

### State rules

- Store independent progress for each genre.
- Returning to a genre restores its artist, track, position, and progress without autoplay.
- Changing genre does not alter current playback unless the user starts another song.
- Genre color can change local atmosphere; active playback controls remain colored by the active release.

## Guided Artist Journey

### Purpose

Help a listener understand one artist at a time within a genre.

### Required content and behavior

- alphabetical artist order;
- artist identity, origin, active years, tags, biography, and progress;
- albums and EPs newest to oldest;
- official disc/track order;
- Matching genre catalog by default;
- All catalog escape hatch;
- Play artist / Pause artist / Resume artist based on real state;
- save artist, release, and track;
- open release details or Song Room;
- queue follows current artist/catalog mode;
- completion summary after final eligible track;
- ask before continuing to next artist;
- reopening directory or changing browsed page never stops playback by itself.

## Release page

### Purpose

Give an album or EP enough identity to be memorable without turning it into a long article.

### Required content

- distinct cover and accessible palette;
- title, artist, release type, year, label/source where authorized;
- official sequence;
- concise hook/context;
- play, pause, resume, save, and per-track Song Room actions;
- truthful credits and provenance outside the main action language;
- optional extra only if it adds real value.

Rules:

- unknown metadata remains unavailable;
- no invented production lore or rights claims;
- optional extras never gate songs, credits, or navigation.

## Song Room

### Purpose

Make the active recording feel central, understandable, and easy to control.

### Modes

- **Room:** artwork, song/artist/release identity, waveform, lyric peek, moment action, timeline, and core controls.
- **About:** concise plain-language context.
- **Lyrics:** synchronized authorized/demo words and line seeking.
- **Credits:** artist, featured artists, writers, producers, recording details.
- **Extra:** optional release material after genuine listening; validate this concept with the user.
- **Up next:** current queue and position.

### Behavior

- active cover drives accent and restrained blurred atmosphere;
- waveform is active only during playback;
- analyser-backed state is labeled live only when true;
- fallback is labeled playback motion;
- paused and Reduced Motion states are visually distinct;
- volume is synchronized across transport and room;
- mute restores last audible volume;
- previous/next/repeat/timeline controls are always understandable;
- desktop and mobile titles remain compact;
- opening/closing preserves focus and playback.

## Library

Contains:

- saved artists;
- saved releases;
- saved tracks;
- timestamped moments;
- private song notes;
- Journey continuity and completed progress;
- optional opened extras if retained after testing.

Empty state should explain value and lead back to Discover. Production data is private by default, synchronized securely, exportable, and deletable.

## Profile and onboarding

Prototype:

- display name and local email field;
- at least three genres;
- at least two seed artists in current UI;
- discovery, popularity, and album-focus controls;
- Light/Night, volume, and accessibility preferences.

Production:

- secure Rondo account;
- region/age and explicit-content settings;
- interface/music/lyrics languages;
- consent, privacy, export, deletion, devices, and session management;
- every taste choice editable later;
- no external streaming account requirement.

## Search

Global search covers artists, releases, tracks, and genres. Production search must account for aliases, editions, territory, explicit settings, rights state, and availability. Results must not expose unplayable actions as if they will work.

## Persistence contract

Persist:

- profile and onboarding completion;
- saves, plays, moments, notes;
- theme, volume, accessibility preferences;
- active Journey and per-genre progress;
- playback context and position;
- optional release progress/extras.

Do not persist:

- open modals or drawers;
- hover/focus state;
- animation frame or waveform samples;
- temporary loading/error visuals;
- autoplay intent across reload.

## Error, empty, and loading states

Every production-backed surface needs deliberate loading, empty, unavailable, offline, partial-data, rights-blocked, rate-limited, and retry states. Playback errors must preserve browsing and clearly distinguish unavailable media from broken application state.
