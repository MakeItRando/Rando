import { artists, genres } from "../data/catalog.js";

const STATE_KEY = "rondo-prototype-v2";
const genreNames = new Map(genres.map((genre) => [genre.id, genre.short]));
const catalog = artists.flatMap((artist) =>
  artist.releases.flatMap((release) =>
    release.tracks.map((track) => ({ artist, release, track })),
  ),
);
const byTrackId = new Map(catalog.map((entry) => [entry.track.id, entry]));

let pickerOrigin = null;
let pickerReturnFocus = null;
let pickerWasOpen = false;
let syncScheduled = false;

function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function readState() {
  try {
    const value = JSON.parse(localStorage.getItem(STATE_KEY) || "null");
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function recommendationEntries(playedTrackIds) {
  const recent = playedTrackIds
    .slice(-12)
    .map((id) => byTrackId.get(id))
    .filter(Boolean);
  const heard = new Set(playedTrackIds);
  const genreWeight = new Map();
  const artistWeight = new Map();

  recent.forEach((entry, index) => {
    const weight = index + 1;
    entry.track.genres.forEach((genreId) =>
      genreWeight.set(genreId, (genreWeight.get(genreId) || 0) + weight),
    );
    artistWeight.set(
      entry.artist.id,
      (artistWeight.get(entry.artist.id) || 0) + weight,
    );
  });

  return catalog
    .filter((entry) => !heard.has(entry.track.id))
    .map((entry, index) => ({
      entry,
      index,
      score:
        entry.track.genres.reduce(
          (total, genreId) => total + (genreWeight.get(genreId) || 0),
          0,
        ) * 10 +
        (artistWeight.get(entry.artist.id) || 0) * 2,
    }))
    .sort(
      (left, right) =>
        right.score - left.score ||
        String(right.entry.release.date || right.entry.release.year).localeCompare(
          String(left.entry.release.date || left.entry.release.year),
        ) ||
        left.index - right.index,
    )
    .slice(0, 8)
    .map(({ entry }) => entry);
}

function recommendationCard(entry, index) {
  return `<button class="music-card" type="button" data-play-entry="${escapeHtml(entry.track.id)}" aria-label="Play ${escapeHtml(entry.track.title)} by ${escapeHtml(entry.artist.name)}" style="--card-order:${index}"><span class="music-card-art"><img src="${escapeHtml(entry.release.cover)}" alt="" loading="lazy" decoding="async"/><i aria-hidden="true">▶</i></span><span class="music-card-copy"><strong>${escapeHtml(entry.track.title)}</strong><span>${escapeHtml(entry.artist.name)}</span><small>${escapeHtml(entry.track.style)}</small></span></button>`;
}

function syncRecommendations() {
  const section = document.querySelector(".music-personal");
  if (!section) return;

  const rawPlayedTrackIds = readState().playedTracks;
  const playedTrackIds = [
    ...new Set(Array.isArray(rawPlayedTrackIds) ? rawPlayedTrackIds : []),
  ].filter((id) => byTrackId.has(id));
  const recommendations = playedTrackIds.length
    ? recommendationEntries(playedTrackIds)
    : [];
  const hasRecommendations = recommendations.length > 0;
  section.hidden = !hasRecommendations;
  section.setAttribute("aria-hidden", String(!hasRecommendations));
  if (!hasRecommendations) {
    section.removeAttribute("data-recommendation-signature");
    return;
  }

  const signature = `${playedTrackIds.join(",")}|${recommendations
    .map((entry) => entry.track.id)
    .join(",")}`;
  if (section.dataset.recommendationSignature === signature) return;

  const eyebrow = section.querySelector("header span");
  const heading = section.querySelector("header h2");
  const grid = section.querySelector(".music-card-grid");
  if (eyebrow) eyebrow.textContent = "From your recent plays";
  if (heading) heading.textContent = "Made for you";
  if (grid) grid.innerHTML = recommendations.map(recommendationCard).join("");
  section.dataset.recommendationSignature = signature;
}

function pickerBackLabel(origin) {
  const parts = origin.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] !== "journeys" || !parts[1]) return "Back to Discover";
  if (parts[2] === "artist") {
    const artistName = document.getElementById("artistName")?.textContent?.trim();
    if (artistName) return `Back to ${artistName}`;
  }
  return `Back to ${genreNames.get(parts[1]) || "Journey"} Journey`;
}

