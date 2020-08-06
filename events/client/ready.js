module.exports = function (client) {
  let guild = client.guilds.cache.find(guilds => guilds.id === "618837514882514944");

  // if ready
  console.log("\u001b[34m\u001b[7m" + client.user.username + " is ready to work on the server!\u001b[0m");

  // Show on the channel how many members are there
  function showMembersCount() {
    let memberCount = guild.members.cache.filter(members => members.user).size;
    let memberCountChannel = guild.channels.cache.find(channels => channels.id === "694243041472544869");

    // Delete the number of members of bots
    let botCount = guild.members.cache.filter(members => members.user.bot).size;
    let allMemberCount = memberCount - botCount;

    if (!memberCountChannel) {
      return;
    } else {
      memberCountChannel.setName(client.lang.event_client_ready_memberCountChannel + allMemberCount);
    }
    setTimeout(showMembersCount, 10000);
  }
  showMembersCount();

  // Show on the channel how many members are bot
  function showBotsCount() {
    let botCount = guild.members.cache.filter(members => members.user.bot).size;
    let botCountChannel = guild.channels.cache.find(channels => channels.id === "729702455515938858");

    if (!botCountChannel) {
      return;
    } else {
      botCountChannel.setName(client.lang.event_client_ready_botCountChannel + botCount);
    }
    setTimeout(showBotsCount, 10000);
  }
  showBotsCount();

  // Show on the channel how many members are online.
  function showOnlineCount() {
    let onlineCount = guild.members.cache.filter(members => members.presence.status === "online").size;
    let onlineCountChannel = guild.channels.cache.find(channels => channels.id === "722105063182434314");

    // Delete the number of members of bots
    let botCount = guild.members.cache.filter(members => members.user.bot).size;
    let allMemberCount = onlineCount - botCount;

    if (!onlineCount) {
      return;
    } else {
      onlineCountChannel.setName(client.lang.event_client_ready_onlineCountChannel + allMemberCount);
    }
    setTimeout(showOnlineCount, 10000);
  }
  showOnlineCount();

  // Show on the channel how many members are offline.
  function showOfflineCount() {
    let offlineCount = guild.members.cache.filter(members => members.presence.status === "offline").size;
    let offlineCountChannel = guild.channels.cache.find(channels => channels.id === "723093393340891276");

    if (!offlineCountChannel) {
      return;
    } else {
      offlineCountChannel.setName(client.lang.event_client_ready_offlineCountChannel + offlineCount);
    }
    setTimeout(showOfflineCount, 10000);
  }
  showOfflineCount();

  // Show on the channel how many members are idle.
  function showIdleCount() {
    let idleCount = guild.members.cache.filter(members => members.presence.status === "idle").size;
    let idleCountChannel = guild.channels.cache.find(channels => channels.id === "729690734520827914");

    if (!idleCountChannel) {
      return;
    } else {
      idleCountChannel.setName(client.lang.event_client_ready_idleCountChannel + idleCount);
    }
    setTimeout(showIdleCount, 10000);
  }
  showIdleCount();

  // Show on the channel how many members are dnd.
  function showDndCount() {
    let dndCount = guild.members.cache.filter(members => members.presence.status === "dnd").size;
    let dndCountChannel = guild.channels.cache.find(channels => channels.id === "729692580987797554");

    if (!dndCountChannel) {
      return;
    } else {
      dndCountChannel.setName(client.lang.event_client_ready_dndCountChannel + dndCount);
    }
    setTimeout(showDndCount, 10000);
  }
  showDndCount();

  // Activity settings
  function activity() {
    let activityName = client.guilds.cache.size + " server" + (client.guilds.cache.size === 1 ? "" : "s");

    client.user.setPresence({
      "status": "available", //"available", "idle", "dnd", or "invisible"
      "activity": {
        "name": activityName,
        "type": 'WATCHING',
        "url": "https://youtube.com/watch?v=OLd68rtX6mI"
      }
    });
    setTimeout(activity, 10000);
  }
  activity();
};
