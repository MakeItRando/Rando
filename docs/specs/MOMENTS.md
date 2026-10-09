# Spec: Moments

Status: proposal D-082 (2026-10-07), Home E rev 15. Desktop + phone. Idea I1 (D-081).

## Job
Keep the best part of a song — the drop, the line, the chorus — and get back to it in one tap.

## How it works
- **✦ in the player** (bottom bar next to the song; "Save moment" in Now Playing; key **M**).
- A moment is **30 seconds: 10 s before your tap, 20 s after.** Why: people tap a beat *after* the good part starts, so a short lead-in catches it; 20 s after is long enough for a chorus or a drop to land, short enough to stay "the best part". Clamped to the song (near the start or end it shifts to stay 30 s; songs under 30 s = whole song).
- Tapping again within ~12 s of a saved moment says "Already saved" instead of duplicating. Toast with **Undo**.
- **Seen where:** orange ranges on the seek bar (bottom bar + Now Playing) for the playing song; ✦ turns orange when the song has moments; **Your moments** row on Home (newest first, play, share); Now Playing → About → "Your moments in this song" (tap a range to jump there).
- **Play all** plays only the moments, back to back, then stops honestly ("That's all your moments", D-055).
- **Share** a moment → link that starts the song at the moment (V1 backend; prototype shows the toast).

## Scope / data
Moment = { songId, start, end, createdAt }. V1 local; sync + share links V1 backend. Prototype seeds two study moments so the row is visible.

## Not
No public "most-saved moment" counts as status (teen audience). No AI picking moments (D-050).

## Acceptance tests
✦ saves 10 s before / 20 s after; no duplicate at the same spot; M key; Undo; Play all starts at the first moment and jumps to the next one when a moment ends.
