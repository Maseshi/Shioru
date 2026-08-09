const {
  EmbedBuilder,
  Colors,
  Events,
  ActivityType,
  PresenceUpdateStatus,
} = require("discord.js");
const { getApps } = require("firebase/app");
const { registeringCommands, webhookSend } = require("../utils/clientUtils");
const { colorize } = require("../utils/consoleUtils");
const { synchronizeGuildData } = require("../services/guild");
const { fetchStatistics } = require("../services/statistics");
const { createChat } = require("../schemas/chat");
const { watchGuildData } = require("../utils/cacheUtils");
const { logMetrics } = require("../utils/metricsUtils");
const { onChat, setChat } = require("../repositories/chat");
const { updateInformation } = require("../repositories/information");
const { currencyFormatter, newTitle } = require("../utils/miscUtils");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    const { underscore } = colorize();
    const registerInterval = (callback, delay) => {
      const interval = setInterval(callback, delay);
      client.temp.intervals.add(interval);
      return interval;
    };

    // Notify when the bot is online.
    client.logger.info(
      `Bot is now online at ${client.readyAt.toLocaleString()}.`,
    );

    if (client.configs.metrics.enabled) {
      registerInterval(
        () => logMetrics("interval"),
        client.configs.metrics.intervalMs,
      );
      client.logger.info(
        { intervalMs: client.configs.metrics.intervalMs },
        "Firebase traffic metrics enabled.",
      );
    }

    // Client username
    client.logger.info(
      `Sign in with the username ${underscore(client.user.username)}.`,
    );

    // Refreshing application (/) commands.
    registeringCommands(client);

    // Check back-ends server is set up.
    if (getApps().length) {
      // Fetch chat data on change and apply
      client.logger.info("Fetching and updating chat data...");

      const baseConstants = require("../configs/constants.json");

      const updateChatData = async (chat) => {
        if (chat) {
          client.configs.constants.conversations = [
            ...baseConstants.conversations,
            ...chat.conversations,
          ];
          client.configs.constants.alternatives = [
            ...baseConstants.alternatives,
            ...chat.alternatives,
          ];
          client.configs.constants.system = chat.system;
        } else {
          await setChat(
            createChat({
              conversations: client.configs.constants.conversations,
              alternatives: client.configs.constants.alternatives,
            }),
          );
        }
      };

      const unsubscribeChat = onChat(
        (chat) => {
          updateChatData(chat).catch((error) =>
            client.logger.error(error, "Failed to synchronize chat data."),
          );
        },
        (error) =>
          client.logger.error(error, "Failed to listen for chat data."),
      );
      client.temp.listeners.set("chat", unsubscribeChat);

      client.logger.info("Chat data retrieved complete.");

      // Listen for guild settings changes from dashboard
      client.logger.info("Listening for guild settings changes...");

      for (const guild of client.guilds.cache.values()) {
        watchGuildData(client, guild, (guildData) =>
          synchronizeGuildData(client, guild, guildData),
        );
      }

      client.logger.info(
        { guilds: client.guilds.cache.size },
        "Per-guild settings listeners active.",
      );

      // Send all commands information
      client.logger.info("Sending details of all commands...");

      try {
        await Promise.all([
          updateInformation(
            "commands",
            Object.fromEntries(client.temp.commands),
          ),
          updateInformation(
            "contexts",
            Object.fromEntries(client.temp.contexts),
          ),
        ]);

        client.logger.info("Completed to sending details of all commands.");
      } catch (error) {
        client.logger.error(
          error,
          "Failed to sending details of all commands.",
        );
      }

      // Send bot statistics.
      client.logger.info("Sending statistical information...");

      const isPrimaryShard = !client.shard || client.shard.ids.includes(0);
      if (isPrimaryShard) {
        const submitStatistics = () => {
          if (!client.isReady()) return;
          fetchStatistics("POST", "size", client).catch((error) =>
            client.logger.error(error, "Failed to update statistics."),
          );
        };

        submitStatistics();
        registerInterval(submitStatistics, 300000);
        client.logger.info("Statistics will be updated every 5 minutes.");
      }
    } else {
      client.logger.warn("Unable to connect to the back-ends server.");
    }

    // Setup bot activity.
    const getStatistics = async () => {
      const callback = {
        guilds: 0,
        members: 0,
        commands: client.commands.size ?? 0,
      };

      if (client.shard?.count && process.connected !== false) {
        const results = await Promise.all([
          client.shard.fetchClientValues("guilds.cache.size"),
          client.shard.broadcastEval((cli) =>
            cli.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
          ),
        ]);
        callback.guilds = results[0].reduce(
          (acc, guildCount) => acc + guildCount,
          0,
        );
        callback.members = results[1].reduce(
          (acc, memberCount) => acc + memberCount,
          0,
        );
      } else {
        callback.guilds = client.guilds.cache.size;
        callback.members = client.users.cache.size;
      }

      return callback;
    };

    const statistics = await getStatistics();
    const activities = {
      production: [
        {
          name: `${currencyFormatter(statistics.guilds, 1)} Server${statistics.guilds === 1 ? "" : "s"}`,
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          type: ActivityType.Streaming,
        },
        {
          name: "/help",
          state: "🪺 IS THE EGG",
          type: ActivityType.Watching,
        },
        {
          name: `${currencyFormatter(statistics.members, 1)} Member${statistics.members === 1 ? "" : "s"}`,
          type: ActivityType.Watching,
        },
        {
          name: `${currencyFormatter(statistics.commands, 1)} Command${statistics.commands === 1 ? "" : "s"}`,
          type: ActivityType.Listening,
        },
      ],
      development: [
        {
          name: "🧶",
          type: ActivityType.Playing,
        },
        {
          name: "/",
          type: ActivityType.Listening,
        },
        {
          name: "📦",
          type: ActivityType.Playing,
        },
        {
          name: `📀 ${newTitle(client.mode)} Mode`,
          type: ActivityType.Custom,
        },
      ],
    };
    const activityType =
      client.mode === "start" ? activities.production : activities.development;

    client.user.setPresence({
      status: PresenceUpdateStatus.Online,
      afk: false,
      activities: activityType,
    });

    registerInterval(async () => {
      if (!client.isReady()) return;

      try {
        const statisticsData = await getStatistics();
        const randomIndex = Math.floor(Math.random() * activityType.length);
        const newActivity = activityType[randomIndex];

        activities.production[0].name = `${currencyFormatter(statisticsData.guilds, 1)} Server${statisticsData.guilds === 1 ? "" : "s"}`;
        activities.production[2].name = `${currencyFormatter(statisticsData.members, 1)} Member${statisticsData.members === 1 ? "" : "s"}`;
        client.user.setActivity(newActivity);
      } catch (error) {
        if (error.code === "ERR_IPC_CHANNEL_CLOSED") return;
        client.logger.error(error, "Failed to update bot activity.");
      }
    }, 10000);

    // If everything is ready to go
    const webhookLogEmbed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle("✅・Ready")
      .setDescription("Bot is ready to work on the servers!")
      .setTimestamp()
      .setFields([
        {
          name: "⌛ Time",
          value: `${(client.temp.startup.end - client.temp.startup.start) / 1000}s`,
          inline: true,
        },
      ]);

    webhookSend(client.configs.logger.ready, {
      embeds: [webhookLogEmbed],
    });
    client.temp.startup.end = new Date().getTime();
    client.logger.info(
      `Bot is ready to work on the servers!: ${
        (client.temp.startup.end - client.temp.startup.start) / 1000
      }s`,
    );
  },
};
