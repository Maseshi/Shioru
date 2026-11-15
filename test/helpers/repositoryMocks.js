const { requireWithMocks } = require("./requireWithMocks");

const firebasePath = require.resolve("firebase/database");
const metricsPath = require.resolve("../../source/utils/metricsUtils");

const loadRepository = (target, initialValues = {}) => {
  const calls = [];
  const values = new Map(Object.entries(initialValues));
  const reference = (path) => ({ path });
  const snapshot = (value) => ({
    exists: () => value !== null && value !== undefined,
    val: () => value ?? null,
  });

  const firebase = {
    child: (parent, name) => reference(`${parent.path}/${name}`),
    getDatabase: () => ({}),
    increment: (amount) => ({ ".sv": { increment: amount } }),
    limitToLast: (maximum) => ({ maximum, type: "limit" }),
    orderByChild: (key) => ({ key, type: "order" }),
    query: (targetRef, ...constraints) => ({
      ...targetRef,
      constraints,
    }),
    ref: (_database, path = "") => reference(path),
  };
  const metrics = {
    trackedGet: async (targetRef) => snapshot(values.get(targetRef.path)),
    trackedOnValue: (targetRef, callback) => {
      calls.push(["listen", targetRef.path]);
      callback(snapshot(values.get(targetRef.path)));
      return () => calls.push(["unsubscribe", targetRef.path]);
    },
    trackedPush: async (targetRef, value) => {
      calls.push(["push", targetRef.path, value]);
      return { key: "generated-key" };
    },
    trackedRemove: async (targetRef) => calls.push(["remove", targetRef.path]),
    trackedRunTransaction: async (targetRef, callback) => {
      const value = callback(values.get(targetRef.path) ?? null);
      values.set(targetRef.path, value);
      calls.push(["transaction", targetRef.path, value]);
      return { committed: true, snapshot: snapshot(value) };
    },
    trackedSet: async (targetRef, value) => {
      values.set(targetRef.path, value);
      calls.push(["set", targetRef.path, value]);
    },
    trackedUpdate: async (targetRef, value) =>
      calls.push(["update", targetRef.path, value]),
  };

  const repository = requireWithMocks(target, {
    [firebasePath]: firebase,
    [metricsPath]: metrics,
  });
  return { calls, repository, values };
};

module.exports = { loadRepository };
