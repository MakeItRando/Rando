# Rondo product specification

## Product promise

Rondo helps a listener feel anticipation before playback, enter music with intent, understand what makes a release distinct, reveal optional context through listening, and keep the moments worth returning to.

The product has two complementary discovery modes:

- **Discover** is an editorial destination for doors, scenes, connections, and controlled surprise.
- **Journeys** is a deliberate genre and artist path with visible sequence and completion.

Rondo is equally a music player, release experience, and artist explorer. It is not an infinite content feed, social feed, or skin over another streaming application.

## Experience loop

`anticipation → entrance → listening → revelation → memory`

1. **Anticipation:** a hook, image, scene, or relationship creates curiosity without explaining everything.
2. **Entrance:** the listener chooses a door, release chapter, track, or guided artist journey.
3. **Listening:** one shared player and queue preserve continuity across every surface.
4. **Revelation:** short listening milestones can open optional stories or artifacts.
5. **Memory:** saves, moments, notes, progress, and reveals make the session worth returning to.

## Confirmed decisions

- **Account:** required Rondo account and editable taste setup.
- **Primary navigation:** Discover, Library, Journeys, and Profile.
- **Artist order:** alphabetical inside the selected genre.
- **Artist chapter:** one artist at a time.
- **Core releases:** albums and EPs, newest to oldest.
- **Track order:** official disc and track order.
- **Catalog default:** tracks matching the selected genre, with an All catalog escape hatch.
- **Boundary:** ask before continuing after the artist's final eligible track.
- **Saves:** tracks, releases, artists, moments, private notes, journeys, progress, and reveals owned by Rondo.
- **External accounts:** not required by the product concept.

## Discover

Discover is a distinct front door—not the genre selector under another name. Its current modules are:

- **Tonight's Door:** one strong, time-sensitive entrance into a song and chapter;
- **New Chapters:** release-led invitations with distinct visual and narrative identity;
- **Take Me Somewhere:** controlled serendipity with a visible destination after selection;
- **Follow a Scene:** human-readable routes into genres without making taxonomy the experience;
- **Signals Between Songs:** editorial relationships that explain why two recordings might belong together;
- **Listening Leaves a Trace:** a quiet record of opened artifacts and remembered moments.

The default page stays finite and composed. It should create curiosity, not simulate an endless feed.

## Journeys and Artist Focus

Journeys owns the genre selector, A–Z artist index, search, chapter, and progress. Playback collapses the directory to prioritize listening; reopening never stops playback. Artist Focus retains biography, sourced styles, catalog counts, alphabetical position, save/skip/play actions, and completion.

Core hierarchy:

`genre → alphabetical artist → matching/all catalog → release → track → Song Room → completion summary`

## Release chapters

Every album or EP can provide:

- a distinct cover and accessible color signal;
- chapter number and short hook;
- liner-style note that frames rather than exhausts the work;
- a motif or recurring idea;
- an optional artifact with a short listening threshold;
- official track order and a truthful Play/Pause chapter action.

Release pages are entrances, not expanded metadata cards. The selected release supplies that page's palette even when another release is currently playing; the global player and Song Room remain tied to the active recording.

## Song Room

The Song Room makes one recording feel understandable rather than adding another dashboard. Its modes are:

1. **Room** — artwork, identity, active signal, current lyric, journey position, and core controls.
2. **Lyrics** — synchronized authorized/demo words with line seeking.
3. **Story** — why the song belongs, exact style, release, signal, featured roles, and provenance.
4. **Credits** — supplied writers, producers, artists, version, and recording ID; unknown roles remain unknown.
5. **Reveals** — the release artifact's locked/open state and earned context.
6. **Queue** — the current artist chapter in release order without silently crossing the artist boundary.

The visual accent comes from the active release artwork. Genre remains a labeled classification and controls the surrounding Journey ambience. Rondo red is the missing-artwork fallback.

## Truthful signal and playback

Authorized prototype recordings use the HTML media clock for progress and seeking. When analysis is permitted, one Web Audio analyser drives the synchronized Song Room waveform, context micro-spectrum, and compact level bars.

The interface labels its state honestly:

- **Live signal:** analyser-backed levels from the active authorized recording;
- **Playback motion:** deterministic, playback-synchronized fallback when signal analysis is unavailable;
- **Paused:** bars settle instead of pretending music is active;
- **Reduced motion:** a stable nonanimated pattern.

Tracks without an authorized recording use an explicitly labeled demo timeline. Rondo never implies that simulated progress or motion is streamed audio analysis.

## Volume

Volume is one shared persisted value across the main transport and Song Room. Both fields show percentage and responsive level feedback. Mute preserves the last audible level so unmute restores intent instead of forcing a default. Native range controls retain keyboard semantics.

## Reveals and ethical progression

Listening can unlock optional release artifacts such as a route card, field note, alternate image, or studio fragment. A reveal may deepen context, but it must never withhold a core song, required credit, essential accessibility content, or paid entitlement behind artificial engagement.

Prototype thresholds are intentionally short. Production thresholds should be transparent, resilient across devices, and based on genuine played time rather than page-open time.

## Personal listening

Listeners can save an exact timestamp and write a private note for a song. Moments and notes persist locally in the prototype, appear as first-class Library cards, and reopen the correct Song Room context. Release progress and unlocked artifacts persist independently of the active track.

## Playback source policy

The prototype contains six original 32-second stereo MP3 instrumentals from Rondo Originals. Production sources may include direct artist uploads, official embeds, Creative Commons/public-domain recordings, or licensed catalog providers. Unlicensed full recordings and lyrics are out of scope.

Fictional stories, artists, releases, and artifacts exist only to demonstrate the interaction model. Production editorial content requires source, attribution, and rights review.

## Motion and accessibility

Reduced Motion removes nonessential animation while preserving hierarchy and state. Controls support visible focus, keyboard operation, focus-contained dialogs, 44px touch targets, mobile safe areas, non-color selected states, and labels for signal mode, progress, volume, and reveal status.

## Artist completion

After the final eligible track, playback pauses and shows tracks heard/saved, releases completed, progress, the next alphabetical artist, and Continue, Replay artist, Choose another artist, and Stop actions.

## Out of scope for version one

- social feeds, public comments, and follower counts;
- fake AI DJs or unsupported audio-analysis claims;
- podcasts and news;
- collaborative listening;
- artificial song locks or manipulative streaks;
- unlicensed commercial recordings, lyrics, artwork, biographies, or liner material.
