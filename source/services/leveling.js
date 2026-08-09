const { EmbedBuilder } = require("discord.js");
const {
  incrementLeaderboardLevelingValue,
  removeLeaderboardEntry,
  setLeaderboardLevelingValue,
  updateLeaderboardExperience,
} = require("../repositories/leaderboard");
const {
  ensureUser,
  getUser,
  incrementUserExperience,
  incrementUserLevelingValue,
  resetUserLeveling,
  setUserLeveling,
  setUserLevelingValue,
  syncUserProfile,
  updateUserProfile,
} = require("../repositories/user");
const { submitNotification } = require("./notification");

const createLevelUpEmbed = (client, username, avatar, level) => {
  const embed = new EmbedBuilder()
    .setTitle(client.i18n.t("utils.databaseUtils.congratulations"))
    .setDescription(
      client.i18n.t("utils.databaseUtils.level_up", {
        username: username,
        level: level,
      }),
    )
    .setColor("Yellow");
  if (avatar) embed.setThumbnail(avatar);
  return embed;
};

const getAuthor = (message, member) => member || message.member || message.user;

const updateExperience = async (
  client,
  message,
  userId,
  guildId,
  member,
  amount,
  callback,
) => {
  const author = getAuthor(message, member);
  const username = author?.user?.username ?? author?.username;
  const avatar =
    author?.user?.displayAvatarURL?.() ?? author?.displayAvatarURL?.();

  if (!client.temp.cache) client.temp.cache = {};
  await syncUserProfile(client.temp.cache, userId, { username, avatar });

  const [experienceResult] = await Promise.all([
    incrementUserExperience(userId, amount),
    updateLeaderboardExperience(client.temp.cache, userId, guildId, amount),
  ]);
  const { leveling, leveledUp, previousLevel } = experienceResult;
  callback.status = "success";
  callback.exp = leveling.exp ?? 0;
  callback.level = leveling.level ?? 0;
  callback.levelup = callback.level * callback.level * 200;

  if (leveledUp && callback.level > previousLevel) {
    void submitNotification(
      client,
      message.guild,
      "general",
      createLevelUpEmbed(client, username ?? "Unknown", avatar, callback.level),
    );
  }
};

const fetchLevel = async (
  client,
  message,
  method,
  { member = "", amount = 1, type = "exp" } = {},
) => {
  if (!client)
    return client.logger.warn(
      "Please configure CLIENT for localization (required).",
    );
  if (!message)
    return client.logger.warn(
      "Please configure MESSAGE to make notifications and receive important basic information (required).",
    );
  if (!method)
    return client.logger.warn(
      "Please specify a METHOD to continue. (required).",
    );

  const callback = {
    status: "padding",
    exp: 0,
    level: 0,
    levelup: 0,
    users: null,
  };
  const userId = member ? member.id : (message.member?.id ?? message.user.id);
  const guildId = message.guild?.id;

  if (method === "POST" && type === "exp") {
    if (!amount) {
      callback.status = "error";
      client.logger.warn("Please specify the amount of experience.");
      return callback;
    }

    try {
      await updateExperience(
        client,
        message,
        userId,
        guildId,
        member,
        amount,
        callback,
      );
    } catch (error) {
      callback.status = "error";
      client.logger.error(
        { err: error, userId, guildId },
        "Failed to update experience.",
      );
    }
    return callback;
  }

  const user = await getUser(userId);
  if (!user) {
    await ensureUser(userId);
    return fetchLevel(client, message, method, { member, amount, type });
  }

  const leveling = user.leveling;
  let exp = leveling.exp || 0;
  let level = leveling.level || 0;
  const author = getAuthor(message, member);

  if (author) {
    const username = author.user?.username ?? author.username;
    const avatar =
      author.user?.displayAvatarURL?.() ?? author.displayAvatarURL?.();
    const profile = {};
    if (username && username !== user.username) profile.username = username;
    if (avatar && avatar !== user.avatar) profile.avatar = avatar;
    if (Object.keys(profile).length) await updateUserProfile(userId, profile);
  }

  const levelup = level * level * 200;

  switch (method) {
    case "GET": {
      callback.status = "success";
      callback.exp = exp;
      callback.level = level;
      callback.levelup = levelup;
      break;
    }
    case "POST": {
      if (!amount) {
        callback.status = "error";
        client.logger.warn("Please specify the amount of experience.");
        return callback;
      }
      try {
        const updatedLeveling = await incrementUserLevelingValue(
          userId,
          type,
          amount,
        );
        exp = updatedLeveling.exp;
        level = updatedLeveling.level;
        await incrementLeaderboardLevelingValue(userId, guildId, type, amount);
        callback.status = "success";
      } catch {
        callback.status = "error";
      }
      break;
    }
    case "PUT": {
      try {
        const updatedLeveling = await setUserLevelingValue(
          userId,
          type,
          amount,
        );
        await setLeaderboardLevelingValue(userId, guildId, type, amount);
        callback.status = "success";
        callback.exp = updatedLeveling.exp;
        callback.level = updatedLeveling.level;
      } catch {
        callback.status = "error";
      }
      break;
    }
    case "DELETE": {
      if (!member)
        return client.logger.warn(
          "Please enter the user ID you wish to delete experience data for.",
        );
      if (!leveling) {
        callback.status = "missing";
        return client.logger.warn(
          "The user's level information has disappeared.",
        );
      }
      try {
        await resetUserLeveling(userId);
        if (guildId) await removeLeaderboardEntry(guildId, userId);
        callback.status = "success";
      } catch {
        callback.status = "error";
      }
      break;
    }
  }

  if (exp >= levelup) {
    const username = author?.user?.username ?? author?.username ?? "Unknown";
    const avatar =
      author?.user?.displayAvatarURL?.() ?? author?.displayAvatarURL?.();
    await setUserLeveling(userId, {
      exp: exp - levelup,
      level: level + 1,
    });
    void submitNotification(
      client,
      message.guild,
      "general",
      createLevelUpEmbed(client, username, avatar, level),
    );
  }

  return callback;
};

module.exports = { fetchLevel };
