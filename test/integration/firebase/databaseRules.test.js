const assert = require("node:assert/strict");
const test = require("node:test");
const { deleteApp, initializeApp } = require("firebase/app");
const {
  child,
  connectDatabaseEmulator,
  get: firebaseGet,
  getDatabase,
  goOffline,
  increment,
  ref,
  set: firebaseSet,
} = require("firebase/database");
const {
  getMetricsReport,
  initializeMetrics,
  trackedGet: get,
  trackedRemove: remove,
  trackedSet: set,
} = require("../../../source/utils/metricsUtils");

const emulatorConfig = JSON.parse(process.env.FIREBASE_CONFIG ?? "{}");
const projectId = emulatorConfig.projectId ?? "demo-shioru";
const firebaseOptions = {
  projectId,
  databaseURL: `https://${projectId}-default-rtdb.firebaseio.com`,
};

const connectToEmulator = (database, mockUserToken) => {
  const emulatorHost = process.env.FIREBASE_DATABASE_EMULATOR_HOST;
  assert.ok(
    emulatorHost,
    "Run this test through npm run test:integration",
  );
  const [host, port] = emulatorHost.split(":");
  const options = mockUserToken ? { mockUserToken } : undefined;
  connectDatabaseEmulator(database, host, Number(port), options);
};

const seedAccess = async (uid) => {
  const emulatorHost = process.env.FIREBASE_DATABASE_EMULATOR_HOST;
  assert.ok(emulatorHost);

  const response = await fetch(
    `http://${emulatorHost}/access/${uid}.json?ns=${projectId}-default-rtdb`,
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer owner",
        "Content-Type": "application/json",
      },
      body: "true",
    },
  );
  assert.equal(response.ok, true, await response.text());
};

test("Realtime Database rules and metrics work through the emulator", async (t) => {
  initializeMetrics({
    configs: { metrics: { enabled: true, label: "rules-test" } },
    logger: { info: () => undefined },
  });

  const botApp = initializeApp(firebaseOptions, "rules-test-bot");
  const publicApp = initializeApp(firebaseOptions, "rules-test-public");
  const allowedApp = initializeApp(firebaseOptions, "rules-test-allowed");
  const deniedApp = initializeApp(firebaseOptions, "rules-test-denied");
  const botDatabase = getDatabase(botApp);
  const publicDatabase = getDatabase(publicApp);
  const allowedDatabase = getDatabase(allowedApp);
  const deniedDatabase = getDatabase(deniedApp);

  connectToEmulator(botDatabase, { sub: "rules-bot", bot: true });
  connectToEmulator(publicDatabase);
  connectToEmulator(allowedDatabase, { sub: "rules-allowed" });
  connectToEmulator(deniedDatabase, { sub: "rules-denied" });

  t.after(async () => {
    goOffline(botDatabase);
    goOffline(publicDatabase);
    goOffline(allowedDatabase);
    goOffline(deniedDatabase);
    await Promise.all([
      deleteApp(botApp),
      deleteApp(publicApp),
      deleteApp(allowedApp),
      deleteApp(deniedApp),
    ]);
  });

  await seedAccess("rules-allowed");

  assert.equal(
    (await firebaseGet(ref(publicDatabase, "maintenance"))).exists(),
    false,
  );
  assert.equal(
    (await firebaseGet(ref(publicDatabase, "information"))).exists(),
    false,
  );
  assert.equal(
    (await firebaseGet(ref(publicDatabase, "statistics"))).exists(),
    false,
  );
  await assert.rejects(firebaseGet(ref(publicDatabase, "chat")));
  await assert.rejects(firebaseGet(ref(publicDatabase, "issues")));
  await assert.rejects(firebaseGet(ref(publicDatabase, "guilds")));
  await assert.rejects(firebaseGet(ref(publicDatabase, "users")));

  await firebaseSet(ref(botDatabase, "information/version"), "test");
  await firebaseSet(ref(botDatabase, "statistics/size/worked"), 1);
  await firebaseSet(ref(botDatabase, "chat/system"), "test");
  await firebaseSet(ref(botDatabase, "issues/bugs/rules-test"), {
    title: "Rules test",
  });
  await firebaseSet(ref(botDatabase, "users/rules-user"), {
    leveling: { exp: 0, level: 0 },
  });

  const leaderboardRef = ref(
    botDatabase,
    "leaderboards/rules-guild/rules-user",
  );
  await set(leaderboardRef, { exp: 1, level: 0 });
  assert.equal((await get(leaderboardRef)).val().exp, 1);
  await firebaseSet(child(leaderboardRef, "exp"), increment(1));
  assert.equal((await firebaseGet(leaderboardRef)).val().exp, 2);

  await assert.rejects(
    set(ref(publicDatabase, "leaderboards/rules-guild/public-user"), {
      exp: 1,
      level: 0,
    }),
  );
  await assert.rejects(
    set(ref(botDatabase, "leaderboards/rules-guild/invalid-type"), {
      exp: "1",
      level: 0,
    }),
  );
  await assert.rejects(
    set(ref(botDatabase, "leaderboards/rules-guild/missing-level"), {
      exp: 1,
    }),
  );
  await assert.rejects(
    set(ref(botDatabase, "leaderboards/rules-guild/unknown-field"), {
      exp: 1,
      level: 0,
      admin: true,
    }),
  );

  const allowedGuildRef = ref(allowedDatabase, "guilds/rules-guild");
  await firebaseSet(allowedGuildRef, { name: "Allowed guild" });
  assert.equal((await firebaseGet(allowedGuildRef)).val().name, "Allowed guild");
  await firebaseSet(ref(allowedDatabase, "chat/rules-test"), "allowed");
  assert.equal(
    (await firebaseGet(ref(allowedDatabase, "chat/rules-test"))).val(),
    "allowed",
  );

  await assert.rejects(firebaseGet(ref(deniedDatabase, "users")));
  await assert.rejects(
    firebaseSet(ref(deniedDatabase, "guilds/rules-guild"), {
      name: "Denied guild",
    }),
  );

  await remove(leaderboardRef);

  const metrics = getMetricsReport();
  assert.equal(metrics.total.reads.operations, 1);
  assert.equal(metrics.total.writes.operations, 2);
  assert.equal(metrics.operations.get.operations, 1);
  assert.equal(metrics.operations.set.operations, 1);
  assert.equal(metrics.operations.remove.operations, 1);
});
