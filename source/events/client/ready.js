const { ActivityType } = require("discord.js");
const { getApps } = require("firebase/app");
const { getDatabase, onValue, ref, update } = require("firebase/database");
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

  console.log("Bot is working and is now online at " + at + ".");

  // Check server is set up.
  console.log(getApps.length === 0 ? "Connected to the server successfully." : "Unable to connect to the provider server.");

  // Send bot statistics.
  const commandSize = client.commands.size;
  const guildSize = client.guilds.cache.size;
  const userSize = client.users.cache.size;

  if (client.mode === "start") {
    update(ref(getDatabase(), "statistics/shioru/size"), {
      "commands": commandSize,
      "guilds": guildSize,
      "users": userSize
    });
  }

  // Setup API
  onValue(ref(getDatabase(), "projects/shioru"), (snapshot) => {
    if (snapshot.exists()) client.api = snapshot.val();
  });
  onValue(ref(getDatabase(), "statistics/shioru"), (snapshot) => {
    if (snapshot.exists()) client.api.statistics = snapshot.val();
  });

  // Set up bot activity.
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
    const randomIndex = Math.floor(Math.random() * activityType.length);
    const newActivity = activityType[randomIndex];

    client.user.setActivity(newActivity);
  }, 10000);

  // Check for update
  await checkForUpdates();

  // Refreshing application (/) commands.
  await updateApplicationCommands(client);

  // Client username
  console.log("Sign in with the username " + client.user.username + ".");

  // If everything is ready to go
  console.timeEnd("\u001b[34m\u001b[7m Bot is ready to work on the servers! \u001b[0m");
};
