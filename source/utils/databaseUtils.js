const { EmbedBuilder } = require("discord.js");
const {
  getDatabase,
  ref,
  child,
  increment,
  limitToLast,
  orderByChild,
  query,
} = require("firebase/database");
const { embedBuilder } = require("./clientUtils");
const { getGuildData } = require("./cacheUtils");
const {
  trackedGet: get,
  trackedRemove: remove,
  trackedRunTransaction: runTransaction,
  trackedSet: set,
  trackedUpdate: update,
} = require("./metricsUtils");

/**
 * The `dataStructures` function returns different data dataStructures based on the value of the `select`
 * parameter.
 * @param {Client} client - The `client` parameter is an object that represents the client or bot that is using
 * this `dataStructures` function. It likely contains various configurations and constants that are used
 * within the function.
 * @param {String} select - The `select` parameter is used to determine which dataStructures to return. It can have
 * the following values:
 * @returns The function `dataStructures` returns an object based on the value of the `select` parameter.
 * The returned object has different properties and values depending on the value of `select`.
 */
const dataStructures = (client, select) => {
  switch (select) {
    case "chat":
      return {
        conversations: client.configs.constants.conversations,
        alternatives: client.configs.constants.alternatives,
        system: "",
      };
    case "user":
      return {
        leveling: {
          exp: 0,
          level: 0,
        },
        guildLeveling: {},
        guilds: [],
      };
    case "guild":
      return {
        joinedAt: "",
        createdAt: "",
        description: "",
        iconURL: "",
        preferredLocale: "",
        memberCount: 0,
        name: "",
        verified: false,
      };
    case "language":
      return {
        type: "USER",
        locale: "en-US",
      };
    case "notification":
      return {
        enable: false,
        channelId: "",
        toggledAt: "",
        content: "",
        embed: {
          createdAt: "",
          createBy: "",
          editor: [
            // {
            //   userId: '',
            //   editedAt: '',
            // },
          ],
          author: {
            name: "",
            url: "",
            iconURL: "",
          },
          color: "",
          title: "",
          url: "",
          description: "",
          thumbnail: "",
          timestamp: "",
          image: "",
          fields: [
            {
              name: "",
              value: "",
              inline: false,
            },
            {
              name: "",
              value: "",
              inline: false,
            },
          ],
          footer: {
            text: "",
            iconURL: "",
          },
        },
      };
    case "djs": {
      return {
        enable: false,
        toggledAt: "",
        editedAt: "",
        only: false,
        roles: [],
        users: [],
      };
    }
  }
};

const updateLeaderboardExperience = async (
  client,
  userRef,
  guildId,
  userId,
  amount,
) => {
  if (!guildId) return;

  if (!client.temp.cache) client.temp.cache = {};
  if (!client.temp.cache.leaderboardUsers)
    client.temp.cache.leaderboardUsers = new Set();

  const cacheKey = `${guildId}:${userId}`;
  const leaderboardRef = ref(
    getDatabase(),
    `leaderboards/${guildId}/${userId}`,
  );
  const leaderboardExpRef = child(leaderboardRef, "exp");

  if (client.temp.cache.leaderboardUsers.has(cacheKey)) {
    await set(leaderboardExpRef, increment(amount));
    return;
  }

  const leaderboardSnapshot = await get(leaderboardRef);
  if (leaderboardSnapshot.exists()) {
    await set(leaderboardExpRef, increment(amount));
  } else {
    const legacySnapshot = await get(
      child(child(userRef, "guildLeveling"), guildId),
    );
    const legacyLeveling = legacySnapshot.val() ?? {};

    await runTransaction(leaderboardRef, (currentLeaderboard) => {
      if (currentLeaderboard)
        return {
          ...currentLeaderboard,
          exp: (Number(currentLeaderboard.exp) || 0) + amount,
        };

      return {
        exp: (Number(legacyLeveling.exp) || 0) + amount,
        level: Number(legacyLeveling.level) || 0,
      };
    });
  }

  client.temp.cache.leaderboardUsers.add(cacheKey);
};

