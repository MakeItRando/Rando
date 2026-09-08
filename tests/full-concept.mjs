import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const base = process.env.RONDO_URL || pathToFileURL(resolve('preview-test.html')).href;
const target = `${base}${base.includes('?') ? '&' : '?'}skip-onboarding=1`;
const executablePath = process.env.CHROMIUM_PATH || '/usr/local/bin/chromium';
const launchOptions = { headless: true, args: ['--no-sandbox'] };
if (existsSync(executablePath)) launchOptions.executablePath = executablePath;
const browser = await chromium.launch(launchOptions);
const errors = [];

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(target, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  assert(await page.locator('body').getAttribute('data-view') === 'discover', 'Discover should be the default destination.');
  assert(await page.locator('#discoveryChoice').isVisible(), 'Entering Discover should ask how the listener wants to begin.');
  assert(await page.locator('#journey').isHidden(), 'Artist Journeys should remain a separate destination.');
  assert(await page.locator('#mobileDirectoryButton').isHidden(), 'Artist directory should belong only to Journeys.');
  await page.click('[data-choice-genre="hiphop"]');
  await page.click('[data-listen-genre]');
  assert(await page.locator('[data-discovery-screen="genre"][data-genre="hiphop"]').isVisible(), 'A genre choice should open its dedicated playlist.');
  assert(await page.locator('.genre-song').count() >= 6, 'The genre playlist should contain a useful sequence.');

  await page.click('[data-open-discovery-picker]');
  await page.click('[data-choose-explore]');
  assert(await page.locator('.music-featured').isVisible(), 'Explore should include popular music.');
  assert(await page.locator('.music-hidden').isVisible(), 'Explore should include hidden gems.');
  assert(await page.locator('.music-genre-row').count() === 4, 'Explore should show every prototype genre.');

  await page.click('#searchTrigger');
  await page.fill('#globalSearch', 'Blacktop Studies');
  await page.locator('[data-result-type="release"]').first().click();
  assert(await page.locator('body').getAttribute('data-view') === 'release', 'Search should open a release destination.');
  assert((await page.locator('.release-page h1').textContent()).includes('Blacktop Studies'), 'Release destination should preserve album identity.');
  assert(await page.locator('.release-page-track').count() === 4, 'Blacktop Studies should keep its sequence intact.');

  const chapterAction = page.locator('[data-play-release="blacktop-studies"]');
  await chapterAction.click();
  await page.waitForFunction(() => document.body.classList.contains('is-playing'));
  assert((await chapterAction.textContent()).includes('Pause chapter'), 'Release action should become Pause chapter while playing.');
  await page.waitForTimeout(500);
  const firstWave = await page.locator('.song-room-wave i').evaluateAll((bars) => bars.map((bar) => getComputedStyle(bar).height));
  await page.waitForTimeout(350);
  const secondWave = await page.locator('.song-room-wave i').evaluateAll((bars) => bars.map((bar) => getComputedStyle(bar).height));
  assert(firstWave.some((height, index) => height !== secondWave[index]), 'Playing waveform should visibly respond over time.');
  const signalMode = await page.locator('.song-room-wave').getAttribute('data-signal-mode');
  assert(['audio', 'motion'].includes(signalMode), `Waveform should identify its signal mode, got ${signalMode}.`);

  await page.click('#mobileTrack');
  assert(await page.locator('#fullPlayer').isVisible(), 'Song Room should open from a release.');
  assert(await page.locator('#fullVolumeControl').isVisible(), 'Desktop Song Room should expose synchronized volume.');
  await page.locator('#volumeControl').evaluate((input) => { input.value = '34'; input.dispatchEvent(new Event('input', { bubbles: true })); });
  assert(await page.locator('#fullVolumeControl').inputValue() === '34', 'Main and Song Room volume should synchronize.');
  assert(await page.locator('#rondoAudio').evaluate((audio) => Math.abs(audio.volume - .34) < .01), 'Volume should control the audio element.');
  await page.click('#fullVolumeMute');
  assert(await page.locator('#volumeControl').inputValue() === '0', 'Mute should synchronize across player surfaces.');
  await page.click('#fullVolumeMute');
  assert(await page.locator('#volumeControl').inputValue() === '34', 'Unmute should restore the last audible level.');

  await page.click('[data-song-room-mode="reveals"]');
  assert(await page.locator('.song-room-reveal.locked').isVisible(), 'Song Room should show a truthful locked extra.');
  await page.locator('#rondoAudio').evaluate((audio) => { audio.currentTime = 12.4; audio.dispatchEvent(new Event('timeupdate')); });
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('rondo-prototype-v2') || '{}').unlockedArtifacts?.includes('blacktop-studies'));
  assert(await page.locator('.song-room-reveal.open').isVisible(), 'Listening milestone should open the optional extra.');
  await page.keyboard.press('Escape');

  await page.click('.rail-button[data-view="discover"]');
  await page.click('[data-choose-explore]');
  await page.setViewportSize({ width: 320, height: 700 });
  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'Compact Explore should not overflow horizontally.');
  const controls = await page.locator('.music-picker-button, .music-card').evaluateAll((items) => items.slice(0, 4).map((item) => item.getBoundingClientRect().height));
  assert(controls.every((height) => height >= 44), 'Compact discovery actions should meet touch targets.');
  await page.click('[data-mobile-view="journeys"]');
  assert(await page.locator('#mobileDirectoryButton').isVisible(), 'Journeys should own the mobile artist-directory trigger.');
  assert(await page.locator('#journey').isVisible(), 'Journeys should reveal the artist-by-artist path.');
  assert(errors.length === 0, `Full concept browser errors: ${errors.join(' | ')}`);
  await page.close();

  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await reduced.goto(target);
  await reduced.locator('#discoveryChoice').waitFor({ state: 'visible' });
  await reduced.click('[data-listen-genre]');
  await reduced.locator('.genre-song').first().click();
  await reduced.waitForFunction(() => document.body.classList.contains('is-playing'));
  assert(await reduced.locator('.song-room-wave').getAttribute('data-signal-mode') === 'reduced', 'Reduced Motion should replace continuous waveform animation with a static signal.');
  await reduced.close();

  console.log('Rondo full-concept regression passed.');
} finally {
  await browser.close();
}
