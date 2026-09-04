import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const executablePath = process.env.CHROMIUM_PATH || '/usr/local/bin/chromium';
const launchOptions = { headless: true, args: ['--no-sandbox'] };
if (existsSync(executablePath)) launchOptions.executablePath = executablePath;
const browser = await chromium.launch(launchOptions);
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const findings = [];
const browserErrors = [];
const add = (severity, area, message) => findings.push({ severity, area, message });
page.on('console', (message) => { if (message.type() === 'error') browserErrors.push(message.text()); });
page.on('pageerror', (error) => browserErrors.push(error.message));

const base = new URL(process.env.RONDO_URL || 'http://127.0.0.1:4173/index.html');
const skipUrl = new URL(base);
skipUrl.searchParams.set('skip-onboarding', '1');
const targetSelectors = [
  '#searchTrigger', '#profileTrigger', '#genreSelect', '#mobileDirectoryButton',
  '#playArtist', '#saveArtist', '#skipArtist', '#matchingMode', '#allMode',
  '.release-save', '.track-save', '#saveTrack', '.inspector-tabs button', '#lyricsCta',
  '#transportPlay', '#previousTrack', '#nextTrack', '#repeatMode', '#queueButton', '#openFullPlayer'
];

async function inspectCurrentLayout(label) {
  const result = await page.evaluate((selectors) => {
    const tinyText = [...document.querySelectorAll('body *')].filter((node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && node.childElementCount === 0 && node.textContent.trim() && parseFloat(style.fontSize) < 8;
    }).map((node) => ({ selector: node.id ? `#${node.id}` : `${node.tagName.toLowerCase()}.${node.className}`, size: getComputedStyle(node).fontSize, text: node.textContent.trim().slice(0, 40) }));
    const controls = [...document.querySelectorAll(selectors.join(','))].filter((node, index, all) => all.indexOf(node) === index).filter((node) => {
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < innerHeight && rect.left < innerWidth && getComputedStyle(node).visibility !== 'hidden';
    }).map((node) => {
      const rect = node.getBoundingClientRect();
      return { selector: node.id ? `#${node.id}` : `${node.tagName.toLowerCase()}.${node.className}`, width: Math.round(rect.width), height: Math.round(rect.height) };
    }).filter((item) => item.width < 44 || item.height < 44);
    return {
      horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
      tinyText,
      compactControls: controls
    };
  }, targetSelectors);
  if (result.horizontalOverflow > 0) add('high', 'responsive', `${label} has ${result.horizontalOverflow}px horizontal overflow.`);
  if (result.tinyText.length) add('low', 'readability', `${label} has text below 8px: ${result.tinyText.slice(0, 10).map((item) => `${item.selector} “${item.text}” ${item.size}`).join(', ')}`);
  if (result.compactControls.length) add('medium', 'targets', `${label} has undersized key controls: ${result.compactControls.map((item) => `${item.selector} ${item.width}×${item.height}`).join(', ')}`);
  return result;
}

