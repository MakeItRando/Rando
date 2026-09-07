const STORAGE_KEY = 'rondo-prototype-v2';

const defaultProfile = {
  displayName: 'M', email: '', genres: ['hiphop', 'rnb', 'electronic'],
  seedArtists: ['kairo-vale', 'mira-son'], discovery: 64, popularity: 45, albumFocus: 78
};

const persistedDefaults = {
  onboardingComplete: false,
  profile: defaultProfile,
  savedTracks: [], savedReleases: [], savedArtists: [], playedTracks: [], savedMoments: [],
  songNotes: {}, releaseProgress: {}, unlockedArtifacts: [], volume: 0.82, theme: 'dark'
};

function readPersisted() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      ...persistedDefaults,
      ...raw,
      profile: { ...defaultProfile, ...(raw.profile || {}) },
      songNotes: raw.songNotes && typeof raw.songNotes === 'object' ? raw.songNotes : {},
      releaseProgress: raw.releaseProgress && typeof raw.releaseProgress === 'object' ? raw.releaseProgress : {},
      unlockedArtifacts: Array.isArray(raw.unlockedArtifacts) ? raw.unlockedArtifacts : [],
      volume: Number.isFinite(raw.volume) ? Math.min(1, Math.max(0, raw.volume)) : 0.82,
      theme: raw.theme === 'light' ? 'light' : 'dark'
    };
  } catch {
    return { ...persistedDefaults, profile: { ...defaultProfile } };
  }
}

export function createStore(initialState) {
  let state = { ...initialState, ...readPersisted() };
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
      theme: state.theme === 'light' ? 'light' : 'dark'
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  return {
    get: () => state,
    set(patch, options = {}) {
      state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
      if (options.persist) persist();
      listeners.forEach((listener) => listener(state));
    },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    reset() {
      localStorage.removeItem(STORAGE_KEY);
      state = { ...initialState, ...persistedDefaults, profile: { ...defaultProfile } };
      listeners.forEach((listener) => listener(state));
    }
  };
}
