# Spec: Home (draft from Home study E, 2026-10-05)

Status: **revision 4 approved** (D-065, owner: "thats perfect") — desktop + phone. Rev 3 = desktop complete (D-058; rev 2 = D-057, rev 1 = D-056; state rules D-055). Targets: desktop app + mobile app (D-062); every rule below applies to both unless a section says otherwise. Implementation approach is chosen after all key pages are approved.

Try it: https://makeitrando.github.io/Rando/design/studies/2026-10-05-home-e/home.html

## Rev 4 changes (owner feedback 2026-10-07, D-060..D-063) — done in the study

- **Scrubber** (player bar + mini player): 3 px line, played part in text colour (accent on hover/drag), line grows to 5 px on hover; thumb 12 px + time bubble only on hover/drag; click or drag seeks; ←/→ ±5 s when focused; `role=slider` with aria-valuenow/valuetext. No waveform in the bar (waveform may return later in Now Playing only).
- **Dig** (new, D-061) — see § Dig.
- **Phone layout** — see § Phone.
- **Labels:** sentence case everywhere; no UPPERCASE letter-spaced micro labels.
- **Scope tags** on every feature (§ Scope).
- Sleeves stay flat placeholders (D-063); 10 new Dig sleeves add variety.

## Sections (top → bottom)

1. **Stage** — the current or last session. Sleeve-coloured flat surface; sleeve + vinyl (slides out and spins only while playing; static under Reduced Motion); caption `Now playing|Paused · <source type> · <source name> · NN/NN`; title; artists + Follow; live lyric line or "Instrumental"; actions: Play/Pause, Like, Add to playlist, ⋯ song menu (Share lives here), source button; Up next (user queue first, then the **same** source) or "End of <source>. Playback stops here."; progress line.
2. **Journey + This week** — Journey path (done ✓, current with progress ring, upcoming dimmed), footer with total songs heard / Journey songs (heard now in accent) and the next artist and a local listening summary (minutes, 7-day bars, top artist, new artists found, monthly recap entry). No streaks or guilt mechanics.
3. **On repeat** — most-replayed songs with ×count (Rondo tagline: find your next repeat).
4. **Moods** — 6 colour tiles with sleeve stack; each is a finite source.
5. **Dig band** (after Journey + This week): "Dig · 10 songs you've never heard", sleeve fan, count left today, Start/Continue digging; after finishing: "Done for today · N dug" + Play Dug.
6. **New from artists you follow** — release type + relative date; new = accent (D-046).

Filter: All / For you (stage, On repeat, Moods) / Journeys (stage, Journey, **Your Journeys** genre cards with live CTA + progress, **Artists you finished** with Replay) / Following (stage, **Artists you follow** with NEW badge, releases). No filter view may be empty.

## Dig (V1-local, D-061)

