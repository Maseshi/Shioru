const { ActivityType } = require("discord.js");
const { getApps } = require("firebase/app");
const { getDatabase, get, onValue, ref, update } = require("firebase/database");
const { checkForUpdates, updateApplicationCommands } = require("../../utils/clientUtils");

module.exports = async (client) => {
  // Notify when the bot is online.
  const date = client.readyAt;
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const at = year + "-" + month + "-" + day + "." + hour + ":" + minute;

  client.console.add("online-loading", {
    "text": "Bot is working and is now online at " + at + ".",
    "status": "non-spinnable"
  });

  // Check server is set up.
  if (getApps.length === 0) {
    client.console.add("server-check-loading", {
      "text": "Connected to the server successfully.",
      "status": "non-spinnable"
    });
  } else {
    client.console.add("server-check-loading", {
      "text": "Unable to connect to the provider server.",
      "status": "non-spinnable"
    });
  }

  // Organize data from a database.
  const data = await get(ref(getDatabase(), "projects/shioru"));
  const statistics = await get(ref(getDatabase(), "statistics/shioru"));

  if (data.exists()) client.api = data.val();
  if (statistics.exists()) client.api.statistics = statistics.val();

  onValue(ref(getDatabase(), "projects/shioru"), (snapshot) => {
    if (snapshot.exists()) client.api = snapshot.val();
  });
  onValue(ref(getDatabase(), "statistics/shioru"), (snapshot) => {
    if (snapshot.exists()) client.api.statistics = snapshot.val();
  });

  // Send bot statistics.
  setInterval(() => {
    const commandSize = client.commands.size;
    const guildSize = client.guilds.cache.size;
    const userSize = client.users.cache.size;

    const prevGuildSize = client.api.statistics.size.guilds;
    const prevUserSize = client.api.statistics.size.users;

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

  // Setup bot activity.
  const commandSize = client.commands.size;
  const guildSize = client.guilds.cache.size;
  const userSize = client.users.cache.size;
  const activities = {
    "production": [
      {
        "name": guildSize + " Server" + (guildSize === 1 ? "" : "s"),
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "type": ActivityType.Streaming
      },
      {
        "name": "Shelp | /help",
        "type": ActivityType.Watching
      },
      {
        "name": userSize + " Member" + (userSize === 1 ? "" : "s"),
        "type": ActivityType.Watching
      },
      {
        "name": commandSize + " Command" + (commandSize === 1 ? "" : "s"),
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

  setInterval(() => {
    const guildSize = client.guilds.cache.size;
    const userSize = client.users.cache.size;
    const randomIndex = Math.floor(Math.random() * activityType.length);
    const newActivity = activityType[randomIndex];

    activities.production[0].name = guildSize + " Server" + (guildSize === 1 ? "" : "s");
    activities.production[2].name = userSize + " Member" + (userSize === 1 ? "" : "s");
    client.user.setActivity(newActivity);
  }, 10000);

  // Check for update
  await checkForUpdates(client);

  // Refreshing application (/) commands.
  await updateApplicationCommands(client);

  // Client username
  client.console.add("username-check-loading", {
    "text": "Sign in with the username " + client.user.username + ".",
    "status": "non-spinnable"
  });

  // If everything is ready to go
  const endTime = new Date().getTime();

  client.startup.end = endTime;
  client.console.add("startup-loading", {
    "color": "blueBright",
    "text": "Bot is ready to work on the servers!: " + ((client.startup.end - client.startup.start) / 1000) + "s",
    "status": "non-spinnable"
  });
};
