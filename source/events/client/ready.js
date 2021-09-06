module.exports = function (client) {
  // Activity settings
  function activity() {
    let guildSize = client.guilds.cache.size;
    let activityName = guildSize + " server" + (guildSize === 1 ? "" : "s");

    client.user.setPresence({
      "status": "available", // "available", "idle", "dnd", or "invisible"
      "afk": false,
      "activities": [
        {
          "name": activityName,
          "type": "STREAMING",
          "url": "https://www.youtube.com/watch?v=fzQ6gRAEoy0"
        }
      ]
    });
    setTimeout(activity, 10000);
  }
  activity();

  // If everything is ready to go
  console.log("\u001b[34m\u001b[7m" + client.user.username + " is ready to work on the servers!\u001b[0m");
};