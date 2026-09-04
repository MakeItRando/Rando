const genrePalettes = Object.freeze({
  hiphop: {
    accent: '#ff6846', rgb: '255, 104, 70', secondary: '#8c63ff', secondaryRgb: '140, 99, 255',
    base: '#09080d', surface: '#15111b', signal: 'EMBER / ULTRAVIOLET'
  },
  rnb: {
    accent: '#ff79bd', rgb: '255, 121, 189', secondary: '#8b7bff', secondaryRgb: '139, 123, 255',
    base: '#0e0810', surface: '#1a101c', signal: 'ROSE / VIOLET'
  },
  electronic: {
    accent: '#47e0cf', rgb: '71, 224, 207', secondary: '#5f7cff', secondaryRgb: '95, 124, 255',
    base: '#050d11', surface: '#0c181d', signal: 'CYAN / COBALT'
  },
  jazz: {
    accent: '#f4b85f', rgb: '244, 184, 95', secondary: '#c45f7d', secondaryRgb: '196, 95, 125',
    base: '#100b08', surface: '#1c1410', signal: 'AMBER / BURGUNDY'
  }
});

export function getGenreAmbience(genreId) {
  return genrePalettes[genreId] || genrePalettes.hiphop;
}

export function applyGenreAmbience(genreId, root = document.documentElement) {
  const palette = getGenreAmbience(genreId);
  root.dataset.genre = genrePalettes[genreId] ? genreId : 'hiphop';
  root.style.setProperty('--genre-accent', palette.accent);
  root.style.setProperty('--genre-rgb', palette.rgb);
  root.style.setProperty('--genre-secondary', palette.secondary);
  root.style.setProperty('--genre-secondary-rgb', palette.secondaryRgb);
  root.style.setProperty('--genre-base', palette.base);
  root.style.setProperty('--genre-surface', palette.surface);
  root.style.setProperty('--signal', palette.accent);
  return palette;
}

export { genrePalettes };