/**
 * The fetchLevel function is a JavaScript function that retrieves and updates user level and
 * experience data in a database, and can also send level up notifications.
 * @param {Client} client - The `client` parameter is the client object that represents the Discord bot. It is
 * used to access various functionalities and properties of the bot, such as the username and avatar.
 * @param {Message} message - The `message` parameter is an object that contains information about the message
 * that triggered the function. It typically includes properties such as the message content, author,
 * channel, and guild.
 * @param {String} method - The `method` parameter is a string that specifies the action to be performed. It can
 * have the following values: 'GET', 'POST', 'PUT' and 'DELETE'
 * @param {GuildMember} member Optional: Members within the guild who wish to change their information
 * @param {String} amount Optional: The desired amount will change the value.
 * @param {String} type Optional: **exp** or **level**
 * @returns The function `fetchLevel` returns a callback object with the following properties:
 */
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

  const usersRef = ref(getDatabase(), "users");
  const userId = member ? member.id : (message.member?.id ?? message.user.id);
  const userRef = child(usersRef, userId);
  const guildId = message.guild?.id;

  if (method === "POST" && type === "exp") {
    if (!amount) {
      callback.status = "error";
      client.logger.warn("Please specify the amount of experience.");
      return callback;
    }

    const author = member || message.member || message.user;
    const username = author?.user?.username ?? author?.username;
    const avatar =
      author?.user?.displayAvatarURL?.() ?? author?.displayAvatarURL?.();
    const profileSignature = `${username ?? ""}:${avatar ?? ""}`;
    const profileUpdates = {};

    if (!client.temp.cache) client.temp.cache = {};
    if (!client.temp.cache.userProfiles)
      client.temp.cache.userProfiles = new Map();
    if (client.temp.cache.userProfiles.get(userId) !== profileSignature) {
      if (username) profileUpdates.username = username;
      if (avatar) profileUpdates.avatar = avatar;
    }

    let leveledUp = false;
    let previousLevel = 0;
    const levelingRef = child(userRef, "leveling");

    try {
      // Keep profile writes outside the transaction path so they cannot cancel it.
      if (Object.keys(profileUpdates).length) {
        await update(userRef, profileUpdates);
        client.temp.cache.userProfiles.set(userId, profileSignature);
      }

      const [transactionResult] = await Promise.all([
        runTransaction(levelingRef, (currentLeveling) => {
          const leveling = currentLeveling ?? {};
          let exp = Number(leveling.exp) || 0;
          let level = Number(leveling.level) || 0;
          const levelup = level * level * 200;

          previousLevel = level;
          exp += amount;
          leveledUp = exp >= levelup;

          if (leveledUp) {
            exp -= levelup;
            level += 1;
          }

          return { ...leveling, exp, level };
        }),
        updateLeaderboardExperience(client, userRef, guildId, userId, amount),
      ]);

      const leveling = transactionResult.snapshot.val() ?? {};
      callback.status = "success";
      callback.exp = leveling.exp ?? 0;
      callback.level = leveling.level ?? 0;
      callback.levelup = callback.level * callback.level * 200;

      if (leveledUp && callback.level > previousLevel) {
        const authorUsername =
          author?.user?.username ?? author?.username ?? "Unknown";
        const authorAvatar =
          author?.user?.displayAvatarURL?.() ??
          author?.displayAvatarURL?.() ??
          null;
        const levelSystemEmbed = new EmbedBuilder()
          .setTitle(client.i18n.t("utils.databaseUtils.congratulations"))
          .setDescription(
            client.i18n
              .t("utils.databaseUtils.level_up")
              .replace("%s1", authorUsername)
              .replace("%s2", callback.level),
          )
          .setColor("Yellow");

        if (authorAvatar) levelSystemEmbed.setThumbnail(authorAvatar);
        void submitNotification(
          client,
          message.guild,
          "general",
          levelSystemEmbed,
        );
      }
    } catch (error) {
      callback.status = "error";
      client.logger.error(
        { err: error, userId, guildId },
        "Failed to update experience.",
      );
    }

    return callback;
  }

  const userSnapshot = await get(userRef);

  if (!userSnapshot.exists()) {
    await set(userRef, dataStructures(client, "user"));
    return fetchLevel(client, message, method, { member, amount, type });
  }

  const userVal = userSnapshot.val();
  const leveling = userVal.leveling;
  let exp = leveling.exp || 0;
  let level = leveling.level || 0;

  // Update cached user profile (username + avatar)
  const author = member ? member : (message.member ?? message.user);
  if (author) {
    const username = author.user?.username ?? author.username;
    const avatar =
      author.user?.displayAvatarURL?.() ?? author.displayAvatarURL?.();
    if (username && username !== userVal.username) {
      update(userRef, { username });
    }
    if (avatar && avatar !== userVal.avatar) {
      update(userRef, { avatar });
    }
  }

  const base = 200;
  const levelup = level * level * base;

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
        return client.logger.warn("Please specify the amount of experience.");
      }

      try {
        // Update global leveling
        if (type === "exp") {
          exp += amount;
          await set(child(child(userRef, "leveling"), "exp"), exp);
        }
        if (type === "level") {
          level += amount;
          await set(child(child(userRef, "leveling"), "level"), level);
        }

        // Update guild leaderboard
        if (guildId) {
          const leaderboardRef = ref(
            getDatabase(),
            `leaderboards/${guildId}/${userId}`,
          );
          if (type === "exp") {
            await set(child(leaderboardRef, "exp"), increment(amount));
          }
          if (type === "level") {
            await set(child(leaderboardRef, "level"), increment(amount));
          }
        }

        callback.status = "success";
      } catch {
        callback.status = "error";
      }
      break;
    }
    case "PUT": {
      try {
        if (type === "exp")
          await set(child(child(userRef, "leveling"), "exp"), amount);
        if (type === "level")
          await set(child(child(userRef, "leveling"), "level"), amount);

        // Also update the guild leaderboard
        if (guildId) {
          const leaderboardRef = ref(
            getDatabase(),
            `leaderboards/${guildId}/${userId}`,
          );
          if (type === "exp") await set(child(leaderboardRef, "exp"), amount);
          if (type === "level")
            await set(child(leaderboardRef, "level"), amount);
        }

        callback.status = "success";
        callback.exp = exp;
        callback.level = level;
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
        await remove(child(userRef, "leveling"));
        if (guildId)
          await remove(ref(getDatabase(), `leaderboards/${guildId}/${userId}`));
        callback.status = "success";
      } catch {
        callback.status = "error";
      }
      break;
    }
  }

  // Check if user has level up
  if (exp >= levelup) {
    const authorUsername = message.member
      ? message.member.username
      : message.user.username;
    const authorAvatar = message.member
      ? message.member.displayAvatarURL()
      : message.user.displayAvatarURL();
    const levelSystemEmbed = new EmbedBuilder()
      .setTitle(client.i18n.t("utils.databaseUtils.congratulations"))
      .setDescription(
        client.i18n
          .t("utils.databaseUtils.level_up")
          .replace("%s1", authorUsername)
          .replace("%s2", level),
      )
      .setColor("Yellow")
      .setThumbnail(authorAvatar);

    await update(child(userRef, "leveling"), {
      exp: exp - levelup,
      level: level + 1,
    });

    submitNotification(client, message.guild, "general", levelSystemEmbed);
  }

  return callback;
};