function syncPicker() {
  const picker = document.getElementById("journeyGenrePicker");
  const isOpen = Boolean(picker && !picker.hidden);
  const wasOpen = pickerWasOpen;
  if (!isOpen) {
    if (wasOpen) {
      pickerOrigin = null;
      pickerReturnFocus = null;
    }
    pickerWasOpen = false;
    return;
  }
  if (!wasOpen) pickerOrigin = location.hash || "#/discover";
  pickerWasOpen = true;

  const cancel = picker.querySelector("[data-cancel-journey-picker]");
  const close = picker.querySelector("[data-close-journey-picker]");
  const label = pickerBackLabel(pickerOrigin || "#/discover");
  if (cancel && cancel.textContent !== label) cancel.textContent = label;
  if (close) close.setAttribute("aria-label", label);
}

function closePickerWithContext() {
  const picker = document.getElementById("journeyGenrePicker");
  if (!picker || picker.hidden) return;

  const origin = pickerOrigin || location.hash || "#/discover";
  const returnFocus = pickerReturnFocus;
  picker.hidden = true;
  document.getElementById("appShell")?.removeAttribute("inert");
  document.body.classList.remove("modal-open", "journey-picker-open");
  pickerWasOpen = false;
  pickerOrigin = null;
  pickerReturnFocus = null;

  if (/^#\/journeys\/[^/]+(?:\/artist\/[^/]+)?$/.test(origin)) {
    if (location.hash !== origin) location.hash = origin;
    requestAnimationFrame(() => {
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    });
    return;
  }

  if (location.hash !== "#/discover") location.hash = "#/discover";
  else {
    document
      .querySelector('[data-mobile-view="discover"], .rail-button[data-view="discover"]')
      ?.focus({ preventScroll: true });
  }
}

function syncProductPolicy() {
  syncRecommendations();
  syncPicker();
}

function scheduleSync() {
  if (syncScheduled) return;
  syncScheduled = true;
  requestAnimationFrame(() => {
    syncScheduled = false;
    syncProductPolicy();
  });
}

const qualityStyles = document.createElement("style");
qualityStyles.dataset.rondoProductPolicy = "";
qualityStyles.textContent = `
.discover-sounds { scroll-margin-block-start: 16px; }
.journey-genre-copy > button { margin-right: 12px; }
html[data-theme="dark"] .journey-directory-switch > span {
  color: rgba(247, 244, 237, .52);
}
html[data-theme="dark"] .journey-directory-switch button {
  color: #f4f5f7;
  border-color: rgba(255, 255, 255, .13);
}
@media (max-width: 760px) {
  .top-actions { min-width: max-content; }
  .top-actions > #themeToggle,
  .top-actions > #searchTrigger,
  .top-actions > #profileTrigger {
    width: 44px;
    min-width: 44px;
    height: 44px;
    min-height: 44px;
    flex: 0 0 44px;
  }
  body[data-journey-page="genre"] #mobileDirectoryButton { display: none !important; }
  body[data-journey-page="genre"] .topbar {
    grid-template-columns: minmax(0, 1fr) auto;
  }
  body[data-journey-page="genre"] .wordmark { grid-column: 1; }
  body[data-journey-page="genre"] .top-actions { grid-column: 2; }
  #directory.open .alphabet {
    display: grid;
    grid-template-columns: repeat(auto-fit, 44px);
    gap: 4px;
  }
  #directory.open .alphabet button:disabled { display: none; }
  #directory.open .alphabet button:not(:disabled) {
    width: 44px;
    height: 44px;
    font-size: 10px;
  }
  .song-room-player .full-times {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
  }
  .song-room-player .full-times span { min-width: 0; }
  .song-room-player .full-times span:nth-child(2) {
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
`;
document.head.append(qualityStyles);

window.addEventListener(
  "click",
  (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    const soundTrigger = target.closest("[data-open-sound]");
    if (soundTrigger) {
      requestAnimationFrame(() => {
        document.querySelector(".discover-sounds")?.scrollIntoView({
          block: "start",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      });
    }

    const changeTrigger = target.closest("[data-change-journey]");
    if (changeTrigger) pickerReturnFocus = changeTrigger;

    const picker = document.getElementById("journeyGenrePicker");
    if (!picker || picker.hidden) {
      scheduleSync();
      return;
    }

    const closesPicker =
      target === picker ||
      Boolean(
        target.closest(
          "[data-close-journey-picker], [data-cancel-journey-picker]",
        ),
      );
    if (!closesPicker) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    closePickerWithContext();
  },
  true,
);

window.addEventListener(
  "keydown",
  (event) => {
    const picker = document.getElementById("journeyGenrePicker");
    if (event.key !== "Escape" || !picker || picker.hidden) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    closePickerWithContext();
  },
  true,
);

new MutationObserver(scheduleSync).observe(document.body, {
  childList: true,
  subtree: true,
});
window.addEventListener("storage", scheduleSync);
window.addEventListener("hashchange", scheduleSync);
document.addEventListener("visibilitychange", scheduleSync);
scheduleSync();
