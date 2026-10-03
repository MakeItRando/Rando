const CONTEXT_KEY = "rondo-playback-context-v1";
const ROUTE_KEY = "rondo-route-state-v1";
const MAX_QUEUE_ITEMS = 20;

let context = readContext();
let globalTransition = null;
let syncQueued = false;
let queueWriteInProgress = false;

function parseJson(value, fallback) {
  try {
    const parsed = JSON.parse(value || "null");
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function readContext() {
  const saved = parseJson(localStorage.getItem(CONTEXT_KEY), null);
  const type = saved?.activePlaybackContext || saved?.type;
  if (!saved || !["journey", "global"].includes(type)) {
    return { type: "journey", sourceLabel: "Journey", queue: [], currentTrackId: null, journeySnapshot: null };
  }
  const globalSession = saved.globalSession && typeof saved.globalSession === "object" ? saved.globalSession : saved;
  const rawQueue = Array.isArray(globalSession.queueTrackIds) ? globalSession.queueTrackIds : globalSession.queue;
  return {
    type,
    sourceLabel: typeof globalSession.sourceLabel === "string" ? globalSession.sourceLabel : type === "journey" ? "Journey" : "Discover",
    queue: Array.isArray(rawQueue)
      ? rawQueue.slice(0, MAX_QUEUE_ITEMS).map((item) => typeof item === "string" ? { id: item } : item).filter((item) => item && typeof item.id === "string")
      : [],
    currentTrackId: typeof globalSession.currentTrackId === "string" ? globalSession.currentTrackId : null,
    journeySnapshot: saved.journeySession && typeof saved.journeySession === "object"
      ? saved.journeySession
      : saved.journeySnapshot && typeof saved.journeySnapshot === "object" ? saved.journeySnapshot : null,
  };
}

function persistContext() {
  try {
    const journey = context.journeySnapshot || routeSnapshot();
    localStorage.setItem(CONTEXT_KEY, JSON.stringify({
      version: 1,
      activePlaybackContext: context.type,
      journeySession: {
        activeGenreId: journey.activeGenreId || null,
        progressByGenre: journey.progressByGenre || {},
        lastJourneyRoute: journey.lastJourneyRoute || null,
      },
      globalSession: {
        sourceLabel: context.sourceLabel || "Discover",
        currentTrackId: context.type === "global" ? context.currentTrackId : null,
        queueTrackIds: context.queue.map((item) => item.id).slice(0, MAX_QUEUE_ITEMS),
      },
    }));
  } catch {
    // Playback remains usable when storage is unavailable.
  }
}

function text(root, selectors) {
  for (const selector of selectors) {
    const value = root?.querySelector(selector)?.textContent?.trim();
    if (value) return value;
  }
  return "";
}

function trackIdFor(node) {
  if (!node) return "";
  if (node.dataset.playEntry) return node.dataset.playEntry;
  if (node.dataset.openTrack) return node.dataset.openTrack;
  if (node.dataset.resultType === "track") return node.dataset.resultId || "";
  return "";
}

function itemFor(node) {
  const id = trackIdFor(node);
  if (!id) return null;
  const title = text(node, [".music-card-copy strong", ".genre-song-name strong", ".track-name strong", "strong"]) || id;
  const artist = text(node, [".music-card-copy > span", ".genre-song-name small", ".track-name small", "small"])
    .split(" · ")[0]
    .trim();
  const image = node.querySelector("img")?.getAttribute("src") || "";
  const duration = node.querySelector("time")?.textContent?.trim() || node.querySelector(".track-duration")?.textContent?.trim() || "";
  return { id, title, artist, image, duration };
}

function uniqueItems(nodes) {
  const seen = new Set();
  return nodes
    .map(itemFor)
    .filter((item) => item && !seen.has(item.id) && seen.add(item.id))
    .slice(0, MAX_QUEUE_ITEMS);
}

function sourceContainer(trigger) {
  return trigger.closest("[data-music-results], [data-sound-results], .music-section, .saved-list, .release-page, #searchResults") ||
    document.querySelector('main[data-rondo-page="discover"]') ||
    document.body;
}

function sourceLabelFor(container) {
  if (!container) return "Discover";
  if (container.matches("[data-music-results]")) return "Discover search";
  if (container.matches("[data-sound-results]")) return text(container, ["h3"]) || "Sound";
  if (container.matches("#searchResults")) return "Search";
  if (container.matches(".saved-list")) return "Library";
  return text(container, ["h1", "h2", "h3"]) || "Discover";
}

function queueFor(trigger) {
  const container = sourceContainer(trigger);
  let items = uniqueItems([...container.querySelectorAll("[data-play-entry], [data-open-track], [data-result-type='track']")]);
  if (items.length < 2) {
    items = uniqueItems([
      ...document.querySelectorAll("main[data-rondo-page='discover'] [data-play-entry]"),
      ...document.querySelectorAll("[data-open-track]"),
    ]);
  }
  const selected = itemFor(trigger);
  if (selected && !items.some((item) => item.id === selected.id)) items.unshift(selected);
  return { items: items.slice(0, MAX_QUEUE_ITEMS), sourceLabel: sourceLabelFor(container) };
}

function routeSnapshot() {
  const route = parseJson(localStorage.getItem(ROUTE_KEY), {});
  return {
    activeGenreId: typeof route.activeGenreId === "string" ? route.activeGenreId : null,
    progressByGenre: route.progressByGenre && typeof route.progressByGenre === "object"
      ? JSON.parse(JSON.stringify(route.progressByGenre))
      : {},
    lastJourneyRoute: String(route.lastRoute || "").startsWith("#/journeys") ? route.lastRoute : null,
  };
}

function setGlobalContext(trigger, trackId, providedQueue = null, sourceLabel = null) {
  const derived = providedQueue ? { items: providedQueue, sourceLabel: sourceLabel || "Discover" } : queueFor(trigger);
  context = {
    type: "global",
    sourceLabel: derived.sourceLabel,
    queue: derived.items,
    currentTrackId: trackId,
    journeySnapshot: context.type === "journey" ? routeSnapshot() : context.journeySnapshot || routeSnapshot(),
  };
  globalTransition = { trackId, startedAt: Date.now(), sawBridgeView: false };
  persistContext();
  scheduleSync();
  settleGlobalTransition();
}

function setJourneyContext(trackId = null) {
  context = {
    ...context,
    type: "journey",
    sourceLabel: "Journey",
    currentTrackId: trackId || context.currentTrackId,
  };
  globalTransition = null;
  persistContext();
  scheduleSync();
}

function settleGlobalTransition() {
  const startedAt = globalTransition?.startedAt;
  if (!startedAt) return;
  const poll = () => {
    if (!globalTransition || globalTransition.startedAt !== startedAt) return;
    if (document.body.dataset.view === "journeys") globalTransition.sawBridgeView = true;
    const returned = globalTransition.sawBridgeView && document.body.dataset.view === "discover" && location.hash === "#/discover";
    const elapsed = Date.now() - startedAt;
    if (returned || elapsed > 2600) {
      globalTransition = null;
      scheduleSync();
      return;
    }
    setTimeout(poll, 40);
  };
  setTimeout(poll, 40);
}

function playGlobalTrack(trackId) {
  if (!trackId) return;
  const existing = context.queue.find((item) => item.id === trackId);
  const queue = context.queue.length ? context.queue : existing ? [existing] : [];
  setGlobalContext(document.body, trackId, queue, context.sourceLabel || "Discover");
  const bridge = document.createElement("button");
  bridge.type = "button";
  bridge.hidden = true;
  bridge.dataset.playEntry = trackId;
  bridge.dataset.contextBridge = "global";
  document.body.append(bridge);
  bridge.click();
  queueMicrotask(() => bridge.remove());
}

function moveGlobalQueue(direction) {
  if (!context.queue.length) return;
  let index = context.queue.findIndex((item) => item.id === context.currentTrackId);
  if (index < 0) index = 0;
  const next = (index + direction + context.queue.length) % context.queue.length;
  playGlobalTrack(context.queue[next].id);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function renderGlobalQueue() {
  if (queueWriteInProgress || context.type !== "global") return;
  const drawer = document.getElementById("queueDrawer");
  const list = document.getElementById("queueList");
  if (!drawer || drawer.hidden || !list || !context.queue.length) return;
  const signature = `${context.sourceLabel}|${context.currentTrackId}|${context.queue.map((item) => item.id).join(",")}`;
  if (list.dataset.globalQueueSignature === signature) return;
  queueWriteInProgress = true;
  const index = Math.max(0, context.queue.findIndex((item) => item.id === context.currentTrackId));
  const title = document.getElementById("queueTitle");
  const artist = document.getElementById("queueArtist");
  const genre = document.getElementById("queueGenre");
  const progress = document.getElementById("queueProgress");
  const current = document.getElementById("queueCurrent");
  if (title) title.textContent = "Discover queue";
  if (artist) artist.textContent = context.sourceLabel;
  if (genre) genre.textContent = "GLOBAL LISTENING";
  if (progress) progress.style.width = `${((index + 1) / context.queue.length) * 100}%`;
  if (current) current.textContent = `${index + 1} / ${context.queue.length}`;
  list.innerHTML = context.queue.map((item, itemIndex) => `
    <button class="queue-item ${item.id === context.currentTrackId ? "active" : ""}" type="button" data-global-queue-track="${escapeHtml(item.id)}">
      <span>${String(itemIndex + 1).padStart(2, "0")}</span>
      ${item.image ? `<img src="${escapeHtml(item.image)}" alt=""/>` : "<span aria-hidden=\"true\">R</span>"}
      <span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.artist || context.sourceLabel)}</small></span>
      <b>${escapeHtml(item.duration || (item.id === context.currentTrackId ? "PLAYING" : ""))}</b>
    </button>`).join("");
  list.dataset.globalQueueSignature = signature;
  queueWriteInProgress = false;
}

function ensureContextBanner() {
  const inspector = document.querySelector(".inspector");
  if (!inspector) return;
  let banner = inspector.querySelector("[data-playback-context-banner]");
  if (!banner) {
    banner = document.createElement("div");
    banner.dataset.playbackContextBanner = "";
    banner.className = "playback-context-banner";
    inspector.querySelector(".inspector-top")?.after(banner);
  }
  banner.innerHTML = `<span>Discover playback</span><b>${escapeHtml(context.sourceLabel || "Global queue")}</b>`;
  banner.hidden = context.type !== "global";
}

function syncSurface() {
  const globalActive = context.type === "global" && Boolean(context.currentTrackId);
  const nonJourneyView = document.body.dataset.view !== "journeys" && document.body.dataset.journeyPage !== "genre";
  document.body.dataset.playbackContext = context.type;
  document.body.classList.toggle("global-player-open", globalActive && nonJourneyView);
  const inspector = document.querySelector(".inspector");
  if (inspector && globalActive && nonJourneyView && inspector.hidden) inspector.hidden = false;
  ensureContextBanner();
  renderGlobalQueue();
}

function scheduleSync() {
  if (syncQueued) return;
  syncQueued = true;
  requestAnimationFrame(() => {
    syncQueued = false;
    syncSurface();
  });
}

const styles = document.createElement("style");
styles.dataset.playbackContexts = "";
styles.textContent = `
.playback-context-banner { margin: 10px 0 2px; padding: 9px 10px; display: flex; align-items: center; justify-content: space-between; gap: 10px; border: 1px solid rgba(var(--genre-rgb), .34); background: rgba(var(--genre-rgb), .08); }
.playback-context-banner span { color: var(--genre-accent); font-size: 8px; font-weight: 900; letter-spacing: .13em; text-transform: uppercase; }
.playback-context-banner b { min-width: 0; overflow: hidden; color: var(--night-muted); font-size: 8px; text-overflow: ellipsis; white-space: nowrap; }
@media (min-width: 1041px) {
  body.global-player-open:not([data-view="journeys"]) .workspace { grid-template-columns: minmax(0, 1fr) 340px; }
  body.global-player-open:not([data-view="journeys"]) #viewSurface { grid-column: 1; min-width: 0; }
  body.global-player-open:not([data-view="journeys"]) .inspector { grid-column: 2; display: flex; }
}
@media (max-width: 1040px) { .playback-context-banner { display: none; } }
`;
document.head.append(styles);

window.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  if (context.type === "global" && !event.isTrusted && target.closest("#mobileTrack")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    scheduleSync();
    return;
  }

  if (globalTransition && !event.isTrusted) {
    const internalArtist = target.closest(".artist-list-item[data-artist]");
    if (internalArtist) {
      internalArtist.classList.remove("artist-list-item");
      setTimeout(() => internalArtist.classList.add("artist-list-item"), 0);
    }
  }

  const queued = target.closest("[data-global-queue-track]");
  if (queued) {
    event.preventDefault();
    event.stopImmediatePropagation();
    document.getElementById("closeQueue")?.click();
    playGlobalTrack(queued.dataset.globalQueueTrack);
    return;
  }

  const directionControl = target.closest("#previousTrack, #fullPrevious, #nextTrack, #fullNext");
  if (directionControl && context.type === "global") {
    event.preventDefault();
    event.stopImmediatePropagation();
    moveGlobalQueue(directionControl.matches("#previousTrack, #fullPrevious") ? -1 : 1);
    return;
  }

  const entry = target.closest("[data-play-entry]");
  if (entry) {
    const id = entry.dataset.playEntry;
    const journeyOrigin = document.body.dataset.view === "journeys" || Boolean(entry.closest("#journeyGenrePage, #journey"));
    if (journeyOrigin && !entry.dataset.contextBridge) setJourneyContext(id);
    else if (!entry.dataset.contextBridge) setGlobalContext(entry, id);
    return;
  }

  const libraryTrack = target.closest("[data-open-track]");
  if (libraryTrack) {
    const derived = queueFor(libraryTrack);
    context = { type: "global", sourceLabel: derived.sourceLabel, queue: derived.items, currentTrackId: libraryTrack.dataset.openTrack, journeySnapshot: context.journeySnapshot || routeSnapshot() };
    persistContext();
    scheduleSync();
    return;
  }

  const searchTrack = target.closest('[data-result-type="track"]');
  if (searchTrack) {
    const derived = queueFor(searchTrack);
    context = { type: "global", sourceLabel: "Search", queue: derived.items, currentTrackId: searchTrack.dataset.resultId, journeySnapshot: context.journeySnapshot || routeSnapshot() };
    persistContext();
    scheduleSync();
    return;
  }

  if (event.isTrusted && document.body.dataset.view === "journeys" && target.closest(".track-play, [data-resume-journey], [data-start-journey-artist]")) {
    setJourneyContext(target.closest("[data-track]")?.dataset.track || null);
  }
}, true);

new MutationObserver(scheduleSync).observe(document.body, {
  attributes: true,
  childList: true,
  subtree: true,
  attributeFilter: ["class", "hidden", "data-view", "data-journey-page"],
});
window.addEventListener("hashchange", scheduleSync);
window.addEventListener("storage", (event) => {
  if (event.key === CONTEXT_KEY) {
    context = readContext();
    scheduleSync();
  }
});
scheduleSync();
