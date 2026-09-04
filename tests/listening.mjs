import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const baseTarget = process.env.RONDO_URL || pathToFileURL(resolve('preview-test.html')).href;
const target = `${baseTarget}${baseTarget.includes('?') ? '&' : '?'}skip-onboarding=1`;
const executablePath = process.env.CHROMIUM_PATH || '/usr/local/bin/chromium';
const browser = await chromium.launch({ headless: true, executablePath });
const assert = (condition, message) => { if (!condition) throw new Error(message); };

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(target);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  assert(await page.locator('html').getAttribute('data-theme') === 'dark', 'Night appearance should be the default.');
  assert((await page.locator('#themeToggle').getAttribute('aria-label')).toLowerCase().includes('light'), 'Theme toggle should describe the next appearance.');
  await page.click('#themeToggle');
  assert(await page.locator('html').getAttribute('data-theme') === 'light', 'Theme toggle should switch to light.');
  await page.click('#themeToggle');
  await page.click('#transportPlay');
  assert(await page.locator('body').evaluate((el) => el.classList.contains('is-playing')), 'Playback state should be visible.');
  assert(await page.locator('body').evaluate((el) => el.classList.contains('journey-collapsed')), 'Genre Journey should collapse when playback starts.');
  await page.click('#journeyToggle');
  assert(!(await page.locator('body').evaluate((el) => el.classList.contains('journey-collapsed'))), 'Listeners should be able to reopen Genre Journey during playback.');
  await page.click('#queueButton');
  assert(await page.locator('#queueDrawer').isVisible(), 'Up Next drawer should open.');
  assert(await page.locator('.queue-item').count() > 1, 'Up Next should render the artist queue.');
  await page.locator('.queue-item').nth(1).click();
  assert(await page.locator('.queue-item.active').count() === 1, 'Selecting a queued track should update the current item.');
  await page.click('#closeQueue');
  await page.click('#openFullPlayer');
  assert(await page.locator('#fullPlayer').isVisible(), 'Immersive player should open.');
  assert((await page.locator('#fullAudioMeta').textContent()).includes('BPM'), 'Immersive player should show audio metadata.');
  await page.click('#fullJourney');
  assert(await page.locator('#fullPlayer').isHidden(), 'Journey action should close the immersive player.');

  const paletteSignals = {};
  for (const genre of ['hiphop', 'rnb', 'electronic', 'jazz']) {
    await page.selectOption('#genreSelect', genre);
    paletteSignals[genre] = await page.locator('html').evaluate((el) => getComputedStyle(el).getPropertyValue('--genre-accent').trim());
  }
  assert(new Set(Object.values(paletteSignals)).size === 4, 'All four genres should have distinct ambience signals.');
  await page.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(target);
  await mobile.click('#transportPlay');
  const closed = await mobile.locator('#directory').evaluate((el) => {
    const style = getComputedStyle(el);
    return { position: style.position, transform: style.transform, left: el.getBoundingClientRect().left, width: el.getBoundingClientRect().width };
  });
  assert(closed.position === 'fixed', 'Mobile Genre Journey must stay fixed off-canvas.');
  assert(closed.left + closed.width <= 2, 'Mobile Genre Journey should be off-canvas during playback.');
  await mobile.click('#mobileDirectoryButton');
  await mobile.waitForTimeout(260);
  const openLeft = await mobile.locator('#directory').evaluate((el) => el.getBoundingClientRect().left);
  assert(Math.abs(openLeft) < 2, 'Mobile Genre Journey should reopen without stopping playback.');
  assert(await mobile.locator('body').evaluate((el) => el.classList.contains('is-playing')), 'Reopening the journey must not stop playback.');
  await mobile.click('#closeDirectory');
  await mobile.close();
  console.log('Immersive listening test passed.');
} finally {
  await browser.close();
}
