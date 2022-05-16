const { getDatabase, ref, update } = require("firebase/database");
const Spinnies = require("spinnies");

module.exports = async (client) => {
  // Notify when the bot is online.
  const date = client.readyAt;
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const at = year + "-" + month + "-" + day + "." + hour + ":" + minute;

  console.log(at + " Bot is working and is now online.");

  // Send bot statistics.
  const db = getDatabase();
  const commandSize = client.commands.size;
  const guildSize = client.guilds.cache.size;
  const userSize = client.users.cache.size;

  if (client.mode === "start") {
    update(ref(db, 'Shioru/data/survey'), {
      "commands": commandSize,
      "servers": guildSize,
      "members": userSize
    });
  }

  // Set up bot activity.
  const activities = {
    "production": [
      {
        "name": guildSize + " Server" + (guildSize === 1 ? "" : "s"),
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "type": "STREAMING"
      },
      {
        "name": "Shelp | /help",
        "type": "WATCHING"
      },
      {
        "name": userSize + " Member" + (userSize === 1 ? "" : "s"),
        "type": "WATCHING"
      },
      {
        "name": commandSize + " Command" + (commandSize === 1 ? "" : "s"),
        "type": "LISTENING"
      }
    ],
    "development": [
      {
        "name": "🧶",
        "type": "PLAYING"
      },
      {
        "name": "/",
        "type": "LISTENING"
      },
      {
        "name": "📦",
        "type": "PLAYING"
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

  // Refreshing application (/) commands.
  const guildID = client.config.guild;
  const spinnies = new Spinnies({
    "failColor": "yellowBright",
    "failPrefix": "⚠️"
  });

  spinnies.add("app-commands-loading", {
    "text": "Starting to refresh all application (/) commands."
  });

  try {
    const data = client.interaction.map(commands => commands.interaction.data);

    if (client.mode === "start") {
      // Remove all old commands.
      await client.application.commands.set([]);

      // Set all new commands.
      await client.application.commands.set(data);

      spinnies.remove("app-commands-loading");
      console.log("Application (/) commands is ready to use.            ");
    } else {
      // Remove all old commands.
      await client.application.commands.set([]);

      // Set all new commands.
      await client.application.commands.set(data, guildID);

      spinnies.remove("app-commands-loading");
      console.log("Application (/) commands is ready to use.           ");
    }
  } catch (err) {
    spinnies.fail("app-commands-loading", {
      "text": "The application (/) commands could not be completely reloaded."
    });
    console.group();
    console.error(err)
    console.groupEnd();
  }

  // Client username
  console.log("Sign in with the username " + client.user.username + ".");

  // If everything is ready to go
  console.timeEnd("\u001b[34m\u001b[7m Bot is ready to work on the servers! \u001b[0m");
};