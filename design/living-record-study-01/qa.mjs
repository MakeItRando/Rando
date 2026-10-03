import playwright from "/data/Rando-candidate/node_modules/playwright/index.js";
import { mkdir } from "node:fs/promises";

const { chromium } = playwright;

const output = "/data/rondo-design-lab/qa";
await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/local/bin/chromium",
});

const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});

const errors = [];
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));

await page.goto("file:///data/rondo-design-lab/index.html");
await page.waitForLoadState("load");

const layout = await page.evaluate(() => ({
  viewport: document.documentElement.clientWidth,
  document: document.documentElement.scrollWidth,
  title: document.title,
}));

if (layout.document !== layout.viewport) {
  throw new Error(`Horizontal overflow: ${layout.document}px / ${layout.viewport}px`);
}

const scenes = ["welcome", "discover", "journey", "artist", "room"];
for (const scene of scenes) {
  await page.locator(`[data-scene="${scene}"]`).click();
  const screen = page.locator(`[data-screen="${scene}"]`);
  await screen.waitFor({ state: "visible" });
  await page.locator(".phone").screenshot({
    path: `${output}/${scene}.png`,
    animations: "disabled",
  });
}

await page.locator('[data-scene="artist"]').click();
await page.locator(".follow-button").click();
if (!(await page.locator(".follow-button").getAttribute("class")).includes("is-following")) {
  throw new Error("Follow control did not change state");
}

await page.locator('[data-scene="room"]').click();
await page.locator(".save-button").click();
if ((await page.locator(".save-button").textContent()).trim() !== "♥") {
  throw new Error("Save control did not change state");
}

await page.locator(".prototype-section").screenshot({
  path: `${output}/prototype-section.png`,
  animations: "disabled",
});
await page.addStyleTag({
  content: ".study-header { position: absolute !important; }",
});
await page.locator(".system-section").screenshot({
  path: `${output}/system-section.png`,
  animations: "disabled",
});
await page.locator(".desktop-study").screenshot({
  path: `${output}/desktop-study.png`,
  animations: "disabled",
});

if (errors.length) {
  throw new Error(`Console errors:\n${errors.join("\n")}`);
}

console.log(
  JSON.stringify(
    {
      passed: true,
      scenes,
      interactions: ["scene switching", "follow", "save"],
      screenshots: scenes.length + 3,
      layout,
      consoleErrors: errors.length,
    },
    null,
    2,
  ),
);

await browser.close();