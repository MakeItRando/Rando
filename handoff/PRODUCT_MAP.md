# Rondo product map and page specifications

## System-wide model

Rondo has one application shell, route-backed page states, one global player, one queue model, and one Song Room. Navigation changes the browsed page without silently changing the active recording or Journey.

Primary jobs:

- **Find:** Discover and search.
- **Play:** shared transport and Song Room.
- **Explore:** Genre pages, Artist Journeys, releases, and credits.
- **Keep:** Library, moments, notes, progress, and Profile.

## Implementation matrix

| Surface | Stable `main` | v0.3.2 candidate | Production phase |
| --- | --- | --- | --- |
| Discover | Basic entry | Direct route-backed music home; history-gated recommendations | Bounded editorial/trend/personal shelves and indexed search |
| Journeys | Genre/artist directory | Journey-owned picker, Genre pages, independent progress | Server-synced state and editable taxonomy |
| Artist Journey | Implemented | Preserved/refined | Real rights-aware catalogs and supplied context |
| Release | Basic grouping | Distinct release page/chapter | Editions, credits, context, attribution |
| Song Room | v0.3.0 | Restrained UX, truthful waveform/volume/modes | Authorized full playback and licensed context |
| Library | Local saves/moments/notes | Expanded continuity | Secure sync, export, deletion |
| Profile | Local prototype | Editable taste flow | Identity, consent, devices, privacy controls |
| Payments | None | None | **Not in V1**; reconsider only in a separately approved later phase |

## Global shell

Contains desktop/mobile navigation, route location/title, search, appearance, profile, shared transport, queue, volume, live-region feedback, and one active page landmark.

Rules:

- Back/Forward works;
- navigation never stops playback by itself;
- active navigation exposes `aria-current`;
- deliberate route changes move heading focus;
- mobile nav/player occupy non-overlapping rows;
- no document overflow at 1440px, 390px, or 320px;
- one audio element, queue, playback clock, and analyser contract exist.

## Discover

**Question answered:** What should I play now?

Required sections:

1. song/artist/release search;
2. Continue listening only after activity;
3. Made for you only after genuine listening history; hide the section at cold start rather than fabricating personalization;
4. editorial Hits today/Popular now, with a named source and timestamp in production;
5. Bangers;
6. Sounds/moods;
7. Hidden gems;
8. New & rising;
9. compact Genre Journey links;
10. direct playback and release actions.

Interaction rules:

- opens directly with no genre modal;
- shelves are finite and useful, not an endless feed;
- playback updates its own context without replacing Journey state;
- copy is short/familiar;
- prototype popularity language identifies Rondo curation;
- production artwork/content is authorized and specific.

Canonical candidate renderer: `src/ui/discoveryHub.js`. `renderDiscoverView()` in `src/ui/views.js` is dormant legacy code and must not be revived. Remove it before production integration.

## Journeys landing and picker

- no active Journey → focused genre picker;
- active Journey → active Genre page;
- Change genre → picker without erased progress;
- first-use dismissal → Discover;
- contextual dismissal from a Genre/Artist route → preserve route and return focus.

Picker requires a clear heading, direct choices, dynamic artist/song counts, independent progress, explicit selected state, a primary action naming the genre, keyboard focus containment, Escape, inert background, useful close behavior, and 44px targets.

## Genre Journey page

Purpose: bridge free genre browsing and guided artist progression.

Contains genre identity/ambience, progress, next artist, Start/Resume, Play top mix, Change genre, scoped search, top songs, essential releases, hidden finds, artists, and a Discover return path.

State rules:

- independent progress per genre;
- resume restores artist/track/position without autoplay;
- changing genre does not change active playback;
- local genre atmosphere does not overwrite the active-release player palette.

Production uses one shared data-driven renderer over an editable genre/style graph. Never duplicate a component/router per genre or use fixed global catalog counts.

## Guided Artist Journey

- alphabetical artist order;
- supplied identity/origin/years/tags/biography and progress;
- releases newest to oldest, tracks in official sequence;
- matching genre by default, All catalog escape hatch;
- truthful Play/Pause/Resume;
- save artist/release/track;
- queue follows current artist/catalog mode;
- explicit completion before crossing the artist boundary;
- navigation/directory changes never stop playback.

## Release page

Contains distinct authorized artwork/palette, title/artist/type/year/source, official sequence, concise context, truthful play/save/Song Room actions, credits/provenance, and optional extras only when valuable. Unknown production metadata stays unavailable; optional extras never gate songs, credits, or navigation.

## Song Room

Modes:

- **Room:** artwork, identity, waveform, lyric peek, moment, timeline, controls;
- **About:** concise context;
- **Lyrics:** synchronized authorized/demo words and seeking;
- **Credits:** supplied artists/writers/producers/recording details;
- **Extra:** optional listening-earned material, still subject to owner validation;
- **Up next:** queue and position.

Behavior:

- active cover drives restrained atmosphere;
- analyser state is live only when true;
- fallback says Playback motion;
- paused and Reduced Motion states are distinct;
- elapsed time, metadata, and remaining time do not overlap;
- volume is synchronized/persistent and mute restores the audible level;
- opening/closing preserves focus and playback.

## Library

Contains saved artists, releases, tracks, timestamped moments, private notes, Journey continuity/progress, and optional retained extras. Empty state leads to Discover. Production data is private by default, securely synchronized, exportable, and deletable.

## Profile and onboarding

Prototype: display name/local email, taste genres, seed artists, discovery/popularity/album-focus controls, appearance, volume, accessibility preferences.

Production: secure Rondo account, territory/age/explicit settings, languages, consent/privacy/export/deletion, devices/sessions, and editable taste. No external streaming account is required.

## Search and catalog scale

Production search is indexed, debounced, alias/edition-aware, typo-tolerant, filterable, rights-aware, stably sorted, and cursor-paginated. Result actions reflect current playability.

Production clients receive bounded page/shelf/search windows and stable Rondo IDs. They must not receive the whole catalog, flatten all pages, persist catalog snapshots in listener state, or rely on array offsets. Artwork/audio lazy-load. Long lists paginate or virtualize accessibly.

## Persistence contract

Persist: profile/onboarding, saves, plays, moments, notes, theme/volume/accessibility, active Journey and bounded per-genre progress, playback context/position, optional release progress.

Do not persist: open dialogs/drawers, hover/focus, waveform samples, animation frames, transient loading/errors, or autoplay intent.

Malformed persisted state must normalize to safe arrays/records/defaults and write the repaired snapshot back so every reader sees one valid contract.

## Error, empty, and loading states

Every production-backed surface requires deliberate loading, empty, unavailable, offline, partial-data, rights-blocked, rate-limited, and retry states. Playback errors preserve browsing and distinguish unavailable media from application failure.
