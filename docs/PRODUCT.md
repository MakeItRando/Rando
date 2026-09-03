# Rondo product specification

## Product promise

Rondo helps a listener understand a genre by moving through artists one at a time, hearing albums and EPs in a deliberate order, and preserving everything the listener discovers.

Rondo is equally a music player and a genre/artist explorer. It is not an article feed, a social feed, or a skin over another streaming application.

## Confirmed decisions

- **Account:** required Rondo account
- **Onboarding:** profile and music-taste setup required
- **Artist order:** alphabetical
- **Artist chapter:** one artist at a time
- **Core releases:** albums and EPs
- **Catalog default:** songs matching the selected genre
- **Catalog escape hatch:** All catalog toggle
- **Release order:** newest to oldest
- **Track order:** original disc and track order
- **Artist completion:** ask before continuing
- **Saved data:** songs, albums, artists, journeys, and progress owned by Rondo
- **Lyrics:** immersive synchronized experience using Rondo's own visual language
- **External accounts:** not required for the product concept

## Core journey

`Create Rondo account → complete taste setup → choose genre → begin or choose an artist → browse artist information → play matching albums/EPs → optionally reveal all catalog → finish artist → review summary → continue or choose another artist`

## Genre screen

The genre screen contains:

- main genre selector;
- optional subgenre filters;
- A–Z artist index;
- total eligible artist count;
- current artist chapter;
- personalized starting position;
- search and resume controls.

A genre may contain thousands of artists. Results are paginated and progressively loaded rather than presented as a final universal list.

## Artist Focus panel

The first prototype's circular style map is replaced by a functional artist panel:

- artist image and name;
- location, active years, and concise biography;
- primary genre and sourced style tags;
- album, EP, and matching-track counts;
- current alphabetical position;
- Save artist, Skip artist, and Open profile actions;
- a progress ring showing artist-catalog completion.

Motion is limited to playback response, loading, and artist transitions. It is never decorative.

## Artist catalog

The catalog has two modes:

- **Matching songs:** default; includes tracks classified within the selected genre or active subgenre.
- **All catalog:** reveals other styles while retaining visible genre labels.

Albums and EPs are grouped as releases and ordered newest to oldest. Tracks retain their official disc and track order. Singles, featured appearances, remixes, live recordings, and compilations stay outside the core journey unless added later as explicit filters.

Every track row shows title, album/EP, disc and track number, year, primary artist, featured artists, genre/style labels, duration, explicit state, save action, and playback availability.

## Now Playing

Now Playing has three primary views:

- **Details:** artwork, title, release, artists, genres, style provenance, label, and legitimately sourced technical metadata.
- **Lyrics:** synchronized highlighting, line-tap seeking, unsynchronized fallback, optional licensed translation, songwriter attribution, and availability states.
- **Credits:** writers, producers, performers, engineers, label, copyright lines, and identifiers such as ISRC when available.

The lyrics experience can use familiar full-screen interaction patterns, but typography, color, transitions, and navigation remain recognizably Rondo.

## Playback and queue

- Play, pause, seek, next song, and previous song
- Skip artist and previous artist
- Repeat song, repeat artist, and continue
- Editable queue while preserving the active artist chapter
- Resume after reload or sign-in on another device
- Clear playback-unavailable and region-unavailable states

The source of production audio is a licensing and connector decision, not part of the UI contract.

## Artist-completion prompt

After the final eligible song, playback pauses and displays songs heard and saved, releases completed, artist completion, next alphabetical artist preview, and Continue, Replay artist, Choose another artist, and Stop actions.

## Library and profile

Rondo stores tracks, releases, artists, genre journeys, artist/album completion, resume position, taste settings, and onboarding answers. Saves do not automatically modify another music service.

## Personalization

Onboarding creates the first taste profile. Listening behavior then adjusts recommendations transparently. Users can inspect and edit the signals that shape their experience. Personalization never changes alphabetical artist ordering; it influences starting genre, suggested subgenres, highlighted releases, and resume suggestions.

## Search

Search covers artists, tracks, releases, genres, and saved journeys. Results are grouped by entity type and preserve source attribution.

## Required quality states

Every feature defines loading, empty, partial-data, offline, unauthorized, rate-limited, region-unavailable, and provider-error states. Controls support keyboard use, visible focus, reduced motion, screen readers, and mobile safe areas.

## Out of scope for version one

- social feeds and comments;
- podcasts and news;
- AI chat;
- public follower counts;
- collaborative listening;
- decorative visualizers without product meaning.
