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
const watch = (page) => {
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
};

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watch(page);
  await page.goto(target, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('#discoveryChoice').waitFor({ state: 'visible' });

  assert(await page.locator('#appShell').evaluate((element) => element.inert), 'The Discover choice should make the background inert.');
  assert(await page.locator('.discovery-option-genre').isVisible(), 'Discover should offer a genre playlist.');
  assert(await page.locator('.discovery-option-explore').isVisible(), 'Discover should offer broad exploration.');
  assert(await page.locator('[data-choice-genre]').count() === 4, 'The chooser should offer every prototype genre.');
  assert(await page.evaluate(() => document.querySelector('#discoveryChoice').contains(document.activeElement)), 'The chooser should receive focus.');

  await page.keyboard.press('Escape');
  assert(await page.locator('#discoveryChoice').isHidden(), 'Escape should close the Discover choice.');
  assert(!(await page.locator('#appShell').evaluate((element) => element.inert)), 'Closing the chooser should restore the app.');
  assert(await page.evaluate(() => document.activeElement?.matches('.rail-button[data-view="discover"]')), 'Closing should return focus to Discover.');

  await page.click('.rail-button[data-view="discover"]');
  await page.click('[data-choice-genre="rnb"]');
  assert(await page.locator('[data-choice-genre="rnb"]').getAttribute('aria-checked') === 'true', 'Genre choice should expose selection.');
  assert((await page.locator('[data-listen-genre]').textContent()).includes('R&B'), 'Listen action should name the selected genre.');
  await page.click('[data-listen-genre]');
  assert(await page.locator('[data-discovery-screen="genre"][data-genre="rnb"]').isVisible(), 'Listen should open the selected genre playlist.');
  assert(await page.locator('.genre-song').count() >= 6, 'Genre playlist should include songs from across the genre.');
  assert(!(await page.locator('#viewSurface').textContent()).includes('Find a door'), 'Rejected editorial door copy should be removed.');

  await page.click('[data-open-discovery-picker]');
  await page.waitForTimeout(30);
  await page.locator('.discovery-choice-close').focus();
  await page.keyboard.press('Shift+Tab');
  assert(await page.evaluate(() => document.activeElement?.matches('[data-choose-explore]')), 'Chooser focus should wrap from first to last control.');
  await page.click('[data-choose-explore]');
  assert(await page.locator('[data-discovery-screen="explore"]').isVisible(), 'Explore should open a broad music page.');
  assert((await page.locator('.music-featured h2').textContent()).trim() === 'Popular now', 'Explore should include popular music.');
  assert((await page.locator('.music-hidden h2').textContent()).trim() === 'Hidden gems', 'Explore should include underrated picks.');
  assert(await page.locator('.music-genre-row').count() === 4, 'Explore should organize music across every genre.');

  await page.fill('[data-music-search]', 'Night Transit');
  assert(await page.locator('.music-search-results [data-explore-track="k101"]').count() === 1, 'Explore search should find a song directly.');
  await page.click('.music-search-results [data-explore-track="k101"]');
  await page.waitForFunction(() => document.body.classList.contains('is-playing'));
  await page.locator('#fullPlayer').waitFor({ state: 'visible' });
  assert((await page.locator('#barTitle').textContent()).trim() === 'Night Transit', 'A search result should start the chosen song.');
  assert(Boolean(await page.locator('#fullPlayer').getAttribute('data-vibe')), 'Song Room should classify the track vibe.');
  await page.keyboard.press('Escape');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.click('.mobile-nav-button[data-mobile-view="discover"]');
  assert(await page.locator('#discoveryChoice').isVisible(), 'Discover should open its chooser on mobile.');
  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'Mobile chooser should not overflow.');
  await page.locator('#discoveryChoice').click({ position: { x: 4, y: 4 } });
  assert(await page.locator('#discoveryChoice').isHidden(), 'Tapping outside should close the chooser.');
  await page.click('.mobile-nav-button[data-mobile-view="discover"]');
  await page.click('[data-choose-explore]');
  await page.setViewportSize({ width: 320, height: 700 });
  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), 'Compact Explore should not overflow.');
  const actionBox = await page.locator('.music-picker-button').boundingBox();
  assert(actionBox && actionBox.height >= 44, 'Compact Discover action should meet a 44px target.');
  await page.close();

  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  watch(reduced);
  await reduced.goto(target);
  await reduced.locator('#discoveryChoice').waitFor({ state: 'visible' });
  await reduced.click('[data-listen-genre]');
  await reduced.locator('.genre-song').first().click();
  await reduced.waitForFunction(() => document.body.classList.contains('is-playing'));
  assert(await reduced.locator('.song-room-wave').getAttribute('data-signal-mode') === 'reduced', 'Reduced Motion should use a static truthful waveform.');
  await reduced.close();

  assert(errors.length === 0, `Discover browser errors: ${errors.join(' | ')}`);
  console.log('Discover and Explore regression passed.');
} finally {
  await browser.close();
}
