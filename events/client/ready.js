module.exports = client => {
  let guild = client.guilds.cache.find(servers => servers.id === "618837514882514944");

  // if ready
  console.log("\u001b[34m\u001b[7m" + client.user.username + " is ready to work on the server!\u001b[0m");

  // Show on the channel how many members are there
  let memberCount = guild.memberCount;
  let memberCountChannel = guild.channels.cache.find(channels => channels.id === "694243041472544869");

  memberCountChannel.setName("▌สมาชิก: " + memberCount);

  // Show on the channel how many members are online.
  let onlineCount = guild.members.cache.filter(member => member.presence.status === "online").size;
  let onlineCountChannel = guild.channels.cache.find(channels => channels.id === "722105063182434314");

  function showOnlineCount() {
    onlineCountChannel.setName("▌ออนไลน์: " + onlineCount);
    setTimeout(showOnlineCount, 5000);
  }
  showOnlineCount();

  // Show on the channel how many members are offline.
  let offlineCount = guild.members.cache.filter(member => member.presence.status === "offline").size;
  let offlineCountChannel = guild.channels.cache.find(channels => channels.id === "723093393340891276");

  function showOfflineCount() {
    offlineCountChannel.setName("▌ออฟไลน์: " + offlineCount);
    setTimeout(showOfflineCount, 5000);
  }
  showOfflineCount();

  // Activity settings
  client.user.setPresence({
    "status": "available", //"available", "idle", "dnd", or "invisible"
    "activity": {
      "name": client.config.prefix + "help ดูคำสั่งทั้งหมด",
      "type": 2,
      "url": "https://youtube.com/watch?v=OLd68rtX6mI"
    }
  });
};