import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const base = process.env.RONDO_URL || pathToFileURL(resolve('preview-test.html')).href;
const target = `${base}${base.includes('?') ? '&' : '?'}skip-onboarding=1`;
const executablePath = process.env.CHROMIUM_PATH || '/usr/local/bin/chromium';
const options = { headless: true, args: ['--no-sandbox'] };
if (existsSync(executablePath)) options.executablePath = executablePath;
const browser = await chromium.launch(options);
const errors = [];

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(target, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  assert(await page.locator('body').getAttribute('data-view') === 'discover', 'Discover should be the default destination.');
  assert(await page.locator('main[data-rondo-page="discover"]').isVisible(), 'Discover should open its music home directly.');
  assert(await page.locator('#journeyGenrePicker').count() === 0, 'Discover should not open the Journey picker.');
  assert(await page.locator('#journey').isHidden(), 'Guided artist Journeys should remain separate.');
  assert(await page.locator('.music-featured').isVisible(), 'Discover should include current picks.');
  assert(await page.locator('.music-hidden').isVisible(), 'Discover should include hidden gems.');
  assert(await page.locator('.discover-genre-card').count() === 4, 'Discover should link to all Genre Journeys.');

  await page.click('.rail-button[data-view="journeys"]');
  await page.locator('#journeyGenrePicker').waitFor();
  await page.click('[data-picker-genre="hiphop"]');
  await page.click('[data-confirm-journey]');
  await page.locator('#journeyGenrePage[data-genre="hiphop"]').waitFor();
  assert(await page.locator('.journey-top-songs .genre-song').count() >= 6, 'Genre Journey should include useful music.');
  assert(await page.locator('.journey-artist-card').count() > 0, 'Genre Journey should include artists.');

  await page.click('#searchTrigger');
  await page.fill('#globalSearch', 'Blacktop Studies');
  await page.locator('[data-result-type="release"]').first().click();
  assert(await page.locator('body').getAttribute('data-view') === 'release', 'Search should open a release destination.');
  assert((await page.locator('.release-page h1').textContent()).includes('Blacktop Studies'), 'Release should preserve album identity.');
  assert(await page.locator('.release-page-track').count() === 4, 'Blacktop Studies should keep its sequence.');

  const chapterAction = page.locator('[data-play-release="blacktop-studies"]');
  await chapterAction.click();
  await page.waitForFunction(() => document.body.classList.contains('is-playing'));
  assert((await chapterAction.textContent()).includes('Pause chapter'), 'Release action should become Pause chapter.');
  await page.waitForTimeout(500);
  const firstWave = await page.locator('.song-room-wave i').evaluateAll((bars) => bars.map((bar) => getComputedStyle(bar).height));
  await page.waitForTimeout(350);
  const secondWave = await page.locator('.song-room-wave i').evaluateAll((bars) => bars.map((bar) => getComputedStyle(bar).height));
  assert(firstWave.some((height, index) => height !== secondWave[index]), 'Playing waveform should respond over time.');
  const signal = await page.locator('.song-room-wave').getAttribute('data-signal-mode');
  assert(['audio', 'motion'].includes(signal), `Waveform signal mode is invalid: ${signal}.`);

  await page.click('#mobileTrack');
  assert(await page.locator('#fullPlayer').isVisible(), 'Song Room should open from a release.');
  assert(await page.locator('#fullVolumeControl').isVisible(), 'Desktop Song Room should expose volume.');
  await page.locator('#volumeControl').evaluate((input) => { input.value = '34'; input.dispatchEvent(new Event('input', { bubbles: true })); });
  assert(await page.locator('#fullVolumeControl').inputValue() === '34', 'Volume controls should synchronize.');
  assert(await page.locator('#rondoAudio').evaluate((audio) => Math.abs(audio.volume - .34) < .01), 'Volume should control audio.');
  await page.click('#fullVolumeMute');
  assert(await page.locator('#volumeControl').inputValue() === '0', 'Mute should synchronize.');
  await page.click('#fullVolumeMute');
  assert(await page.locator('#volumeControl').inputValue() === '34', 'Unmute should restore volume.');

  await page.click('[data-song-room-mode="reveals"]');
  assert(await page.locator('.song-room-reveal.locked').isVisible(), 'Song Room should show a truthful locked extra.');
  await page.locator('#rondoAudio').evaluate((audio) => { audio.currentTime = 12.4; audio.dispatchEvent(new Event('timeupdate')); });
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('rondo-prototype-v2') || '{}').unlockedArtifacts?.includes('blacktop-studies'));
  assert(await page.locator('.song-room-reveal.open').isVisible(), 'Listening should open the optional extra.');
  await page.keyboard.press('Escape');

  await page.click('.rail-button[data-view="discover"]');
  await page.locator('main[data-rondo-page="discover"]').waitFor();
  await page.setViewportSize({ width: 320, height: 700 });
  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'Compact Discover should not overflow.');
  const controls = await page.locator('[data-surprise-track], .music-card').evaluateAll((items) => items.slice(0, 4).map((item) => item.getBoundingClientRect().height));
  assert(controls.every((height) => height >= 44), 'Compact discovery actions should meet touch targets.');
  await page.click('[data-mobile-view="journeys"]');
  await page.locator('#journeyGenrePage[data-genre="hiphop"]').waitFor();
  assert(await page.locator('#mobileDirectoryButton').isHidden(), 'Genre home should not expose the artist directory.');
  await page.click('[data-resume-journey="hiphop"]');
  assert(await page.locator('#mobileDirectoryButton').isVisible(), 'Guided Journey should own the artist directory.');
  assert(await page.locator('#journey').isVisible(), 'Start Journey should reveal the artist path.');
  assert(errors.length === 0, `Full concept browser errors: ${errors.join(' | ')}`);
  await page.close();

  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await reduced.goto(target);
  await reduced.locator('main[data-rondo-page="discover"]').waitFor();
  await reduced.locator('[data-play-entry="k101"]').first().click();
  await reduced.waitForFunction(() => document.body.classList.contains('is-playing'));
  assert(await reduced.locator('.song-room-wave').getAttribute('data-signal-mode') === 'reduced', 'Reduced Motion should use a static signal.');
  await reduced.close();

  console.log('Rondo full-concept regression passed.');
} finally {
  await browser.close();
}
