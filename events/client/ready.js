module.exports = client => {
  let guild = client.guilds.cache.find(guilds => guilds.id === "618837514882514944");

  // if ready
  console.log("\u001b[34m\u001b[7m" + client.user.username + " is ready to work on the server!\u001b[0m");

  // Show on the channel how many members are there
  function showMembersCount() {
    let memberCount = guild.members.cache.filter(members => members.user).size;
    let memberCountChannel = guild.channels.cache.find(channels => channels.id === "694243041472544869");

    // Delete the number of members of bots
    let botCount = guild.members.cache.filter(members => members.user.bot).size;
    allMemberCount = memberCount - botCount;

    memberCountChannel.setName("▌สมาชิก: " + allMemberCount);
    setTimeout(showMembersCount, 10000);
  }
  showMembersCount();

  // Show on the channel how many members are bot
  function showBotsCount() {
    let botCount = guild.members.cache.filter(members => members.user.bot).size;
    let botCountChannel = guild.channels.cache.find(channels => channels.id === "729702455515938858");

    botCountChannel.setName("▌บอท: " + botCount);
    setTimeout(showBotsCount, 10000);
  }
  showBotsCount();

  // Show on the channel how many members are online.
  function showOnlineCount() {
    let onlineCount = guild.members.cache.filter(members => members.presence.status === "online").size;
    let onlineCountChannel = guild.channels.cache.find(channels => channels.id === "722105063182434314");

    onlineCountChannel.setName("▌ออนไลน์: " + onlineCount);
    setTimeout(showOnlineCount, 10000);
  }
  showOnlineCount();

  // Show on the channel how many members are offline.
  function showOfflineCount() {
    let offlineCount = guild.members.cache.filter(members => members.presence.status === "offline").size;
    let offlineCountChannel = guild.channels.cache.find(channels => channels.id === "723093393340891276");

    offlineCountChannel.setName("▌ออฟไลน์: " + offlineCount);
    setTimeout(showOfflineCount, 10000);
  }
  showOfflineCount();

  // Show on the channel how many members are idle.
  function showIdleCount() {
    let idleCount = guild.members.cache.filter(members => members.presence.status === "idle").size;
    let idleCountChannel = guild.channels.cache.find(channels => channels.id === "729690734520827914");

    idleCountChannel.setName("▌ไม่อยู่: " + idleCount);
    setTimeout(showIdleCount, 10000);
  }
  showIdleCount();

  // Show on the channel how many members are dnd.
  function showDndCount() {
    let dndCount = guild.members.cache.filter(members => members.presence.status === "dnd").size;
    let dndCountChannel = guild.channels.cache.find(channels => channels.id === "729692580987797554");

    dndCountChannel.setName("▌ห้ามรบกวน: " + dndCount);
    setTimeout(showDndCount, 10000);
  }
  showDndCount();

  // Activity settings
  client.user.setPresence({
    "status": "available", //"available", "idle", "dnd", or "invisible"
    "activity": {
      "name": client.config.prefix + "help ดูคำสั่งทั้งหมด",
      "type": 'WATCHING',
      "url": "https://youtube.com/watch?v=OLd68rtX6mI"
    }
  });
};
