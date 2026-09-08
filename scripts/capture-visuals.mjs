import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const baseUrl = process.env.RONDO_URL || 'http://127.0.0.1:4173/preview-test.html';
const executablePath = process.env.CHROMIUM_PATH || '/usr/local/bin/chromium';
const launchOptions = { headless: true, args: ['--no-sandbox'] };
if (existsSync(executablePath)) launchOptions.executablePath = executablePath;

const outputDir = '.qa/screenshots';
mkdirSync(outputDir, { recursive: true });
const browser = await chromium.launch(launchOptions);
const captures = [];
const runtimeErrors = [];

function target(screen = 'journey') {
  const url = new URL(baseUrl);
  url.searchParams.set('skip-onboarding', '1');
  url.searchParams.set('screen', screen);
  return url.href;
}

function watch(page, label) {
  page.on('pageerror', (error) => runtimeErrors.push(`${label}: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') runtimeErrors.push(`${label}: ${message.text()}`);
  });
}

async function settle(page) {
  await page.waitForTimeout(180);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function capture(page, name, options = {}) {
  await settle(page);
  const file = `${outputDir}/${name}.jpg`;
  await page.screenshot({ path: file, type: 'jpeg', quality: 84, fullPage: Boolean(options.fullPage) });
  const metrics = await page.evaluate(() => {
    const visibleImages = [...document.images].filter((image) => {
      const style = getComputedStyle(image);
      const rect = image.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    });
    const fontSize = (selector) => {
      const element = document.querySelector(selector);
      return element ? Number.parseFloat(getComputedStyle(element).fontSize) : null;
    };
    return {
      viewport: { width: innerWidth, height: innerHeight },
      bodyView: document.body.dataset.view || null,
      discoveryScreen: document.body.dataset.discoveryScreen || null,
      signalMode: document.body.dataset.signalMode || null,
      palette: document.documentElement.dataset.songPalette || null,
      appearance: document.documentElement.dataset.appearance || document.documentElement.dataset.theme || null,
      overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      scrollHeight: document.documentElement.scrollHeight,
      chooserVisible: Boolean(document.querySelector('#discoveryChoice:not([hidden])')),
      songRoomVisible: Boolean(document.querySelector('#fullPlayer:not([hidden])')),
      songTitleSize: fontSize('.song-room-title h2'),
      pageTitleSize: fontSize('#viewSurface h1'),
      brokenVisibleImages: visibleImages.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc || image.src)
    };
  });
  captures.push({ name, file, fullPage: Boolean(options.fullPage), ...metrics });
}

async function openExplore(page, mobile = false) {
  await page.goto(target('journey'), { waitUntil: 'networkidle' });
  const selector = mobile ? '[data-mobile-view="discover"]' : '.rail-button[data-view="discover"]';
  await page.locator(selector).click();
  await page.locator('#discoveryChoice').waitFor({ state: 'visible' });
  await page.locator('[data-choose-explore]').click();
  await page.locator('.music-explore').waitFor({ state: 'visible' });
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watch(desktop, 'desktop');
  await desktop.goto(target('journey'), { waitUntil: 'networkidle' });
  await desktop.locator('.rail-button[data-view="discover"]').click();
  await desktop.locator('#discoveryChoice').waitFor({ state: 'visible' });
  await capture(desktop, '01-desktop-discover-chooser');

  await desktop.locator('[data-choose-explore]').click();
  await desktop.locator('.music-explore').waitFor({ state: 'visible' });
  await capture(desktop, '02-desktop-explore-top');
  await capture(desktop, '03-desktop-explore-full', { fullPage: true });
  await desktop.locator('.music-hidden').scrollIntoViewIfNeeded();
  await capture(desktop, '04-desktop-hidden-gems');

  await desktop.locator('[data-open-discovery-picker]').click();
  await desktop.locator('#discoveryChoice').waitFor({ state: 'visible' });
  await desktop.locator('[data-choice-genre="hiphop"]').click();
  await desktop.locator('[data-listen-genre]').click();
  await desktop.locator('main.genre-playlist[data-genre="hiphop"]').waitFor({ state: 'visible' });
  await capture(desktop, '05-desktop-hiphop-playlist', { fullPage: true });

  await desktop.locator('.genre-song').first().click();
  await desktop.locator('#fullPlayer').waitFor({ state: 'visible' });
  await capture(desktop, '06-desktop-song-room-about');
  for (const [mode, name] of [['lyrics', '07-desktop-song-room-lyrics'], ['credits', '08-desktop-song-room-credits'], ['queue', '09-desktop-song-room-queue'], ['reveal', '10-desktop-song-room-extra']]) {
    await desktop.locator(`[data-song-room-mode="${mode}"]`).first().click();
    await capture(desktop, name);
  }
  await desktop.close();

  const light = await browser.newPage({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  watch(light, 'light');
  await light.goto(target('light'), { waitUntil: 'networkidle' });
  if (!(await light.locator('#fullPlayer').isVisible())) await light.locator('#openFullPlayer').click();
  await light.locator('#fullPlayer').waitFor({ state: 'visible' });
  await capture(light, '11-desktop-song-room-light');
  await light.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  watch(mobile, 'mobile');
  await mobile.goto(target('player'), { waitUntil: 'networkidle' });
  await mobile.locator('#fullPlayer').waitFor({ state: 'visible' });
  await capture(mobile, '12-mobile-song-room');
  await mobile.locator('.song-room-mobile-nav [data-song-room-mode="story"]').click();
  await capture(mobile, '13-mobile-song-room-about');
  await mobile.locator('.song-room-mobile-nav [data-song-room-mode="lyrics"]').click();
  await capture(mobile, '14-mobile-song-room-lyrics');
  await mobile.close();

  const compact = await browser.newPage({ viewport: { width: 320, height: 700 } });
  watch(compact, 'compact');
  await openExplore(compact, true);
  await capture(compact, '15-compact-explore');
  await compact.close();

  const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const reduced = await reducedContext.newPage();
  watch(reduced, 'reduced');
  await reduced.goto(target('player'), { waitUntil: 'networkidle' });
  await reduced.locator('#fullPlayer').waitFor({ state: 'visible' });
  await capture(reduced, '16-reduced-motion-song-room');
  await reduced.close();
  await reducedContext.close();

  const failures = [
    ...captures.filter((item) => item.overflowX > 1).map((item) => `${item.name}: ${item.overflowX}px horizontal overflow`),
    ...captures.flatMap((item) => item.brokenVisibleImages.map((src) => `${item.name}: broken image ${src}`)),
    ...runtimeErrors
  ];

  const report = {
    checkedAt: new Date().toISOString(),
    baseUrl,
    captureCount: captures.length,
    captures,
    runtimeErrors,
    failures
  };
  writeFileSync('.qa/visual-report.json', `${JSON.stringify(report, null, 2)}\n`);

  const sheet = await browser.newPage({ viewport: { width: 1500, height: 900 } });
  const cards = captures.map((item) => {
    const data = readFileSync(item.file).toString('base64');
    const details = `${item.viewport.width}×${item.viewport.height} · overflow ${item.overflowX}px${item.songTitleSize ? ` · song title ${item.songTitleSize}px` : ''}`;
    return `<figure><figcaption><strong>${item.name}</strong><span>${details}</span></figcaption><img src="data:image/jpeg;base64,${data}" alt="${item.name}"></figure>`;
  }).join('');
  await sheet.setContent(`<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#111;color:#f5f1e8;font:14px Arial,sans-serif}header{padding:28px 34px;border-bottom:1px solid #444}h1{margin:0 0 6px;font-size:26px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;padding:24px}figure{margin:0;background:#1c1c1c;border:1px solid #444;border-radius:14px;overflow:hidden}figcaption{display:flex;justify-content:space-between;gap:16px;padding:12px 14px}figcaption span{color:#aaa;text-align:right}img{display:block;width:100%;height:auto;background:#000}</style><header><h1>Rondo v0.3.2 visual QA</h1><div>${captures.length} captured states · ${failures.length} automated visual findings</div></header><main class="grid">${cards}</main>`, { waitUntil: 'load' });
  await sheet.screenshot({ path: '.qa/visual-contact-sheet.jpg', type: 'jpeg', quality: 82, fullPage: true });
  await sheet.close();

  console.log(`Visual QA captured ${captures.length} states with ${failures.length} findings.`);
  if (failures.length) throw new Error(failures.join('\n'));
} finally {
  await browser.close();
}
