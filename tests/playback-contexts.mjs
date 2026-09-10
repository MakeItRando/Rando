import { existsSync } from "node:fs";
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const assert = (condition, message) => { if (!condition) throw new Error(message); };
const base = process.env.RONDO_URL || pathToFileURL(resolve("preview-test.html")).href;
const target = `${base}${base.includes("?") ? "&" : "?"}skip-onboarding=1`;
const executablePath = process.env.CHROMIUM_PATH || "/usr/local/bin/chromium";
const launchOptions = { headless: true, args: ["--no-sandbox"] };
if (existsSync(executablePath)) launchOptions.executablePath = executablePath;
const browser = await chromium.launch(launchOptions);

try {
  const fresh = await browser.newPage({ viewport: { width: 1000, height: 820 } });
  const freshErrors = [];
  fresh.on("pageerror", (error) => freshErrors.push(error.message));
  fresh.on("console", (message) => { if (message.type() === "error") freshErrors.push(message.text()); });
  await fresh.goto(target, { waitUntil: "networkidle" });
  await fresh.evaluate(() => localStorage.clear());
  await fresh.reload({ waitUntil: "networkidle" });
  await fresh.locator('main[data-rondo-page="discover"]').waitFor();

  assert(await fresh.locator("body").evaluate((body) => body.classList.contains("playback-idle")), "A fresh profile must start without an active player.");
  assert(await fresh.locator(".transport").isHidden(), "A fresh profile must not show a preselected song.");
  assert((await fresh.locator("body").getAttribute("data-playback-context")) === "idle", "A fresh profile needs an idle playback context.");

  await fresh.click('.rail-button[data-view="journeys"]');
  await fresh.locator("#journeyGenrePicker").waitFor();
  await fresh.waitForFunction(() => document.querySelectorAll('[data-picker-genre][aria-checked="true"]').length === 0);
  assert(await fresh.locator("[data-confirm-journey]").isDisabled(), "A fresh Journey must wait for an explicit genre choice.");
  await fresh.click('[data-picker-genre="hiphop"]');
  await fresh.waitForFunction(() => document.querySelector('[data-picker-genre="hiphop"]')?.getAttribute("aria-checked") === "true");
  assert(!(await fresh.locator("[data-confirm-journey]").isDisabled()), "Choosing a genre must enable Journey confirmation.");
  await fresh.click("[data-confirm-journey]");
  await fresh.locator('#journeyGenrePage[data-genre="hiphop"]').waitFor();
  assert(await fresh.locator(".transport").isHidden(), "Choosing a Journey must not claim that playback has started.");
  assert(freshErrors.length === 0, `Fresh-profile browser errors: ${freshErrors.join(" | ")}`);
  await fresh.close();

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(target, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });

  await page.click('.rail-button[data-view="journeys"]');
  await page.locator("#journeyGenrePicker").waitFor();
  await page.waitForFunction(() => document.querySelectorAll('[data-picker-genre][aria-checked="true"]').length === 0);
  await page.click('[data-picker-genre="hiphop"]');
  await page.click("[data-confirm-journey]");
  await page.locator('#journeyGenrePage[data-genre="hiphop"]').waitFor();
  await page.click('[data-resume-journey="hiphop"]');
  await page.waitForFunction(() => location.hash.includes("/artist/kairo-vale"));
  await page.locator('.track-play').first().click();
  await page.waitForFunction(() => document.body.classList.contains("is-playing"));
  assert(await page.locator(".transport").isVisible(), "The player must appear after a real play action.");

  const journeyBefore = await page.evaluate(() => JSON.parse(localStorage.getItem("rondo-route-state-v1")));
  assert(journeyBefore.progressByGenre.hiphop.artistId === "kairo-vale", "Kairo Vale should be the saved Journey artist.");
  const journeySong = (await page.locator("#barTitle").textContent()).trim();

  await page.click('.rail-button[data-view="discover"]');
  await page.locator('main[data-rondo-page="discover"]').waitFor();
  assert((await page.locator("#barTitle").textContent()).trim() === journeySong, "Journey playback must continue after opening Discover.");
  assert((await page.locator("body").getAttribute("data-playback-context")) === "journey", "Playback must remain in Journey context until another song is chosen.");

  const discoverTrack = page.locator('.music-featured [data-play-entry="a101"]');
  await discoverTrack.click();
  await page.waitForFunction(() => document.body.dataset.view === "discover" && document.body.dataset.playbackContext === "global");
  await page.waitForTimeout(250);
  assert(await page.locator("#fullPlayer").isHidden(), "Discover play must not force Song Room open.");
  assert(await page.locator(".inspector").isVisible(), "Discover playback needs its own desktop side player.");
  assert(await page.locator("[data-playback-context-banner]").isVisible(), "The side player must identify Discover playback.");

  const journeyAfter = await page.evaluate(() => JSON.parse(localStorage.getItem("rondo-route-state-v1")));
  assert(journeyAfter.activeGenreId === journeyBefore.activeGenreId, "Discover playback changed the active Journey genre.");
  assert(journeyAfter.progressByGenre.hiphop.artistId === "kairo-vale", "Discover playback changed the saved Journey artist.");
  assert(journeyAfter.progressByGenre.hiphop.trackId === journeyBefore.progressByGenre.hiphop.trackId, "Discover playback changed the saved Journey track.");

  await page.click("#queueButton");
  await page.locator("#queueDrawer").waitFor();
  await page.waitForFunction(() => document.getElementById("queueTitle")?.textContent === "Discover queue");
  assert((await page.locator("[data-global-queue-track]").count()) > 1, "Discover must own a separate Up Next queue.");
  const firstTitle = (await page.locator("#barTitle").textContent()).trim();
  await page.click("#closeQueue");
  await page.click("#nextTrack");
  await page.waitForFunction((before) => document.getElementById("barTitle")?.textContent?.trim() !== before, firstTitle);
  assert((await page.locator("body").getAttribute("data-playback-context")) === "global", "Global next must stay in the Discover queue.");
  await page.waitForFunction(() => document.body.dataset.view === "discover" && location.hash === "#/discover");

  await page.setViewportSize({ width: 1000, height: 820 });
  await page.waitForTimeout(100);
  assert(await page.locator(".inspector").isVisible(), "Discover side player must remain available in a normal desktop window.");
  assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), "Responsive Discover side player must not cause horizontal overflow.");

  await page.click('.rail-button[data-view="journeys"]');
  await page.locator('#journeyGenrePage[data-genre="hiphop"]').waitFor();
  const restored = await page.evaluate(() => JSON.parse(localStorage.getItem("rondo-route-state-v1")));
  assert(restored.progressByGenre.hiphop.artistId === "kairo-vale", "Returning to Journeys must restore Kairo Vale.");
  assert(restored.progressByGenre.hiphop.trackId === journeyBefore.progressByGenre.hiphop.trackId, "Returning to Journeys must restore its track.");

  await page.close();
  assert(errors.length === 0, `Playback-context browser errors: ${errors.join(" | ")}`);
  console.log("Fresh profile and Journey/global playback-context isolation passed.");
} finally {
  await browser.close();
}
