const {
  EmbedBuilder,
  Colors,
  Events,
  ActivityType,
  PresenceUpdateStatus,
} = require("discord.js");
const { getApps } = require("firebase/app");
const {
  getDatabase,
  onValue,
  ref,
  child,
  update,
  get,
  set,
} = require("firebase/database");
const { registeringCommands, webhookSend } = require("../utils/clientUtils");
const { colorize } = require("../utils/consoleUtils");
const { dataStructures, fetchStatistics } = require("../utils/databaseUtils");
const { currencyFormatter, newTitle } = require("../utils/miscUtils");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    const { underscore } = colorize();

    // Notify when the bot is online.
    client.logger.info(
      `Bot is now online at ${client.readyAt.toLocaleString()}.`,
    );

    // Client username
    client.logger.info(
      `Sign in with the username ${underscore(client.user.username)}.`,
    );

    // Refreshing application (/) commands.
    registeringCommands(client);

    // Check back-ends server is set up.
    if (!getApps.length) {
      // Fetch chat data on change and apply
      client.logger.info("Fetching and updating chat data...");

      const chatRef = ref(getDatabase(), "chat");

      const updateChatData = (snapshot) => {
        if (snapshot.exists()) {
          const prompts = snapshot.val().prompts ?? [];
          const replies = snapshot.val().replies ?? [];
          const alternatives = snapshot.val().alternatives ?? [];
          const scripts = snapshot.val().scripts ?? [];
          const system = snapshot.val().system ?? "";

          client.configs.constants.prompts = [
            ...client.configs.constants.prompts,
            ...prompts,
          ];
          client.configs.constants.replies = [
            ...client.configs.constants.replies,
            ...replies,
          ];
          client.configs.constants.alternatives = [
            ...client.configs.constants.alternatives,
            ...alternatives,
          ];
          client.configs.constants.scripts = [
            ...client.configs.constants.scripts,
            ...scripts,
          ];
          client.configs.constants.system = system;
        } else {
          set(chatRef, dataStructures(client, "chat"));
        }
      };

      get(chatRef).then((snapshot) => updateChatData(snapshot));
      onValue(chatRef, (snapshot) => updateChatData(snapshot));

      client.logger.info("Chat data retrieved complete.");

      // Send all commands information
      client.logger.info("Sending details of all commands...");

      try {
        const commandsRef = child(
          ref(getDatabase(), "information"),
          "commands",
        );
        const contextsRef = child(
          ref(getDatabase(), "information"),
          "contexts",
        );

        update(commandsRef, Object.fromEntries(client.temp.commands));
        update(contextsRef, Object.fromEntries(client.temp.contexts));

        client.logger.info("Completed to sending details of all commands.");
      } catch (error) {
        client.logger.error(
          error,
          "Failed to sending details of all commands.",
        );
      }

      // Send bot statistics.
      client.logger.info("Sending statistical information...");

      setInterval(() => fetchStatistics("POST", "size", client), 10000);

      client.logger.info(
        "Statistics are sent successfully and updated every 10 seconds.",
      );
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

      if (client.shard && client.shard.count) {
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

    setInterval(async () => {
      const statisticsData = await getStatistics();
      const randomIndex = Math.floor(Math.random() * activityType.length);
      const newActivity = activityType[randomIndex];

      activities.production[0].name = `${currencyFormatter(statisticsData.guilds, 1)} Server${statisticsData.guilds === 1 ? "" : "s"}`;
      activities.production[2].name = `${currencyFormatter(statisticsData.members, 1)} Member${statisticsData.members === 1 ? "" : "s"}`;
      client.user.setActivity(newActivity);
    }, 10000);

    // Anti-bot system
    setInterval(async () => {
      const guilds = await client.guilds.fetch();

      guilds.forEach(async (guild) => {
        const guildRef = child(ref(getDatabase(), "guilds"), guild.id);
        const guildSnapshot = await get(guildRef);

        if (guildSnapshot.exists()) {
          const antiBotData = guildSnapshot.val().antibot;

          if (!antiBotData) return;

          const antiBotEnabledStartTime = new Date(
            antiBotData.enabledAt,
          ).getTime();
          const antiBotEnabledEndTime = new Date().getTime();
          const antiBotEnabledPassed =
            antiBotEnabledStartTime - antiBotEnabledEndTime;

          if (antiBotEnabledPassed >= 10) {
            const members = await guilds.members.fetch();

            if (!antiBotData.enable) return;

            members.forEach((member) => {
              if (member.user.bot) {
                if (
                  !antiBotData.all &&
                  antiBotData.bots.includes(member.user.id)
                )
                  return;
                if (member.id !== client.user.id)
                  return member.kick({
                    reason: client.i18n.t("events.ready.prevented_anti_bot"),
                  });
              }
            });
          }
        }
      });
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
