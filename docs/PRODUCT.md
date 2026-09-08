# Rondo product specification

## Product promise

Rondo helps a listener choose what to hear, find songs across genres, explore artists at a comfortable pace, and keep music worth returning to.

The product has two distinct entry points:

- **Discover** is the quick route to a genre playlist or broad exploration.
- **Journeys** is an intentional genre and artist path with visible sequence and completion.

The interface should feel like a music app made for listeners: clear words, useful motion, strong artwork, and no unnecessary explanation.

## Core flow

`choose → play → explore → save`

1. **Choose:** open Discover and select a genre, or browse everything.
2. **Play:** start a song directly from a playlist, search result, or release.
3. **Explore:** move between genres, artists, releases, and related songs without losing playback.
4. **Save:** keep songs, releases, artists, moments, and private notes.

## Confirmed decisions

- **Primary navigation:** Discover, Library, Journeys, and Profile.
- **Discover:** opens a focused chooser every time it is entered or selected again.
- **Genre route:** choose a genre, confirm with a dynamically named Listen action, then open that genre's playlist.
- **Explore route:** Browse everything opens a cross-genre page with search and categorized music.
- **Artist order:** alphabetical inside the selected Journey genre.
- **Core releases:** albums and EPs in official sequence.
- **Catalog default:** tracks matching the selected genre, with an All catalog option in Journeys.
- **Boundary:** ask before continuing after an artist's final eligible track.
- **Saves:** tracks, releases, artists, moments, private notes, journeys, and progress belong to Rondo.
- **External accounts:** not required by the prototype.

## Discover chooser

Selecting Discover opens one short decision:

1. **Pick a genre** — Hip-Hop, R&B, Electronic, or Jazz. The primary action updates to the selected genre, such as `Listen to Hip-Hop`.
2. **Browse everything** — opens Explore directly.

The chooser keeps focus inside, closes with Escape or an outside click, restores focus to its opener, and makes the background inert while open.

## Genre playlists

Each genre receives a dedicated playlist rather than routing into Journeys. The page includes:

- a clear genre title and short supporting line;
- song search;
- Play mix;
- scannable rows with cover art, artist, release, style, and duration;
- direct playback into the existing queue and Song Room.

## Explore

Explore supports broad discovery without turning into an endless feed:

- one search field for songs and artists;
- Popular now;
- Hidden gems;
- sections for Hip-Hop, R&B, Electronic, and Jazz;
- direct song playback;
- links into a genre playlist.

The first screen should offer useful choices quickly. More genre sections can sit below the fold for someone who wants to keep browsing.

## Journeys and Artist Focus

Journeys owns the genre selector, A–Z artist index, search, artist chapter, and progress. Playback can collapse the directory to prioritize listening; reopening it never stops playback.

Core hierarchy:

`genre → alphabetical artist → matching/all catalog → release → track → Song Room → completion summary`

## Releases

Every album or EP can provide distinct cover art, track order, a short hook, a concise note, and an optional extra. Release identity should make the music easier to recognize without covering the page in lore.

## Song Room

The Song Room is a focused listening surface, not another dashboard. Visible modes are:

1. **Room** — cover, song identity, active waveform, current lyric, timeline, and core controls.
2. **Lyrics** — synchronized authorized or demo words with line seeking.
3. **About** — short, plain-language context for the song.
4. **Credits** — supplied artists, writers, producers, and recording details; unknown roles remain unknown.
5. **Extra** — optional release material that can open after genuine listening time.
6. **Up next** — the current queue in sequence.

The active cover sets the room's color and blurred backdrop. Typography stays proportional to the artwork. Motion is limited to playback feedback, a subtle cover/backdrop response, and state changes. Reduced Motion keeps a meaningful static signal.

## Truthful signal and playback

Authorized prototype recordings use the media clock for progress and seeking. When analysis is available, Web Audio drives the waveform. Otherwise Rondo uses labeled, playback-synchronized motion.

Signal states are explicit:

- **Live signal:** analyser-backed levels from the active recording.
- **Playback motion:** synchronized fallback when analysis is unavailable.
- **Paused:** bars settle instead of pretending music is active.
- **Reduced motion:** a stable nonanimated pattern.

Tracks without an authorized recording use an explained demo timeline. Simulated progress is never presented as streamed audio analysis.

## Volume

Volume is one persisted value across the main transport and Song Room. Both controls show percentage and responsive level feedback. Mute preserves the last audible level so unmute restores it. Native range controls retain keyboard semantics.

## Optional extras

Listening may open a release-specific extra, but no song, credit, lyric access, accessibility feature, or paid entitlement can be locked behind engagement. Extras reward attention without manufacturing scarcity.

## Personal listening

Listeners can save an exact timestamp and write a private note for a song. Moments and notes persist locally in the prototype, appear in Library, and reopen the correct listening context.

## Playback source policy

The prototype contains six original 32-second stereo MP3 instrumentals from Rondo Originals. Production sources may include direct artist uploads, official embeds, Creative Commons/public-domain recordings, or licensed catalog providers. Unlicensed recordings and lyrics are out of scope.

The artists, releases, stories, and extras in the prototype are fictional. Production editorial content requires source, attribution, and rights review.

## Motion and accessibility

Reduced Motion removes nonessential animation while preserving state. Controls support visible focus, keyboard operation, focus-contained dialogs, 44px touch targets, mobile safe areas, non-color selected states, and labels for signal mode, progress, and volume.

## Artist completion

After the final eligible track, playback pauses and shows tracks heard or saved, releases completed, progress, the next alphabetical artist, and clear Continue, Replay artist, Choose another artist, and Stop actions.

## Out of scope for this prototype

- real artists and licensed commercial songs;
- production accounts, provider credentials, catalog ingestion, or backend services;
- social feeds, public comments, and follower counts;
- fake AI DJs or unsupported audio-analysis claims;
- podcasts and news;
- collaborative listening;
- artificial song locks or manipulative streaks.
