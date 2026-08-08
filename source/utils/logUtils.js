const { readdirSync, statSync } = require("node:fs");
const { join, resolve } = require("node:path");
const pino = require("pino");
const packages = require("../../package.json");

const LOG_DIRECTORY = resolve(process.env.LOG_DIRECTORY ?? "logs");
const LOG_FILE_PATTERN = /^(app|error)\.(\d{4}-\d{2}-\d{2})(?:\.(\d+))?\.log$/;
const LOG_TYPES = new Set(["app", "error"]);
let loggerInstance;

const createLogger = () => {
  const loggerOptions = {
    name: packages.name,
    level: process.env.LOG_LEVEL ?? "info",
  };
  const retentionDays = Math.min(
    Math.max(Math.trunc(Number(process.env.LOG_RETENTION_DAYS)) || 14, 1),
    365,
  );
  const consoleStream =
    process.env.NODE_ENV === "production"
      ? process.stdout
      : pino.transport({ target: "pino-pretty" });
  const rollOptions = (type) => ({
    dateFormat: "yyyy-MM-dd",
    extension: "log",
    file: join(LOG_DIRECTORY, type),
    frequency: "daily",
    limit: { count: retentionDays, removeOtherLogFiles: true },
    mkdir: true,
  });
  const fileTransport = pino.transport({
    targets: [
      {
        level: loggerOptions.level,
        options: rollOptions("app"),
        target: "pino-roll",
      },
      {
        level: "error",
        options: rollOptions("error"),
        target: "pino-roll",
      },
    ],
  });

  fileTransport.on("error", (error) =>
    process.stderr.write(`Application file logger failed: ${error.message}\n`),
  );

  return pino(
    loggerOptions,
    pino.multistream([
      { level: loggerOptions.level, stream: consoleStream },
      { level: loggerOptions.level, stream: fileTransport },
    ]),
  );
};

const getLogger = () => {
  loggerInstance ??= createLogger();
  return loggerInstance;
};

const formatLogDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isLogDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);
  return formatLogDate(parsed) === value;
};

const getLogPath = (type, date, directory = LOG_DIRECTORY, sequence = 1) => {
  if (!LOG_TYPES.has(type) || !isLogDate(date)) return null;
  if (!Number.isInteger(sequence) || sequence < 1) return null;
  return resolve(directory, `${type}.${date}.${sequence}.log`);
};

const listLogFiles = (directory = LOG_DIRECTORY) => {
  try {
    return readdirSync(directory)
      .map((name) => {
        const match = LOG_FILE_PATTERN.exec(name);
        if (!match) return null;

        const path = resolve(directory, name);
        return {
          date: match[2],
          name,
          path,
          sequence: Number(match[3] ?? 0),
          size: statSync(path).size,
          type: match[1],
        };
      })
      .filter(Boolean)
      .sort(
        (left, right) =>
          right.date.localeCompare(left.date) ||
          left.type.localeCompare(right.type) ||
          right.sequence - left.sequence,
      );
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
};

const findLogFile = (type, date, directory = LOG_DIRECTORY) =>
  listLogFiles(directory).find(
    (file) => file.type === type && file.date === date,
  ) ?? null;

const logUtils = {
  createLogger,
  LOG_DIRECTORY,
  findLogFile,
  formatLogDate,
  getLogPath,
  isLogDate,
  listLogFiles,
};

Object.defineProperty(logUtils, "logger", {
  enumerable: true,
  get: getLogger,
});

module.exports = logUtils;
