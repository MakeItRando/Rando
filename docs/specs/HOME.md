# Spec: Home (draft from Home study E, 2026-10-05)

Status: proposal (D-056); rules D-055 confirmed. Design first; implementation approach chosen after approval.

## Sections (top → bottom)

1. **Stage** — the current or last session. Sleeve-coloured flat surface; sleeve + vinyl (slides out and spins only while playing; static under Reduced Motion); caption `Now playing|Paused · <source type> · <source name> · NN/NN`; title; artists + Follow; live lyric line or "Instrumental"; actions: Play/Pause, Like, Add to playlist, Share, source button; Up next (next 2 from the **same** source) or "End of <source>. Playback stops here."; progress line.
2. **Journey + This week** — Journey path (done ✓, current with progress ring, upcoming dimmed) and a local listening summary (minutes, 7-day bars, top artist, new artists found). No streaks or guilt mechanics.
3. **On repeat** — most-replayed songs with ×count (Rondo tagline: find your next repeat).
4. **Moods** — 6 colour tiles with sleeve stack; each is a finite source.
5. **New from artists you follow** — release type + relative date; new = accent (D-046).

Filter: All / Music (stage, On repeat, Moods) / Journeys (stage, Journey) / Following (stage, releases).

## State rules (binding)

- One active **source** (playlist, Journey, release, mix, mood). Every play surface shows it; Up next and queue only contain that source's items.
- Clicking the control of the source that is already active **toggles pause**; it never restarts.
- Journey CTA: not in Journey → `Open Journey` + `Start/Resume <artist>`; in Journey playing → `Open Journey` + `Pause`; in Journey paused → `Open Journey` + `Resume`.
- Current-artist node: ring = songs heard / artist's songs; overlay equaliser only while the Journey is playing.
- Natural end of a source stops playback (no silent expansion — B-002). Next on last item = stop.
- Add to playlist: popover; success toast with Undo; duplicate → "Already in X · Add anyway".
- ⌘K / Ctrl+K search palette: artists → playlists/releases → songs (max 4 songs), arrows + Enter, Esc closes and returns focus.
- Space toggles playback outside inputs; Esc closes drawer/popover.

## Motion

Section rise on load (staggered 60 ms), sleeve swap 0.5 s, vinyl slide 0.8 s, spring press feedback, lyric line slide, chart grow. All removed under `prefers-reduced-motion`.
