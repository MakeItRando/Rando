import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const baseUrl =
  process.env.RONDO_URL || "http://127.0.0.1:4173/preview-test.html";
const executablePath = process.env.CHROMIUM_PATH || "/usr/local/bin/chromium";
const options = { headless: true, args: ["--no-sandbox"] };
if (existsSync(executablePath)) options.executablePath = executablePath;
const outputDir = ".qa/screenshots";
mkdirSync(outputDir, { recursive: true });
const browser = await chromium.launch(options);
const captures = [];
const runtimeErrors = [];

function target(screen = "discover") {
  const url = new URL(baseUrl);
  url.searchParams.set("skip-onboarding", "1");
  url.searchParams.set("screen", screen);
  return url.href;
}

function watch(page, label) {
  page.on("pageerror", (error) =>
    runtimeErrors.push(`${label}: ${error.message}`),
  );
  page.on("console", (message) => {
    if (message.type() === "error")
      runtimeErrors.push(`${label}: ${message.text()}`);
  });
}

async function settle(page) {
  await page.evaluate(async () => {
    const images = [...document.images];
    images.forEach((image) => {
      image.loading = "eager";
      image.setAttribute("loading", "eager");
    });

    await Promise.all(
      images.map((image) => {
        if (image.complete) return Promise.resolve();
        return new Promise((resolve) => {
          let timer;
          const finish = () => {
            clearTimeout(timer);
            image.removeEventListener("load", finish);
            image.removeEventListener("error", finish);
            resolve();
          };
          image.addEventListener("load", finish, { once: true });
          image.addEventListener("error", finish, { once: true });
          timer = setTimeout(finish, 3500);
        });
      }),
    );

    await Promise.all(
      images.map((image) => {
        if (!image.complete || image.naturalWidth === 0 || !image.decode)
          return Promise.resolve();
        return image.decode().catch(() => undefined);
      }),
    );
  });
  await page.waitForTimeout(180);
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
}

async function scrollTo(page, selector) {
  await page.locator(selector).first().evaluate((element) =>
    element.scrollIntoView({ block: "start", inline: "nearest", behavior: "instant" }),
  );
  await settle(page);
}

