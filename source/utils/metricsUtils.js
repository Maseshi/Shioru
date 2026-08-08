const {
  get,
  onValue,
  push,
  remove,
  runTransaction,
  set,
  update,
} = require("firebase/database");

let metrics = null;

const createCounter = () => ({ operations: 0, bytes: 0 });

const estimateBytes = (value) => {
  try {
    return Buffer.byteLength(JSON.stringify(value ?? null), "utf8");
  } catch {
    return 0;
  }
};

const normalizePath = (target) => {
  try {
    const pathname = new URL(target.toString()).pathname;
    const segments = decodeURIComponent(pathname)
      .split("/")
      .filter(Boolean)
      .map((segment) =>
        /^\d{15,22}$/.test(segment) ||
        /^-[A-Za-z0-9_-]{16,}$/.test(segment) ||
        segment.length > 40
          ? ":id"
          : segment,
      );
    return segments.length ? segments.join("/") : "/";
  } catch {
    return "unknown";
  }
};

const ensureOperation = (operation) => {
  if (!metrics) return null;
  if (!metrics.operations[operation])
    metrics.operations[operation] = createCounter();
  return metrics.operations[operation];
};

const record = (category, operation, target, value) => {
  if (!metrics?.enabled) return;

  const bytes = estimateBytes(value);
  metrics.totals[category].operations += 1;
  metrics.totals[category].bytes += bytes;

  const operationCounter = ensureOperation(operation);
  operationCounter.operations += 1;
  operationCounter.bytes += bytes;

  const path = normalizePath(target);
  const pathCounter = metrics.paths.get(path) ?? {
    reads: 0,
    writes: 0,
    bytes: 0,
  };
  pathCounter[category] += 1;
  pathCounter.bytes += bytes;
  metrics.paths.set(path, pathCounter);
};

const initializeMetrics = (client) => {
  const enabled = client.configs.metrics.enabled;
  metrics = {
    client,
    enabled,
    label: client.configs.metrics.label,
    startedAt: Date.now(),
    previousAt: Date.now(),
    totals: {
      reads: createCounter(),
      writes: createCounter(),
      cache: { hits: 0, misses: 0 },
    },
    operations: {},
    paths: new Map(),
    previous: {
      reads: createCounter(),
      writes: createCounter(),
      cache: { hits: 0, misses: 0 },
    },
  };

  return metrics;
};

const recordMetricsCache = (hit) => {
  if (!metrics?.enabled) return;
  metrics.totals.cache[hit ? "hits" : "misses"] += 1;
};

const trackedGet = async (target) => {
  const snapshot = await get(target);
  record("reads", "get", target, snapshot.val());
  return snapshot;
};

const trackedOnValue = (target, callback, cancelCallback, options) => {
  const trackedCallback = (snapshot) => {
    record("reads", "listener", target, snapshot.val());
    callback(snapshot);
  };

  if (options !== undefined)
    return onValue(target, trackedCallback, cancelCallback, options);
  if (cancelCallback !== undefined)
    return onValue(target, trackedCallback, cancelCallback);
  return onValue(target, trackedCallback);
};

const trackedSet = async (target, value) => {
  await set(target, value);
  record("writes", "set", target, value);
};

const trackedUpdate = async (target, values) => {
  await update(target, values);
  record("writes", "update", target, values);
};

const trackedRemove = async (target) => {
  await remove(target);
  record("writes", "remove", target, null);
};

const trackedPush = async (target, value) => {
  const result = await push(target, value);
  record("writes", "push", target, value);
  return result;
};

const trackedRunTransaction = async (target, transactionUpdate, options) => {
  const result = await runTransaction(target, transactionUpdate, options);
  record("reads", "transaction-read", target, result.snapshot.val());
  if (result.committed)
    record("writes", "transaction-write", target, result.snapshot.val());
  return result;
};

const counterDelta = (current, previous) => ({
  operations: current.operations - previous.operations,
  bytes: current.bytes - previous.bytes,
});

const getMetricsReport = ({ advance = false } = {}) => {
  if (!metrics) return null;

  const now = Date.now();
  const { totals, previous } = metrics;
  const cacheRequests = totals.cache.hits + totals.cache.misses;
  const previousCacheRequests = previous.cache.hits + previous.cache.misses;
  const intervalCacheRequests = cacheRequests - previousCacheRequests;
  const intervalSeconds = Math.max((now - metrics.previousAt) / 1000, 0.001);
  const intervalReads = counterDelta(totals.reads, previous.reads);
  const intervalWrites = counterDelta(totals.writes, previous.writes);
  const report = {
    label: metrics.label,
    elapsedSeconds: Math.round((now - metrics.startedAt) / 1000),
    intervalSeconds: Math.round(intervalSeconds),
    interval: {
      reads: intervalReads,
      writes: intervalWrites,
      perMinute: {
        reads: Number(
          ((intervalReads.operations * 60) / intervalSeconds).toFixed(2),
        ),
        readBytes: Number(
          ((intervalReads.bytes * 60) / intervalSeconds).toFixed(2),
        ),
        writes: Number(
          ((intervalWrites.operations * 60) / intervalSeconds).toFixed(2),
        ),
        writeBytes: Number(
          ((intervalWrites.bytes * 60) / intervalSeconds).toFixed(2),
        ),
      },
      cache: {
        hits: totals.cache.hits - previous.cache.hits,
        misses: totals.cache.misses - previous.cache.misses,
        hitRate:
          intervalCacheRequests > 0
            ? Number(
                (
                  (totals.cache.hits - previous.cache.hits) /
                  intervalCacheRequests
                ).toFixed(4),
              )
            : 0,
      },
    },
    total: {
      reads: { ...totals.reads },
      writes: { ...totals.writes },
      cache: {
        ...totals.cache,
        hitRate:
          cacheRequests > 0
            ? Number((totals.cache.hits / cacheRequests).toFixed(4))
            : 0,
      },
    },
    operations: Object.fromEntries(
      Object.entries(metrics.operations).map(([operation, counter]) => [
        operation,
        { ...counter },
      ]),
    ),
    topPaths: [...metrics.paths.entries()]
      .sort((first, second) => second[1].bytes - first[1].bytes)
      .slice(0, 10)
      .map(([path, counter]) => ({ path, ...counter })),
  };

  if (advance) {
    metrics.previous = {
      reads: { ...totals.reads },
      writes: { ...totals.writes },
      cache: { ...totals.cache },
    };
    metrics.previousAt = now;
  }

  return report;
};

const logMetrics = (reason = "interval") => {
  if (!metrics?.enabled) return null;
  const report = getMetricsReport({ advance: true });
  metrics.client.logger.info(
    { reason, firebaseMetrics: report },
    "Firebase traffic metrics.",
  );
  return report;
};

module.exports = {
  getMetricsReport,
  initializeMetrics,
  logMetrics,
  recordMetricsCache,
  trackedGet,
  trackedOnValue,
  trackedPush,
  trackedRemove,
  trackedRunTransaction,
  trackedSet,
  trackedUpdate,
};
