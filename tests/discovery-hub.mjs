import { existsSync } from "node:fs";
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

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
const route = (page) => page.evaluate(() => location.hash);
const hasOneVisibleMain = (page) =>
  page.evaluate(
    () =>
      [...document.querySelectorAll("main")].filter(
        (element) => element.offsetParent !== null,
      ).length === 1,
  );

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(target, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.locator('main[data-rondo-page="discover"]').waitFor();

  assert(
    (await page.locator("#journeyGenrePicker").count()) === 0,
    "Discover must not open the genre chooser.",
  );
  assert(
    (await page.locator("#discoverTitle").textContent()).trim() ===
      "Play something good.",
    "Discover copy should be concise.",
  );
  for (const section of [
    "Hits today",
    "Made for you",
    "Bangers",
    "Sounds",
    "Hidden gems",
    "New & rising",
    "Genre Journeys",
  ]) {
    assert(
      (await page.locator(`h2:text-is("${section}")`).count()) === 1,
      `Missing Discover section: ${section}`,
    );
  }
  assert(
    !(await page.locator("#viewSurface").textContent()).includes("Find a door"),
    "Rejected editorial copy returned.",
  );
  assert(
    await page.locator("#genreSelect").isHidden(),
    "Legacy genre dropdown should be hidden.",
  );
  assert(await hasOneVisibleMain(page), "Discover should expose one visible main.");
  assert((await route(page)) === "#/discover", "Discover route is incorrect.");

  await page.click('.rail-button[data-view="journeys"]');
  await page.locator("#journeyGenrePicker").waitFor();
  assert(
    await page.locator("#appShell").evaluate((element) => element.inert),
    "Journey picker background should be inert.",
  );
  assert(
    (await page.locator("[data-picker-genre]").count()) === 4,
    "Journey picker should list four genres.",
  );
  assert(
    await page.evaluate(() =>
      document.querySelector("#journeyGenrePicker").contains(document.activeElement),
    ),
    "Journey picker should receive focus.",
  );
  assert((await route(page)) === "#/journeys", "Journey picker route is incorrect.");

  await page.click('[data-picker-genre="rnb"]');
  assert(
    (await page.locator('[data-picker-genre="rnb"]').getAttribute("aria-checked")) ===
      "true",
    "Genre selection lacks accessible state.",
  );
  assert(
    (await page.locator("[data-confirm-journey]").textContent()).includes("R&B"),
    "Journey action should name R&B.",
  );
  await page.click("[data-confirm-journey]");
  await page.locator('#journeyGenrePage[data-genre="rnb"]').waitFor();
  assert((await route(page)) === "#/journeys/rnb", "R&B should open as a Journey subroute.");
  assert((await page.title()).includes("R&B Journey"), "Genre page needs a useful title.");
  await page.waitForFunction(() => document.activeElement?.id === "journeyGenreTitle");
  assert(await hasOneVisibleMain(page), "Genre page should expose one visible main.");
  assert(
    (await page.locator(".journey-artist-card").count()) > 0,
    "Genre page should list artists.",
  );
  assert(
    (await page.locator(".journey-top-songs .genre-song").count()) >= 6,
    "Genre page should list songs.",
  );
  await page.fill("[data-journey-genre-search]", "Mira");
  assert(
    (await page.locator("[data-journey-genre-results] .genre-song").count()) > 0,
    "Scoped genre search failed.",
  );
  await page.fill("[data-journey-genre-search]", "");

  await page.click(".journey-genre-actions [data-change-journey]");
  await page.click('[data-picker-genre="jazz"]');
  await page.click("[data-confirm-journey]");
  await page.locator('#journeyGenrePage[data-genre="jazz"]').waitFor();
  const savedRouteState = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("rondo-route-state-v1")),
  );
  assert(savedRouteState.activeGenreId === "jazz", "Active Journey genre was not saved.");
  assert(
    savedRouteState.progressByGenre.rnb && savedRouteState.progressByGenre.jazz,
    "Per-genre progress records were not preserved.",
  );

  await page.goBack();
  await page.locator('#journeyGenrePage[data-genre="rnb"]').waitFor();
  assert((await route(page)) === "#/journeys/rnb", "Back did not restore R&B.");
  await page.goForward();
  await page.locator('#journeyGenrePage[data-genre="jazz"]').waitFor();
  assert((await route(page)) === "#/journeys/jazz", "Forward did not restore Jazz.");

  await page.click("[data-return-discover]");
  await page.locator('main[data-rondo-page="discover"]').waitFor();
  await page.waitForTimeout(150);
  await page.fill("[data-music-search]", "Night Transit");
  assert(
    (await page.locator('[data-music-results] [data-play-entry="k101"]').count()) === 1,
    "Discover search should find Night Transit.",
  );
  await page.click('[data-music-results] [data-play-entry="k101"]');
  await page.waitForFunction(() => document.body.classList.contains("is-playing"));
  await page.locator("#fullPlayer").waitFor();
  assert(
    (await page.locator("#barTitle").textContent()).trim() === "Night Transit",
    "Discover direct play chose the wrong song.",
  );
  assert((await route(page)) === "#/discover", "Song Room should preserve Discover beneath it.");
  assert(
    (await page.evaluate(() =>
      JSON.parse(localStorage.getItem("rondo-route-state-v1")),
    )).activeGenreId === "jazz",
    "Discover playback replaced the active Journey.",
  );

  await page.keyboard.press("Escape");
  await page.locator('main[data-rondo-page="discover"]').waitFor();
  await page.click('.rail-button[data-view="journeys"]');
  await page.locator('#journeyGenrePage[data-genre="jazz"]').waitFor();
  assert(
    await page.locator("#journeyGenrePicker").isHidden(),
    "Returning listener should resume the saved Journey.",
  );
  await page.click('[data-resume-journey="jazz"]');
  await page.locator("#journey").waitFor();
  assert(
    (await route(page)).startsWith("#/journeys/jazz/artist/"),
    "Guided Journey should use an artist subroute.",
  );
  assert(
    await page.locator("#journeyGenreSwitch").isVisible(),
    "Guided Journey needs Change genre.",
  );

  const artistRoute = await route(page);
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#journey").waitFor();
  assert((await route(page)) === artistRoute, "Journey artist route did not survive reload.");
  const session = await page.evaluate(
    () => JSON.parse(localStorage.getItem("rondo-prototype-v2")).session,
  );
  assert(session?.genreId && session?.artistId, "Playback context was not persisted.");

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileDirectory = page.locator("#mobileDirectoryButton");
  assert(await mobileDirectory.isVisible(), "Mobile artist Journey needs its directory control.");
  await mobileDirectory.click();
  await page.locator("#directory.open").waitFor();
  const directoryPosition = await page.locator("#directory").evaluate((element) => ({
    left: element.getBoundingClientRect().left,
    width: element.getBoundingClientRect().width,
  }));
  assert(
    Math.abs(directoryPosition.left) < 2 && directoryPosition.width > 0,
    "Mobile artist directory should open in the viewport.",
  );
  await page.locator("#journeyDirectorySwitch [data-change-journey]").click();
  await page.locator("#journeyGenrePicker").waitFor();
  assert(
    !(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)),
    "Mobile Journey picker overflows.",
  );
  const genreChoice = await page.locator("[data-picker-genre]").first().boundingBox();
  assert(genreChoice && genreChoice.height >= 44, "Mobile genre choices need 44px targets.");

  await page.keyboard.press("Escape");
  await page.locator('main[data-rondo-page="discover"]').waitFor();
  await page.setViewportSize({ width: 320, height: 700 });
  assert(
    !(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)),
    "Compact Discover overflows.",
  );
  const surprise = await page.locator("[data-surprise-track]").boundingBox();
  assert(surprise && surprise.height >= 44, "Compact Discover action needs a 44px target.");

  await page.close();
  assert(errors.length === 0, `Discover/Journey browser errors: ${errors.join(" | ")}`);
  console.log("Route-backed Discover and Journey regression passed.");
} finally {
  await browser.close();
}