/**
 * Fetches statistics from the database based on the provided method and path.
 *
 * @param {string} method - The HTTP method to use (GET or POST).
 * @param {string} path - The path to the statistics data in the database.
 * @param {object} client - The client object representing the user.
 * @returns {Promise<any>} - A promise that resolves to the fetched statistics data.
 */
const fetchStatistics = async (method, path, client) => {
  const statisticsRef = child(ref(getDatabase(), "statistics"), path);

  switch (method) {
    case "GET": {
      switch (path) {
        case "size": {
          const statisticsSnapshot = await get(statisticsRef);
          const statisticsVal = statisticsSnapshot.exists()
            ? statisticsSnapshot.val()
            : null;

          return statisticsVal;
        }
      }
      break;
    }
    case "POST": {
      switch (path) {
        case "size": {
          const commandSize = client.commands.size ?? 0;
          let guildSize = client.guilds.cache.size ?? 0;
          let userSize = client.users.cache.size ?? 0;

          if (client.shard?.count && process.connected !== false) {
            const [guildCounts, userCounts] = await Promise.all([
              client.shard.fetchClientValues("guilds.cache.size"),
              client.shard.fetchClientValues("users.cache.size"),
            ]);
            guildSize = guildCounts.reduce((total, count) => total + count, 0);
            userSize = userCounts.reduce((total, count) => total + count, 0);
          }

          await update(statisticsRef, {
            commands: commandSize,
            guilds: guildSize,
            users: userSize,
          });
          break;
        }
        case "size/worked": {
          set(statisticsRef, increment(1));
          break;
        }
        default: {
          if (path.startsWith("command") || path.startsWith("context")) {
            set(statisticsRef, increment(1));
            break;
          }

          client.logger.warn(`Unknown post path at ${path}`);
          break;
        }
      }
    }
  }
};

const incrementStatistics = (paths) => {
  const updates = Object.fromEntries(paths.map((path) => [path, increment(1)]));
  return update(ref(getDatabase(), "statistics"), updates);
};

