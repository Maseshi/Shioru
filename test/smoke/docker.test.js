const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const composeArguments = ["compose", "--file", "docker/compose.yaml"];
const runDocker = (arguments_, { allowFailure = false } = {}) => {
  const result = spawnSync("docker", arguments_, {
    cwd: process.cwd(),
    encoding: "utf8",
    windowsHide: true,
  });
  if (!allowFailure && result.status !== 0) {
    throw new Error(
      [result.error?.message, result.stdout, result.stderr]
        .filter(Boolean)
        .join("\n"),
    );
  }
  return result;
};
const waitForHealthy = async (containerId, timeout = 120_000) => {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const result = runDocker(
      ["inspect", "--format", "{{.State.Health.Status}}", containerId],
      { allowFailure: true },
    );
    if (result.stdout.trim() === "healthy") return;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error("Container did not become healthy before the timeout.");
};

const dockerInfo = runDocker(["info"], { allowFailure: true });
const dockerAvailable = dockerInfo.status === 0;

test(
  "Docker Compose configuration is valid",
  { skip: !dockerAvailable },
  () => {
    const result = runDocker([...composeArguments, "config", "--quiet"]);
    assert.equal(result.status, 0);
  },
);

test(
  "running bot container is non-root, healthy, and serves health endpoints",
  {
    skip: !dockerAvailable,
  },
  async () => {
    const containerId = runDocker([
      ...composeArguments,
      "ps",
      "--quiet",
      "bot",
    ]).stdout.trim();
    assert.ok(
      containerId,
      "Start the service with npm run docker:up before the Docker smoke test.",
    );

    const inspection = JSON.parse(
      runDocker(["inspect", containerId]).stdout,
    )[0];
    assert.equal(inspection.Config.User, "node");
    assert.equal(inspection.State.Health.Status, "healthy");

    const published = runDocker([
      ...composeArguments,
      "port",
      "bot",
      "3000",
    ]).stdout.trim();
    const port = published.match(/:(\d+)$/)?.[1];
    assert.ok(port, `Unable to parse published port from ${published}`);

    const root = await fetch(`http://127.0.0.1:${port}/`);
    assert.equal(root.status, 200);
    const health = await fetch(`http://127.0.0.1:${port}/health`);
    assert.equal(health.status, 200);
    assert.ok(Array.isArray(await health.json()));

    const logs = runDocker([
      ...composeArguments,
      "logs",
      "--no-color",
      "--tail",
      "500",
      "bot",
    ]).stdout;
    const knownErrors = [
      "ERR_IPC_CHANNEL_CLOSED",
      "channel is not defined",
      "fetchStatistics is not defined",
      "Interaction has already been acknowledged",
    ];
    for (const signature of knownErrors) {
      assert.equal(logs.includes(signature), false, signature);
    }
  },
);

test(
  "bot remains healthy after an explicitly enabled restart smoke test",
  {
    skip: !dockerAvailable || process.env.RUN_DOCKER_RESTART_SMOKE !== "1",
    timeout: 150_000,
  },
  async () => {
    runDocker([...composeArguments, "restart", "bot"]);
    const containerId = runDocker([
      ...composeArguments,
      "ps",
      "--quiet",
      "bot",
    ]).stdout.trim();
    assert.ok(containerId);
    await waitForHealthy(containerId);
  },
);