- Daily finite stack of **10 songs the listener has never played** (V1: from the local catalog; V1-backend: from catalog by genre/followed-artist similarity). No infinite feed.
- Card: sleeve, title, artist, genre/BPM line, 15 s **hook** (starts at the song's hook timestamp) with a progress ring; the hook plays once, then waits for Keep or Skip.
- Actions: **Keep** (button, →, swipe right) adds to the **Dug** playlist; **Skip** (button, ←, swipe left); Space pauses the hook; Undo toast for the last action; Play full song (source = Dig); Follow artist; Esc / back closes.
- Opening Dig **pauses** main playback; closing offers "Resume <song>" (toast). Dig never changes the main queue.
- End: "Done for today. You kept N of 10. A new stack arrives tomorrow." + Play Dug. No streaks, no guilt copy.
- States: not started, in progress (n/10), done; empty catalog → "Nothing new to dig today" + Browse genres (spec only; not drawn in the study yet).

## Phone (≤640 px; the mobile app's base layout)

- **Bottom tabs** (icon + label, 56 px + safe area): rev 4 had Home, Journeys, Dig, Library; the Explore proposal (D-066) makes them Home, Explore, Journeys, Library with Dig inside Explore — see [EXPLORE.md](EXPLORE.md). Search via top bar icon or Explore; profile/bell in the top bar.
- **Mini player** above the tabs: sleeve, title/artist, play/pause, 2 px progress line; tap opens full-screen **Now Playing** (sleeve, title, scrubber, 5 controls, lyrics below). Swipe down/back closes.
- Filter (All / For you / Journeys / Following) is a scrollable row inside the page, not the top bar. Stage stacks: sleeve, caption, title, actions; Up next hidden.
- Journey path scrolls horizontally; shelves are horizontal scroll rows; This week becomes a compact card.
- Dig on phone is full screen; the mini player hides while digging.
- Touch targets ≥44 px; no horizontal page overflow at 320–640 px (tested at 390 px). Theme toggle lives in the profile menu on phone.

## Scope

| Feature | Scope |
| --- | --- |
| Stage, Journey, On repeat, Moods, queue, ⌘K search, song menu, lyrics, sleep timer, crossfade, repeat, themes, shortcuts, Dig (local catalog) | V1-local |
| Following/new releases, notifications, monthly recap sync, share links, Dig from full catalog | V1-backend |
| Blend, devices/handoff, social profile | V2 (accounts) |

## Top bar and overlays

- **Notifications** (bell, N): New / Earlier; release items have a live Play/Pause (D-055), recap → View, Journey milestone → Start. Mark all as read clears the dot.
- **Profile menu** (avatar): Profile, Appearance Dark / Light / Auto (Auto follows the system), Keyboard shortcuts, Settings, Log out.
- **Now Playing** (song title, sleeve, lyrics button, L): sleeve-coloured full view, title, artists, BPM / key / length, Like, Share lyric; synced lyrics (current line bright, past dim), click a line to seek; "Instrumental" state when there are no lyrics.
- **Share card** (song menu → Share, Share lyric): Story 9:16 or Post 1:1, background Sleeve / Dark / Light, pick one lyric line or none; Save image, Copy link.
- **Monthly recap** (This week → Your <month>; notification): 5 story cards (time + day calendar, top artists, song of the month, discoveries, your sound), auto-advance 5.2 s, arrows, Save my month. Local stats only, no streaks.
- **Blend** (sidebar + → New Blend): invite a friend; daily-refreshing shared playlist. Needs accounts for both people (V2 backend).
- **Keyboard shortcuts** (?): Space, ⇧→ / ⇧←, → / ← 5 s, S, R, M, ⌘K or /, L, Q, N, T, Esc.

## Player bar

Shuffle; Repeat cycles off → this source → this song (repeat loops the active source only, never expands it); sleep timer (Off, 15, 30, 45, 60 min, end of this song; countdown chip, pauses with a toast) and crossfade (Off, 3, 6, 12 s; albums/EPs always gapless); lyrics; queue; devices (honest single-device state); volume slider (drag, arrow keys) + mute.

## See all destinations

On repeat → expands to 12; New from artists you follow → Following filter; Browse genres → more genre Journeys; Manage → unfollow mode with Undo. No dead links.

## Responsive

≤1240 px: stage Up next hides, shelves show 5. ≤1020 px: sidebar collapses to icons, This week becomes a row, Now Playing shows lyrics only. ≤640 px: phone layout (§ Phone).

## Theme

Dark (default) and light. Toggle in top bar, stored locally, first run follows `prefers-color-scheme`. Same tokens, inverted neutrals; accent unchanged; the stage keeps its sleeve-coloured dark surface in both themes.

## State rules (binding)

- One active **source** (playlist, Journey, release, mix, mood). Every play surface shows it. Queue = **Next in queue** (songs the user added via Play next / Add to queue; played first, then cleared) + **Next from <source>** (only that source's items).
- Song menu (⋯ on stage, right-click / long-press on any song row or card): Play next, Add to queue, Add to playlist, Go to artist, Share. Queue actions show a toast with Undo.
- Clicking the control of the source that is already active **toggles pause**; it never restarts.
- Journey CTA: not in Journey → `Open Journey` + `Start/Resume <artist>`; in Journey playing → `Open Journey` + `Pause`; in Journey paused → `Open Journey` + `Resume`.
- Current-artist node: ring = songs heard / artist's songs; overlay equaliser only while the Journey is playing.
- Natural end of a source stops playback (no silent expansion — B-002). Next on last item = stop.
- Add to playlist: popover; success toast with Undo; duplicate → "Already in X · Add anyway".
- ⌘K / Ctrl+K search palette: artists → playlists/releases → songs (max 4 songs), arrows + Enter, Esc closes and returns focus.
- Space toggles playback outside inputs; Esc closes drawer/popover.

## Motion

Section rise on load (staggered 60 ms), sleeve swap 0.5 s, vinyl slide 0.8 s, spring press feedback, lyric line slide, chart grow. All removed under `prefers-reduced-motion`.