const fetchLeaderboard = async (guildId, maximum = 10) => {
  const leaderboardQuery = query(
    ref(getDatabase(), `leaderboards/${guildId}`),
    orderByChild("exp"),
    limitToLast(maximum),
  );
  const snapshot = await get(leaderboardQuery);
  return snapshot.exists() ? snapshot : null;
};

/**
 * The `submitNotification` function sends a notification to a specified channel in a guild with optional
 * embed data.
 * @param {Client} client - The `client` parameter is typically an instance of the Discord.js `Client` class. It
 * represents the bot or user that is connected to the Discord API.
 * @param {Guild} guild - The `guild` parameter represents the guild (server) where the notification will be
 * sent. It is an object that contains information about the guild, such as its ID, name, and other
 * properties.
 * @param {String} eventName - The `eventName` parameter is a string that represents the name of the event for
 * which the notification is being sent. It could be something like "userJoined", "messageDeleted",
 * etc.
 * @param {EmbedBuilder} embedData - The `embedData` parameter is an object that contains the data for creating an
 * embed message. It includes properties such as `author`, `color`, `title`, `description`,
 * `thumbnail`, `fields`, `image`, `timestamp`, `footer`, etc. These properties are used to customize
 * the
 * @returns The function `submitNotification` returns the result of the `GuildChannel` method call.
 */
const submitNotification = async (client, guild, eventName, embedData) => {
  if (!guild) return null;

  const guildRef = child(ref(getDatabase(), "guilds"), guild.id);
  let guildData = getGuildData(client, guild.id);

  if (!guildData) {
    const guildSnapshot = await get(guildRef);
    if (!guildSnapshot.exists()) return null;
    guildData = guildSnapshot.val();
  }

  const notification = guildData.notification;

  if (!notification) return null;

  const notify = notification[eventName];

  if (!notify) return null;

  const channelId = notify.channelId ?? notify.id;
  const content = notify.content;
  const enable = notify.enable;
  const embed = notify.embed;

  const guildChannel = guild.channels.cache.find(
    (channel) => channel.id === channelId,
  );

  if (!guildChannel) return null;
  if (!enable) return null;
  if (embed) {
    embedData = embedBuilder(
      client,
      embed.author.name,
      embed.author.url,
      embed.author.iconURL,
      embed.color,
      embed.title,
      embed.url,
      embed.description,
      embed.thumbnail,
      embed.fields[0].name,
      embed.fields[0].value,
      embed.fields[0].inline,
      embed.fields[1].name,
      embed.fields[1].value,
      embed.fields[1].inline,
      embed.image,
      embed.timestamp,
      embed.footer.text,
      embed.footer.iconURL,
    );
  }

  return guildChannel.send({
    content: content ?? "",
    embeds: [embedData],
  });
};

/**
 * The `initializeData` function initializes and updates data for a guild in a database based on the
 * provided client and guild information.
 * @param {Client} client - The `client` parameter is an object representing the Discord bot client. It is used
 * to interact with the Discord API and perform actions on behalf of the bot.
 * @param {Guild} guild - The `guild` parameter is an object that represents a Discord guild (server). It
 * contains various properties such as `id`, `joinedAt`, `createdAt`, `description`, `iconURL`,
 * `language`, `memberCount`, `name`, and `verified`. These properties are used to initialize or
 */
const synchronizeGuildData = async (client, guild, guildData) => {
  const guildRef = child(ref(getDatabase(), "guilds"), guild.id);
  const fallback = dataStructures(client, "guild");
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
    const initialData = {
      ...metadata,
      language: dataStructures(client, "language"),
    };
    await set(guildRef, initialData);
    return initialData;
  }

  const changes = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (guildData[key] !== value) changes[key] = value;
  }
  if (!guildData.language)
    changes.language = dataStructures(client, "language");

  if (Object.keys(changes).length) await update(guildRef, changes);
  return { ...guildData, ...changes };
};

const updateGuildMemberCount = (guild) =>
  update(child(ref(getDatabase(), "guilds"), guild.id), {
    memberCount: guild.memberCount ?? 0,
  });

const initializeData = async (client, guild) => {
  const guildRef = child(ref(getDatabase(), "guilds"), guild.id);
  const guildSnapshot = await get(guildRef);
  return synchronizeGuildData(
    client,
    guild,
    guildSnapshot.exists() ? guildSnapshot.val() : null,
  );
};

module.exports = {
  dataStructures,
  fetchLevel,
  fetchStatistics,
  incrementStatistics,
  fetchLeaderboard,
  submitNotification,
  synchronizeGuildData,
  updateGuildMemberCount,
  initializeData,
};
