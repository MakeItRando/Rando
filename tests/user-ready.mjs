import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const target = process.env.RONDO_URL || `${pathToFileURL(resolve('preview-test.html')).href}?skip-onboarding=1`;
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || '/usr/local/bin/chromium' });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const browserErrors = [];
page.on('pageerror', (error) => browserErrors.push(error.message));
page.on('console', (message) => { if (message.type() === 'error') browserErrors.push(message.text()); });

try {
  const url = `${target}${target.includes('?') ? '&' : '?'}skip-onboarding=1`;
  await page.goto(url);
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const directory = page.locator('#directory');
  const directoryButton = page.locator('#mobileDirectoryButton');
  assert(await directory.getAttribute('aria-hidden') === 'true', 'Closed mobile journey should be hidden from assistive technology.');
  assert(await directory.evaluate((element) => element.inert), 'Closed mobile journey should be inert.');
  assert(await directoryButton.getAttribute('aria-expanded') === 'false', 'Closed mobile journey trigger should report collapsed.');

  await directoryButton.click();
  await page.waitForTimeout(40);
  assert(await directory.getAttribute('aria-hidden') === 'false', 'Open mobile journey should be available to assistive technology.');
  assert(!(await directory.evaluate((element) => element.inert)), 'Open mobile journey should not be inert.');
  assert(await directoryButton.getAttribute('aria-expanded') === 'true', 'Open mobile journey trigger should report expanded.');
  assert(await page.evaluate(() => document.activeElement?.id) === 'closeDirectory', 'Opening the mobile journey should focus its close control.');

  await page.click('#closeDirectory');
  assert(await directory.getAttribute('aria-hidden') === 'true', 'Closing the mobile journey should restore aria-hidden.');
  assert(await directory.evaluate((element) => element.inert), 'Closing the mobile journey should restore inert.');
  assert(await page.evaluate(() => document.activeElement?.id) === 'mobileDirectoryButton', 'Closing the mobile journey should restore trigger focus.');

  await page.click('#mobileTrack');
  await page.waitForTimeout(60);
  assert(await page.locator('#fullPlayer').isVisible(), 'Mobile Song Room should open.');
  assert(await page.locator('#fullPlayer').getAttribute('data-mode') === 'room', 'Mobile Song Room should open on Room.');
  assert(await page.locator('.song-room-mobile-nav [data-song-room-mode="room"]').getAttribute('aria-current') === 'page', 'Room should expose the current mobile destination.');
  assert(await page.locator('#closeFullPlayer').isVisible(), 'Mobile Song Room must expose a close control.');
  assert(await page.evaluate(() => document.activeElement?.id) === 'closeFullPlayer', 'Opening Song Room should focus its close control.');
  assert(await page.locator('#fullPrevious').isVisible(), 'Previous-track control should be visible on mobile.');
  assert(await page.locator('#fullNext').isVisible(), 'Next-track control should be visible on mobile.');

  const slider = page.locator('#fullTimeline');
  const previousPosition = Number(await slider.getAttribute('aria-valuenow'));
  assert((await slider.getAttribute('aria-valuetext'))?.includes(' of '), 'Song progress should expose readable elapsed and duration text.');
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  const nextPosition = Number(await slider.getAttribute('aria-valuenow'));
  assert(nextPosition >= previousPosition + 4, 'Song progress should support keyboard seeking.');

  const story = page.locator('.song-room-mobile-nav [data-song-room-mode="story"]');
  await story.focus();
  await page.keyboard.press('ArrowRight');
  assert(await page.locator('#fullPlayer').getAttribute('data-mode') === 'credits', 'Arrow navigation should move between Song Room modes.');
  assert(await page.locator('.song-room-mobile-nav [data-song-room-mode="credits"]').getAttribute('aria-current') === 'page', 'Keyboard-selected mode should expose aria-current.');
  await page.keyboard.press('Home');
  assert(await page.locator('#fullPlayer').getAttribute('data-mode') === 'room', 'Home should return to the first Song Room mode.');

  await page.click('#closeFullPlayer');
  assert(await page.locator('#fullPlayer').isHidden(), 'Mobile Song Room should close from its visible control.');
  assert(await page.evaluate(() => document.activeElement?.id) === 'mobileTrack', 'Closing Song Room should restore focus to the mobile track trigger.');

  await directoryButton.click();
  await page.keyboard.press('Escape');
  assert(await directory.getAttribute('aria-hidden') === 'true', 'Escape should close and hide the mobile journey.');
  assert(await directory.evaluate((element) => element.inert), 'Escape should make the mobile journey inert.');
  assert(await page.evaluate(() => document.activeElement?.id) === 'mobileDirectoryButton', 'Escape should restore focus to the mobile journey trigger.');

  await page.setViewportSize({ width: 1200, height: 820 });
  await page.waitForTimeout(40);
  assert(!(await directory.evaluate((element) => element.inert)), 'Desktop journey should become interactive after resizing.');
  assert(await directory.getAttribute('aria-hidden') === 'false', 'Desktop journey should be exposed after resizing.');
  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)), 'User-test layout should not overflow horizontally.');
  assert(browserErrors.length === 0, `Browser errors: ${browserErrors.join(' | ')}`);

  console.log('Rondo user-ready interaction test passed.');
  await page.close();
  process.exit(0);
} catch (error) {
  console.error(error.stack || error.message);
  await page.close();
  process.exit(1);
}
