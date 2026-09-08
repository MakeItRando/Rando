import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const baseUrl = process.env.RONDO_URL || 'http://127.0.0.1:4173/preview-test.html';
const executablePath = process.env.CHROMIUM_PATH || '/usr/local/bin/chromium';
const options = { headless: true, args: ['--no-sandbox'] };
if (existsSync(executablePath)) options.executablePath = executablePath;
const outputDir = '.qa/screenshots';
mkdirSync(outputDir, { recursive: true });
const browser = await chromium.launch(options);
const captures = [];
const runtimeErrors = [];

function target(screen = 'discover') {
  const url = new URL(baseUrl);
  url.searchParams.set('skip-onboarding', '1');
  url.searchParams.set('screen', screen);
  return url.href;
}
function watch(page, label) {
  page.on('pageerror', (error) => runtimeErrors.push(`${label}: ${error.message}`));
  page.on('console', (message) => { if (message.type() === 'error') runtimeErrors.push(`${label}: ${message.text()}`); });
}
async function settle(page) {
  await page.waitForTimeout(220);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function capture(page, name, fullPage = false) {
  await settle(page);
  const file = `${outputDir}/${name}.jpg`;
  await page.screenshot({ path: file, type: 'jpeg', quality: 84, fullPage });
  const metrics = await page.evaluate(() => {
    const images = [...document.images].filter((image) => {
      const rect = image.getBoundingClientRect();
      const style = getComputedStyle(image);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    });
    const size = (selector) => {
      const element = document.querySelector(selector);
      return element ? Number.parseFloat(getComputedStyle(element).fontSize) : null;
    };
    return {
      viewport: { width: innerWidth, height: innerHeight },
      bodyView: document.body.dataset.view || null,
      route: location.hash,
      journeyPage: document.body.dataset.journeyPage || null,
      signalMode: document.body.dataset.signalMode || null,
      appearance: document.documentElement.dataset.appearance || document.documentElement.dataset.theme || null,
      overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      pickerVisible: Boolean(document.querySelector('#journeyGenrePicker:not([hidden])')),
      songRoomVisible: Boolean(document.querySelector('#fullPlayer:not([hidden])')),
      songTitleSize: size('.song-room-title h2'),
      pageTitleSize: size('#discoverTitle, #journeyGenreTitle'),
      visibleMainCount: [...document.querySelectorAll('main')].filter((element) => element.offsetParent !== null).length,
      brokenVisibleImages: images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc || image.src)
    };
  });
  captures.push({ name, file, fullPage, ...metrics });
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watch(desktop, 'desktop');
  await desktop.goto(target('discover'), { waitUntil: 'networkidle' });
  await desktop.locator('main[data-rondo-page="discover"]').waitFor();
  await capture(desktop, '01-desktop-discover');
  await capture(desktop, '02-desktop-discover-full', true);
  await desktop.locator('[data-open-sound="late-night"]').click();
  await capture(desktop, '03-desktop-discover-sound');

  await desktop.locator('.rail-button[data-view="journeys"]').click();
  await desktop.locator('#journeyGenrePicker').waitFor();
  await capture(desktop, '04-desktop-journey-picker');
  await desktop.locator('[data-picker-genre="hiphop"]').click();
  await desktop.locator('[data-confirm-journey]').click();
  await desktop.locator('#journeyGenrePage[data-genre="hiphop"]').waitFor();
  await capture(desktop, '05-desktop-hiphop-journey');
  await capture(desktop, '06-desktop-hiphop-full', true);

  await desktop.locator('[data-resume-journey="hiphop"]').first().click();
  await desktop.locator('#journey').waitFor();
  await capture(desktop, '07-desktop-artist-journey');
  await desktop.locator('.track-row .track-play').first().click();
  await desktop.locator('#mobileTrack').click();
  await desktop.locator('#fullPlayer').waitFor();
  await capture(desktop, '08-desktop-song-room-about');
  await desktop.locator('[data-song-room-mode="lyrics"]').first().click();
  await capture(desktop, '09-desktop-song-room-lyrics');
  await desktop.locator('[data-song-room-mode="queue"]').first().click();
  await capture(desktop, '10-desktop-song-room-queue');
  await desktop.close();

  const light = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  watch(light, 'light');
  await light.goto(target('light'), { waitUntil: 'networkidle' });
  await light.locator('main[data-rondo-page="discover"]').waitFor();
  await capture(light, '11-desktop-light-discover');
  await light.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  watch(mobile, 'mobile');
  await mobile.goto(target('discover'), { waitUntil: 'networkidle' });
  await mobile.locator('main[data-rondo-page="discover"]').waitFor();
  await capture(mobile, '12-mobile-discover');
  await mobile.locator('[data-mobile-view="journeys"]').click();
  await mobile.locator('#journeyGenrePicker').waitFor();
  await capture(mobile, '13-mobile-journey-picker');
  await mobile.locator('[data-picker-genre="rnb"]').click();
  await mobile.locator('[data-confirm-journey]').click();
  await mobile.locator('#journeyGenrePage[data-genre="rnb"]').waitFor();
  await capture(mobile, '14-mobile-rnb-journey');
  await mobile.close();

  const compact = await browser.newPage({ viewport: { width: 320, height: 700 } });
  watch(compact, 'compact');
  await compact.goto(target('discover'), { waitUntil: 'networkidle' });
  await compact.locator('main[data-rondo-page="discover"]').waitFor();
  await capture(compact, '15-compact-discover');
  await compact.close();

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reduced = await reducedContext.newPage();
  watch(reduced, 'reduced');
  await reduced.goto(target('player'), { waitUntil: 'networkidle' });
  await reduced.locator('#fullPlayer').waitFor();
  await capture(reduced, '16-reduced-motion-song-room');
  await reduced.close();
  await reducedContext.close();

  const failures = [
    ...captures.filter((item) => item.overflowX > 1).map((item) => `${item.name}: ${item.overflowX}px horizontal overflow`),
    ...captures.filter((item) => !item.songRoomVisible && !item.pickerVisible && item.visibleMainCount !== 1).map((item) => `${item.name}: ${item.visibleMainCount} visible main landmarks`),
    ...captures.flatMap((item) => item.brokenVisibleImages.map((src) => `${item.name}: broken image ${src}`)),
    ...runtimeErrors
  ];
  const report = { checkedAt: new Date().toISOString(), baseUrl, captureCount: captures.length, captures, runtimeErrors, failures };
  writeFileSync('.qa/visual-report.json', `${JSON.stringify(report, null, 2)}\n`);

  const sheet = await browser.newPage({ viewport: { width: 1500, height: 900 } });
  const cards = captures.map((item) => {
    const data = readFileSync(item.file).toString('base64');
    const details = `${item.viewport.width}×${item.viewport.height} · overflow ${item.overflowX}px${item.pageTitleSize ? ` · page title ${item.pageTitleSize}px` : ''}${item.songTitleSize ? ` · song title ${item.songTitleSize}px` : ''}`;
    return `<figure><figcaption><strong>${item.name}</strong><span>${details}</span></figcaption><img src="data:image/jpeg;base64,${data}" alt="${item.name}"></figure>`;
  }).join('');
  await sheet.setContent(`<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#111;color:#f5f1e8;font:14px Arial,sans-serif}header{padding:28px 34px;border-bottom:1px solid #444}h1{margin:0 0 6px;font-size:26px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;padding:24px}figure{margin:0;background:#1c1c1c;border:1px solid #444;border-radius:14px;overflow:hidden}figcaption{display:flex;justify-content:space-between;gap:16px;padding:12px 14px}figcaption span{color:#aaa;text-align:right}img{display:block;width:100%;height:auto;background:#000}</style><header><h1>Rondo v0.3.2 visual QA</h1><div>${captures.length} captured states · ${failures.length} automated findings</div></header><main class="grid">${cards}</main>`, { waitUntil: 'load' });
  await sheet.screenshot({ path: '.qa/visual-contact-sheet.jpg', type: 'jpeg', quality: 82, fullPage: true });
  await sheet.close();

  console.log(`Visual QA captured ${captures.length} states with ${failures.length} findings.`);
  if (failures.length) throw new Error(failures.join('\n'));
} finally {
  await browser.close();
}
