import { existsSync } from "node:fs";
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { artists } from "../src/data/catalog.js";

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const base = process.env.RONDO_URL || pathToFileURL(resolve("preview-test.html")).href;
const target = `${base}${base.includes("?") ? "&" : "?"}skip-onboarding=1`;
const executablePath = process.env.CHROMIUM_PATH || "/usr/local/bin/chromium";
const launchOptions = { headless: true, args: ["--no-sandbox"] };
if (existsSync(executablePath)) launchOptions.executablePath = executablePath;
const browser = await chromium.launch(launchOptions);
const errors = [];
const allTrackIds = artists.flatMap((artist) =>
  artist.releases.flatMap((release) => release.tracks.map((track) => track.id)),
);

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(target, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem(
      "rondo-prototype-v2",
      JSON.stringify({ playedTracks: { malformed: true } }),
    );
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.locator('main[data-rondo-page="discover"]').waitFor();
  await page.waitForTimeout(50);
  assert(
    await page.locator(".music-personal").isHidden(),
    "Malformed listening history must not expose or break recommendations.",
  );

  await page.evaluate((trackIds) => {
    localStorage.setItem(
      "rondo-prototype-v2",
      JSON.stringify({ playedTracks: trackIds }),
    );
  }, allTrackIds);
  await page.reload({ waitUntil: "networkidle" });
  await page.locator('main[data-rondo-page="discover"]').waitFor();
  await page.waitForTimeout(50);
  assert(
    await page.locator(".music-personal").isHidden(),
    "Made for you must hide when the available catalog is exhausted.",
  );

  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.locator('main[data-rondo-page="discover"]').waitFor();
  await page.click('.rail-button[data-view="journeys"]');
  await page.locator("#journeyGenrePicker").waitFor();
  await page.click("[data-cancel-journey-picker]");
  await page.waitForFunction(() => location.hash === "#/discover");
  await page.locator('main[data-rondo-page="discover"]').waitFor();
  assert(
    await page.locator("#journeyGenrePicker").isHidden(),
    "First-time Journey cancellation must return to Discover.",
  );

  await page.click('.rail-button[data-view="journeys"]');
  await page.locator("#journeyGenrePicker").waitFor();
  await page.click('[data-picker-genre="rnb"]');
  await page.click("[data-confirm-journey]");
  await page.locator('#journeyGenrePage[data-genre="rnb"]').waitFor();

  const breadcrumbGap = await page.evaluate(() => {
    const back = document.querySelector(".journey-genre-copy > button");
    const eyebrow = document.querySelector(".journey-genre-copy > span");
    const backRect = back.getBoundingClientRect();
    const eyebrowRect = eyebrow.getBoundingClientRect();
    return eyebrowRect.left - backRect.right;
  });
  assert(breadcrumbGap >= 8, "Journey breadcrumb labels need a visible gap.");

  const changeGenre = page.locator(".journey-genre-actions [data-change-journey]");
  await changeGenre.click();
  await page.locator("#journeyGenrePicker").waitFor();
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => location.hash === "#/journeys/rnb");
  await page.waitForFunction(
    () =>
      document.activeElement ===
      document.querySelector(".journey-genre-actions [data-change-journey]"),
  );
  assert(
    await page.locator("#journeyGenrePicker").isHidden(),
    "Genre-route dismissal must preserve the current Journey.",
  );

  await page.click('[data-resume-journey="rnb"]');
  await page.waitForFunction(() => location.hash.includes("/artist/"));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#mobileDirectoryButton").click();
  await page.locator("#directory.open").waitFor();
  await page.waitForFunction(
    () => Math.abs(document.querySelector("#directory").getBoundingClientRect().left) < 2,
  );
  const switchLabel = page.locator(
    "#journeyDirectorySwitch [data-journey-switch-label]",
  );
  assert((await switchLabel.textContent()).trim() === "R&B", "Drawer must name the current Journey.");
  assert(
    (await switchLabel.evaluate((element) => getComputedStyle(element).color)) ===
      "rgb(244, 245, 247)",
    "Current Journey label must remain legible in Night appearance.",
  );

  await page.locator("#closeDirectory").click();
  await page.locator(".track-play").first().click();
  await page.waitForFunction(() => document.body.classList.contains("is-playing"));
  await page.locator("#mobileTrack").click();
  await page.locator("#fullPlayer").waitFor();
  const mobileTimeLayout = await page.locator(".song-room-player .full-times").evaluate(
    (element) => ({
      display: getComputedStyle(element).display,
      gap: Number.parseFloat(getComputedStyle(element).columnGap),
    }),
  );
  assert(
    mobileTimeLayout.display === "grid" && mobileTimeLayout.gap >= 8,
    "Mobile Song Room timing and metadata need readable separation.",
  );

  await page.close();
  assert(errors.length === 0, `Product-policy browser errors: ${errors.join(" | ")}`);
  console.log("Product policy regression passed.");
} finally {
  await browser.close();
}
