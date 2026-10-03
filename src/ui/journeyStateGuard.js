const JOURNEY_ROUTE_KEY = "rondo-route-state-v1";
const PLAYBACK_CONTEXT_KEY = "rondo-playback-context-v1";

function readStoredObject(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}

function cloneProgress(value) {
  return value && typeof value === "object"
    ? JSON.parse(JSON.stringify(value))
    : {};
}

function snapshotJourneyRoute() {
  const route = readStoredObject(JOURNEY_ROUTE_KEY);
  if (typeof route.activeGenreId !== "string") return null;
  return {
    activeGenreId: route.activeGenreId,
    progressByGenre: cloneProgress(route.progressByGenre),
    lastJourneyRoute: String(route.lastRoute || "").startsWith("#/journeys")
      ? route.lastRoute
      : null,
  };
}

function contextJourneySnapshot() {
  const context = readStoredObject(PLAYBACK_CONTEXT_KEY);
  const snapshot = context.journeySession;
  if (!snapshot || typeof snapshot !== "object") return null;
  return {
    activeGenreId: typeof snapshot.activeGenreId === "string"
      ? snapshot.activeGenreId
      : null,
    progressByGenre: cloneProgress(snapshot.progressByGenre),
    lastJourneyRoute: typeof snapshot.lastJourneyRoute === "string"
      ? snapshot.lastJourneyRoute
      : null,
  };
}

let guardedJourney = contextJourneySnapshot();
let syncQueued = false;

function persistGuardedJourney() {
  if (!guardedJourney) return;
  const context = readStoredObject(PLAYBACK_CONTEXT_KEY);
  if (!["journey", "global"].includes(context.activePlaybackContext || context.type)) return;
  const current = context.journeySession || {};
  const unchanged =
    current.activeGenreId === guardedJourney.activeGenreId &&
    current.lastJourneyRoute === guardedJourney.lastJourneyRoute &&
    JSON.stringify(current.progressByGenre || {}) ===
      JSON.stringify(guardedJourney.progressByGenre || {});
  if (unchanged) return;
  context.journeySession = cloneProgress(guardedJourney);
  localStorage.setItem(PLAYBACK_CONTEXT_KEY, JSON.stringify(context));
}

function rememberJourney() {
  const snapshot = snapshotJourneyRoute();
  if (!snapshot) return;
  guardedJourney = snapshot;
  persistGuardedJourney();
}

function restoreJourney() {
  if (!guardedJourney) guardedJourney = contextJourneySnapshot();
  if (!guardedJourney) return;
  const route = readStoredObject(JOURNEY_ROUTE_KEY);
  const next = {
    ...route,
    activeGenreId: guardedJourney.activeGenreId || route.activeGenreId || null,
    progressByGenre: cloneProgress(guardedJourney.progressByGenre),
  };
  if (guardedJourney.lastJourneyRoute) {
    next.lastRoute = guardedJourney.lastJourneyRoute;
  }
  const unchanged =
    route.activeGenreId === next.activeGenreId &&
    route.lastRoute === next.lastRoute &&
    JSON.stringify(route.progressByGenre || {}) ===
      JSON.stringify(next.progressByGenre || {});
  if (!unchanged) localStorage.setItem(JOURNEY_ROUTE_KEY, JSON.stringify(next));
}

function syncJourneyGuard() {
  const context = readStoredObject(PLAYBACK_CONTEXT_KEY);
  const type = context.activePlaybackContext || context.type;
  if (document.body.dataset.view === "journeys" && type !== "global") {
    rememberJourney();
    return;
  }
  if (type === "global") {
    persistGuardedJourney();
    if (document.body.dataset.view === "journeys") restoreJourney();
  }
}

function scheduleJourneyGuard() {
  if (syncQueued) return;
  syncQueued = true;
  requestAnimationFrame(() => {
    syncQueued = false;
    syncJourneyGuard();
  });
}

window.addEventListener(
  "click",
  (event) => {
    if (!event.isTrusted || !(event.target instanceof Element)) return;
    const navigation = event.target.closest(
      ".rail-button[data-view], .mobile-nav-button[data-mobile-view]",
    );
    const destination = navigation?.dataset.view || navigation?.dataset.mobileView;
    if (
      navigation &&
      document.body.dataset.view === "journeys" &&
      destination !== "journeys"
    ) {
      rememberJourney();
    }
    if (destination === "journeys") {
      restoreJourney();
      queueMicrotask(restoreJourney);
    }
    queueMicrotask(scheduleJourneyGuard);
  },
  true,
);

new MutationObserver(scheduleJourneyGuard).observe(document.body, {
  attributes: true,
  childList: true,
  subtree: true,
  attributeFilter: ["class", "hidden", "data-view", "data-playback-context"],
});
window.addEventListener("hashchange", scheduleJourneyGuard);
scheduleJourneyGuard();
