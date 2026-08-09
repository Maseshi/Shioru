const { createGuild, createLanguage } = require("../schemas/guild");
const { getGuild, setGuild, updateGuild } = require("../repositories/guild");

const synchronizeGuildData = async (client, guild, guildData) => {
  const fallback = createGuild();
  const metadata = {
    joinedAt: guild.joinedAt?.toISOString?.() ?? fallback.joinedAt,
    createdAt: guild.createdAt?.toISOString?.() ?? fallback.createdAt,
    description: guild.description ?? fallback.description,
    iconURL: guild.iconURL() ?? fallback.iconURL,
    preferredLocale: guild.preferredLocale ?? fallback.preferredLocale,
    memberCount: guild.memberCount ?? fallback.memberCount,
    name: guild.name ?? fallback.name,
    verified: guild.verified ?? fallback.verified,
  };

  if (!guildData) {
    const initialData = { ...metadata, language: createLanguage() };
    await setGuild(guild.id, initialData);
    return initialData;
  }

  const changes = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (guildData[key] !== value) changes[key] = value;
  }
  if (!guildData.language) changes.language = createLanguage();

  if (Object.keys(changes).length) await updateGuild(guild.id, changes);
  return { ...guildData, ...changes };
};

const updateGuildMemberCount = (guild) =>
  updateGuild(guild.id, { memberCount: guild.memberCount ?? 0 });

const initializeData = async (client, guild) => {
  const guildData = await getGuild(guild.id);
  return synchronizeGuildData(client, guild, guildData);
};

module.exports = {
  initializeData,
  synchronizeGuildData,
  updateGuildMemberCount,
};
