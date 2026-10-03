# Rondo design lab

This folder contains an isolated, interactive exploration of the “Living Record”
direction. It does not modify the production candidate.

## Run

Open `index.html`, or serve this directory with any static server.

## Inspect

Use the scene selector to review:

1. first-minute onboarding;
2. Discover;
3. a Journey;
4. an artist page;
5. the Song Room.

The lower sections specify the visual system and desktop composition.

## QA

`qa.mjs` verifies horizontal layout, scene switching, follow/save interactions,
console errors, and captures all major states. It imports Playwright from the
existing Rondo development checkout and is a local design-review utility, not
production code.

## Status

Exploratory. Preserve separately until the owner accepts or rejects the
direction. Read `DESIGN_SPEC.md` before translating any part into product code.