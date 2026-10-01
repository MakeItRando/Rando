/*
 * Transitional runtime guard for the v0.3.3 prototype.
 *
 * renderFullPlayer still lives in the legacy monolith and writes the Song Room
 * footer directly. This module keeps the user-facing contract safe until that
 * renderer is split into a dedicated view module: no JS placeholders in visible
 * metadata, no mobile-only Room mode selected on desktop, and a consistent play
 * icon. Keep this narrow and delete it once the renderer owns those invariants.
 */
const placeholderPattern = /\\b(undefined|null|NaN)\\b|\\[object Object\\]/g;
const playIcon = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
const pauseIcon = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';

function repairFullPlayer() {
  const player = document.getElementById('fullPlayer');
  if (!player || player.hidden) return;
  const desktop = window.matchMedia('(min-width: 761px)').matches;
  if (desktop && player.dataset.mode === 'room') {
    player.dataset.mode = 'story';
    document.querySelectorAll('#songRoomTabs [data-song-room-mode]').forEach((button) => {
      const active = button.dataset.songRoomMode === 'story';
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
  }
  const meta = document.getElementById('fullAudioMeta');
  if (meta && placeholderPattern.test(meta.textContent)) {
    placeholderPattern.lastIndex = 0;
    const cleaned = meta.textContent.replace(placeholderPattern, '').replace(/\\s+·\\s+·/g, ' · ').replace(/\\s{2,}/g, ' ').trim();
    meta.textContent = cleaned;
  }
  const play = document.getElementById('fullPlay');
  if (play && !play.querySelector('svg')) play.innerHTML = document.body.classList.contains('is-playing') ? pauseIcon : playIcon;
}

const observer = new MutationObserver(repairFullPlayer);
observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['hidden', 'data-mode', 'class'] });
window.addEventListener('resize', repairFullPlayer, { passive: true });
requestAnimationFrame(repairFullPlayer);
