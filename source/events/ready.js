const { Events, ActivityType } = require("discord.js");
const { readdirSync } = require("node:fs");
const { join } = require("node:path");
const { getApps } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const { getDatabase, get, onValue, ref, update } = require("firebase/database");
const { checkForUpdates, updateApplicationCommands } = require("../utils/clientUtils");
const { currencyFormatter } = require("../utils/miscUtils");

module.exports = {
  "name": Events.ClientReady,
  "once": true,
  async execute(client) {
    // Notify when the bot is online.
    client.console.add("online-loading", {
      "text": "Bot is now online at " + client.readyAt.toLocaleString() + ".",
      "status": "non-spinnable"
    });

    // Client username
    client.console.add("username-check-loading", {
      "text": "Sign in with the username " + client.user.username + ".",
      "status": "non-spinnable"
    });

    // Refreshing application (/) commands.
    updateApplicationCommands(client);

    // Check for update
    checkForUpdates(client);

    // Check server is set up.
    if (!getApps.length) {
      client.console.add("server-check-loading", {
        "text": "Connected to the server successfully.",
        "status": "non-spinnable"
      });

      client.api = {};
      client.api.statistics = {}

      // Organize data from a database.
      const startLoadDataTime = new Date().getTime();

      client.console.add("server-database-data-loading", {
        "text": "Receiving data from database.",
        "indent": 2
      });
      get(ref(getDatabase(), "projects/shioru")).then((data) => {
        if (data.exists()) client.api = data.val();

        onValue(ref(getDatabase(), "projects/shioru"), (snapshot) => {
          if (snapshot.exists()) client.api = snapshot.val();
        });

        client.console.succeed("server-database-data-loading", {
          "text": "Completed receiving data from the database.: " + (((new Date().getTime() - startLoadDataTime) / 1000) + "s")
        });
      }).catch((error) => {
        client.console.fail("server-database-data-loading", {
          "text": "There was an error getting data from the database.\n" + error
        });
      });

      // Organize statistics from a database.
      const startLoadStatisticsTime = new Date().getTime();

      client.console.add("server-database-statistics-loading", {
        "text": "Receiving statistics from database.",
        "indent": 2
      });
      get(ref(getDatabase(), "statistics/shioru")).then((data) => {
        if (data.exists()) client.api.statistics = data.val();

        onValue(ref(getDatabase(), "statistics/shioru"), (snapshot) => {
          if (snapshot.exists()) client.api.statistics = snapshot.val();
        });

        client.console.succeed("server-database-statistics-loading", {
          "text": "Completed receiving statistics from the database.: " + (((new Date().getTime() - startLoadStatisticsTime) / 1000) + "s")
        });
      }).catch((error) => {
        client.console.fail("server-database-statistics-loading", {
          "text": "There was an error getting statistics from the database.\n" + error
        });
      });

      // Send commands information
      client.console.add("server-database-send-info-loading", {
        "text": "Send information about the command.",
        "indent": 2
      });

      try {
        const startSendDataTime = new Date().getTime();
        const foldersPath = join(__dirname, "../commands");
        const commandFolders = readdirSync(foldersPath);

        for (const [folderIndex, folder] of commandFolders.entries()) {
          const commandsPath = join(foldersPath, folder);
          const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".js"));

          for (const [fileIndex, file] of commandFiles.entries()) {
            const filePath = join(commandsPath, file);
            const command = require(filePath);

            client.console.update("server-database-send-info-loading", {
              "text": "Sending information about the " + command.name + " command."
            });

            setDoc(doc(getFirestore(), "Information", "shioru"), {
              "commands": {
                [command.category]: {
                  [command.name]: {
                    "name": command.name ?? "",
                    "description": {
                      "en-US": command.function.command.data.description,
                      "th": command.function.command.data.description_localizations ? command.function.command.data.description_localizations["th"] : ""
                    },
                    "category": command.category ?? "",
                    "permissions": {
                      "client": command.permissions.client ? command.permissions.client.map(String) : [],
                      "user": command.permissions.user ? command.permissions.user.map(String) : []
                    },
                    "usage": command.usage ?? "",
                    "function": {
                      "command": command.function.command ? true : false,
                      "context": command.function.context ? true : false
                    }
                  }
                }
              }
            }, {
              "merge": true
            });

            if ((folderIndex === (commandFolders.length - 1)) && (fileIndex === (commandFiles.length - 1))) {
              client.console.succeed("server-database-send-info-loading", {
                "text": "Finished sending information about the command.: " + (((new Date().getTime() - startSendDataTime) / 1000) + "s")
              });
            }
          }
        }
      } catch (error) {
        client.console.fail("server-database-send-info-loading", {
          "text": "Failed to send information about the command.\n" + error
        });
      }

      // Send bot statistics.
      setInterval(() => {
        const commandSize = client.commands.size;
        const guildSize = client.guilds.cache.size;
        const userSize = client.users.cache.size;

        const prevGuildSize = client.api.statistics ? client.api.statistics.size.guilds : guildSize;
        const prevUserSize = client.api.statistics ? client.api.statistics.size.users : userSize;

        if (client.mode === "start") {
          if (guildSize !== prevGuildSize || userSize !== prevUserSize) {
            update(ref(getDatabase(), "statistics/shioru/size"), {
              "commands": commandSize,
              "guilds": guildSize,
              "users": userSize
            });
          }
        }
      }, 5000);
    } else {
      client.console.add("server-check-loading", {
        "text": "Unable to connect to the provider server.",
        "status": "non-spinnable"
      });
    }

    // Setup bot activity.
    let totalGuilds = 0, totalMembers = 0;
    const commandSize = client.commands.size;

    if (client.shard && client.shard.count) {
      const promises = [
        client.shard.fetchClientValues("guilds.cache.size"),
        client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
      ];
      const results = await Promise.all(promises);

      totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
      totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
    } else {
      totalGuilds = client.guilds.cache.size;
      totalMembers = client.users.cache.size;
    }

    const activities = {
      "production": [
        {
          "name": currencyFormatter(totalGuilds, 1) + " Server" + (totalGuilds === 1 ? "" : "s"),
          "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          "type": ActivityType.Streaming
        },
        {
          "name": "/help",
          "type": ActivityType.Watching
        },
        {
          "name": currencyFormatter(totalMembers, 1) + " Member" + (totalMembers === 1 ? "" : "s"),
          "type": ActivityType.Watching
        },
        {
          "name": currencyFormatter(commandSize, 1) + " Command" + (commandSize === 1 ? "" : "s"),
          "type": ActivityType.Listening
        }
      ],
      "development": [
        {
          "name": "🧶",
          "type": ActivityType.Playing
        },
        {
          "name": "/",
          "type": ActivityType.Listening
        },
        {
          "name": "📦",
          "type": ActivityType.Playing
        }
      ]
    };
    const activityType = client.mode === "start" ? activities.production : activities.development;

    client.user.setPresence({
      "status": "available",
      "afk": false,
      "activities": activityType
    });

    setInterval(async () => {
      let totalGuilds = 0, totalMembers = 0;

      if (client.shard && client.shard.count) {
        const promises = [
          client.shard.fetchClientValues("guilds.cache.size"),
          client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
        ];
        const results = await Promise.all(promises);

        totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
        totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
      } else {
        totalGuilds = client.guilds.cache.size;
        totalMembers = client.users.cache.size;
      }

      const randomIndex = Math.floor(Math.random() * activityType.length);
      const newActivity = activityType[randomIndex];

      activities.production[0].name = currencyFormatter(totalGuilds, 1) + " Server" + (totalGuilds === 1 ? "" : "s");
      activities.production[2].name = currencyFormatter(totalMembers, 1) + " Member" + (totalMembers === 1 ? "" : "s");
      client.user.setActivity(newActivity);
    }, 10000);

    // If everything is ready to go
    client.startup.end = new Date().getTime();

    client.console.add("startup-loading", {
      "color": "blueBright",
      "text": "Bot is ready to work on the servers!: " + (((client.startup.end - client.startup.start) / 1000) + "s"),
      "status": "non-spinnable"
    });
  }
};
