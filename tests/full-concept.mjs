import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const base = process.env.RONDO_URL || pathToFileURL(resolve('preview-test.html')).href;
const target = `${base}${base.includes('?') ? '&' : '?'}skip-onboarding=1`;
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || '/usr/local/bin/chromium' });
const errors = [];

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(target, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  assert(await page.locator('body').getAttribute('data-view') === 'discover', 'Discover should be the real default destination.');
  assert(await page.locator('.discover-page').isVisible(), 'Dedicated Discover page should be visible.');
  assert(await page.locator('#journey').isHidden(), 'Artist Journey should not masquerade as Discover.');
  assert(await page.locator('#mobileDirectoryButton').isHidden(), 'Artist directory should belong only to Journeys.');
  for (const selector of ['.discover-hero', '.discover-chapters', '.discover-detour', '.discover-scenes', '.discover-connections', '.discover-reveals']) {
    assert(await page.locator(selector).count() === 1, `${selector} should be part of the Discover composition.`);
  }
  assert(await page.locator('.discover-chapter').count() >= 4, 'Discover should offer a small set of distinct release chapters.');

  await page.locator('[data-open-release="blacktop-studies"]').first().click();
  assert(await page.locator('body').getAttribute('data-view') === 'release', 'Chapter action should open a release destination.');
  assert((await page.locator('.release-page h1').textContent()).includes('Blacktop Studies'), 'Release destination should preserve album identity.');
  assert(await page.locator('.release-page-track').count() === 4, 'Blacktop Studies should keep its sequence intact.');
  assert((await page.locator('.release-artifact').textContent()).includes('the music is never locked'), 'Locked reveal should explicitly keep music open.');

  const chapterAction = page.locator('[data-play-release="blacktop-studies"]');
  await chapterAction.click();
  await page.waitForFunction(() => document.body.classList.contains('is-playing'));
  assert((await chapterAction.textContent()).includes('Pause chapter'), 'Release playback action should become Pause chapter.');
  await page.waitForTimeout(500);
  const firstWave = await page.locator('.song-room-wave i').evaluateAll((bars) => bars.map((bar) => getComputedStyle(bar).height));
  await page.waitForTimeout(350);
  const secondWave = await page.locator('.song-room-wave i').evaluateAll((bars) => bars.map((bar) => getComputedStyle(bar).height));
  assert(firstWave.some((height, index) => height !== secondWave[index]), 'Playing waveform should visibly respond over time.');
  const signalMode = await page.locator('.song-room-wave').getAttribute('data-signal-mode');
  assert(['audio', 'motion'].includes(signalMode), `Playing waveform should identify an honest signal mode, got ${signalMode}.`);

  await page.click('#mobileTrack');
  assert(await page.locator('#fullPlayer').isVisible(), 'Song Room should open from a release chapter.');
  assert(await page.locator('#fullVolumeControl').isVisible(), 'Desktop Song Room should expose its synchronized sound field.');
  await page.locator('#volumeControl').evaluate((input) => { input.value = '34'; input.dispatchEvent(new Event('input', { bubbles: true })); });
  assert(await page.locator('#fullVolumeControl').inputValue() === '34', 'Main and Song Room volume sliders should synchronize.');
  assert(await page.locator('#rondoAudio').evaluate((audio) => Math.abs(audio.volume - .34) < .01), 'Sound field should control the actual audio element.');
  await page.click('#fullVolumeMute');
  assert(await page.locator('#volumeControl').inputValue() === '0', 'Mute should synchronize across player surfaces.');
  await page.click('#fullVolumeMute');
  assert(await page.locator('#volumeControl').inputValue() === '34', 'Unmute should restore the last audible level.');

  await page.click('[data-song-room-mode="reveals"]');
  assert(await page.locator('.song-room-reveal.locked').isVisible(), 'Song Room should show a truthful locked reveal state.');
  await page.locator('#rondoAudio').evaluate((audio) => { audio.currentTime = 12.4; audio.dispatchEvent(new Event('timeupdate')); });
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('rondo-prototype-v2') || '{}').unlockedArtifacts?.includes('blacktop-studies'));
  assert(await page.locator('.song-room-reveal.open').isVisible(), 'Listening milestone should open the optional release artifact.');
  assert((await page.locator('.song-room-reveal.open').textContent()).includes('Route card 17'), 'Opened artifact should retain release-specific lore.');
  await page.keyboard.press('Escape');

  await page.click('.rail-button[data-view="discover"]');
  await page.setViewportSize({ width: 320, height: 700 });
  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'Compact Discover should not overflow horizontally.');
  const discoverHeader = await page.evaluate(() => {
    const profile = document.querySelector('#profileTrigger').getBoundingClientRect();
    const wordmark = document.querySelector('.wordmark').getBoundingClientRect();
    return { profileLeft: profile.left, profileRight: profile.right, wordmarkLeft: wordmark.left, wordmarkRight: wordmark.right };
  });
  assert(discoverHeader.profileLeft > 240 && discoverHeader.profileRight <= 320, 'Compact Discover should keep profile controls at the right edge.');
  assert(discoverHeader.wordmarkLeft >= 0 && discoverHeader.wordmarkRight < discoverHeader.profileLeft, 'Compact Discover wordmark should not collide with profile controls.');
  const discoveryActions = await page.locator('.discover-hero-actions button').evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().height));
  assert(discoveryActions.every((height) => height >= 44), 'Discover hero actions should meet compact touch targets.');
  await page.click('[data-mobile-view="journeys"]');
  assert(await page.locator('#mobileDirectoryButton').isVisible(), 'Journeys should own the mobile artist-directory trigger.');
  assert(await page.locator('#journey').isVisible(), 'Journeys should reveal the artist-by-artist listening path.');
  const journeyHeader = await page.evaluate(() => ['mobileDirectoryButton', 'profileTrigger'].map((id) => { const rect = document.getElementById(id).getBoundingClientRect(); return { id, top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right }; }));
  assert(journeyHeader.every(({ top, bottom, left, right }) => top >= 0 && bottom <= 58 && left >= 0 && right <= 320), 'Compact Journey header controls should stay in one visible row.');
  assert(errors.length === 0, `Full concept browser errors: ${errors.join(' | ')}`);
  await page.close();

  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await reduced.goto(target);
  await reduced.locator('[data-discover-play]').click();
  await reduced.waitForTimeout(160);
  assert(await reduced.locator('.song-room-wave').getAttribute('data-signal-mode') === 'reduced', 'Reduced Motion should replace continuous waveform animation with a static signal.');
  await reduced.close();

  console.log('Rondo full-concept regression passed.');
} finally {
  await browser.close();
}
