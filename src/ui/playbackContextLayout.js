const playbackContextLayout = document.createElement('style');
playbackContextLayout.dataset.playbackContextLayout = '';
playbackContextLayout.textContent = `
@media (min-width: 1041px) {
  body.global-player-open:not([data-view="journeys"]) .workspace { grid-template-columns: 238px minmax(0, 1fr) 340px; }
  body.global-player-open:not([data-view="journeys"]) #viewSurface { grid-column: 2; grid-row: 1; min-width: 0; }
  body.global-player-open:not([data-view="journeys"]) .inspector { grid-column: 3; grid-row: 1; display: flex; }
}
`;
document.head.append(playbackContextLayout);
