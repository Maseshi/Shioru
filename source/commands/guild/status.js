module.exports.run = function (client, message, args) {
    let input1 = args.join(" ");
    let icon = message.guild.iconURL();

    if (!input1) return message.reply(client.translate.commands.status.empty);
    if (!["online", "offline", "idle", "dnd"].includes(input1)) {
        return message.reply(client.translate.commands.status.no_status);
    }

    switch (input1) {
        case "online":
            let onlineCount = message.guild.members.cache.filter(members => members.presence ? members.presence.status === "online" : null).size;

            message.channel.send({
                "embeds": [
                    {
                        "description": client.translate.commands.status.online_status.replace("%s", onlineCount),
                        "color": 3055702,
                        "footer": {
                            "icon_url": icon,
                            "text": client.translate.commands.status.data_by_server
                        }
                    }
                ]
            });
        break;
        case "offline":
            let offlineCount = message.guild.members.cache.filter(members => members.presence ? members.presence.status === "offline" : "offline").size;

            message.channel.send({
                "embeds": [
                    {
                        "description": client.translate.commands.status.offline_status.replace("%s", offlineCount),
                        "color": 10197915,
                        "footer": {
                            "icon_url": icon,
                            "text": client.translate.commands.status.data_by_server
                        }
                    }
                ]
            });
        break;
        case "idle":
            let idleCount = message.guild.members.cache.filter(members => members.presence ? members.presence.status === "idle" : null).size;

            message.channel.send({
                "embeds": [
                    {
                        "description": client.translate.commands.status.idle_status.replace("%s", idleCount),
                        "color": 16098851,
                        "footer": {
                            "icon_url": icon,
                            "text": client.translate.commands.status.data_by_server
                        }
                    }
                ]
            });
        break;
        case "dnd":
            let dndCount = message.guild.members.cache.filter(members => members.presence ? members.presence.status === "dnd" : null).size;

            message.channel.send({
                "embeds": [
                    {
                        "description": client.translate.commands.status.dnd_status.replace("%s", dndCount),
                        "color": 13632027,
                        "footer": {
                            "icon_url": icon,
                            "text": client.translate.commands.status.data_by_server
                        }
                    }
                ]
            });
        break;
    }
};

module.exports.help = {
    "name": "status",
    "description": "Check the status of all members within the server",
    "usage": "status <status: online, offline, idle, dnd>",
    "category": "guild",
    "aliases": ["สถานะ"],
    "permissions": ["SEND_MESSAGES"]
};