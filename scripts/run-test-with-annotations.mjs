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
if (status !== 0) {
  const details = [result.stdout, result.stderr, result.error?.stack]
    .filter(Boolean)
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