async function capture(page, name) {
  await settle(page);
  const file = `${outputDir}/${name}.jpg`;
  await page.screenshot({ path: file, type: "jpeg", quality: 84 });
  const metrics = await page.evaluate(() => {
    const rendered = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== "none" &&
        style.visibility !== "hidden"
      );
    };
    const inViewport = (element) => {
      const rect = element.getBoundingClientRect();
      return (
        rendered(element) &&
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < innerHeight &&
        rect.left < innerWidth
      );
    };
    const conciseSource = (value = "") => {
      if (!value) return "missing source";
      if (value.startsWith("data:image/svg+xml")) return "inline SVG";
      if (value.startsWith("data:")) return "inline image";
      try {
        const pathname = new URL(value, location.href).pathname;
        return pathname.split("/").filter(Boolean).at(-1) || pathname;
      } catch {
        return value.slice(0, 80);
      }
    };
    const imageLabel = (image, index) => {
      const alt = image.getAttribute("alt")?.trim();
      const parentLabel = image.closest("[aria-label]")?.getAttribute("aria-label")?.trim();
      return alt || parentLabel || `image ${index + 1}`;
    };
    const targetLabel = (element) => {
      if (element.id) return `#${element.id}`;
      for (const key of [
        "data-mobile-view",
        "data-song-room-mode",
        "data-change-journey",
        "data-picker-genre",
        "data-resume-journey",
        "data-surprise-track",
      ]) {
        if (element.hasAttribute(key)) {
          const value = element.getAttribute(key);
          return value ? `[${key}="${value}"]` : `[${key}]`;
        }
      }
      return (
        element.getAttribute("aria-label")?.trim() ||
        element.textContent?.trim().replace(/\s+/g, " ").slice(0, 54) ||
        element.tagName.toLowerCase()
      );
    };
    const images = [...document.images].filter(rendered);
    const touchTargets =
      innerWidth <= 760
        ? [...document.querySelectorAll("button:not(:disabled)")].filter(
            (element) => inViewport(element) && !element.closest("[inert]"),
          )
        : [];
    const size = (selector) => {
      const element = document.querySelector(selector);
      return element
        ? Number.parseFloat(getComputedStyle(element).fontSize)
        : null;
    };
    const scrollSurfaces = [
      document.querySelector("#viewSurface"),
      document.querySelector("#journeyGenrePage"),
      document.querySelector("#journey"),
    ]
      .filter((element) => element && rendered(element))
      .map((element) => ({
        id: element.id || element.className,
        top: Math.round(element.scrollTop),
        height: Math.round(element.clientHeight),
        contentHeight: Math.round(element.scrollHeight),
      }));

    return {
      viewport: { width: innerWidth, height: innerHeight },
      bodyView: document.body.dataset.view || null,
      route: location.hash,
      journeyPage: document.body.dataset.journeyPage || null,
      signalMode: document.body.dataset.signalMode || null,
      appearance:
        document.documentElement.dataset.appearance ||
        document.documentElement.dataset.theme ||
        null,
      overflowX: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      pickerVisible: Boolean(
        document.querySelector("#journeyGenrePicker:not([hidden])"),
      ),
      songRoomVisible: Boolean(document.querySelector("#fullPlayer:not([hidden])")),
      songTitleSize: size(".song-room-title h2"),
      pageTitleSize: size("#discoverTitle, #journeyGenreTitle"),
      visibleMainCount: [...document.querySelectorAll("main")].filter(
        (element) => element.offsetParent !== null,
      ).length,
      scrollSurfaces,
      brokenRenderedImages: images
        .map((image, index) => ({ image, index }))
        .filter(({ image }) => !image.complete || image.naturalWidth === 0)
        .map(({ image, index }) => ({
          label: imageLabel(image, index),
          source: conciseSource(image.currentSrc || image.src),
        })),
      undersizedTouchTargets: touchTargets
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            label: targetLabel(element),
            width: Math.round(rect.width * 10) / 10,
            height: Math.round(rect.height * 10) / 10,
          };
        })
        .filter((item) => item.width < 44 || item.height < 44),
    };
  });
  captures.push({ name, file, ...metrics });
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watch(desktop, "desktop");
  await desktop.goto(target("discover"), { waitUntil: "networkidle" });
  await desktop.locator('main[data-rondo-page="discover"]').waitFor();
  await capture(desktop, "01-desktop-discover");
  await scrollTo(desktop, ".music-hidden");
  await capture(desktop, "02-desktop-discover-lower");
  await desktop.locator('[data-open-sound="late-night"]').click();
  await capture(desktop, "03-desktop-discover-sound");

  await desktop.locator('.rail-button[data-view="journeys"]').click();
  await desktop.locator("#journeyGenrePicker").waitFor();
  await capture(desktop, "04-desktop-journey-picker");
  await desktop.locator('[data-picker-genre="hiphop"]').click();
  await desktop.locator("[data-confirm-journey]").click();
  await desktop.locator('#journeyGenrePage[data-genre="hiphop"]').waitFor();
  await capture(desktop, "05-desktop-hiphop-journey");
  await scrollTo(desktop, ".journey-top-songs");
  await capture(desktop, "06-desktop-hiphop-songs");

  await desktop.locator('[data-resume-journey="hiphop"]').first().click();
  await desktop.locator("#journey").waitFor();
  await capture(desktop, "07-desktop-artist-journey");
  await desktop.locator(".track-row .track-play").first().click();
  await desktop.locator("#mobileTrack").click();
  await desktop.locator("#fullPlayer").waitFor();
  await capture(desktop, "08-desktop-song-room-about");
  await desktop.locator('[data-song-room-mode="lyrics"]').first().click();
  await capture(desktop, "09-desktop-song-room-lyrics");
  await desktop.locator('[data-song-room-mode="queue"]').first().click();
  await capture(desktop, "10-desktop-song-room-queue");
  await desktop.close();

  const light = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    colorScheme: "light",
  });
  watch(light, "light");
  await light.goto(target("light"), { waitUntil: "networkidle" });
  await light.locator('main[data-rondo-page="discover"]').waitFor();
  await capture(light, "11-desktop-light-discover");
  await light.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  watch(mobile, "mobile");
  await mobile.goto(target("discover"), { waitUntil: "networkidle" });
  await mobile.locator('main[data-rondo-page="discover"]').waitFor();
  await capture(mobile, "12-mobile-discover");
  await mobile.locator('[data-mobile-view="journeys"]').click();
  await mobile.locator("#journeyGenrePicker").waitFor();
  await capture(mobile, "13-mobile-journey-picker");
  await mobile.locator('[data-picker-genre="rnb"]').click();
  await mobile.locator("[data-confirm-journey]").click();
  await mobile.locator('#journeyGenrePage[data-genre="rnb"]').waitFor();
  await capture(mobile, "14-mobile-rnb-journey");
  await mobile.locator('[data-resume-journey="rnb"]').first().click();
  await mobile.locator("#journey").waitFor();
  await capture(mobile, "15-mobile-rnb-artist");
  await mobile.locator("#mobileDirectoryButton").click();
  await mobile.locator("#directory.open").waitFor();
  await capture(mobile, "16-mobile-change-genre");
  await mobile.locator("#closeDirectory").click();
  await mobile.close();

  const compact = await browser.newPage({ viewport: { width: 320, height: 700 } });
  watch(compact, "compact");
  await compact.goto(target("discover"), { waitUntil: "networkidle" });
  await compact.locator('main[data-rondo-page="discover"]').waitFor();
  await capture(compact, "17-compact-discover");
  await compact.close();

  const reducedContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const reduced = await reducedContext.newPage();
  watch(reduced, "reduced");
  await reduced.goto(target("player"), { waitUntil: "networkidle" });
  await reduced.locator("#fullPlayer").waitFor();
  await capture(reduced, "18-reduced-motion-song-room");
  await reduced.close();
  await reducedContext.close();

  const failures = [
    ...captures
      .filter((item) => item.overflowX > 1)
      .map((item) => `${item.name}: ${item.overflowX}px horizontal overflow`),
    ...captures
      .filter(
        (item) =>
          !item.songRoomVisible &&
          !item.pickerVisible &&
          item.visibleMainCount !== 1,
      )
      .map(
        (item) =>
          `${item.name}: ${item.visibleMainCount} visible main landmarks`,
      ),
    ...captures.flatMap((item) =>
      item.brokenRenderedImages.map(
        (image) =>
          `${item.name}: broken image ${image.label} (${image.source})`,
      ),
    ),
    ...captures.flatMap((item) =>
      item.undersizedTouchTargets.map(
        (target) =>
          `${item.name}: touch target ${target.label} is ${target.width}×${target.height}px`,
      ),
    ),
    ...runtimeErrors,
  ];
  const report = {
    checkedAt: new Date().toISOString(),
    baseUrl,
    captureCount: captures.length,
    captures,
    runtimeErrors,
    failures,
  };
  writeFileSync(
    ".qa/visual-report.json",
    `${JSON.stringify(report, null, 2)}\n`,
  );

  const sheet = await browser.newPage({ viewport: { width: 1500, height: 900 } });
  const cards = captures
    .map((item) => {
      const data = readFileSync(item.file).toString("base64");
      const details = `${item.viewport.width}×${item.viewport.height} · overflow ${item.overflowX}px${item.pageTitleSize ? ` · page title ${item.pageTitleSize}px` : ""}${item.songTitleSize ? ` · song title ${item.songTitleSize}px` : ""}`;
      return `<figure><figcaption><strong>${item.name}</strong><span>${details}</span></figcaption><img src="data:image/jpeg;base64,${data}" alt="${item.name}"></figure>`;
    })
    .join("");
  await sheet.setContent(
    `<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#111;color:#f5f1e8;font:14px Arial,sans-serif}header{padding:28px 34px;border-bottom:1px solid #444}h1{margin:0 0 6px;font-size:26px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;padding:24px}figure{margin:0;background:#1c1c1c;border:1px solid #444;border-radius:14px;overflow:hidden}figcaption{display:flex;justify-content:space-between;gap:16px;padding:12px 14px}figcaption span{color:#aaa;text-align:right}img{display:block;width:100%;height:auto;background:#000}</style><header><h1>Rondo v0.3.2 visual QA</h1><div>${captures.length} captured states · ${failures.length} automated findings</div></header><main class="grid">${cards}</main>`,
    { waitUntil: "load" },
  );
  await sheet.screenshot({
    path: ".qa/visual-contact-sheet.jpg",
    type: "jpeg",
    quality: 82,
    fullPage: true,
  });
  await sheet.close();

  console.log(
    `Visual QA captured ${captures.length} states with ${failures.length} findings.`,
  );
  if (failures.length) throw new Error(failures.join("\n"));
} finally {
  await browser.close();
}
