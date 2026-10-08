# Spec: Stamps, passport and share cards

Status: **approved direction, D-070** (owner 2026-10-07: "yes i like those idea (j and e), perfect… now we gotta design them and note all that in handoff and specs"). Built in Home E rev 9 (`design/studies/2026-10-05-home-e/`, end of `app.js`/`style.css`). Extends [JOURNEYS.md](JOURNEYS.md). All numbers come from real counts or the user's own plays — nothing is guessed (D-050).

## Job

Make finishing an artist feel worth it and worth showing: a keepsake with real facts, proof you were early, and an easy share.

## Stamp (front)

- Artist portrait, name, date finished, **No. <collector number>** (large stamps only).
- **Edition (J7):** *Full discography* = solid double frame; *Essentials* = dashed edge.
- **Early ear ribbon (E1)** when it applies.
- **"<n> new" badge (E6, living stamp)** when the artist released songs after you finished. Private — never on share cards.
- Tap any stamp (genre page, artist page, passport) → stamp sheet.

## Stamp sheet

- Left: the stamp; **Flip** (or tap the stamp) shows the **back (J6):** Started, Finished, Songs (heard of total), **Took** (days from first to last song), **Listening time** (including replays), Most played (× plays), Liked, and your note (empty → "+ Add a note", focuses the note field). Only personal facts: first/last song were removed (owner 2026-10-07) because Journey order is fixed — artists A→Z, each artist's releases newest → oldest, songs in official order — so they'd be the same for everyone.
- Right: genre + station, artist, edition · date.
  - **Early ear (E1):** monthly listeners when you finished → now, growth ×, bar. Rule: under **100K** when you finished and **≥5×** since. Otherwise the box shows "When you finished … Now …" without the badge.
  - **Collector number (E2):** "You were the 1,284th person to finish Asha." Counts everyone who finished that artist (any edition).
  - **New since you finished (E6):** new songs, playable; "Your stamp stays. Listen to these and it shows 'up to date' again."
  - **Your note (J8):** one private line, 80 characters.
  - Actions: **Share**, **Pin to passport / Pinned**, **Open <artist>**.

## Genre seal (J7)

Round seal in the genre colour; ring text "<GENRE> · <n> ARTISTS · A TO Z · FULL/ESSENTIALS"; centre: genre + date. Appears first in "Your stamps" on a finished genre, in the passport, and can be shared.

## Passport (J1)

Route: Journeys › Passport (from "Open passport" in Your stamps; later also Profile).
- Hero: stamps · genre seals · early ears, **Share passport**.
- **Pinned** (max 3, stamps or seals; pinning a 4th replaces the oldest with a toast). Shown on profile + passport card.
- **Genre seals:** all genres; unfinished = dashed outline with "3/7" (tap → that genre).
- One row per genre with any stamp: stamps + empty numbered slots with the artist name.
- Footnote explains early ear and collector number.
- Phone: pinned row scrolls sideways inside itself; page never scrolls sideways (tested).

## Share cards (E3)

Preview + options. Types: stamp, genre seal, passport (3 pins + counts). Formats **Story 9:16** / **Square**. Content: label, item, "I finished <artist>", songs · edition, early ear pill, collector number, footer **rondo · rondo.app/@username**. Actions: Save image, Copy link, Instagram, TikTok, More (system share). Privacy line: "Shows your username and this stamp only. No listening history."

## Also in rev 9

- **Halfway mark (J12):** a small dot at 50 % on every progress ring; fills when reached. No popups.
- **Journey of the week (E4):** card on the genre page — editorial short Journey (3 artists), "ends Sunday", live "people on it now", Start; "Finish by Sunday for this week's stamp. Miss it and nothing is lost." An event, not a streak.

## Not designed yet (approved ideas, specced for later)

| Id | Idea | Scope | Notes |
| --- | --- | --- | --- |
| J2 | Genre finish recap (story cards) | V1-local | reuse share card system |
| J3 | Journey picks playlist (liked during a Journey) | V1-local | auto playlist in Library |
| J4 | Era checkpoints | V1-backend | needs release/era metadata |
| J5 / E7 | Friends on the same Journey, friends' passports | V2 | accounts; no rankings by hours |
| J9 | Connections on the map (features between artists) | V1-backend | credits data |
| J10 | Producer / label Journeys | V1-backend | builds on Credits |
| J11 | Year view of the map | V1-local | view only, progress stays A→Z |
| J13 | Your own Journey (3–10 artists) | V1-local | same rules + stamps |
| J14 | Hook replay game after finishing | V1-local | optional, scores private |
| J15 | Not for me (skip artist for good) | V1-local | honest "skipped" on the map |
| J16 | Download next artist | V1-backend | offline |
| E5 | Artist voice intro + thank-you | V1-backend | needs artist partnerships |
| E8 | Ring widget (home/lock screen) | app | native widget |

## Avoid

Streaks, hour-based leaderboards, public listening history.

## Study limitations

Listener counts, collector numbers, play counts and dates are placeholders (Asha/Dax/Kairo hand-set; others generated). Lo-fi is pre-finished as an Essentials genre to show the seal. Share buttons show toasts. Journey of the week Start shows a toast.

## Acceptance tests (`check.mjs`)

Stamp opens with early ear + collector number + new songs · Flip shows the back · note saves · pin/unpin, max 3 · share card shows the stamp without the private badge · Square format · passport shows 3 pins + Lo-fi seal · empty seal opens its genre · phone passport has no sideways scroll.
