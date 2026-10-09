const STORAGE_KEY = "rondo-prototype-v2";

const defaultProfile = {
  displayName: "M",
  email: "",
  genres: ["hiphop", "rnb", "electronic"],
  seedArtists: ["kairo-vale", "mira-son"],
  discovery: 64,
  popularity: 45,
  albumFocus: 78,
};

const persistedDefaults = {
  onboardingComplete: false,
  profile: defaultProfile,
  savedTracks: [],
  savedReleases: [],
  savedArtists: [],
  playedTracks: [],
  savedMoments: [],
  songNotes: {},
  releaseProgress: {},
  unlockedArtifacts: [],
  volume: 0.82,
  theme: "dark",
};

const isRecord = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const readStringList = (value) =>
  Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item)
    : [];

const readRecordList = (value) =>
  Array.isArray(value) ? value.filter(isRecord) : [];

const readPercentage = (value, fallback) =>
  Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : fallback;

function readProfile(value) {
  const source = isRecord(value) ? value : {};
  return {
    ...defaultProfile,
    ...source,
    displayName:
      typeof source.displayName === "string"
        ? source.displayName
        : defaultProfile.displayName,
    email: typeof source.email === "string" ? source.email : defaultProfile.email,
    genres: Array.isArray(source.genres)
      ? readStringList(source.genres)
      : [...defaultProfile.genres],
    seedArtists: Array.isArray(source.seedArtists)
      ? readStringList(source.seedArtists)
      : [...defaultProfile.seedArtists],
    discovery: readPercentage(source.discovery, defaultProfile.discovery),
    popularity: readPercentage(source.popularity, defaultProfile.popularity),
    albumFocus: readPercentage(source.albumFocus, defaultProfile.albumFocus),
  };
}

function readSession(raw) {
  const source = isRecord(raw.session) ? raw.session : {};
  const session = {};
  for (const key of [
    "genreId",
    "artistId",
    "selectedTrackId",
    "activeReleaseId",
  ]) {
    if (typeof source[key] === "string" && source[key])
      session[key] = source[key];
  }
  if (source.catalogMode === "matching" || source.catalogMode === "all")
    session.catalogMode = source.catalogMode;
  if (["continue", "track", "artist"].includes(source.repeatMode))
    session.repeatMode = source.repeatMode;
  else if (source.repeatMode === "off") session.repeatMode = "continue";
  if (Number.isFinite(source.position) && source.position >= 0)
    session.position = source.position;
  return session;
}

function readPersisted() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const raw = isRecord(parsed) ? parsed : {};
    const normalized = {
      ...persistedDefaults,
      ...raw,
      onboardingComplete: raw.onboardingComplete === true,
      profile: readProfile(raw.profile),
      savedTracks: readStringList(raw.savedTracks),
      savedReleases: readStringList(raw.savedReleases),
      savedArtists: readStringList(raw.savedArtists),
      playedTracks: readStringList(raw.playedTracks),
      savedMoments: readRecordList(raw.savedMoments),
      songNotes: isRecord(raw.songNotes) ? raw.songNotes : {},
      releaseProgress: isRecord(raw.releaseProgress)
        ? raw.releaseProgress
        : {},
      unlockedArtifacts: readStringList(raw.unlockedArtifacts),
      volume: Number.isFinite(raw.volume)
        ? Math.min(1, Math.max(0, raw.volume))
        : 0.82,
      theme: raw.theme === "light" ? "light" : "dark",
      session: readSession(raw),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch {
      // The in-memory state remains usable when storage is unavailable.
    }
    return normalized;
  } catch {
    return {
      ...persistedDefaults,
      profile: { ...defaultProfile },
      session: {},
    };
  }
}

export function createStore(initialState) {
  const persisted = readPersisted();
  let state = { ...initialState, ...persisted, ...persisted.session };
  const listeners = new Set();

  const persist = () => {
    const data = {
      onboardingComplete: state.onboardingComplete,
      profile: state.profile,
      savedTracks: [...state.savedTracks],
      savedReleases: [...state.savedReleases],
      savedArtists: [...state.savedArtists],
      playedTracks: [...state.playedTracks],
      savedMoments: [...(state.savedMoments || [])],
      songNotes: { ...(state.songNotes || {}) },
      releaseProgress: { ...(state.releaseProgress || {}) },
      unlockedArtifacts: [...(state.unlockedArtifacts || [])],
      volume: Math.min(1, Math.max(0, Number(state.volume) || 0)),
      theme: state.theme === "light" ? "light" : "dark",
      session: {
        genreId: state.genreId,
        artistId: state.artistId,
        selectedTrackId: state.selectedTrackId,
        activeReleaseId: state.activeReleaseId,
        catalogMode: state.catalogMode,
        repeatMode: state.repeatMode,
        position: Math.max(0, Number(state.position) || 0),
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  return {
    get: () => state,
    set(patch, options = {}) {
      state = {
        ...state,
        ...(typeof patch === "function" ? patch(state) : patch),
      };
      if (options.persist) persist();
      listeners.forEach((listener) => listener(state));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    reset() {
      localStorage.removeItem(STORAGE_KEY);
      state = {
        ...initialState,
        ...persistedDefaults,
        profile: { ...defaultProfile },
      };
      listeners.forEach((listener) => listener(state));
    },
  };
}
