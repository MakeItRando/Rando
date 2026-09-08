import { existsSync } from 'node:fs';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const baseTarget = process.env.RONDO_URL || pathToFileURL(resolve('preview-test.html')).href;
const target = `${baseTarget}${baseTarget.includes('?') ? '&' : '?'}skip-onboarding=1&screen=journey`;
const executablePath = process.env.CHROMIUM_PATH || '/usr/local/bin/chromium';
const launchOptions = { headless: true, args: ['--no-sandbox'] };
if (existsSync(executablePath)) launchOptions.executablePath = executablePath;
const browser = await chromium.launch(launchOptions);
const browserErrors = [];
const watch = (page) => {
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') browserErrors.push(message.text()); });
};

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watch(desktop);
  await desktop.goto(target);
  await desktop.evaluate(() => localStorage.clear());
  await desktop.reload();

  const timeline = desktop.locator('#timeline');
  assert(await timeline.getAttribute('role') === 'slider', 'Main progress should expose slider semantics.');
  assert((await timeline.getAttribute('aria-valuetext'))?.includes(' of '), 'Progress should expose readable elapsed and duration.');
  await timeline.focus();
  await desktop.keyboard.press('End');
  assert(await timeline.getAttribute('aria-valuenow') === await timeline.getAttribute('aria-valuemax'), 'End should seek to the duration.');
  await desktop.keyboard.press('Home');
  assert(await timeline.getAttribute('aria-valuenow') === '0', 'Home should seek to the beginning.');
  await desktop.keyboard.press('ArrowRight');
  assert(Number(await timeline.getAttribute('aria-valuenow')) >= 4, 'ArrowRight should advance progress.');

  const firstRow = desktop.locator('.track-row').first();
  assert(await firstRow.getAttribute('role') === null, 'Catalog rows should not impersonate buttons.');
  assert(await firstRow.locator('button button').count() === 0, 'Catalog rows must not nest controls.');
  assert(await firstRow.locator('.track-play').evaluate((element) => element.tagName) === 'BUTTON', 'Every track should expose a play button.');

  await desktop.click('#searchTrigger');
  await desktop.fill('#globalSearch', 'Asha North');
  await desktop.locator('[data-result-type="artist"]').first().click();
  assert(await desktop.locator('body').getAttribute('data-view') === 'journeys', 'Artist search should enter Journeys.');
  assert((await desktop.locator('#artistName').textContent()).trim() === 'Asha North', 'Search should open the selected artist.');

  await desktop.click('#openFullPlayer');
  assert(await desktop.locator('#appShell').evaluate((element) => element.inert), 'Song Room should make the background inert.');
  await desktop.keyboard.press('/');
  assert(await desktop.locator('#searchOverlay').isHidden(), 'Search must not stack under Song Room.');
  await desktop.keyboard.press('Escape');
  assert(!(await desktop.locator('#appShell').evaluate((element) => element.inert)), 'Closing Song Room should restore the app.');

  await desktop.click('.rail-button[data-view="discover"]');
  await desktop.locator('#discoveryChoice').waitFor({ state: 'visible' });
  assert(await desktop.locator('#discoveryChoice').isVisible(), 'Entering Discover should open its chooser.');
  assert(await desktop.locator('#appShell').evaluate((element) => element.inert), 'Discover chooser should make the background inert.');
  await desktop.keyboard.press('Escape');
  assert(!(await desktop.locator('#appShell').evaluate((element) => element.inert)), 'Closing the Discover chooser should restore the app.');

  await desktop.click('#profileTrigger');
  assert(await desktop.locator('#appShell').evaluate((element) => element.inert), 'Onboarding should make the background inert.');
  await desktop.fill('#draftName', 'Release Test');
  await desktop.fill('#draftEmail', 'release@example.com');
  await desktop.click('#onboardingNext');
  await desktop.waitForFunction(() => document.activeElement?.hasAttribute('data-genre-choice'));
  const focused = await desktop.evaluate(() => document.activeElement?.getAttribute('data-genre-choice'));
  const choice = desktop.locator(`[data-genre-choice="${focused}"]`);
  const before = await choice.getAttribute('aria-pressed');
  await choice.click();
  assert(await choice.getAttribute('aria-pressed') !== before, 'Genre choices should expose pressed state.');
  await desktop.keyboard.press('Escape');

  await desktop.click('.rail-button[data-view="journeys"]');
  await desktop.click('#allMode');
  await desktop.locator('.track-play').last().click();
  await desktop.click('#openFullPlayer');
  assert(await desktop.locator('body').evaluate((element) => element.classList.contains('is-playing')), 'Selecting the last track should start playback.');
  await desktop.click('#fullNext');
  assert(await desktop.locator('#completionOverlay').isVisible(), 'Next from the final track should open completion.');
  assert(await desktop.locator('#fullPlayer').isHidden(), 'Completion should replace Song Room.');
  assert(!(await desktop.locator('body').evaluate((element) => element.classList.contains('is-playing'))), 'Completion should stop playback.');
  await desktop.click('#closeCompletion');
  await desktop.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  watch(mobile);
  await mobile.goto(target);
  await mobile.evaluate(() => localStorage.clear());
  await mobile.reload();
  const nav = mobile.locator('#mobilePrimaryNav');
  assert(await nav.isVisible(), 'Mobile primary navigation should be visible.');
  assert(await mobile.locator('[data-mobile-view]').count() === 4, 'Mobile should expose four destinations.');
  const targets = await mobile.locator('[data-mobile-view]').evaluateAll((buttons) => buttons.map((button) => { const rect = button.getBoundingClientRect(); return { width: rect.width, height: rect.height }; }));
  assert(targets.every(({ width, height }) => width >= 44 && height >= 44), 'Mobile destinations should meet 44px targets.');

  await mobile.click('[data-mobile-view="discover"]');
  await mobile.locator('#discoveryChoice').waitFor({ state: 'visible' });
  assert(await mobile.locator('#discoveryChoice').isVisible(), 'Mobile Discover should open the chooser.');
  await mobile.click('[data-choose-explore]');
  assert(await mobile.locator('.music-explore').isVisible(), 'Mobile Explore should be reachable.');
  await mobile.click('[data-mobile-view="library"]');
  assert(await mobile.locator('.empty-library').isVisible(), 'Mobile Library should be reachable.');
  await mobile.click('[data-mobile-view="profile"]');
  assert(await mobile.locator('.profile-summary').isVisible(), 'Mobile Profile should be reachable.');
  await mobile.click('[data-mobile-view="journeys"]');
  assert(await mobile.locator('#mobileDirectoryButton').isVisible(), 'Artist directory trigger should appear in Journeys.');

  await mobile.click('#mobileDirectoryButton');
  assert(await mobile.locator('#directoryScrim').isVisible(), 'Mobile directory should show a dismissible scrim.');
  assert(await mobile.evaluate(() => document.activeElement?.id) === 'closeDirectory', 'Directory should focus its close control.');
  await mobile.click('#directoryScrim');
  assert(await mobile.evaluate(() => document.activeElement?.id) === 'mobileDirectoryButton', 'Dismissing directory should restore focus.');

  await mobile.click('#mobileTrack');
  await mobile.click('.song-room-mobile-nav [data-song-room-mode="lyrics"]');
  for (const control of ['#fullPrevious', '#fullNext']) {
    const box = await mobile.locator(control).boundingBox();
    assert(box && box.width >= 44 && box.height >= 44, `${control} should meet a 44px mobile target.`);
  }
  await mobile.keyboard.press('Escape');
  await mobile.setViewportSize({ width: 320, height: 700 });
  const layout = await mobile.evaluate(() => {
    const workspace = document.querySelector('.workspace').getBoundingClientRect();
    const navigation = document.querySelector('#mobilePrimaryNav').getBoundingClientRect();
    const transport = document.querySelector('.transport').getBoundingClientRect();
    return {
      noOverflow: document.documentElement.scrollWidth <= innerWidth + 1,
      workspaceBeforeNavigation: workspace.bottom <= navigation.top + 1,
      navigationBeforeTransport: navigation.bottom <= transport.top + 1
    };
  });
  assert(layout.noOverflow, 'Compact mobile should not overflow.');
  assert(layout.workspaceBeforeNavigation && layout.navigationBeforeTransport, 'Mobile content, navigation, and player should occupy separate rows.');
  await mobile.close();

  const unavailable = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await unavailable.route('**/*.mp3', (route) => route.abort());
  await unavailable.goto(target);
  await unavailable.click('#transportPlay');
  await unavailable.waitForTimeout(250);
  assert(await unavailable.locator('body').evaluate((element) => element.classList.contains('is-playing')), 'Unavailable audio should fall back to the demo timeline.');
  assert((await unavailable.locator('#toast').textContent()).includes('Audio unavailable'), 'Unavailable audio should explain the fallback.');
  await unavailable.close();

  assert(browserErrors.length === 0, `Browser errors: ${browserErrors.join(' | ')}`);
  console.log('Rondo release-readiness regression passed.');
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
