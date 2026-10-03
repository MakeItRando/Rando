export function createAudioEngine({ onTime = () => {}, onEnded = () => {}, onError = () => {} } = {}) {
  const audio = document.createElement('audio');
  audio.id = 'rondoAudio';
  audio.preload = 'metadata';
  audio.crossOrigin = 'anonymous';
  audio.setAttribute('aria-hidden', 'true');
  audio.volume = 0.82;
  document.body.appendChild(audio);

  let activeUrl = '';
  let pendingSeek = 0;
  let audioContext = null;
  let analyser = null;
  let frequencyData = null;
  let signalUnavailable = false;

  const applySeek = () => {
    if (!Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration - 0.05, pendingSeek || 0));
  };

  const ensureSignal = async () => {
    if (analyser || signalUnavailable) return Boolean(analyser);
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) { signalUnavailable = true; return false; }
    try {
      audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(audio);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.78;
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      frequencyData = new Uint8Array(analyser.frequencyBinCount);
      if (audioContext.state === 'suspended') await audioContext.resume();
      return true;
    } catch {
      signalUnavailable = true;
      analyser = null;
      frequencyData = null;
      return false;
    }
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
      const signalPromise = ensureSignal();
      const playPromise = audio.play();
      await playPromise;
      await signalPromise;
      return true;
    },
    pause() { audio.pause(); },
    stop() { audio.pause(); pendingSeek = 0; if (audio.readyState >= 1) audio.currentTime = 0; },
    seek(position) { pendingSeek = Math.max(0, Number(position) || 0); if (audio.readyState >= 1) applySeek(); },
    setVolume(value) { audio.volume = Math.min(1, Math.max(0, Number(value) || 0)); return audio.volume; },
    getLevels(count = 24) {
      if (!analyser || !frequencyData || audio.paused || audioContext?.state !== 'running') return null;
      analyser.getByteFrequencyData(frequencyData);
      const levels = [];
      const usefulBins = Math.max(count, Math.floor(frequencyData.length * 0.76));
      for (let index = 0; index < count; index += 1) {
        const start = Math.floor((index / count) * usefulBins);
        const end = Math.max(start + 1, Math.floor(((index + 1) / count) * usefulBins));
        let total = 0;
        for (let bin = start; bin < end; bin += 1) total += frequencyData[bin] || 0;
        const average = total / (end - start) / 255;
        levels.push(Math.min(1, Math.max(0.06, Math.pow(average, 0.72))));
      }
      return levels;
    },
    getSignalMode: () => analyser && !signalUnavailable ? 'audio' : 'motion',
    getState: () => ({ paused: audio.paused, currentTime: audio.currentTime, duration: audio.duration, src: activeUrl })
  };
}
