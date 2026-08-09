const { child, getDatabase, ref } = require("firebase/database");
const {
  trackedGet: get,
  trackedRemove: remove,
  trackedRunTransaction: runTransaction,
  trackedUpdate: update,
} = require("../utils/metricsUtils");
const {
  LevelingSchema,
  UserSchema,
  createLeveling,
  createUser,
} = require("../schemas/leveling");

const UserProfileSchema = UserSchema.pick({
  username: true,
  avatar: true,
}).strict();

const getUserRef = (userId) => ref(getDatabase(), `users/${userId}`);

const getUser = async (userId) => {
  const snapshot = await get(getUserRef(userId));
  return snapshot.exists() ? UserSchema.parse(snapshot.val()) : null;
};

const getUserEphemeral = async (userId) => {
  const snapshot = await get(child(getUserRef(userId), "settings/ephemeral"));
  return snapshot.exists() ? snapshot.val() === true : true;
};

const ensureUser = async (userId, profile = {}) => {
  const userRef = getUserRef(userId);
  return runTransaction(userRef, (currentUser) =>
    createUser({
      ...(currentUser ?? {}),
      ...profile,
      leveling: LevelingSchema.parse(
        currentUser?.leveling ?? { exp: 0, level: 0 },
      ),
    }),
  );
};

const updateUserProfile = (userId, profile) =>
  update(getUserRef(userId), UserProfileSchema.parse(profile));

const setUserEphemeral = async (userId, ephemeral) => {
  const result = await runTransaction(getUserRef(userId), (currentUser) =>
    createUser({
      ...(currentUser ?? {}),
      settings: {
        ...(currentUser?.settings ?? {}),
        ephemeral,
      },
    }),
  );
  return result.snapshot.val().settings.ephemeral;
};

const removeUser = (userId) => remove(getUserRef(userId));

const setUserLeveling = async (userId, value) => {
  const levelingRef = child(getUserRef(userId), "leveling");
  const result = await runTransaction(levelingRef, () =>
    LevelingSchema.parse(value),
  );
  return LevelingSchema.parse(result.snapshot.val());
};

const resetUserLeveling = (userId) => setUserLeveling(userId, createLeveling());

const setUserLevelingValue = async (userId, type, amount) => {
  const levelingRef = child(getUserRef(userId), "leveling");
  const result = await runTransaction(levelingRef, (currentLeveling) =>
    LevelingSchema.parse({
      ...(currentLeveling ?? { exp: 0, level: 0 }),
      [type]: amount,
    }),
  );
  return LevelingSchema.parse(result.snapshot.val());
};

const incrementUserLevelingValue = async (userId, type, amount) => {
  const levelingRef = child(getUserRef(userId), "leveling");
  const result = await runTransaction(levelingRef, (currentLeveling) => {
    const leveling = LevelingSchema.parse(currentLeveling ?? createLeveling());
    return LevelingSchema.parse({
      ...leveling,
      [type]: leveling[type] + amount,
    });
  });
  return LevelingSchema.parse(result.snapshot.val());
};

const incrementUserExperience = async (userId, amount) => {
  let leveledUp = false;
  let previousLevel = 0;
  const levelingRef = child(getUserRef(userId), "leveling");
  const transactionResult = await runTransaction(
    levelingRef,
    (currentLeveling) => {
      const leveling = LevelingSchema.parse(
        currentLeveling ?? { exp: 0, level: 0 },
      );
      const levelup = leveling.level * leveling.level * 200;

      previousLevel = leveling.level;
      leveling.exp += amount;
      leveledUp = leveling.exp >= levelup;

      if (leveledUp) {
        leveling.exp -= levelup;
        leveling.level += 1;
      }

      return LevelingSchema.parse(leveling);
    },
  );

  return {
    leveling: LevelingSchema.parse(transactionResult.snapshot.val()),
    leveledUp,
    previousLevel,
  };
};

module.exports = {
  ensureUser,
  getUser,
  getUserEphemeral,
  getUserRef,
  incrementUserExperience,
  incrementUserLevelingValue,
  removeUser,
  resetUserLeveling,
  setUserLeveling,
  setUserLevelingValue,
  setUserEphemeral,
  updateUserProfile,
};
