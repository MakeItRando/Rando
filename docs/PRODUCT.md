# Rondo product specification

## Product promise

Rondo helps a listener understand a genre by moving through artists one at a time, hearing albums and EPs in a deliberate order, and preserving everything worth returning to.

Rondo is equally a music player and a genre/artist explorer. It is not an article feed, social feed, or skin over another streaming application.

## Confirmed decisions

- **Account:** required Rondo account and editable taste setup
- **Artist order:** alphabetical inside the selected genre
- **Artist chapter:** one artist at a time
- **Core releases:** albums and EPs, newest to oldest
- **Track order:** official disc and track order
- **Catalog default:** tracks matching the selected genre, with an All catalog escape hatch
- **Boundary:** ask before continuing after the artist's final eligible track
- **Saves:** tracks, releases, artists, moments, private notes, journeys, and progress owned by Rondo
- **External accounts:** not required by the product concept

## Core hierarchy

`Create account → taste setup → genre → artist → matching/all catalog → release → track → Song Room → completion summary → continue, replay, choose, or stop`

## Genre Journey and Artist Focus

Genre Journey provides the selector, A–Z artist index, search, chapter, and progress. Playback collapses it to prioritize listening; reopening never stops playback. Artist Focus retains biography, sourced styles, catalog counts, alphabetical position, save/skip/play actions, and completion.

## Song Room

The Song Room makes one recording feel understandable rather than adding another dashboard. Its modes are:

1. **Room** — artwork, identity, current lyric, journey position, and core controls.
2. **Lyrics** — synchronized authorized/demo words with line seeking.
3. **Story** — why the song belongs, exact style, release, signal, featured roles, and provenance.
4. **Credits** — supplied writers, producers, artists, version, and recording ID; unknown roles remain unknown.
5. **Up Next** — current artist chapter in release order without silently crossing the artist boundary.

The visual accent comes from the active release artwork. Genre remains a labeled classification and controls the surrounding journey ambience. Rondo red is the missing-artwork fallback.

## Playback source policy

The prototype contains six original 32-second stereo MP3 instrumentals from Rondo Originals. Authorized tracks use the real media clock for progress and seeking. Tracks without a recording use an explicitly labeled demo timeline so the product never pretends simulated progress is streamed audio.

Production sources may include direct artist uploads, official embeds, Creative Commons/public-domain recordings, or licensed catalog providers. Unlicensed full recordings and lyrics are out of scope.

## Personal listening

Listeners can save an exact timestamp and write a private note for a song. Moments and notes persist locally in the prototype, appear as first-class Library cards, and reopen the correct Song Room context. Volume persists independently of the current track.

## Motion and accessibility

Playback-driven bars, ambient drift, and artwork halos are interface visualization—not frequency analysis. Reduced Motion removes nonessential animation. Controls support visible focus, keyboard operation, focus-contained dialogs, 44px touch targets, mobile safe areas, and non-color selected states.

## Artist completion

After the final eligible track, playback pauses and shows tracks heard/saved, releases completed, progress, the next alphabetical artist, and Continue, Replay artist, Choose another artist, and Stop actions.

## Out of scope for version one

- social feeds, public comments, and follower counts;
- fake AI DJs or unsupported audio-analysis claims;
- podcasts and news;
- collaborative listening;
- unlicensed commercial recordings or lyrics.
