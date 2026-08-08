const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const { mkdtempSync, readFileSync, rmSync, writeFileSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join, resolve } = require("node:path");
const test = require("node:test");
const {
  findLogFile,
  formatLogDate,
  getLogPath,
  isLogDate,
  listLogFiles,
} = require("../../source/utils/logUtils");

const withTempDirectory = async (callback) => {
  const directory = mkdtempSync(join(tmpdir(), "shioru-logs-"));
  try {
    return await callback(directory);
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
};

test("log dates and paths accept only supported daily log names", () => {
  assert.equal(formatLogDate(new Date(2026, 7, 9)), "2026-08-09");
  assert.equal(isLogDate("2026-08-09"), true);
  assert.equal(isLogDate("2026-02-30"), false);
  assert.equal(isLogDate("../2026-08-09"), false);
  assert.match(
    getLogPath("error", "2026-08-09", "logs"),
    /logs[\\/]error\.2026-08-09\.1\.log$/,
  );
  assert.equal(getLogPath("debug", "2026-08-09", "logs"), null);
  assert.equal(getLogPath("app", "2026-08-09", "logs", 0), null);
});

test("Pino writes all logs to app files and errors to dedicated files", async () => {
  await withTempDirectory(async (directory) => {
    const result = spawnSync(
      process.execPath,
      [
        "-e",
        [
          'const { logger } = require("./source/utils/logUtils");',
          'logger.info("logger integration info");',
          'logger.error("logger integration error");',
          "setTimeout(() => {}, 100);",
        ].join(" "),
      ],
      {
        cwd: resolve(__dirname, "../.."),
        encoding: "utf-8",
        env: {
          ...process.env,
          LOG_DIRECTORY: directory,
          NODE_ENV: "production",
        },
        timeout: 10_000,
      },
    );

    assert.equal(result.status, 0, result.stderr);
    const date = formatLogDate();
    const appLog = readFileSync(getLogPath("app", date, directory), "utf-8");
    const errorLog = readFileSync(
      getLogPath("error", date, directory),
      "utf-8",
    );
    assert.match(appLog, /logger integration info/);
    assert.match(appLog, /logger integration error/);
    assert.doesNotMatch(errorLog, /logger integration info/);
    assert.match(errorLog, /logger integration error/);
  });
});

test("log listing ignores unrelated files and sorts newest first", async () => {
  await withTempDirectory(async (directory) => {
    writeFileSync(join(directory, "app.2026-08-08.1.log"), "old");
    writeFileSync(join(directory, "error.2026-08-09.1.log"), "newer");
    writeFileSync(join(directory, "notes.txt"), "ignored");

    assert.deepEqual(
      listLogFiles(directory).map(({ name }) => name),
      ["error.2026-08-09.1.log", "app.2026-08-08.1.log"],
    );
  });
});

test("log lookup returns the newest segment for a requested type and date", async () => {
  await withTempDirectory(async (directory) => {
    writeFileSync(join(directory, "app.2026-08-09.1.log"), "first");
    writeFileSync(join(directory, "app.2026-08-09.2.log"), "second");
    writeFileSync(join(directory, "error.2026-08-09.1.log"), "error");

    assert.equal(
      findLogFile("app", "2026-08-09", directory).name,
      "app.2026-08-09.2.log",
    );
  });
});