try {
  await page.goto(base.href, { waitUntil: 'networkidle' });
  if (await page.locator('#onboardingOverlay').evaluate((node) => node.hidden)) add('high', 'first-run', 'A clean first visit skips required onboarding.');
  await page.waitForTimeout(40);
  if ((await page.evaluate(() => document.activeElement?.id)) !== 'draftName') add('medium', 'first-run', 'Required onboarding does not focus the first profile field.');
  await page.keyboard.press('Escape');
  await page.goto(skipUrl.href, { waitUntil: 'networkidle' });

  const semantics = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map((node) => node.id);
    const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    const unnamedButtons = [...document.querySelectorAll('button')].filter((button) => !button.getAttribute('aria-label') && !button.textContent.trim()).map((button) => button.id || button.outerHTML.slice(0, 80));
    const missingAlt = [...document.querySelectorAll('img')].filter((image) => !image.hasAttribute('alt')).map((image) => image.id || image.src);
    return {
      duplicateIds,
      unnamedButtons,
      missingAlt,
      fullPlayerRole: document.querySelector('#fullPlayer')?.getAttribute('role'),
      searchLabel: document.querySelector('#globalSearch')?.getAttribute('aria-label')
    };
  });
  if (semantics.duplicateIds.length) add('high', 'semantics', `Duplicate IDs: ${semantics.duplicateIds.join(', ')}`);
  if (semantics.unnamedButtons.length) add('high', 'semantics', `${semantics.unnamedButtons.length} unnamed buttons.`);
  if (semantics.missingAlt.length) add('medium', 'semantics', `${semantics.missingAlt.length} images are missing alt attributes.`);
  if (semantics.fullPlayerRole !== 'dialog') add('medium', 'semantics', 'Immersive player has no dialog semantics.');
  if (!semantics.searchLabel) add('medium', 'semantics', 'Global search field has no accessible label.');

  for (const viewport of [{ width: 320, height: 700 }, { width: 375, height: 812 }, { width: 390, height: 844 }, { width: 768, height: 900 }, { width: 1024, height: 768 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.reload({ waitUntil: 'networkidle' });
    await inspectCurrentLayout(`${viewport.width}px Discover`);
    for (const view of ['library', 'profile']) {
      await page.locator(`[data-view="${view}"]`).evaluate((button) => button.click());
      await inspectCurrentLayout(`${viewport.width}px ${view}`);
      if (view === 'library' && await page.locator('.empty-library-features li').count() !== 3) add('medium', 'library', `Empty Library is incomplete at ${viewport.width}px.`);
      if (view === 'profile' && await page.locator('.profile-metric').count() !== 3) add('medium', 'profile', `Profile metrics are incomplete at ${viewport.width}px.`);
      await page.locator('[data-view="discover"]').evaluate((button) => button.click());
    }
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload({ waitUntil: 'networkidle' });
  const genreIds = await page.locator('#genreSelect option').evaluateAll((options) => options.map((option) => option.value));
  for (const genreId of genreIds) {
    await page.selectOption('#genreSelect', genreId);
    const artistCount = await page.locator('.artist-list-item').count();
    const trackCount = await page.locator('.track-row').count();
    if (!artistCount || !trackCount) add('high', 'catalog', `${genreId} renders ${artistCount} artists and ${trackCount} tracks.`);
  }

  await page.selectOption('#genreSelect', 'hiphop');
  await page.click('#searchTrigger');
  await page.fill('#globalSearch', 'Signal Memory');
  await page.locator('[data-result-type="release"]').first().click();
  const releaseTrack = (await page.locator('#barTitle').innerText()).trim();
  if (releaseTrack !== 'Afterimage') add('high', 'search', `Opening Signal Memory starts “${releaseTrack}” instead of that release.`);

  await page.click('#openFullPlayer');
  await page.waitForTimeout(30);
  if ((await page.evaluate(() => document.activeElement?.id)) !== 'closeFullPlayer') add('medium', 'keyboard', 'Immersive player does not focus its close control.');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(40);
  if ((await page.evaluate(() => document.activeElement?.id)) !== 'openFullPlayer') add('medium', 'keyboard', 'Immersive player does not return focus to its opener.');

  await page.click('#saveTrack');
  const savedTrackId = await page.locator('.track-row.active').getAttribute('data-track');
  await page.reload({ waitUntil: 'networkidle' });
  const savedIds = await page.evaluate(() => JSON.parse(localStorage.getItem('rondo-prototype-v2') || '{}').savedTracks || []);
  if (!savedIds.includes(savedTrackId)) add('high', 'persistence', 'Saved track did not survive reload.');

  await page.click('#profileTrigger');
  await page.fill('#draftName', 'Quality Test');
  await page.fill('#draftEmail', 'quality@example.com');
  await page.click('#onboardingNext');
  await page.click('[data-genre-choice="rnb"]');
  await page.click('[data-genre-choice="electronic"]');
  await page.click('#onboardingNext');
  if (await page.locator('[data-genre-choice]').count() === 0) add('high', 'onboarding', 'Genre minimum validation allowed fewer than three choices.');
  await page.click('[data-genre-choice="rnb"]');
  await page.click('[data-genre-choice="electronic"]');
  await page.click('[data-genre-choice="rock"]');
  await page.click('#onboardingNext');
  await page.click('[data-seed="kairo-vale"]');
  await page.click('#onboardingNext');
  if (await page.locator('[data-seed]').count() === 0) add('high', 'onboarding', 'Artist minimum validation allowed fewer than two seed artists.');
  await page.click('[data-seed="kairo-vale"]');
  await page.click('#onboardingNext');
  await page.click('#onboardingNext');
  const savedProfile = await page.evaluate(() => JSON.parse(localStorage.getItem('rondo-prototype-v2') || '{}').profile);
  if (savedProfile?.displayName !== 'Quality Test' || savedProfile?.email !== 'quality@example.com') add('high', 'onboarding', 'Completed profile did not persist all account fields.');
  if ((await page.locator('#profileTrigger').innerText()).trim() !== 'Q') add('medium', 'onboarding', 'Profile avatar did not update after setup.');

  await page.click('[data-view="profile"]');
  const profileText = await page.locator('#viewSurface').innerText();
  if (!profileText.includes('Quality Test')) add('high', 'profile', 'Profile view did not reflect completed onboarding.');
  if (!profileText.includes('Rock')) add('high', 'profile', 'Profile mislabeled an onboarding-only genre.');
  if (await page.locator('.profile-metric').count() !== 3 || await page.locator('.profile-seed').count() < 2) add('medium', 'profile', 'Profile omitted taste metrics or seed artists.');

  await page.click('[data-view="discover"]');
  await page.click('#searchTrigger');
  await page.keyboard.press('Escape');
  if ((await page.evaluate(() => document.activeElement?.id)) !== 'searchTrigger') add('medium', 'keyboard', 'Search does not return focus to its opener.');
  await page.locator('.artist-focus').click({ position: { x: 4, y: 4 } });
  await page.keyboard.press('/');
  await page.waitForTimeout(40);
  if ((await page.evaluate(() => document.activeElement?.id)) !== 'globalSearch') add('medium', 'keyboard', 'Search does not receive focus when opened from the keyboard.');
  await page.keyboard.press('Escape');

  if (browserErrors.length) add('high', 'runtime', browserErrors.join(' | '));
  const blocking = findings.filter((finding) => finding.severity === 'high' || finding.severity === 'medium');
  console.log(JSON.stringify({ checkedAt: new Date().toISOString(), findings, metadata: { genreCount: genreIds.length, browserErrors } }, null, 2));
  if (blocking.length) process.exitCode = 1;
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await page.close();
  await browser.close();
}
