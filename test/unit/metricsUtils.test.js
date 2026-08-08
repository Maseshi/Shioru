const assert = require("node:assert/strict");
const test = require("node:test");
const {
  getMetricsReport,
  initializeMetrics,
  logMetrics,
  recordMetricsCache,
} = require("../../source/utils/metricsUtils");

const createClient = ({ enabled = true } = {}) => ({
  configs: {
    metrics: { enabled, label: "unit-test" },
  },
  logger: {
    info: () => undefined,
  },
});

test("Firebase metrics reports cache hits and misses", () => {
  initializeMetrics(createClient());

  recordMetricsCache(true);
  recordMetricsCache(true);
  recordMetricsCache(false);

  const report = getMetricsReport();
  assert.deepEqual(report.total.cache, {
    hits: 2,
    misses: 1,
    hitRate: 0.6667,
  });
  assert.deepEqual(report.interval.cache, {
    hits: 2,
    misses: 1,
    hitRate: 0.6667,
  });
});

test("advancing a report resets only the interval counters", () => {
  initializeMetrics(createClient());
  recordMetricsCache(true);
  getMetricsReport({ advance: true });
  recordMetricsCache(false);

  const report = getMetricsReport();
  assert.deepEqual(report.interval.cache, {
    hits: 0,
    misses: 1,
    hitRate: 0,
  });
  assert.deepEqual(report.total.cache, {
    hits: 1,
    misses: 1,
    hitRate: 0.5,
  });
});

test("logMetrics emits a structured report", () => {
  const calls = [];
  const client = createClient();
  client.logger.info = (...arguments_) => calls.push(arguments_);
  initializeMetrics(client);

  const report = logMetrics("shutdown");

  assert.equal(calls.length, 1);
  assert.equal(calls[0][0].reason, "shutdown");
  assert.deepEqual(calls[0][0].firebaseMetrics, report);
  assert.equal(calls[0][1], "Firebase traffic metrics.");
});

test("disabled Firebase metrics ignores cache activity and logging", () => {
  initializeMetrics(createClient({ enabled: false }));
  recordMetricsCache(true);

  assert.equal(getMetricsReport().total.cache.hits, 0);
  assert.equal(logMetrics(), null);
});
