module.exports = function (client) {
  // if ready
  console.log("\u001b[34m\u001b[7m" + client.user.username + " is ready to work on the server!\u001b[0m");

  // Activity settings
  function activity() {
    let activityName = client.guilds.cache.size + " server" + (client.guilds.cache.size === 1 ? "" : "s");

    client.user.setPresence({
      "status": "available", //"available", "idle", "dnd", or "invisible"
      "activity": {
        "name": activityName,
        "type": "WATCHING",
        "url": "https://youtube.com/watch?v=OLd68rtX6mI"
      }
    });
    setTimeout(activity, 10000);
  }
  activity();
};
