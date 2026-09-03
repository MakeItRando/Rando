# Rondo product design concept

## Purpose

This high-fidelity prototype establishes the visual language and information hierarchy for Rondo before catalog authentication and production architecture are introduced.

## Primary screen

The first concept focuses on genre discovery:

- main genre selector;
- an editorial genre introduction;
- filterable subgenre spectrum;
- one-track-per-artist discovery queue;
- persistent transport controls;
- a detailed now-playing inspector with separate featured-artist and credit fields.

## Data contract shown by the UI

`Genre → sourced style tags → primary artist → featured artists → release → track → credits`

A streaming API alone may not provide a universally “exact” track subgenre. Production should combine provider metadata with a documented enrichment source and display provenance rather than inventing certainty.

## Prototype status

The catalog, artists, releases, and credits in this prototype are fictional design data. The cover artwork is bundled locally, so the design does not depend on remote images.

## Responsive behavior

- **Desktop:** navigation rail, editorial discovery canvas, detailed inspector, persistent transport.
- **Mobile:** compact header, vertically stacked discovery flow, horizontally scrollable filters, simplified rows, persistent mini-player.

## Production next steps

1. Confirm the visual direction.
2. Choose the licensed catalog/playback provider.
3. Replace sample data with typed adapters and server-side authentication.
4. Add route-level views for search, artist, release, library, and full player.
5. Add automated accessibility, visual-regression, and interaction tests.
