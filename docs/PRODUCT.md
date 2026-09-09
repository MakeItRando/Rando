# Rondo product specification

## Product promise

Rondo helps a listener find a song quickly, move across sounds, explore artists at a comfortable pace, and keep music worth returning to.

The product has two distinct entry points:

- **Discover** is a song-first music home for search, suggestions, hits, bangers, new music, hidden finds, and moods.
- **Journeys** is an intentional genre and artist path with saved progress.

The interface should feel like a music app made for listeners: clear words, useful motion, strong artwork, and no unnecessary explanation.

## Core flow

`find → play → explore → keep`

1. **Find:** open Discover, search, choose a sound, or browse a short curated section.
2. **Play:** start a song directly without losing the page underneath.
3. **Explore:** enter a Genre Journey, then move through artists, releases, and related songs.
4. **Keep:** save songs, releases, artists, moments, private notes, and Journey progress.

## Confirmed decisions

- Primary navigation is Discover, Library, Journeys, and Profile.
- Discover opens directly; it never opens a genre modal.
- Journeys owns the first-time genre picker and every genre page.
- Every genre page is a page-like subroute under Journeys.
- Returning listeners resume their active genre; Change genre remains available.
- Progress is independent for Hip-Hop, R&B, Electronic, and Jazz.
- Playing from Discover does not replace the active Journey.
- Changing genres does not erase another genre's place or stop the current song.
- Tracks matching the selected genre are the default guided catalog, with an All option in the artist Journey.
- After an artist's final eligible track, Rondo asks before continuing.
- External accounts are not required by the prototype.
- **Rondo** is the canonical name everywhere; existing `Rando` repository URLs remain temporarily only to avoid breaking prototype history.
- Production catalog scope is broad across artists and genres and must not be coupled to one provider or source app.
- The catalog architecture must support thousands of songs initially and scale to millions without a product-model rewrite.
- The product owner will provide the legal acquisition/integration plan before real-source work begins.
- **V1 has no payments.** Payment features require a separately approved later phase.

## Page hierarchy

```text
#/discover
#/library
#/profile
#/journeys
#/journeys/hiphop
#/journeys/rnb
#/journeys/electronic
#/journeys/jazz
#/journeys/<genre>/artist/<artist-id>
```

These are route-backed SPA pages, not separate document reloads. They provide distinct URLs, browser Back/Forward, accurate page titles, heading focus, one visible main landmark, and uninterrupted global playback.

## Discover

Discover answers one question quickly: what is worth playing now?

The page includes:

- music search;
- Continue listening when there is meaningful history;
- Hits today;
- Made for you;
- Bangers;
- Sounds for a mood;
- Hidden gems;
- New & rising;
- compact links into Genre Journeys;
- direct playback into the existing queue and Song Room.

The prototype catalog is fictional, so editorial labels describe Rondo's own curation. It must not claim that demo songs are real internet charts. Live trends will require a named source and update time in the production-data phase.

## Journey entry

Selecting Journeys behaves differently by state:

- with no active Journey, open a focused four-genre picker;
- with an active Journey, open its genre page immediately;
- Change genre reopens the picker without erasing progress;
- dismissing the first-time picker returns to Discover rather than leaving an empty page.

The picker contains focus, supports Escape, makes the background inert, has 44px targets, and exposes radio state to assistive technology.

## Genre Journey pages

Each genre has a distinct page beneath Journeys with:

- a clear genre identity and restrained ambience;
- current progress and the next artist;
- scoped song, artist, and album search;
- Play top mix;
- Start or Resume Journey;
- Change genre;
- top songs;
- essential releases;
- hidden finds where available;
- artists to know;
- a link back to Discover.

Starting or resuming enters the existing guided artist flow:

`genre page → alphabetical artist → matching/all catalog → release → track → Song Room → completion summary`

The four prototype genres validate the interaction model, not the production taxonomy. Production must support a much larger, editable genre/style graph without hard-coded route or layout assumptions.

## Saved continuity

The prototype stores meaningful state, not transient UI details.

Per genre:

- active genre;
- last artist;
- last track and position where available;
- songs heard and saved;
- progress percentage;
- last update time.

Playback context also preserves the selected genre, artist, track, release, catalog mode, repeat mode, and position. Rondo never attempts autoplay after reload because browsers require a fresh user gesture.

Modal state, hover, focus rings, animation phases, and open temporary panels are not persisted.

## Releases

Every album or EP can provide distinct cover art, track order, a short hook, concise context, and an optional extra. Release identity should make the music recognizable without covering the page in lore.

## Song Room

The Song Room is a focused listening surface. Visible modes are:

1. **Room** — cover, song identity, active waveform, current lyric, timeline, and core controls.
2. **Lyrics** — synchronized authorized or demo words with line seeking.
3. **About** — short, plain-language context.
4. **Credits** — supplied artists, writers, producers, and recording details.
5. **Extra** — optional release material after genuine listening time.
6. **Up next** — the current queue in sequence.

The active cover sets the room's color and blurred backdrop. Motion stays limited to playback feedback, a subtle artwork response, and state changes. Reduced Motion keeps a meaningful static signal.

## Truthful playback and volume

Authorized prototype recordings use the media clock for progress and seeking. Web Audio drives the waveform when analysis is available; otherwise Rondo labels playback-synchronized motion honestly. Paused and Reduced Motion states remain visually distinct.

Volume is one persisted value across the transport and Song Room. Both controls show percentage and level feedback. Mute preserves the last audible value so unmute restores it.

## Personal listening

Listeners can save an exact timestamp and write a private note for a song. Moments and notes persist locally, appear in Library, and reopen the correct listening context.

## Catalog-scale experience requirements

A large catalog must still feel intentional rather than like an endless database:

- search is indexed, typo-tolerant, filterable, and paginated;
- shelves return bounded, ranked results rather than full collections;
- genre and artist pages lazy-load deeper content;
- artwork and audio are loaded only when needed;
- long lists use pagination or virtualization with accessible focus behavior;
- unavailable or region-limited recordings remain understandable without dead ends;
- editorial and recommendation surfaces explain why a small subset is shown;
- the browser never downloads the complete catalog.

## Performance approach

Routes alone do not shrink the bundle. The current architecture improves runtime work by rendering only the active page, avoiding duplicate hidden page DOM, and lazy-loading artwork. Production adds API pagination, server-side/index-backed search, CDN media delivery, bounded caches, background ingestion, and code splitting so catalog growth does not expand the initial client payload.

## Motion and accessibility

Reduced Motion removes nonessential animation while preserving state. Controls support visible focus, keyboard operation, focus-contained dialogs, 44px touch targets, mobile safe areas, non-color selected states, page titles, route announcements, and meaningful landmarks.

## Out of scope for this prototype

- real artists and licensed commercial songs;
- live charts or unsupported internet-trend claims;
- production accounts, provider credentials, catalog ingestion, or backend services;
- social feeds, public comments, and follower counts;
- fake AI DJs or unsupported audio-analysis claims;
- artificial song locks or manipulative streaks.

## Out of scope for V1

- subscriptions, checkout, tips, payment entitlements, artist billing, refunds, and payouts;
- social-feed growth mechanics;
- any content source not covered by the product owner's supplied legal integration plan.
