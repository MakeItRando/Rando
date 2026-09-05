export function createAudioEngine({ onTime = () => {}, onEnded = () => {}, onError = () => {} } = {}) {
  const audio = document.createElement('audio');
  audio.id = 'rondoAudio';
  audio.preload = 'metadata';
  audio.setAttribute('aria-hidden', 'true');
  audio.volume = 0.82;
  document.body.appendChild(audio);
  let activeUrl = '';
  let pendingSeek = 0;

  const applySeek = () => {
    if (!Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration - 0.05, pendingSeek || 0));
  };

  audio.addEventListener('loadedmetadata', applySeek);
  audio.addEventListener('timeupdate', () => onTime(audio.currentTime));
  audio.addEventListener('ended', onEnded);
  audio.addEventListener('error', () => onError(audio.error));

  function load(track, position = 0) {
    if (!track?.previewUrl) return false;
    pendingSeek = Number.isFinite(position) ? position : 0;
    if (activeUrl !== track.previewUrl) {
      activeUrl = track.previewUrl;
      audio.src = track.previewUrl;
      audio.load();
    } else if (audio.readyState >= 1) applySeek();
    return true;
  }

  return {
    element: audio,
    hasSource: (track) => Boolean(track?.previewUrl),
    async play(track, position = 0) {
      if (!load(track, position)) return false;
      await audio.play();
      return true;
    },
    pause() { audio.pause(); },
    stop() { audio.pause(); pendingSeek = 0; if (audio.readyState >= 1) audio.currentTime = 0; },
    seek(position) { pendingSeek = Math.max(0, Number(position) || 0); if (audio.readyState >= 1) applySeek(); },
    setVolume(value) { audio.volume = Math.min(1, Math.max(0, Number(value) || 0)); return audio.volume; },
    getState: () => ({ paused: audio.paused, currentTime: audio.currentTime, duration: audio.duration, src: activeUrl })
  };
}
