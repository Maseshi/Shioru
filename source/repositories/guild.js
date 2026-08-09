const { getDatabase, ref } = require("firebase/database");
const {
  trackedGet: get,
  trackedOnValue: onValue,
  trackedRemove: remove,
  trackedSet: set,
  trackedUpdate: update,
} = require("../utils/metricsUtils");
const { GuildSchema } = require("../schemas/guild");

const GuildUpdateSchema = GuildSchema.partial().strict();
const getGuildRef = (guildId) => ref(getDatabase(), `guilds/${guildId}`);

const getGuild = async (guildId) => {
  const snapshot = await get(getGuildRef(guildId));
  return snapshot.exists() ? GuildSchema.parse(snapshot.val()) : null;
};

const onGuild = (guildId, callback, onError) =>
  onValue(
    getGuildRef(guildId),
    (snapshot) =>
      callback(snapshot.exists() ? GuildSchema.parse(snapshot.val()) : null),
    onError,
  );

const setGuild = (guildId, value) =>
  set(getGuildRef(guildId), GuildSchema.parse(value));

const updateGuild = (guildId, patch) =>
  update(getGuildRef(guildId), GuildUpdateSchema.parse(patch));

const removeGuild = (guildId) => remove(getGuildRef(guildId));

module.exports = { getGuild, onGuild, removeGuild, setGuild, updateGuild };
