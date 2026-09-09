import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const [label, script] = process.argv.slice(2);
if (!label || !script) {
  console.error("Usage: node run-test-with-annotations.mjs <label> <script>");
  process.exit(2);
}

const result = spawnSync(process.execPath, [script], {
  encoding: "utf8",
  env: process.env,
  maxBuffer: 10 * 1024 * 1024,
});

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);

const status = result.status ?? 1;
const slug = label
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
const outputDir = ".qa/test-logs";
const summaryPath = ".qa/test-results.json";
mkdirSync(outputDir, { recursive: true });
const errorText = result.error?.stack || "";
const log = [
  `label=${label}`,
  `script=${script}`,
  `status=${status}`,
  "",
  "--- stdout ---",
  result.stdout || "",
  "",
  "--- stderr ---",
  result.stderr || "",
  "",
  "--- spawn error ---",
  errorText,
].join("\n");
writeFileSync(`${outputDir}/${slug}.log`, `${log}\n`);

let summary = { checkedAt: new Date().toISOString(), results: [] };
try {
  summary = JSON.parse(readFileSync(summaryPath, "utf8"));
} catch {
  // The first test creates the summary.
}
summary.checkedAt = new Date().toISOString();
summary.results = (summary.results || []).filter((item) => item.label !== label);
summary.results.push({
  label,
  script,
  status,
  log: `${outputDir}/${slug}.log`,
});
writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);

if (status !== 0) {
  const details = [result.stdout, result.stderr, errorText]
    .filter(Boolean)
    .join("\n")
    .split("\n")
    .filter((line) => line.length < 1200)
    .join("\n")
    .slice(-20000);
  const escapeWorkflowCommand = (value) =>
    String(value)
      .replaceAll("%", "%25")
      .replaceAll("\r", "%0D")
      .replaceAll("\n", "%0A");
  console.log(
    `::error title=${escapeWorkflowCommand(label)}::${escapeWorkflowCommand(details)}`,
  );
}

process.exit(status);
