module.exports.run = (client, message, args) => {
    const inputStatus = args.join(" ");
    const guildIcon = message.guild.iconURL();

    if (!inputStatus) return message.reply(client.translate.commands.status.empty);
    if (!["online", "offline", "idle", "dnd"].includes(inputStatus)) {
        return message.reply(client.translate.commands.status.no_status);
    }

    switch (inputStatus) {
        case "online":
            const onlineCount = message.guild.members.cache.filter(members => members.presence ? members.presence.status === "online" : null).size;

            message.channel.send({
                "embeds": [
                    {
                        "description": client.translate.commands.status.online_status.replace("%s", onlineCount),
                        "color": 3055702,
                        "footer": {
                            "icon_url": guildIcon,
                            "text": client.translate.commands.status.data_by_server
                        }
                    }
                ]
            });
        break;
        case "offline":
            const offlineCount = message.guild.members.cache.filter(members => members.presence ? members.presence.status === "offline" : "offline").size;

            message.channel.send({
                "embeds": [
                    {
                        "description": client.translate.commands.status.offline_status.replace("%s", offlineCount),
                        "color": 10197915,
                        "footer": {
                            "icon_url": guildIcon,
                            "text": client.translate.commands.status.data_by_server
                        }
                    }
                ]
            });
        break;
        case "idle":
            const idleCount = message.guild.members.cache.filter(members => members.presence ? members.presence.status === "idle" : null).size;

            message.channel.send({
                "embeds": [
                    {
                        "description": client.translate.commands.status.idle_status.replace("%s", idleCount),
                        "color": 16098851,
                        "footer": {
                            "icon_url": guildIcon,
                            "text": client.translate.commands.status.data_by_server
                        }
                    }
                ]
            });
        break;
        case "dnd":
            const dndCount = message.guild.members.cache.filter(members => members.presence ? members.presence.status === "dnd" : null).size;

            message.channel.send({
                "embeds": [
                    {
                        "description": client.translate.commands.status.dnd_status.replace("%s", dndCount),
                        "color": 13632027,
                        "footer": {
                            "icon_url": guildIcon,
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
    "clientPermissions": ["SEND_MESSAGES"]
};