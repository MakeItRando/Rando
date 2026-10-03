import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const baseTarget =
  process.env.RONDO_URL || pathToFileURL(resolve("preview-test.html")).href;
const target = `${baseTarget}${baseTarget.includes("?") ? "&" : "?"}skip-onboarding=1&screen=journey`;
const executablePath = process.env.CHROMIUM_PATH || "/usr/local/bin/chromium";
const browser = await chromium.launch({ headless: true, executablePath });
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

async function openJourneyPicker(page) {
  const preferred = page.locator("#journeyGenreSwitch");
  if (await preferred.isVisible()) {
    await preferred.click();
  } else {
    const controls = page.locator("[data-change-journey]");
    let activated = false;
    for (let index = 0; index < (await controls.count()); index += 1) {
      const control = controls.nth(index);
      if (await control.isVisible()) {
        await control.click();
        activated = true;
        break;
      }
    }
    assert(activated, "The current Journey needs a visible Change genre action.");
  }
  await page.locator("#journeyGenrePicker").waitFor();
  assert(
    await page.locator("#appShell").evaluate((element) => element.inert),
    "Opening Change genre should make the app background inert.",
  );
}

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(target);
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  assert(
    (await page.locator("html").getAttribute("data-theme")) === "dark",
    "Night appearance should be the default.",
  );
  assert(
    (await page.locator("#themeToggle").getAttribute("aria-label"))
      .toLowerCase()
      .includes("light"),
    "Theme toggle should describe the next appearance.",
  );
  await page.click("#themeToggle");
  assert(
    (await page.locator("html").getAttribute("data-theme")) === "light",
    "Theme toggle should switch to light.",
  );
  await page.click("#themeToggle");

  await page.click("#transportPlay");
  assert(
    await page.locator("body").evaluate((element) => element.classList.contains("is-playing")),
    "Playback state should be visible.",
  );
  assert(
    await page
      .locator("body")
      .evaluate((element) => element.classList.contains("journey-collapsed")),
    "Genre Journey should collapse when playback starts.",
  );
  await page.click("#journeyToggle");
  assert(
    !(await page
      .locator("body")
      .evaluate((element) => element.classList.contains("journey-collapsed"))),
    "Listeners should be able to reopen Genre Journey during playback.",
  );

  await page.click("#queueButton");
  assert(await page.locator("#queueDrawer").isVisible(), "Up Next drawer should open.");
  assert((await page.locator(".queue-item").count()) > 1, "Up Next should render the artist queue.");
  await page.locator(".queue-item").nth(1).click();
  assert(
    (await page.locator(".queue-item.active").count()) === 1,
    "Selecting a queued track should update the current item.",
  );
  await page.click("#closeQueue");

  await page.click("#openFullPlayer");
  assert(await page.locator("#fullPlayer").isVisible(), "Immersive player should open.");
  assert(
    (await page.locator("#fullAudioMeta").textContent()).includes("BPM"),
    "Immersive player should show audio metadata.",
  );
  const uninterruptedTrack = (await page.locator("#barTitle").textContent()).trim();
  await page.click("#fullJourney");
  assert(
    await page.locator("#fullPlayer").isHidden(),
    "Journey action should close the immersive player.",
  );
  await page.waitForTimeout(500);

  const journeyRestored = await page.locator("#directory").evaluate((element) => ({
    hidden: element.hidden,
    inert: element.inert,
    collapsed: document.body.classList.contains("journey-collapsed"),
    visibility: getComputedStyle(element).visibility,
  }));
  assert(
    !journeyRestored.hidden &&
      !journeyRestored.inert &&
      !journeyRestored.collapsed &&
      journeyRestored.visibility === "visible",
    `Journey action should reveal the desktop Genre Journey: ${JSON.stringify(journeyRestored)}`,
  );
  assert(
    await page.locator("#journeyGenreSwitch").isVisible(),
    "The route-backed artist Journey should expose Change genre.",
  );

  const paletteSignals = {};
  for (const genre of ["hiphop", "rnb", "electronic", "jazz"]) {
    await openJourneyPicker(page);
    await page.locator(`[data-picker-genre="${genre}"]`).click();
    assert(
      (await page
        .locator(`[data-picker-genre="${genre}"]`)
        .getAttribute("aria-checked")) === "true",
      `The ${genre} option should expose its selected state.`,
    );
    await page.locator("[data-confirm-journey]").click();
    await page.locator(`#journeyGenrePage[data-genre="${genre}"]`).waitFor();
    assert(
      locationHash(await page.evaluate(() => location.hash)) === `#/journeys/${genre}`,
      `Changing genre should open the ${genre} Journey route.`,
    );
    assert(
      await page
        .locator("body")
        .evaluate((element) => element.classList.contains("is-playing")),
      "Changing Journey genre must not stop playback.",
    );
    assert(
      (await page.locator("#barTitle").textContent()).trim() === uninterruptedTrack,
      "Changing Journey genre must not replace the playing song.",
    );
    paletteSignals[genre] = await page
      .locator("#journeyGenrePage")
      .evaluate((element) =>
        getComputedStyle(element).getPropertyValue("--journey-page-rgb").trim(),
      );
    assert(paletteSignals[genre], `${genre} should expose a Journey ambience signal.`);
  }
  assert(
    new Set(Object.values(paletteSignals)).size === 4,
    "All four Journey routes should have distinct ambience signals.",
  );
  await page.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(target);
  await mobile.click("#transportPlay");
  const closed = await mobile.locator("#directory").evaluate((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      position: style.position,
      transform: style.transform,
      left: rect.left,
      width: rect.width,
    };
  });
  assert(closed.position === "fixed", "Mobile Genre Journey must stay fixed off-canvas.");
  assert(closed.left + closed.width <= 2, "Mobile Genre Journey should be off-canvas during playback.");
  await mobile.click("#mobileDirectoryButton");
  await mobile.waitForTimeout(260);
  const openLeft = await mobile
    .locator("#directory")
    .evaluate((element) => element.getBoundingClientRect().left);
  assert(Math.abs(openLeft) < 2, "Mobile Genre Journey should reopen without stopping playback.");
  assert(
    await mobile
      .locator("body")
      .evaluate((element) => element.classList.contains("is-playing")),
    "Reopening the journey must not stop playback.",
  );
  assert(
    await mobile.locator("#journeyDirectorySwitch [data-change-journey]").isVisible(),
    "Mobile artist directory should make Change genre discoverable.",
  );
  await mobile.click("#closeDirectory");
  await mobile.close();
  console.log("Immersive listening test passed.");
} finally {
  await browser.close();
}

function locationHash(value) {
  return String(value || "");
}
