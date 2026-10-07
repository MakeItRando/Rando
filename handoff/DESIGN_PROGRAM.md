# Rondo design program — design first, then build

**Started:** 2026-10-06 (folder names say 10-04/05; see handoff/SESSION_2026-10-07.md). **Status:** active — Home rev 4 (desktop + phone, Dig) proposed — awaiting verdict; Now Playing page next. Every page is designed for desktop and phone (D-062). **Owner direction:** design every surface first, page by page, then choose implementation approaches. Update this file whenever a page brief, study, verdict or token changes.

## Why this program exists

The owner reviewed the v0.3.1 preview and judged it "fine but not that good": it looks dated against current music apps and does not feel engaging or systematic enough. This is a new explicit owner request for a modern visual and interaction system. It **supersedes D-043's "small component changes only" limit** for this phase. It does **not** revive the rejected Living Record study (D-042 stands): no cream editorial reset, slogan typography, concept-board styling or forced terminology.

## Honest critique of v0.3.x visuals (what to fix)

| Problem | Evidence in v0.3.x | Direction |
| --- | --- | --- |
| Navy-tinted canvas everywhere makes every page look the same and slightly muddy | Discover, Genre, Song Room share one blue-black wash | Neutral graphite canvas; color comes from the artwork in context only |
| Typography mixes heavy tight display, tiny uppercase labels and a serif | "Play something good." hero, `RONDO RIGHT NOW` eyebrows, Georgia in Song Room | One modern sans (Geist study), 5 sizes, sentence case, no letter-spaced micro labels |
| Cover art is code-drawn with titles printed inside the art | `BLACKTOP STUDIES` text inside covers | Covers are pure imagery; the UI prints titles. Real catalog art later |
| Home opens with a slogan, not with the listener's music | Hero copy + Surprise me before any content | Open on resume tiles, Journey progress and new releases from followed artists |
| Too many bordered pills, outlines and small chrome | tags, chips, outlined buttons on every surface | Fewer containers; hierarchy by size, weight and spacing |
| Playback context is not legible | B-001/B-002, unclear "what plays next" | "Playing from …" source line on every player surface; truthful Up next |
| Desktop wastes the third column, mobile Now Playing is crowded | Song Room tabs + panel + waveform + volume all at once | Desktop: Home + persistent Now Playing panel. Mobile: art, title, scrub, 5 controls, lyrics sheet |
| Two accent colors compete (coral and periwinkle/pink) | Discover coral, Song Room blue, artist pink | One brand coral for primary action/active state; artwork supplies ambience |

## Principles (acceptance bar for every page)

1. **Music first, within one second.** The first screen shows something the listener can play or resume.
2. **One primary action per surface.** Everything else is visibly secondary.
3. **Always say where the sound comes from.** "Playing from playlist Late drive" is on mini player, panel and Now Playing.
4. **Color is earned from the artwork,** limited to ambient backgrounds and the lyric card. UI chrome stays neutral; coral marks the primary action and active state only.
5. **Familiar patterns, Rondo details.** Users already know Spotify/Apple Music layouts. Don't make them relearn; differentiate through Journeys, follow updates, playlist intelligence and craft.
6. **Motion is causal and short** (120–240 ms; shared-element art transition into Now Playing; progress, like and add-to-playlist feedback). Reduced Motion gets the full experience without movement.
7. **Readable at real size:** 14px floor for secondary text, 44×44 targets, AA contrast, 320px safe.

## Foundation tokens (study A, superseded — see Study B)

- Canvas `#0a0a0b`; surfaces `#121214` / `#1a1a1d` / `#242428`; hairlines 8% / 14% white.
- Text 100% / 66% / 46% of `#f5f5f4`. Brand coral `#ff6b4a` (dark ink on coral).
- Type: Geist (OFL) 400–700. Sizes 12 / 14 / 20 / 24–30 display. Sentence case. Tabular numerals for time.
- Radius 8 (tiles, covers) / 12 (panels) / pill only for chips and buttons. Spacing 4·8·12·16·24·32.
- Icons: 1.8px stroke, 24-grid, rounded joins; filled only for play/pause/liked.

## Page-by-page order

Each page goes through: **brief → study (real-size desktop + mobile renders in repo) → owner verdict → refine → locked spec in `docs/specs/` → build later**.

| # | Surface | Status |
| --- | --- | --- |
| 0 | Foundation (tokens, type, icons, player bar, mini player) | Settled through studies B → E (Home E style.css is the reference) |
| 1 | Home (Discover) desktop | Rev 3 approved (D-058); **rev 4 proposal (D-065)** — clean scrubber, Dig, sentence case; awaiting verdict |
| 1b | Home phone | **Designed in rev 4 (D-065)**: bottom tabs, mini player, full-screen Now Playing; awaiting verdict |
| 2 | Now Playing (desktop panel + mobile full screen) + Lyrics/Credits/About sheet | Overlay exists in Home E; full page next |
| 3 | Playlists (Library list, playlist page, create/add flow) | Study A only (superseded); spec in docs/specs/PLAYLISTS.md |
| 4 | Artist page (follow, releases, Journey entry) | Not started |
| 5 | Journeys (picker, Genre page, Artist Journey) | Not started |
| 6 | Search (instant results, recents, empty/error) | ⌘K palette in Home E; page not started |
| 7 | Library (playlists, liked, artists, albums, moments/notes) | Not started |
| 8 | Release/album page | Not started |
| 9 | Profile & settings | Profile menu in Home E; page not started |
| 10 | First run (play-first, optional setup) | Not started; D-045 play before setup |
| 11 | Notifications/new releases from followed artists | Panel in Home E; spec docs/specs/FOLLOWING.md |

