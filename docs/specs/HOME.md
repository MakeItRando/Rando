# Spec: Home (draft from Home study E, 2026-10-05)

Status: complete, revision 3 (D-058; rev 2 = D-057, rev 1 = D-056). Next: Now Playing page and Journey page reuse these rules.; rules D-055 confirmed. Design first; implementation approach chosen after approval.

## Sections (top → bottom)

1. **Stage** — the current or last session. Sleeve-coloured flat surface; sleeve + vinyl (slides out and spins only while playing; static under Reduced Motion); caption `Now playing|Paused · <source type> · <source name> · NN/NN`; title; artists + Follow; live lyric line or "Instrumental"; actions: Play/Pause, Like, Add to playlist, ⋯ song menu (Share lives here), source button; Up next (user queue first, then the **same** source) or "End of <source>. Playback stops here."; progress line.
2. **Journey + This week** — Journey path (done ✓, current with progress ring, upcoming dimmed) and a local listening summary (minutes, 7-day bars, top artist, new artists found). No streaks or guilt mechanics.
3. **On repeat** — most-replayed songs with ×count (Rondo tagline: find your next repeat).
4. **Moods** — 6 colour tiles with sleeve stack; each is a finite source.
5. **New from artists you follow** — release type + relative date; new = accent (D-046).

Filter: All / For you (stage, On repeat, Moods) / Journeys (stage, Journey, **Your Journeys** genre cards with live CTA + progress, **Artists you finished** with Replay) / Following (stage, **Artists you follow** with NEW badge, releases). No filter view may be empty.

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

≤1240 px: stage Up next hides, shelves show 5. ≤1020 px: sidebar collapses to icons, This week becomes a row, Now Playing shows lyrics only.

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
