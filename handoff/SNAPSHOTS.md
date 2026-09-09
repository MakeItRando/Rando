# Conversation and visual snapshot index

## Source note

The previous chat link supplied on 2026-09-09 could not be loaded as a Notion page/session, so four user-supplied screenshots were treated as state-recovery evidence. Their product decisions remain preserved below. Repository-native final QA evidence now supplements those screenshots.

## Recovered snapshot 1 — Earlier readiness claim

Visible context:

- the user asked for final touches before real artists, songs, and the real system;
- Play artist still appeared unchanged and some concepts felt overexplained;
- Song Room needed to feel more active and professional;
- an earlier assistant claimed readiness.

Controlling interpretation: that readiness claim is historical. Exact-head QA and current handoff evidence determine readiness.

## Recovered snapshot 2 — Discover and design correction

- Discover had become a genre-choice popup; the user wanted a real song-first page with useful search, direct playback, suggestions, hits, bangers, moods, and genre exploration.
- Discover and guided Journeys must be distinct.
- The user rejected giant type, excessive animation, generated-looking decoration, and product-strategy copy.

Decision: Discover opens directly; music/artwork/selection create interest; motion and copy stay restrained.

## Recovered snapshot 3 — Corrected information architecture

- Genre selection belongs in Journeys.
- Each genre opens its own page.
- No permanent Journey genre dropdown.
- First use shows a focused picker; returning use resumes; Change genre remains available.
- Meaningful progress persists independently.

Accepted supporting direction: continuous playback, Resume Journey, truthful history-based recommendations, and no streaks, fake charts, autoplay traps, giant banners, or excessive locking.

## Recovered snapshot 4 — Route-backed pages

The user accepted page-like SPA routes for accessibility/navigation continuity. Routing provides distinct URLs, titles, landmarks, and Back/Forward while preserving the shared player. It does not by itself reduce bundle size; production performance depends on bounded APIs, pagination, lazy assets, caching, and code splitting.

## Final v0.3.2 repository evidence

### Exact references

- Candidate: `89fc0d5d352db31ab90ff7d5b25b698db8e8c6cf`
- Successful run: `34332141798`
- Evidence: `dbe315e6ad1687537594a80da566af44645c764f`
- Preview: `873fbbeb1d209889250825b054b235b8493b4e05`
- Preview HTML blob: `759a9df34423092ee5843f57f09efe7f4bd43363`
- PR #5: open, draft, unmerged

### Evidence files

On `rondo-v032-qa-evidence/latest`:

- `run-summary.txt` — all 12 suites plus visual step successful;
- `test-results.json` — every browser suite status `0`;
- `test-logs/` — per-suite logs;
- `visual-report.json` — 18 captures, no failures/runtime errors/overflow/broken images/undersized targets;
- `visual-contact-sheet.jpg` — complete visual matrix;
- `screenshots/` — source captures.

### Final 18-capture matrix

| # | File | Viewport | State | Manual result |
| --- | --- | --- | --- | --- |
| 01 | `01-desktop-discover.jpg` | 1440×900 | Direct Discover | Accepted |
| 02 | `02-desktop-discover-lower.jpg` | 1440×900 | Lower Discover | Accepted |
| 03 | `03-desktop-discover-sound.jpg` | 1440×900 | Sounds expanded | Accepted |
| 04 | `04-desktop-journey-picker.jpg` | 1440×900 | First-use picker | Accepted |
| 05 | `05-desktop-hiphop-journey.jpg` | 1440×900 | Hip-Hop Genre page | Accepted |
| 06 | `06-desktop-hiphop-songs.jpg` | 1440×900 | Hip-Hop songs | Accepted |
| 07 | `07-desktop-artist-journey.jpg` | 1440×900 | Artist Journey | Accepted |
| 08 | `08-desktop-song-room-about.jpg` | 1440×900 | Song Room About | Accepted |
| 09 | `09-desktop-song-room-lyrics.jpg` | 1440×900 | Song Room Lyrics | Accepted |
| 10 | `10-desktop-song-room-queue.jpg` | 1440×900 | Song Room Up next | Accepted |
| 11 | `11-desktop-light-discover.jpg` | 1440×900 | Light Discover | Accepted |
| 12 | `12-mobile-discover.jpg` | 390×844 | Mobile Discover | Accepted |
| 13 | `13-mobile-journey-picker.jpg` | 390×844 | Mobile picker | Accepted |
| 14 | `14-mobile-rnb-journey.jpg` | 390×844 | Mobile R&B Genre page | Accepted |
| 15 | `15-mobile-rnb-artist.jpg` | 390×844 | Mobile R&B Artist Journey | Accepted |
| 16 | `16-mobile-change-genre.jpg` | 390×844 | Mobile Change genre/directory | Accepted |
| 17 | `17-compact-discover.jpg` | 320×700 | Compact Discover | Accepted |
| 18 | `18-reduced-motion-song-room.jpg` | 390×844 | Reduced Motion Song Room | Accepted |

**Manual acceptance:** `18/18`. No candidate source change was warranted by the final visual review.

## Exact portable-preview runtime audit

The exact published HTML Git blob was extracted without modification and served over HTTP. Its canonical size is `500467` bytes; extraction tools that append a newline produce a non-identical file and must not be used for identity checks.

The 37-check audit passed:

- malformed raw local state repaired and persisted;
- direct Discover and cold-start recommendation gating;
- Discover search and Sounds expansion;
- real playback path and Song Room;
- playback continuity through navigation;
- first-use Journey picker, R&B route, contextual Change genre close, and focus return;
- Artist Journey plus browser Back/Forward;
- 320px no-overflow checks;
- Reduced Motion static signal;
- non-overlapping Song Room time/metadata columns;
- zero page, console, request, or HTTP errors.

Local audit-only MP3 fixtures were used under the six exact relative filenames to keep browser playback deterministic after sandbox resets. They were not committed and are not repository evidence for the recordings themselves. The six preview-branch audio objects and their exact SHAs were independently confirmed:

| File | Blob SHA |
| --- | --- |
| `afterimage.mp3` | `172c59614f12bbf2b844bd0fcceb8cb407d8dd11` |
| `blue-hour.mp3` | `74167eb7f3df55f875991f863cd6a3a956d5cb46` |
| `continuum.mp3` | `566a4608ff5496a153079b7290b946ee599325ad` |
| `first-light-again.mp3` | `029143c6090c84c8f6098a14ee834bccf3cd044a` |
| `night-transit.mp3` | `2643293d06f4aaaeb843a823362693cc4331b95c` |
| `open-circuit.mp3` | `d8e8b61973243ea607a6318bbb68404be2ab1826` |

## Security evidence

A targeted review covered all 58 PR files and patches. Credential-pattern findings: `0`. GitHub Advanced Security was unavailable, so no paid feature was enabled and no unavailable result was represented as coverage.

## Future evidence template

```text
File:
Date/time:
Branch and exact SHA:
Build/preview URL and blob:
Route and state:
Viewport/device:
Appearance and motion preference:
What the evidence proves:
Known issue visible:
Related test/run:
Manual reviewer result:
```
