const PROTOTYPE_KEY = "rondo-prototype-v2";
const ROUTE_KEY = "rondo-route-state-v1";
const CONTEXT_KEY = "rondo-playback-context-v1";
const GENRE_LABELS = new Map([
  ["hiphop", "Hip-Hop"],
  ["rnb", "R&B"],
  ["electronic", "Electronic"],
  ["jazz", "Jazz"],
]);

function readObject(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

function hasRealListeningHistory() {
  const prototype = readObject(PROTOTYPE_KEY);
  const route = readObject(ROUTE_KEY);
  const context = readObject(CONTEXT_KEY);
  const hasPlayedTrack = Array.isArray(prototype.playedTracks) && prototype.playedTracks.length > 0;
  const hasJourneyTrack = Object.values(route.progressByGenre || {}).some(
    (progress) => progress && typeof progress.trackId === "string" && progress.trackId,
  );
  const globalTrack = context.globalSession?.currentTrackId || context.currentTrackId;
  return hasPlayedTrack || hasJourneyTrack || (typeof globalTrack === "string" && globalTrack);
}

let playbackIdle = !hasRealListeningHistory();
let pendingGenreId = null;
let pickerWasOpen = false;
let syncQueued = false;

const policyStyles = document.createElement("style");
policyStyles.dataset.freshStartPolicy = "";
policyStyles.textContent = `
body.playback-idle .transport { display: none !important; }
body.playback-idle .stage { grid-template-rows: 64px minmax(0, 1fr); }
@media (max-width: 760px) {
  body.playback-idle .stage { grid-template-rows: 58px minmax(0, 1fr) 58px; }
}
`;
document.head.append(policyStyles);

function syncIdleSurface() {
  document.body.classList.toggle("playback-idle", playbackIdle);
  const transport = document.querySelector(".transport");
  if (!transport) return;
  transport.inert = playbackIdle;
  transport.setAttribute("aria-hidden", String(playbackIdle));
  if (playbackIdle && document.body.dataset.playbackContext !== "idle") {
    document.body.dataset.playbackContext = "idle";
  }
}

function routeHasJourney() {
  return GENRE_LABELS.has(readObject(ROUTE_KEY).activeGenreId);
}

function syncFirstJourneyPicker() {
  const picker = document.getElementById("journeyGenrePicker");
  const open = Boolean(picker && !picker.hidden);
  if (!open) {
    if (pickerWasOpen) pendingGenreId = null;
    pickerWasOpen = false;
    return;
  }
  pickerWasOpen = true;
  if (routeHasJourney()) return;

  const choices = [...picker.querySelectorAll("[data-picker-genre]")];
  const selected = GENRE_LABELS.has(pendingGenreId) ? pendingGenreId : null;
  choices.forEach((choice) => {
    const active = choice.dataset.pickerGenre === selected;
    choice.classList.toggle("active", active);
    choice.setAttribute("aria-checked", String(active));
  });

  const confirm = picker.querySelector("[data-confirm-journey]");
  if (!confirm) return;
  confirm.disabled = !selected;
  confirm.setAttribute("aria-disabled", String(!selected));
  const label = selected
    ? `Open ${GENRE_LABELS.get(selected)} <span>→</span>`
    : "Choose a genre to continue";
  if (confirm.innerHTML !== label) confirm.innerHTML = label;
}

function syncPolicy() {
  syncIdleSurface();
  syncFirstJourneyPicker();
}

function scheduleSync() {
  if (syncQueued) return;
  syncQueued = true;
  requestAnimationFrame(() => {
    syncQueued = false;
    syncPolicy();
  });
}

window.addEventListener(
  "click",
  (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const genre = target.closest("[data-picker-genre]");
    if (genre && !routeHasJourney()) {
      pendingGenreId = genre.dataset.pickerGenre || null;
      scheduleSync();
    }

    const startsPlayback = target.closest(
      "[data-play-entry], .track-play, [data-play-track], #playArtist, [data-play-release], [data-play-release-inline], [data-open-track], [data-release-track], [data-result-type='track']",
    );
    if (startsPlayback && event.isTrusted) {
      playbackIdle = false;
      syncIdleSurface();
    }
  },
  true,
);

new MutationObserver(() => {
  syncFirstJourneyPicker();
  scheduleSync();
}).observe(document.body, {
  attributes: true,
  childList: true,
  subtree: true,
  attributeFilter: ["class", "hidden", "data-view", "data-playback-context"],
});
window.addEventListener("hashchange", scheduleSync);
window.addEventListener("storage", scheduleSync);
syncPolicy();
