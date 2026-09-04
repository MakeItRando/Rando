const STORAGE_KEY = 'rondo-prototype-v2';

const persistedDefaults = {
	onboardingComplete: false,
	profile: {
		displayName: 'M', email: '', genres: ['hiphop', 'rnb', 'electronic'],
		seedArtists: ['kairo-vale', 'mira-son'], discovery: 64, popularity: 45, albumFocus: 78
	},
	savedTracks: [], savedReleases: [], savedArtists: [], playedTracks: []
};

function readPersisted() {
  try {
    return { ...persistedDefaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return { ...persistedDefaults };
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
      playedTracks: [...state.playedTracks]
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
    reset() { localStorage.removeItem(STORAGE_KEY); state = { ...initialState, ...persistedDefaults }; listeners.forEach((listener) => listener(state)); }
  };
}
