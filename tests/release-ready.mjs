import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const baseTarget = process.env.RONDO_URL || pathToFileURL(resolve('preview-test.html')).href;
const target = `${baseTarget}${baseTarget.includes('?') ? '&' : '?'}skip-onboarding=1`;
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || '/usr/local/bin/chromium' });
const browserErrors = [];
const watchErrors = (page) => {
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') browserErrors.push(message.text()); });
};
const contrastFor = (locator) => locator.evaluate((element) => {
  const parse = (value) => {
    const values = value.match(/[\d.]+/g)?.map(Number) || [0, 0, 0, 0];
    return { r: values[0], g: values[1], b: values[2], a: values.length > 3 ? values[3] : 1 };
  };
  const composite = (top, bottom) => {
    const a = top.a + bottom.a * (1 - top.a);
    return a ? {
      r: (top.r * top.a + bottom.r * bottom.a * (1 - top.a)) / a,
      g: (top.g * top.a + bottom.g * bottom.a * (1 - top.a)) / a,
      b: (top.b * top.a + bottom.b * bottom.a * (1 - top.a)) / a,
      a
    } : { r: 0, g: 0, b: 0, a: 0 };
  };
  const chain = [];
  for (let node = element; node; node = node.parentElement) chain.unshift(node);
  let background = { r: 255, g: 255, b: 255, a: 1 };
  for (const node of chain) background = composite(parse(getComputedStyle(node).backgroundColor), background);
  const foreground = composite(parse(getComputedStyle(element).color), background);
  const luminance = ({ r, g, b }) => [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= .03928 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
  }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + .05) / (dark + .05);
});

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watchErrors(desktop);
  await desktop.goto(target);
  await desktop.evaluate(() => localStorage.clear());
  await desktop.reload();

  const mainTimeline = desktop.locator('#timeline');
  assert(await mainTimeline.getAttribute('role') === 'slider', 'Main progress control should expose slider semantics.');
  assert((await mainTimeline.getAttribute('aria-valuetext'))?.includes(' of '), 'Main progress should expose readable elapsed and duration text.');
  await mainTimeline.focus();
  await desktop.keyboard.press('End');
  assert(await mainTimeline.getAttribute('aria-valuenow') === await mainTimeline.getAttribute('aria-valuemax'), 'End should seek main progress to the track duration.');
  await desktop.keyboard.press('Home');
  assert(await mainTimeline.getAttribute('aria-valuenow') === '0', 'Home should seek main progress to the beginning.');
  await desktop.keyboard.press('ArrowRight');
  assert(Number(await mainTimeline.getAttribute('aria-valuenow')) >= 4, 'ArrowRight should advance main progress by about five seconds.');

  const firstTrackRow = desktop.locator('.track-row').first();
  assert(await firstTrackRow.getAttribute('role') === null, 'Catalog rows should not impersonate buttons around nested controls.');
  assert(await firstTrackRow.locator('button button').count() === 0, 'Catalog rows must not nest interactive buttons.');
  assert(await firstTrackRow.locator('.track-play').evaluate((element) => element.tagName) === 'BUTTON', 'Every catalog row should expose a dedicated play button.');

  await desktop.click('.rail-button[data-view="library"]');
  assert((await desktop.locator('#locationSection').textContent()).trim() === 'LIBRARY', 'Library should update the desktop location trail.');
  await desktop.click('#searchTrigger');
  await desktop.fill('#globalSearch', 'Asha North');
  await desktop.locator('[data-result-type="artist"]').first().click();
  assert(await desktop.locator('body').getAttribute('data-view') === 'discover', 'Opening a search result from Library should return to Discover.');
  assert((await desktop.locator('#artistName').textContent()).trim() === 'Asha North', 'Search should open the selected artist.');
  assert((await desktop.locator('#locationSection').textContent()).trim() === 'DISCOVER', 'Search navigation should restore the Discover location trail.');

  await desktop.click('#openFullPlayer');
  assert(await desktop.locator('#appShell').evaluate((element) => element.inert), 'Opening Song Room should make the app background inert.');
  await desktop.keyboard.press('/');
  assert(await desktop.locator('#searchOverlay').isHidden(), 'The search shortcut must not stack Search beneath Song Room.');
  await desktop.keyboard.press('Escape');
  assert(!(await desktop.locator('#appShell').evaluate((element) => element.inert)), 'Closing Song Room should restore the app background.');

  await desktop.click('#profileTrigger');
  assert(await desktop.locator('#appShell').evaluate((element) => element.inert), 'Onboarding should make the app background inert.');
  await desktop.keyboard.press('/');
  assert(await desktop.locator('#searchOverlay').isHidden(), 'The search shortcut must not stack Search beneath onboarding.');
  await desktop.fill('#draftName', 'Release Test');
  await desktop.fill('#draftEmail', 'release@example.com');
  await desktop.click('#onboardingNext');
  await desktop.waitForFunction(() => document.activeElement?.hasAttribute('data-genre-choice'));
  const focusedChoice = await desktop.evaluate(() => document.activeElement?.getAttribute('data-genre-choice'));
  assert(Boolean(focusedChoice), 'Advancing onboarding should focus the first control in the new step.');
  const choice = desktop.locator(`[data-genre-choice="${focusedChoice}"]`);
  const beforePressed = await choice.getAttribute('aria-pressed');
  await choice.click();
  await desktop.waitForFunction((expected) => document.activeElement?.getAttribute('data-genre-choice') === expected, focusedChoice);
  assert(await desktop.locator(`[data-genre-choice="${focusedChoice}"]`).getAttribute('aria-pressed') !== beforePressed, 'Genre choices should expose their pressed state.');
  await desktop.keyboard.press('Escape');

  await desktop.click('.rail-button[data-view="discover"]');
  await desktop.click('#allMode');
  await desktop.locator('.track-play').last().click();
  await desktop.click('#openFullPlayer');
  assert(await desktop.locator('body').evaluate((element) => element.classList.contains('is-playing')), 'Selecting the last track should start playback before completion.');
  await desktop.click('#fullNext');
  assert(await desktop.locator('#completionOverlay').isVisible(), 'Next from the final Song Room track should open completion.');
  assert(await desktop.locator('#fullPlayer').isHidden(), 'Completion should replace, not sit beneath, Song Room.');
  assert(!(await desktop.locator('body').evaluate((element) => element.classList.contains('is-playing'))), 'Completion should stop playback at the final track.');
  assert(await desktop.locator('#appShell').evaluate((element) => element.inert), 'Completion should keep the app background inert.');
  await desktop.keyboard.press('/');
  assert(await desktop.locator('#searchOverlay').isHidden(), 'The search shortcut must not stack Search beneath completion.');
  await desktop.click('#closeCompletion');
  assert(!(await desktop.locator('#appShell').evaluate((element) => element.inert)), 'Closing completion should restore the app background.');
  await desktop.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  watchErrors(mobile);
  await mobile.goto(target);
  await mobile.evaluate(() => localStorage.clear());
  await mobile.reload();

  const mobileNav = mobile.locator('#mobilePrimaryNav');
  assert(await mobileNav.isVisible(), 'Primary navigation should be visible on mobile.');
  assert(await mobile.locator('[data-mobile-view]').count() === 4, 'Mobile should expose all four primary destinations.');
  const mobileTargets = await mobile.locator('[data-mobile-view]').evaluateAll((buttons) => buttons.map((button) => {
    const rect = button.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }));
  assert(mobileTargets.every(({ width, height }) => width >= 44 && height >= 44), 'Every mobile navigation destination should meet a 44px target.');

  for (const view of ['library', 'journeys', 'profile']) {
    await mobile.click(`[data-mobile-view="${view}"]`);
    assert(await mobile.locator('body').getAttribute('data-view') === view, `Mobile ${view} navigation should open its destination.`);
    assert(await mobileNav.isVisible(), `Mobile navigation should remain reachable in ${view}.`);
    assert(await mobile.locator('#mobileDirectoryButton').isHidden(), `Artist directory trigger should not appear in ${view}.`);
    if (view === 'library') {
      const title = await mobile.locator('.view-surface-head h1').boundingBox();
      const summary = await mobile.locator('.view-surface-head > p').boundingBox();
      assert(title && summary && title.y + title.height <= summary.y + 1, 'Mobile Library title and collection totals should not overlap.');
      assert(await contrastFor(mobile.locator('.empty-library-copy p')) >= 4.5, 'Empty Library guidance should meet normal-text contrast.');
      const discoveryTarget = await mobile.locator('.empty-library-copy [data-return-discover]').boundingBox();
      assert(discoveryTarget && discoveryTarget.width >= 44 && discoveryTarget.height >= 44, 'Empty Library discovery action should meet a 44px mobile target.');
    }
  }
  await mobile.click('[data-mobile-view="discover"]');
  assert(await mobile.locator('#mobileDirectoryButton').isVisible(), 'Artist directory trigger should return in Discover.');

  await mobile.click('#mobileDirectoryButton');
  assert(await mobile.locator('#directoryScrim').isVisible(), 'Opening the mobile directory should show a dismissible scrim.');
  assert(await mobile.locator('.topbar').evaluate((element) => element.inert), 'Mobile directory should make the top bar inert.');
  assert(await mobileNav.evaluate((element) => element.inert), 'Mobile directory should make primary navigation inert.');
  assert(await mobile.evaluate(() => document.activeElement?.id) === 'closeDirectory', 'Mobile directory should move focus to its close control.');
  await mobile.click('#directoryScrim');
  assert(!(await mobile.locator('#directory').evaluate((element) => element.classList.contains('open'))), 'Tapping outside the mobile directory should dismiss it.');
  assert(await mobile.evaluate(() => document.activeElement?.id) === 'mobileDirectoryButton', 'Dismissing the mobile directory should return focus to its trigger.');
  await mobile.click('#mobileDirectoryButton');
  await mobile.setViewportSize({ width: 1200, height: 820 });
  await mobile.waitForTimeout(60);
  assert(!(await mobile.locator('#directory').evaluate((element) => element.classList.contains('open'))), 'Crossing to desktop should close the mobile drawer state.');
  assert(await mobile.locator('#directoryScrim').isHidden(), 'Crossing to desktop should dismiss the mobile scrim.');
  await mobile.setViewportSize({ width: 390, height: 844 });
  await mobile.waitForTimeout(60);
  assert(await mobile.locator('#directory').getAttribute('aria-hidden') === 'true', 'Returning to mobile should keep the directory closed.');

  await mobile.click('#mobileTrack');
  await mobile.click('.song-room-mobile-nav [data-song-room-mode="lyrics"]');
  assert(await contrastFor(mobile.locator('.song-room-lyric-list button:not(.active)').first()) >= 3, 'Inactive large lyric lines should remain readable.');
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
      noDocumentOverflow: document.documentElement.scrollWidth <= innerWidth + 1,
      workspaceBeforeNavigation: workspace.bottom <= navigation.top + 1,
      navigationBeforeTransport: navigation.bottom <= transport.top + 1
    };
  });
  assert(layout.noDocumentOverflow, 'Compact mobile should not overflow horizontally.');
  assert(layout.workspaceBeforeNavigation && layout.navigationBeforeTransport, 'Mobile content, navigation, and player should occupy separate rows without overlap.');
  await mobile.close();

  const unavailable = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await unavailable.route('**/*.mp3', (route) => route.abort());
  await unavailable.goto(target);
  await unavailable.evaluate(() => localStorage.clear());
  await unavailable.reload();
  await unavailable.click('#transportPlay');
  await unavailable.waitForTimeout(250);
  assert(await unavailable.locator('body').evaluate((element) => element.classList.contains('is-playing')), 'Unavailable audio should fall back to the demo timeline without stopping playback UX.');
  assert((await unavailable.locator('#toast').textContent()).includes('Audio unavailable'), 'Unavailable audio should explain the timeline fallback.');
  await unavailable.close();

  assert(browserErrors.length === 0, `Browser errors: ${browserErrors.join(' | ')}`);
  console.log('Rondo release-readiness regression passed.');
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
