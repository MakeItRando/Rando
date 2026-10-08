# Motion guide

Status: D-073 (owner 2026-10-07: "we can make design, animations and other fantastic stuff later" → agreed). The HTML study decides **structure, flow and behaviour**. Full motion, real artwork and fine polish happen in **one dedicated polish pass on the real apps** (desktop + mobile), so they are consistent instead of page-by-page. This file is the brief for that pass.

## Principles

1. **Motion explains, it doesn't decorate.** Every animation answers "where did this come from / where did it go / what changed".
2. **Fast by default.** Taps and hovers 120–180 ms; panels and sheets 220–320 ms; signature moments ≤ 700 ms. Nothing blocks input.
3. **One spring, one ease.** Ease `cubic-bezier(.2,.7,.2,1)` for movement and fades; a light spring `cubic-bezier(.3,1.4,.5,1)` only for small confirmations (like, add, stamp press). No bouncing panels.
4. **Playback is the clock.** Things tied to sound (eq bars, vinyl spin, lyric highlight, rings) move only while audio plays and stop exactly on pause.
5. **Reduced motion is a first-class mode.** With `prefers-reduced-motion` (and an in-app switch): no spins, flips, parallax or confetti — swap for instant state changes or short fades. Nothing important may exist only as motion.
6. **No reward loops.** No streak flames, slot-machine reveals or confetti on every action (D-019). Celebration is reserved for real milestones (finishing an artist, a genre seal).
7. **Phone haptics mirror motion** (H9): light tap on like/add, medium on stamp collected; never on scroll.

## Signature moments (design these first in the polish pass)

| Moment | Where | Intent | Study today |
| --- | --- | --- | --- |
| Stamp collected | end of an Artist Journey | the one real celebration: stamp presses in, ring completes, soft haptic | static stamp + toast |
| Stamp flip | stamp sheet | card turns to show its back | CSS flip |
| Genre seal | finishing a genre | seal closes over the passport page | static |
| Radio cards turning over | Radio page, Up next | face-down card flips as its song starts; peek flips one | simple rotateY |
| Vinyl / record | Radio hero, Now Playing | spins at a slow constant speed only while playing | CSS spin |
| Source switch | Stage, mini player | cover and title cross-fade; "Playing from" updates in place | instant |
| Now Playing open/close | mini player ↔ full screen | cover grows from the mini player (shared element) | slide |
| Dig card | Dig | Keep flies to the Dug stack, Skip slides away; Undo reverses the same path | basic slide |
| Journey map ring | Journeys, Artist page | ring fills as songs are heard | static conic ring |
| Keep going card | end of a source | rises from the player, never pulses | slide-up |
| Add / like / queue | everywhere | icon pops once (spring), toast slides with Undo | pop + toast |
| Lyrics | Now Playing | current line brightens and scrolls smoothly, never jumps | basic |

## Tokens for the build

- Durations: `instant 0`, `fast 140ms`, `base 220ms`, `slow 320ms`, `moment 600ms`.
- Easing: `ease-out (.2,.7,.2,1)`, `spring (.3,1.4,.5,1)` (small elements only), `linear` (spins, progress).
- Distances: elements travel ≤ 16 px on enter; sheets travel their own height.
- Stagger lists ≤ 30 ms per item, max 8 items, then the rest appear together.

## Not now

Parallax headers, colour-extracted animated backgrounds, 3D, sound effects, animated covers (Canvas-style loops) — revisit after real artwork and real users.
