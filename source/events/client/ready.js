const { info } = require("log-symbols");

module.exports = (client) => {
  // Presence settings
  const guildSize = client.guilds.cache.size;
  let activities = {
    "name": "Minecraft",
    "type": "PLAYING"
  };

  if (client.config.mode === "production") activities = {
    "name": guildSize + " Server" + (guildSize === 1 ? "" : "s"),
    "type": "STREAMING",
    "url": "https://www.youtube.com/watch?v=fzQ6gRAEoy0"
  };

  client.user.setPresence({
    "status": "available",
    "afk": false,
    "activities": [
      activities
    ]
  });

  // Client username
  console.log(info + " Sign in with the name " + client.user.username + ".");

  // If everything is ready to go
  console.timeEnd("\u001b[34m\u001b[7m Bot is ready to work on the servers! \u001b[0m");
};