## Anti-slop rules (owner verdict on study A, 2026-10-05)

Owner: study A is "the right direction" but "feels kinda overused and AI… not giving tech vibe, giving AI slop vibe" (colors and wording). Banned from now on:

- Purple/pink/cyan gradients, glowing blobs, neon bokeh, page-wide ambient washes, glassmorphism.
- Greetings and chatty copy ("Good evening, Mikoto", "picks up where … left off", "Fits this playlist", "Surprise me").
- Rounded-pill everything, soft drop shadows, emoji-ish iconography.
- Decorative visuals without data; generic AI imagery.

Required instead: neutral canvas with hairline structure; numbers and metadata as design material (track numbers, durations, counts, BPM/key, dates in mono); flat, intentional sleeves; real waveform scrubber; plain labels; one accent for live/now-playing state only. Every element must answer "what is it, what can I do". Reference feel: professional audio tools and well-made dev tools (precise, quiet, information-rich), not concept art.

## Owner feedback 2026-10-07 (open)

Owner: bottom progress bar "looking kinda untidy with those big ass lines"; app "looks boring sometimes… not giving the vibe to explore it and engaging (maybe because we havent added real songs yet)". Reviewer also found no phone layout and UPPERCASE micro labels that break principle 3 of the type rules. Proposed fixes: REVIEW_2026-10-07.md §3–4.

## Home study E (2026-10-06) — approved through rev 3

Owner on C also said: audience is mostly teenagers; make it more advanced, engaging, interactive and systematic; perfect Home before any other page. E builds on D's binding state rule (D-055) and adds: Stage hero (sleeve + vinyl that slides out while playing), Journey CTA states (Start/Resume X → Pause/Resume + Open Journey), progress ring, source-bounded queues + queue drawer, ⌘K search palette, add-to-playlist with Undo/duplicate warning, On repeat (×plays), Moods, This week, animated filter, toggle-never-restart. Files: [`design/studies/2026-10-05-home-e/`](../design/studies/2026-10-05-home-e/README.md), spec [docs/specs/HOME.md](../docs/specs/HOME.md). Awaiting verdict (D-056). D (below) stays as the alternative without a bottom bar.

**Rev 2 (2026-10-06, D-057).** Owner: "way way better… so close". Added light mode (token swap, toggle + system default), filled Journeys filter (Your Journeys genre cards, Artists you finished) and Following filter (Artists you follow), song menu (Play next, Add to queue, Add to playlist, Go to artist, Share), user queue ahead of the source queue. Owner confirmed rev 2.

**Rev 3 — Home complete (2026-10-06, D-058).** Owner liked every suggestion and delegated the bar choice (bottom bar kept). Added Now Playing + synced lyrics, share cards, monthly recap, notifications, profile/appearance (Auto), shortcuts sheet, sleep timer + crossfade, repeat modes, volume/mute, devices, New playlist/Blend, working See all/Browse/Manage, "For you" filter, responsive collapse. Renders 10–18. Next: Now Playing page, then Journey page.

## Study D (2026-10-05) — alternative (state-aware Home, no bottom bar)

Owner on C: "way better… way impressive" but Journey action never changed while playing; some parts old/not advanced; some elements shouldn't be there. D makes every play control state-aware (Start/Resume/Pause, live progress ring), keeps "Open Journey" always available, gives each source its own truthful queue, and removes the bottom bar, filter chips, uppercase labels, pills and duplicate sections. Files: [`design/studies/2026-10-05-foundation-d/`](../design/studies/2026-10-05-foundation-d/README.md). Awaiting verdict (D-054).

**Binding rule from this feedback:** any control that starts playback must reflect the current state of its source (playing / paused / in progress / not started) everywhere it appears.

## Study C (2026-10-05) — superseded by D

Owner on B: right direction but not satisfying; wants more engaging, smooth, advanced, creative and unique, systematic, user-friendly, no AI wording. Files: [`design/studies/2026-10-05-foundation-c/`](../design/studies/2026-10-05-foundation-c/README.md). Keeps B's anti-slop system and adds: flat sleeve-colour surfaces, Journey artist path as the signature component, real interaction and motion (hover lift, sleeve swap, live lyric line, playing indicator, waveform seek), truthful source switching. Awaiting verdict (D-053).

## Study B (2026-10-05) — superseded by C

Files: [`design/studies/2026-10-05-foundation-b/`](../design/studies/2026-10-05-foundation-b/README.md). Same three surfaces as A, rebuilt under the anti-slop rules. Awaiting owner verdict (D-051). Study B tokens: canvas `#0c0c0c`, surfaces `#131313/#1b1b1b/#262626`, hairline `#232323`, text `#ededed/#a3a3a3/#6e6e6e`, accent `#ff5b1f`, radius 4px (2px sleeves), Geist + Geist Mono 500.

## Study A (2026-10-04) — superseded by B (direction right, styling read as AI slop)

Files: [`design/studies/2026-10-04-foundation-a/`](../design/studies/2026-10-04-foundation-a/README.md). Renders: Home desktop 1440×900, Now Playing mobile 390×844, Playlist mobile 390×844. Covers are code-drawn abstract placeholders for the study only (no text in art); they are not product assets. Awaiting owner verdict on: overall direction, Geist type, coral-only accent, layout of Home, Now Playing, playlist page.

## Rules for contributors

- Never merge a study into app code before the owner marks it approved here.
- Keep every study's HTML and renders in the repo; rejected studies stay with a recorded reason.
- Specs describe states: loading, empty, error, long text, offline/unavailable, reduced motion, 320 / 390 / 1440 widths.
