module.exports = async (client, oldChannel, newChannel) => {
    let ignoreChannels = ["694243041472544869", "722105063182434314", "723093393340891276", "729690734520827914", "729692580987797554", "729702455515938858"];
    if (ignoreChannels.includes(oldChannel.id)) return;
    
    let guild = client.guilds.cache.find(servers => servers.id === "618837514882514944");
    let notification = guild.channels.cache.find(ch => ch.name === "│การแจ้งเตือน🔔");
    let embed = {
        "description": "สมาชิกได้เปลี่ยนแปลงที่ช่อง: `" + oldChannel.name + "` เป็น <#" + newChannel.id + ">",
        "color": 4886754,
        "author": {
            "name": "ระบบ",
            "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/bell_1f514.png"
        }
    };
    notification.send({ embed });
};