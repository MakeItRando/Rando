import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const output = '.qa-output/screens';
mkdirSync(output, { recursive: true });
const base = new URL(process.env.RONDO_URL || 'file:///tmp/preview-test.html');
const executablePath = process.env.CHROMIUM_PATH;
const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
const report = { checkedAt: new Date().toISOString(), states: [], browserErrors: [], failures: [] };

function urlFor(params = {}) {
  const url = new URL(base.href);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return url.href;
}

function observe(page, label) {
  page.on('pageerror', (error) => report.browserErrors.push(`${label}: ${error.message}`));
  page.on('console', (message) => { if (message.type() === 'error') report.browserErrors.push(`${label}: ${message.text()}`); });
}

async function cleanLoad(page, params = { 'skip-onboarding': '1' }) {
  await page.goto(urlFor(params), { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.goto(urlFor(params), { waitUntil: 'networkidle' });
  await page.waitForTimeout(120);
}

async function audit(page, name, expectations = []) {
  await page.waitForTimeout(100);
  const diagnostic = await page.evaluate(() => {
    const visible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < innerHeight && rect.left < innerWidth;
    };
    const ids = [...document.querySelectorAll('[id]')].map((element) => element.id);
    const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    const brokenImages = [...document.images].filter((image) => visible(image) && (!image.complete || image.naturalWidth === 0)).map((image) => image.id || image.getAttribute('src'));
    const unnamedButtons = [...document.querySelectorAll('button')].filter((button) => visible(button) && !button.textContent.trim() && !button.getAttribute('aria-label')).map((button) => button.id || button.outerHTML.slice(0, 90));
    const clippedControls = [...document.querySelectorAll('button, input, select, textarea, a[href]')].filter(visible).map((element) => {
      const rect = element.getBoundingClientRect();
      return { id: element.id || element.getAttribute('aria-label') || element.textContent.trim().slice(0, 24), left: Math.round(rect.left), top: Math.round(rect.top), right: Math.round(rect.right), bottom: Math.round(rect.bottom), width: Math.round(rect.width), height: Math.round(rect.height) };
    }).filter((item) => item.left < -1 || item.top < -1 || item.right > innerWidth + 1 || item.bottom > innerHeight + 1);
    return {
      viewport: { width: innerWidth, height: innerHeight },
      documentSize: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
      horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      duplicateIds,
      brokenImages,
      unnamedButtons,
      clippedControls
    };
  });
  const expectationResults = {};
  for (const selector of expectations) expectationResults[selector] = await page.locator(selector).isVisible().catch(() => false);
  const file = `${output}/${name}.png`;
  await page.screenshot({ path: file, animations: 'disabled' });
  const state = { name, file, diagnostic, expectations: expectationResults };
  report.states.push(state);
  if (diagnostic.horizontalOverflow > 1) report.failures.push(`${name}: ${diagnostic.horizontalOverflow}px horizontal overflow`);
  if (diagnostic.duplicateIds.length) report.failures.push(`${name}: duplicate IDs ${diagnostic.duplicateIds.join(', ')}`);
  if (diagnostic.brokenImages.length) report.failures.push(`${name}: broken images ${diagnostic.brokenImages.join(', ')}`);
  if (diagnostic.unnamedButtons.length) report.failures.push(`${name}: unnamed buttons ${diagnostic.unnamedButtons.join(', ')}`);
  const missing = Object.entries(expectationResults).filter(([, shown]) => !shown).map(([selector]) => selector);
  if (missing.length) report.failures.push(`${name}: expected visible ${missing.join(', ')}`);
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  observe(desktop, 'desktop');
  await cleanLoad(desktop);
  await audit(desktop, '01-desktop-discover', ['#artistName', '#releases', '#openFullPlayer', '#transportPlay']);
  await desktop.click('#themeToggle');
  await audit(desktop, '02-desktop-light', ['#artistName', '#releases']);
  await desktop.click('#themeToggle');
  await desktop.click('#transportPlay');
  await audit(desktop, '03-desktop-playing', ['#artistName', '#openFullPlayer', '#transportPlay']);
  await desktop.click('#openFullPlayer');
  await audit(desktop, '04-desktop-song-story', ['#closeFullPlayer', '#fullTitle', '#songRoomPanel', '#fullPlay']);
  await desktop.click('[data-song-room-mode="lyrics"]');
  await audit(desktop, '05-desktop-song-lyrics', ['#closeFullPlayer', '.song-room-lyric-list', '#fullPlay']);
  await desktop.click('[data-song-room-mode="queue"]');
  await audit(desktop, '06-desktop-song-queue', ['.song-room-queue-list', '#fullPlay']);
  await desktop.close();

  const library = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  observe(library, 'library');
  await cleanLoad(library);
  await library.click('[data-view="library"]');
  await audit(library, '07-desktop-empty-library', ['#viewSurface', '.empty-library']);
  await library.click('[data-view="profile"]');
  await audit(library, '08-desktop-profile', ['#viewSurface', '.profile-summary', '.profile-metrics']);
  await library.close();

  const onboarding = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  observe(onboarding, 'onboarding');
  await cleanLoad(onboarding, { onboarding: '1' });
  await audit(onboarding, '09-desktop-onboarding', ['#onboardingOverlay', '#draftName', '#onboardingNext']);
  await onboarding.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  observe(mobile, 'mobile');
  await cleanLoad(mobile);
  await audit(mobile, '10-mobile-discover', ['#mobileDirectoryButton', '#artistName', '#mobileTrack']);
  await mobile.click('#mobileDirectoryButton');
  await mobile.waitForTimeout(220);
  await audit(mobile, '11-mobile-journey', ['#directory', '#closeDirectory', '#genreSelect']);
  await mobile.click('#closeDirectory');
  await mobile.click('#mobileTrack');
  await audit(mobile, '12-mobile-song-room', ['#closeFullPlayer', '#fullTitle', '#fullPrevious', '#fullPlay', '#fullNext', '.song-room-mobile-nav']);
  await mobile.click('.song-room-mobile-nav [data-song-room-mode="story"]');
  await audit(mobile, '13-mobile-song-story', ['#closeFullPlayer', '#songRoomPanel', '#fullPlay', '.song-room-mobile-nav']);
  await mobile.close();

  const compact = await browser.newPage({ viewport: { width: 320, height: 700 }, deviceScaleFactor: 1 });
  observe(compact, 'compact');
  await cleanLoad(compact);
  await audit(compact, '14-compact-discover', ['#mobileDirectoryButton', '#artistName', '#mobileTrack']);
  await compact.click('#mobileTrack');
  await audit(compact, '15-compact-song-room', ['#closeFullPlayer', '#fullTitle', '#fullPrevious', '#fullPlay', '#fullNext', '.song-room-mobile-nav']);
  await compact.close();

  const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
  observe(reduced, 'reduced-motion');
  await cleanLoad(reduced);
  await reduced.click('#transportPlay');
  await reduced.click('#openFullPlayer');
  await audit(reduced, '16-reduced-motion-song-room', ['#closeFullPlayer', '#fullTitle', '#fullPlay']);
  const animations = await reduced.evaluate(() => [...document.getAnimations()].filter((animation) => animation.playState === 'running').length);
  if (animations > 0) report.failures.push(`reduced-motion: ${animations} animations remain running`);
  await reduced.close();
} catch (error) {
  report.failures.push(error.stack || error.message);
}

if (report.browserErrors.length) report.failures.push(...report.browserErrors);
writeFileSync('.qa-output/report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ states: report.states.length, failures: report.failures }, null, 2));
await browser.close();
if (report.failures.length) process.exit(1);
