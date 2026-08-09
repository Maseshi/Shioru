const {
  child,
  getDatabase,
  increment,
  limitToLast,
  orderByChild,
  query,
  ref,
} = require("firebase/database");
const {
  trackedGet: get,
  trackedRemove: remove,
  trackedRunTransaction: runTransaction,
  trackedSet: set,
} = require("../utils/metricsUtils");
const { createLeaderboardEntry } = require("../schemas/leaderboard");

const getUserRef = (userId) => ref(getDatabase(), `users/${userId}`);

const getLeaderboardRef = (guildId, userId) =>
  ref(getDatabase(), `leaderboards/${guildId}/${userId}`);

const setLeaderboardLevelingValue = async (userId, guildId, type, amount) => {
  if (!guildId) return null;

  const leaderboardRef = getLeaderboardRef(guildId, userId);
  const result = await runTransaction(leaderboardRef, (currentLeaderboard) =>
    createLeaderboardEntry({
      ...(currentLeaderboard ?? { exp: 0, level: 0 }),
      [type]: amount,
    }),
  );
  return createLeaderboardEntry(result.snapshot.val());
};

const incrementLeaderboardLevelingValue = async (
  userId,
  guildId,
  type,
  amount,
) => {
  if (!guildId) return null;

  const result = await runTransaction(
    getLeaderboardRef(guildId, userId),
    (currentLeaderboard) => {
      const current = createLeaderboardEntry(currentLeaderboard ?? {});
      return createLeaderboardEntry({
        ...current,
        [type]: current[type] + amount,
      });
    },
  );
  return createLeaderboardEntry(result.snapshot.val());
};

const removeLeaderboardEntry = (guildId, userId) =>
  remove(getLeaderboardRef(guildId, userId));

const getLeaderboard = async (guildId, maximum = 10) => {
  const leaderboardQuery = query(
    ref(getDatabase(), `leaderboards/${guildId}`),
    orderByChild("exp"),
    limitToLast(maximum),
  );
  const snapshot = await get(leaderboardQuery);
  return snapshot.exists() ? snapshot : null;
};

const updateLeaderboardExperience = async (cache, userId, guildId, amount) => {
  if (!guildId) return;
  if (!cache.leaderboardUsers) cache.leaderboardUsers = new Set();

  const cacheKey = `${guildId}:${userId}`;
  const leaderboardRef = getLeaderboardRef(guildId, userId);
  const leaderboardExpRef = child(leaderboardRef, "exp");

  if (cache.leaderboardUsers.has(cacheKey)) {
    await set(leaderboardExpRef, increment(amount));
    return;
  }

  const leaderboardSnapshot = await get(leaderboardRef);
  if (leaderboardSnapshot.exists()) {
    await set(leaderboardExpRef, increment(amount));
  } else {
    const legacySnapshot = await get(
      child(child(getUserRef(userId), "guildLeveling"), guildId),
    );
    const legacyLeveling = legacySnapshot.val() ?? {};

    await runTransaction(leaderboardRef, (currentLeaderboard) => {
      const current = currentLeaderboard ?? legacyLeveling;
      return createLeaderboardEntry({
        exp: (Number(current.exp) || 0) + amount,
        level: Number(current.level) || 0,
      });
    });
  }

  cache.leaderboardUsers.add(cacheKey);
};

module.exports = {
  getLeaderboard,
  incrementLeaderboardLevelingValue,
  removeLeaderboardEntry,
  setLeaderboardLevelingValue,
  updateLeaderboardExperience,
};
