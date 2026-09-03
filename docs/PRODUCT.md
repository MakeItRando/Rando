# Rondo product specification

## Product promise

Rondo helps a listener understand a genre by moving through artists one at a time, hearing their catalog in a deliberate order, and preserving what the listener discovers.

Rondo is equally a music player and a genre/artist explorer. It is not a news or article feed.

## Confirmed decisions

- **Playback target:** Spotify account
- **Authentication:** required
- **Artist order:** alphabetical
- **Artist chapter:** one artist at a time
- **Catalog default:** songs matching the selected genre
- **Catalog escape hatch:** All catalog toggle
- **Release order:** newest to oldest
- **Track order:** original album track order
- **Artist completion:** ask before continuing
- **Saved data:** songs, albums, artists, journeys, and progress
- **Lyrics:** a full, synchronized experience with Rondo's own visual language

## Core journey

`Sign in → choose genre → choose or begin at an artist → browse artist information → play matching catalog → optionally reveal all catalog → finish artist → review summary → continue or choose another artist`

## Genre screen

The genre screen contains:

- main genre selector;
- optional subgenre filters;
- A–Z artist index;
- total eligible artist count;
- current artist chapter;
- search and resume controls.

A genre may contain thousands of artists. Results are paginated and progressively loaded rather than presented as a claim of a final, universal list.

## Artist Focus panel

The circular style map in the first prototype is replaced by a functional artist panel:

- artist image and name;
- location, active years, and concise biography;
- primary genre and sourced style tags;
- album and matching-track counts;
- current position, such as `Artist 014 of 2,380`;
- Save artist, Skip artist, and Open profile actions;
- a progress ring showing catalog completion.

Motion is limited to playback response, loading, and artist transitions. It is never decorative.

## Artist catalog

The catalog has two modes:

- **Matching songs:** default; includes tracks classified within the selected genre or active subgenre filter.
- **All catalog:** reveals other styles while retaining visible genre labels.

Albums, EPs, and singles are grouped as releases and ordered newest to oldest. Tracks inside a release retain their official disc and track order.

Every track row shows:

- title and explicit status;
- album or release;
- disc and track number;
- year;
- primary artist and featured artists;
- genre and sourced style tags;
- duration;
- save action;
- unavailable-market or playback state when needed.

## Now Playing

Now Playing has three primary tabs:

### Details

Artwork, title, album, release year, primary artist, featured artists, genres, style provenance, label, BPM/key when legitimately sourced, and playback quality/status.

### Lyrics

- synchronized line highlighting when licensed timing data exists;
- tap a line to seek;
- unsynchronized fallback;
- translation toggle when licensed;
- songwriter and lyrics-provider attribution;
- explicit unavailable and regional-restriction states.

### Credits

Writers, producers, performers, engineers, label, copyright lines, and external identifiers such as ISRC when available.

## Playback and queue

- Play, pause, seek, next song, and previous song
- Skip artist and previous artist
- Repeat song, repeat artist, and continue
- Editable queue while preserving the active artist chapter
- Resume after reload or sign-in on another device when supported
- Clear device-transfer and playback-unavailable states

## Artist-completion prompt

After the final eligible song, playback pauses and displays:

- songs heard and saved;
- releases completed;
- current artist completion percentage;
- next alphabetical artist preview;
- Continue, Replay artist, Choose another artist, and Stop actions.

## Library

Users can save:

- tracks;
- releases;
- artists;
- genre journeys;
- artist and album completion progress;
- resume position.

Whether a save also modifies the user's Spotify library is a separate preference and connector action; Rondo's own progress must remain independent.

## Search

Search covers artists, tracks, releases, genres, and saved journeys. Results are grouped by entity type and preserve provider attribution.

## Required quality states

Every feature must define loading, empty, partial-data, offline, unauthorized, rate-limited, region-unavailable, and provider-error states. Controls must support keyboard use, visible focus, reduced motion, screen readers, and mobile safe areas.

## Out of scope for version one

- social feed and comments;
- podcasts and news;
- AI chat;
- public profiles;
- collaborative listening;
- decorative visualizers without product meaning.
